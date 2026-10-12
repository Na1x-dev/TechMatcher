import logging
import random
import re
import time
from decimal import Decimal, InvalidOperation
from urllib.parse import urljoin, urlsplit, urlunsplit

import requests
from bs4 import BeautifulSoup
from django.conf import settings
from django.db import transaction

from tech_matcher_app.models import Smartphone

logger = logging.getLogger(__name__)

DEFAULT_CATALOG_URL = "https://catalog.onliner.by/mobile?mobile_type%5B0%5D=smartphone&mobile_type%5Boperation%5D=union&page="
COLUMN_MAPPING = {
    "Дата выхода на рынок": "launch_year",
    "Версия ОС на момент выхода": "os_version",
    "Размер экрана": "screen_size",
    "Разрешение экрана": "screen_res",
    "Технология экрана": "screen_type",
    "Частота обновления экрана": "screen_fps",
    "Объем оперативной памяти": "ram_size",
    "Тип оперативной памяти": "ram_type",
    "Объем встроенной памяти": "rom_size",
    "Тип встроенной памяти": "rom_type",
    "Количество основных камер": "camera_count",
    "Количество точек матрицы основной камеры": "main_camera_mp",
    "Модули камер": "camera_type",
    "Характеристики блока камер": "camera_block",
    "Максимальное разрешение видео": "max_video_resolution",
    "Фронтальная камера": "front_camera_mp",
    "Диафрагма фронтальной камеры": "front_camera_aperture",
    "Процессор": "cpu",
    "Техпроцесс": "tech_process",
    "Графический ускоритель": "gpu",
    "Материал граней": "edges_material",
    "Материал задней крышки": "back_material",
    "Цвет задней крышки": "back_color",
    "Пыле- и влагозащита": "protection",
    "Длина": "length",
    "Ширина": "width",
    "Толщина": "thickness",
    "Вес": "weight",
    "Соотношение сторон": "screen_ratio",
    "Защита от царапин": "screen_protector",
    "Количество цветов экрана": "color_count",
    "Разрешающая способность экрана": "ppi",
    "Тип аккумулятора": "accum_type",
    "Емкость аккумулятора": "accum_volume",
    "Мощность зарядки": "charging_power",
    "Беспроводная зарядка": "wireless_charging",
    "Bluetooth": "bluetooth",
    "Аудиовыход": "audio_port",
    "Разъём подключения": "charge_port",
    "Wi-Fi": "wifi",
    "NFC": "nfc",
    "5G": "has_5g",
    "Количество физических SIM-карт": "sim_count",
    "Формат SIM-карты": "sim_type",
}


def clean_text(value):
    if value is None:
        return ""
    value = re.sub(r"\s+", " ", str(value)).strip()
    return "" if value.lower() in {"-", "—", "нет данных", "none", "n/a"} else value


def clean_int(value):
    text = clean_text(value)
    if not text:
        return None
    match = re.search(r"\d+", text.replace(" ", ""))
    return int(match.group()) if match else None


def clean_float(value):
    text = clean_text(value).replace("\xa0", "").replace(" ", "").replace(",", ".")
    match = re.search(r"\d+(?:\.\d+)?", text)
    return float(match.group()) if match else None


def clean_decimal(value):
    text = clean_text(value).replace("\xa0", "").replace(" ", "")
    if not text:
        return None
    # Prices may contain currency and text. Keep decimal separator only.
    match = re.search(r"\d+(?:[.,]\d{1,2})?", text)
    if not match:
        return None
    try:
        return Decimal(match.group().replace(",", "."))
    except InvalidOperation:
        return None


def clean_bool(value):
    if isinstance(value, bool):
        return value
    return clean_text(value).lower() in {"есть", "да", "+", "true", "1", "поддерживается"}


def canonical_url(url):
    parts = urlsplit(url)
    # Query parameters and fragments are not part of a product's identity.
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), parts.path.rstrip("/"), "", ""))


def _get(session, url, timeout):
    response = session.get(url, timeout=timeout)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def _extract_listing_links(soup, base_url):
    selectors = (
        ".catalog-form__offers-list .catalog-form__link_base-additional",
        "a.catalog-form__link",
        "a[href*='/mobile/']",
    )
    links = []
    seen = set()
    for selector in selectors:
        for node in soup.select(selector):
            href = node.get("href")
            if not href:
                continue
            absolute = canonical_url(urljoin(base_url, href))
            path = urlsplit(absolute).path
            if "/mobile/" not in path or path.rstrip("/").endswith("/mobile"):
                continue
            if absolute not in seen:
                seen.add(absolute)
                links.append(absolute)
        if links:
            break
    return links


def _first_text(soup, selectors):
    for selector in selectors:
        node = soup.select_one(selector)
        if node:
            text = clean_text(node.get_text(" ", strip=True))
            if text:
                return text
    return ""


def parse_product_page(session, url, timeout):
    soup = _get(session, url, timeout)
    title = _first_text(soup, [
        "h1.catalog-masthead__title.js-nav-header",
        "h1.catalog-masthead__title",
        "h1",
    ])
    if not title:
        logger.warning("Skipping product without title: %s", url)
        return None

    image_node = soup.select_one(".js-gallery-zoom[href], .product-gallery img[src], img[itemprop='image']")
    image_url = ""
    if image_node:
        image_url = image_node.get("href") or image_node.get("src") or image_node.get("data-src") or ""
    if not image_url:
        image_node = soup.select_one("img[src]")
        image_url = image_node.get("src", "") if image_node else ""
    image_url = urljoin(url, image_url) if image_url else ""

    price_text = _first_text(soup, [
        "div.offers-description__price a",
        ".offers-description__price",
        "[data-price]",
    ])
    price = clean_decimal(price_text)

    brand = ""
    breadcrumbs = soup.select("a.breadcrumbs__link")
    if breadcrumbs:
        brand = clean_text(breadcrumbs[-1].get_text(" ", strip=True))
    if not brand:
        brand = title.split()[0]

    data = {
        "source_url": canonical_url(url),
        "title": title[:255],
        "brand": brand[:100],
        "image_url": image_url[:500] or None,
        "price": price,
        "camera_count": 1,
        "sim_count": 2,
        "wireless_charging": False,
        "nfc": False,
        "has_5g": False,
    }

    for row in soup.select("table tr"):
        cells = row.find_all(["td", "th"], recursive=False)
        if len(cells) < 2:
            continue
        label = clean_text(cells[0].get_text(" ", strip=True)).rstrip(":")
        value = clean_text(cells[1].get_text(" ", strip=True))
        field = COLUMN_MAPPING.get(label)
        if not field or not value:
            continue
        if field in {"launch_year", "screen_fps", "ppi", "ram_size", "rom_size",
                     "camera_count", "accum_volume", "charging_power", "sim_count"}:
            data[field] = clean_int(value)
        elif field in {"screen_size", "length", "width", "thickness", "weight"}:
            data[field] = clean_float(value)
        elif field in {"wireless_charging", "nfc", "has_5g"}:
            data[field] = clean_bool(value)
        else:
            data[field] = value

    # A year is optional; do not discard a product just because the source changed its format.
    allowed_fields = {field.name for field in Smartphone._meta.fields}
    data = {key: value for key, value in data.items() if key in allowed_fields}
    return data


def run_catalog_parser():
    if not getattr(settings, "PARSER_ENABLED", True):
        return {"status": "disabled", "created": 0, "updated": 0, "pages": 0}

    source_url = getattr(settings, "PARSER_SOURCE_URL", DEFAULT_CATALOG_URL)
    max_pages = max(1, int(getattr(settings, "PARSER_MAX_PAGES", 10)))
    min_products = max(1, int(getattr(settings, "PARSER_MIN_PRODUCTS", 100)))
    timeout = max(3, int(getattr(settings, "PARSER_REQUEST_TIMEOUT", 25)))
    delay_min = max(0.0, float(getattr(settings, "PARSER_DELAY_MIN", 0.8)))
    delay_max = max(delay_min, float(getattr(settings, "PARSER_DELAY_MAX", 1.8)))
    user_agent = getattr(settings, "PARSER_USER_AGENT", "TechMatcherCatalogBot/1.0")

    session = requests.Session()
    session.headers.update({"User-Agent": user_agent, "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.7"})
    created = updated = pages = errors = 0
    seen_urls = set()
    try:
        for page_number in range(1, max_pages + 1):
            if re.search(r"[?&]page=\d+", source_url):
                current_url = re.sub(r"([?&]page=)\d+", rf"\g<1>{page_number}", source_url)
            elif re.search(r"[?&]page=$", source_url):
                current_url = f"{source_url}{page_number}"
            else:
                current_url = f"{source_url}{'&' if '?' in source_url else '?'}page={page_number}"
            try:
                listing = _get(session, current_url, timeout)
            except requests.RequestException:
                logger.exception("Could not fetch catalog page %s", current_url)
                errors += 1
                break
            pages += 1
            links = _extract_listing_links(listing, current_url)
            if not links:
                logger.info("No product links found on page %s; stopping pagination", page_number)
                break

            for product_url in links:
                if product_url in seen_urls:
                    continue
                seen_urls.add(product_url)
                try:
                    data = parse_product_page(session, product_url, timeout)
                    if not data:
                        continue
                    source_key = data.pop("source_url")
                    with transaction.atomic():
                        product = Smartphone.objects.filter(source_url=source_key).first()
                        # Link legacy rows only when title, brand and memory configuration
                        # identify exactly one candidate.
                        if product is None and (data.get("ram_size") is not None or data.get("rom_size") is not None):
                            candidates = Smartphone.objects.filter(
                                title__iexact=data["title"],
                                brand__iexact=data["brand"],
                                source_url__isnull=True,
                            )
                            if data.get("ram_size") is not None:
                                candidates = candidates.filter(ram_size=data["ram_size"])
                            if data.get("rom_size") is not None:
                                candidates = candidates.filter(rom_size=data["rom_size"])
                            if candidates.count() == 1:
                                product = candidates.first()

                        was_created = product is None
                        if was_created:
                            product = Smartphone.objects.create(source_url=source_key, **data)
                        else:
                            for field, value in data.items():
                                setattr(product, field, value)
                            product.source_url = source_key
                            product.save()
                    created += int(was_created)
                    updated += int(not was_created)
                except (requests.RequestException, ValueError, TypeError):
                    errors += 1
                    logger.exception("Failed to parse product %s", product_url)
                time.sleep(random.uniform(delay_min, delay_max))

                if Smartphone.objects.count() >= min_products:
                    logger.info("Catalog reached configured threshold (%s)", min_products)
                    return {"status": "ok", "created": created, "updated": updated, "pages": pages, "errors": errors}

        return {"status": "ok", "created": created, "updated": updated, "pages": pages, "errors": errors}
    finally:
        session.close()
