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
    "Поддержка беспроводной зарядки": "wireless_charging",
    "Мощность беспроводной зарядки": "wireless_charging_power",
    "Мощность беспроводной зарядки, Вт": "wireless_charging_power",
    "Bluetooth": "bluetooth",
    "Аудиовыход": "audio_port",
    "Разъём подключения": "charge_port",
    "Wi-Fi": "wifi",
    "NFC": "nfc",
    "Поддержка NFC": "nfc",
    "5G": "has_5g",
    "Поддержка 5G": "has_5g",
    "Поддержка сетей 5G": "has_5g",
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
    text = clean_text(value).lower().strip(" .")
    if text in {"есть", "да", "+", "true", "1", "поддерживается", "поддержка есть", "yes"}:
        return True
    if text in {"нет", "не поддерживается", "-", "false", "0", "отсутствует", "no", "не предусмотрена"}:
        return False
    return None


def normalize_spec_label(label):
    label = clean_text(label).strip(":").lower().replace("ё", "е")
    aliases = {
        "поддержка nfc": "nfc",
        "поддержка 5g": "5g",
        "поддержка сетей 5g": "5g",
        "поддержка беспроводной зарядки": "беспроводная зарядка",
        "мощность беспроводной зарядки, вт": "мощность беспроводной зарядки",
    }
    return aliases.get(label, label)


def extract_spec_rows(soup):
    """Read specification rows from tables and definition lists."""
    found = {}
    for row in soup.select("table tr, .product-specs__row, .catalog-specs__row, .offers-description__specs tr, .offers-description__item, [class*='specification'] [class*='row']"):
        cells = row.find_all(["td", "th"], recursive=False)
        if len(cells) >= 2:
            label = clean_text(cells[0].get_text(" ", strip=True)).rstrip(":")
            value = clean_text(" ".join(cell.get_text(" ", strip=True) for cell in cells[1:]))
        else:
            label_node = row.select_one(".product-specs__name, .catalog-specs__name, dt, [class*='label'], [class*='name']")
            value_node = row.select_one(".product-specs__value, .catalog-specs__value, dd, [class*='value']")
            if not label_node or not value_node:
                continue
            label = clean_text(label_node.get_text(" ", strip=True)).rstrip(":")
            value = clean_text(value_node.get_text(" ", strip=True))
        if label and value and label.lower() not in {"характеристики", "параметр", "значение"}:
            found[label] = value
    for dl in soup.select("dl"):
        labels, values = dl.find_all("dt"), dl.find_all("dd")
        for label_node, value_node in zip(labels, values):
            label = clean_text(label_node.get_text(" ", strip=True)).rstrip(":")
            value = clean_text(value_node.get_text(" ", strip=True))
            if label and value:
                found[label] = value

    # Handle key/value markup variations used by product detail pages, including
    # rows whose label/value are represented through data attributes.
    for node in soup.select("[data-specification-name][data-specification-value], [data-spec-name][data-spec-value]"):
        label = clean_text(node.get("data-specification-name") or node.get("data-spec-name"))
        value = clean_text(node.get("data-specification-value") or node.get("data-spec-value"))
        if label and value:
            found[label] = value

    for row in soup.select("[class*='offers-description'] li, [class*='spec'] li, [class*='characteristic'] li"):
        if row.select_one("a, button, script, style"):
            continue
        label_node = row.select_one("[class*='title'], [class*='name'], [class*='label'], dt")
        value_node = row.select_one("[class*='value'], [class*='description'], dd")
        if label_node and value_node:
            label = clean_text(label_node.get_text(" ", strip=True)).rstrip(":")
            value = clean_text(value_node.get_text(" ", strip=True))
            if label and value and label != value:
                found.setdefault(label, value)

    # Some pages expose extra product properties in JSON-LD instead of HTML rows.
    import json
    def collect_properties(obj):
        if isinstance(obj, list):
            for item in obj:
                collect_properties(item)
        elif isinstance(obj, dict):
            props = obj.get("additionalProperty", [])
            if isinstance(props, dict):
                props = [props]
            for prop in props:
                if isinstance(prop, dict):
                    name = clean_text(prop.get("name") or prop.get("propertyID"))
                    value = clean_text(prop.get("value") or prop.get("description"))
                    if name and value:
                        found.setdefault(name, value)
            for key, value in obj.items():
                if key in {"@graph", "mainEntity", "subjectOf"}:
                    collect_properties(value)

    for script in soup.select("script[type='application/ld+json']"):
        try:
            collect_properties(json.loads(script.string or script.get_text()))
        except (ValueError, TypeError):
            continue
    return found


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


def _image_is_likely_product(url, alt=""):
    if not url or url.startswith("data:"):
        return False
    path = urlsplit(url).path.lower()
    label = str(alt).lower()
    if any(token in path or token in label for token in ("logo", "sprite", "icon", "favicon", "avatar", "banner", "placeholder")):
        return False
    # Image-proxy URLs can end with encoded source data rather than an extension.
    return bool(re.search(r"\.(?:jpe?g|png|webp)(?:$)", path, re.I)) or "image" in label or "photo" in label or "смартфон" in label or "телефон" in label


def _image_url_from_node(node, page_url):
    """Resolve eager and lazy-loaded image URLs, including srcset and proxy URLs."""
    if node.name == "meta":
        raw = node.get("content")
    else:
        raw = node.get("data-src") or node.get("data-original") or node.get("data-lazy-src") or node.get("src")
        srcset = node.get("data-srcset") or node.get("srcset")
        if srcset:
            # The final srcset candidate is normally the largest available image.
            raw = srcset.split(",")[-1].strip().split()[0] or raw
    if not raw or raw.startswith("data:"):
        return None
    return urljoin(page_url, raw)


def _extract_product_image(soup, page_url):
    # Prioritize the primary photo shown in the product description, but do not
    # return a lazy-loading placeholder if a real URL is available.
    selectors = [
        "figure.offers-description__figure img",
        ".catalog-masthead__image img",
        ".catalog-masthead__image",
        ".product-gallery img",
        ".product-gallery__image",
        ".js-gallery img",
        ".js-gallery-zoom",
        "img[itemprop='image']",
        "meta[property='og:image']",
        "meta[name='twitter:image']",
    ]
    candidates = []
    for priority, selector in enumerate(selectors):
        for node in soup.select(selector):
            absolute = _image_url_from_node(node, page_url)
            if not absolute:
                continue
            alt = node.get("alt", "") or node.get("title", "")
            # The primary Onliner figure can use image-proxy URLs without file extensions.
            is_primary_figure = node in soup.select("figure.offers-description__figure img")
            is_explicit_metadata = node.name == "meta" and (
                node.get("property") == "og:image"
                or node.get("name") == "twitter:image"
            )
            is_image_property = node.get("itemprop") == "image"
            if not (is_primary_figure or is_explicit_metadata or is_image_property) and not _image_is_likely_product(absolute, alt):
                continue
            score = 100 - priority * 5
            cls = " ".join(node.get("class", [])) if isinstance(node.get("class"), list) else str(node.get("class", ""))
            if "gallery" in cls or "masthead" in cls or is_primary_figure:
                score += 10
            if "itemprop" in node.attrs or node.get("property") == "og:image":
                score += 3
            candidates.append((score, absolute))
    return max(candidates, key=lambda item: item[0])[1][:500] if candidates else None


def _extract_price(soup):
    # Prefer explicit offer-price nodes; generic page text often contains specs, not prices.
    for selector in (
        "[itemprop='price']",
        "meta[property='product:price:amount']",
        "meta[itemprop='price']",
        ".offers-description__price-value",
        ".offers-description__price",
        ".offers-list__price",
        "[data-price]",
    ):
        node = soup.select_one(selector)
        if not node:
            continue
        value = node.get("content") or node.get("data-price") or node.get_text(" ", strip=True)
        price = clean_decimal(value)
        if price is not None and price > 0:
            return price

    # Some catalog pages expose the product or its offers inside JSON-LD @graph.
    import json

    def find_jsonld_price(obj):
        if isinstance(obj, list):
            for item in obj:
                price = find_jsonld_price(item)
                if price is not None:
                    return price
        elif isinstance(obj, dict):
            offers = obj.get("offers", [])
            if isinstance(offers, dict):
                offers = [offers]
            for offer in offers if isinstance(offers, list) else []:
                if isinstance(offer, dict):
                    price = clean_decimal(offer.get("price") or offer.get("lowPrice"))
                    if price is not None and price > 0:
                        return price
            for key in ("@graph", "mainEntity", "itemListElement"):
                if key in obj:
                    price = find_jsonld_price(obj[key])
                    if price is not None:
                        return price
        return None

    for node in soup.select("script[type='application/ld+json']"):
        try:
            price = find_jsonld_price(json.loads(node.string or node.get_text()))
        except (ValueError, TypeError):
            continue
        if price is not None:
            return price
    return None


def _listing_card_data(listing_soup, product_url, listing_url):
    """Fallback for catalog cards, which often expose prices/images more reliably."""
    target = canonical_url(product_url)
    anchor = None
    for candidate in listing_soup.select("a[href]"):
        if canonical_url(urljoin(listing_url, candidate.get("href", ""))) == target:
            anchor = candidate
            break
    if anchor is None:
        return {}

    node = anchor
    for _ in range(5):
        if node is None:
            break
        text = clean_text(node.get_text(" ", strip=True))
        # Require a currency marker; arbitrary model/spec numbers are not prices.
        match = re.search(r"([0-9][0-9\s\u00a0]*(?:[,.][0-9]{1,2})?)\s*(?:р\.?|руб(?:лей|ля)?|BYN|₽)", text, re.I)
        if match:
            price = clean_decimal(match.group(1))
            if price is not None and price > 0:
                result = {"price": price}
                for image in node.select("img"):
                    src = image.get("data-src") or image.get("data-original") or image.get("src")
                    alt = image.get("alt", "")
                    if src and _image_is_likely_product(src, alt):
                        result["image_url"] = urljoin(listing_url, src)[:500]
                        break
                return result
        node = node.parent
    return {}

def parse_product_page(session, url, timeout):
    soup = _get(session, url, timeout)
    title = _first_text(soup, [
        "h1.catalog-masthead__title.js-nav-header",
        "h1.catalog-masthead__title",
        "h1",
        "meta[property='og:title']",
    ])
    if not title:
        logger.warning("Skipping product without title: %s", url)
        return None

    image_url = _extract_product_image(soup, url)
    price = _extract_price(soup)

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
    }
    if image_url:
        data["image_url"] = image_url
    if price is not None:
        data["price"] = price

    raw_specs = extract_spec_rows(soup)
    if raw_specs:
        data["specifications"] = raw_specs

    for label, value in raw_specs.items():
        normalized_label = normalize_spec_label(label)
        field = COLUMN_MAPPING.get(label) or next((target for source, target in COLUMN_MAPPING.items() if normalize_spec_label(source) == normalized_label), None)
        if not field or not value:
            continue
        if field in {"launch_year", "screen_fps", "ppi", "ram_size", "rom_size",
                     "camera_count", "accum_volume", "charging_power",
                     "wireless_charging_power", "sim_count"}:
            parsed = clean_int(value)
        elif field in {"screen_size", "length", "width", "thickness", "weight"}:
            parsed = clean_float(value)
        elif field in {"wireless_charging", "nfc", "has_5g"}:
            parsed = clean_bool(value)
        else:
            parsed = value
        if parsed is not None and parsed != "":
            data[field] = parsed

        key = normalize_spec_label(label)
        if key in {"nfc", "5g", "беспроводная зарядка"}:
            target = {"nfc": "nfc", "5g": "has_5g", "беспроводная зарядка": "wireless_charging"}[key]
            parsed_bool = clean_bool(value)
            if parsed_bool is not None:
                data[target] = parsed_bool
        if "мощност" in key and "беспровод" in key:
            power = clean_int(value)
            if power is not None:
                data["wireless_charging_power"] = power
        elif key in {"мощность зарядки", "мощность проводной зарядки"}:
            power = clean_int(value)
            if power is not None:
                data["charging_power"] = power

    allowed_fields = {field.name for field in Smartphone._meta.fields}
    return {key: value for key, value in data.items() if key in allowed_fields}


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
                    card_data = _listing_card_data(listing, product_url, current_url)
                    if data.get("price") is None and card_data.get("price") is not None:
                        data["price"] = card_data["price"]
                    if not data.get("image_url") and card_data.get("image_url"):
                        data["image_url"] = card_data["image_url"]
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
                            incoming_specs = data.get("specifications") or {}
                            if incoming_specs:
                                merged_specs = dict(product.specifications or {})
                                merged_specs.update({key: value for key, value in incoming_specs.items() if value not in (None, "")})
                                data["specifications"] = merged_specs
                            for field, value in data.items():
                                # Do not replace good values with blank text from a partial page.
                                if isinstance(value, str) and not value.strip() and field not in {"specifications"}:
                                    continue
                                setattr(product, field, value)
                            # Remove a previously imported site logo rather than keeping it
                            # forever when a valid product photo cannot be found.
                            if not data.get("image_url") and product.image_url:
                                old_image = product.image_url.lower()
                                if any(token in urlsplit(old_image).path for token in ("logo", "sprite", "favicon", "placeholder")):
                                    product.image_url = None
                            product.source_url = source_key
                            product.save()
                    created += int(was_created)
                    updated += int(not was_created)
                except (requests.RequestException, ValueError, TypeError):
                    errors += 1
                    logger.exception("Failed to parse product %s", product_url)
                time.sleep(random.uniform(delay_min, delay_max))


        return {"status": "ok", "created": created, "updated": updated, "pages": pages, "errors": errors}
    finally:
        session.close()
