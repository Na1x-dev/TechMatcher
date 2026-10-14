import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiError, getReq } from "../Api";
import { useSnackbar } from "notistack";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import Loading from "./Loading";

const money = (value) =>
  value == null || value === ""
    ? "Цена не указана"
    : `${Number(value).toLocaleString("ru-RU")} ₽`;
const groups = [
  [
    "Основное",
    [
      ["Бренд", "brand"],
      ["Год релиза", "launch_year"],
      ["Операционная система", "os_version"],
      ["Материал задней панели", "back_material"],
      ["Материал граней", "edges_material"],
      ["Цвет", "back_color"],
      ["Класс защиты", "protection"],
    ],
  ],
  [
    "Дисплей",
    [
      ["Диагональ", "screen_size", "″"],
      ["Разрешение", "screen_res"],
      ["Тип матрицы", "screen_type"],
      ["Частота обновления", "screen_fps", " Гц"],
      ["Плотность пикселей", "ppi", " PPI"],
      ["Защита от царапин / защитное стекло", "screen_protector"],
      ["Соотношение сторон", "screen_ratio"],
      ["Количество цветов", "color_count"],
    ],
  ],
  [
    "Процессор",
    [
      ["Процессор", "cpu"],
      ["Техпроцесс", "tech_process"],
      ["Графика", "gpu"],
      ["ОЗУ", "ram_size", " ГБ"],
      ["Тип ОЗУ", "ram_type"],
      ["Накопитель", "rom_size", " ГБ"],
      ["Тип накопителя", "rom_type"],
    ],
  ],
  [
    "Камера",
    [
      ["Количество основных камер", "camera_count"],
      ["Разрешение основной камеры", "main_camera_mp"],
      ["Модули камер", "camera_type"],
      ["Характеристики блока камер", "camera_block"],
      ["Максимальное разрешение видео", "max_video_resolution"],
      ["Фронтальная камера", "front_camera_mp"],
      ["Диафрагма фронтальной камеры", "front_camera_aperture"],
    ],
  ],
  [
    "Батарея",
    [
      ["Аккумулятор", "accum_volume", " мАч"],
      ["Проводная зарядка", "charging_power", " Вт"],
      ["Беспроводная зарядка", "wireless_charging"],
      ["Мощность беспроводной зарядки", "wireless_charging_power", " Вт"],
    ],
  ],
  [
    "Интерфейсы",
    [
      ["NFC", "nfc"],
      ["5G", "has_5g"],
      ["Порт зарядки", "charge_port"],
      ["Аудиоразъём", "audio_port"],
      ["Wi-Fi", "wifi"],
      ["Bluetooth", "bluetooth"],
      ["SIM-карты", "sim_type"],
    ],
  ],
];
const displayValue = (v, suffix = "") =>
  v === null || v === undefined || v === ""
    ? "—"
    : typeof v === "boolean"
      ? v
        ? "Есть"
        : "Нет"
      : `${v}${suffix}`;
const normalize = (value) =>
  String(value)
    .toLocaleLowerCase("ru")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/g, " ")
    .trim();
const absent = (value) => {
  if (value === null || value === undefined || value === false || value === 0)
    return true;
  const v = normalize(value);
  return (
    !v ||
    [
      "нет",
      "отсутствует",
      "не поддерживается",
      "не предусмотрено",
      "нет данных",
      "n a",
      "n/a",
      "—",
      "-",
      "false",
      "0",
    ].includes(v)
  );
};
const sectionFor = (label) => {
  const s = normalize(label);
  if (
    /камера|фото|видеосъем|видеосъем|оптическ|мегапиксел|вспышк|автофокус|стабилизац/.test(
      s,
    )
  )
    return "Камера";
  if (
    /экран|диспле|матриц|разрешен|яркост|частот.*обнов|ppi|пиксел|стекло|hdr|сенсорн/.test(
      s,
    )
  )
    return "Дисплей";
  if (
    /процессор|чипсет|cpu|gpu|график|оперативн.*памят|озу|ram|накопител|встроенн.*памят|rom|память|техпроцесс/.test(
      s,
    )
  )
    return "Процессор";
  if (/аккумулятор|батаре|зарядк|м ач|мч|емкость аккумулятора/.test(s))
    return "Батарея";
  if (
    /nfc|5g|4g|lte|wi fi|wifi|bluetooth|sim|esim|usb|порт|разъем|разьем|интерфейс|связь|навигац|gps|audio/.test(
      s,
    )
  )
    return "Интерфейсы";
  if (
    /бренд|год|операционн.*систем|материал|цвет|защит|корпус|вес|размер|габарит/.test(
      s,
    )
  )
    return "Основное";
  return "Прочее";
};
const knownLabelPatterns = [
  /^(бренд|производитель|год выпуска|год релиза|операционная система|ос|материал задней панели|материал граней|цвет|класс защиты)$/,
  /^(диагональ|диагональ экрана|разрешение|разрешение экрана|тип матрицы|частота обновления|плотность пикселей|ppi|защитное стекло|защита от царапин|яркость|соотношение сторон|количество цветов экрана)$/,
  /^(процессор|модель процессора|техпроцесс|графика|графический процессор|озу|оперативная память|тип озу|тип оперативной памяти|накопитель|встроенная память|тип накопителя)$/,
  /^(основная камера|разрешение основной камеры|количество основных камер|количество точек матрицы основной камеры|модули камер|характеристики блока камер|максимальное разрешение видео|фронтальная камера|диафрагма фронтальной камеры|видео|видеозапись)$/,
  /^(аккумулятор|емкость аккумулятора|емкость батареи|зарядка|мощность зарядки|беспроводная зарядка|мощность беспроводной зарядки)$/,
  /^(nfc|поддержка nfc|5g|поддержка 5g|порт зарядки|разъем зарядки|аудиоразъем|аудиоразьем|wi fi|wifi|bluetooth|sim карты|тип sim)$/,
];
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart, changeQuantity, items } = useCart();
  const { isCompared, toggleCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    setLoading(true);
    getReq(`smartphones/${id}/`)
      .then(setProduct)
      .catch((e) =>
        enqueueSnackbar(getApiError(e, "Смартфон не найден"), {
          variant: "error",
        }),
      )
      .finally(() => setLoading(false));
  }, [id, enqueueSnackbar]);
  if (loading) return <Loading />;
  if (!product)
    return (
      <div className="state-screen">
        <h2>Смартфон не найден</h2>
        <button className="button button-outline" onClick={() => navigate("/")}>
          В каталог
        </button>
      </div>
    );
  const cartItem = items.find(
    (item) =>
      Number((item.smartphone || item.product || item).id) ===
      Number(product.id),
  );
  const quantityInCart = Number(cartItem?.quantity || 0);
  const compared = isCompared(product.id);
  const add = async () => {
    setAdding(true);
    try {
      await addToCart(product);
      enqueueSnackbar("Количество в корзине увеличено", { variant: "success" });
    } catch (e) {
      enqueueSnackbar(getApiError(e, "Не удалось добавить товар"), {
        variant: "error",
      });
    } finally {
      setAdding(false);
    }
  };
  const rawSpecs = Object.entries(product.specifications || {}).filter(
    ([label, value]) =>
      !absent(value) &&
      !knownLabelPatterns.some((pattern) => pattern.test(normalize(label))),
  );
  const extraGroups = Object.fromEntries(
    [
      "Основное",
      "Дисплей",
      "Процессор",
      "Камера",
      "Батарея",
      "Интерфейсы",
      "Прочее",
    ].map((name) => [name, []]),
  );
  rawSpecs.forEach(([label, value]) =>
    extraGroups[sectionFor(label)].push([label, value]),
  );
  const renderRows = (rows) =>
    rows.map(([label, key, suffix = ""]) => (
      <div className="spec-row" key={key}>
        <span>{label}</span>
        <strong>{displayValue(product[key], suffix)}</strong>
      </div>
    ));
  const renderExtras = (rows) =>
    rows.map(([label, value]) => (
      <div className="spec-row" key={label}>
        <span>{label}</span>
        <strong>{String(value)}</strong>
      </div>
    ));

  return (
    <main className="product-page">
      <button className="button button-outline back-link" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="product-layout">
        <div className="detail-visual">
          <div className="detail-image">
            <img
              src={product.image_url || "/default-phone.png"}
              alt={product.title}
            />
          </div>

          <div className="detail-note">
            TECHMATCHER
            <br />
            <span>ORIGINAL CATALOG</span>
          </div>
        </div>

        <div className="detail-copy">
          <div className="eyebrow">{product.brand || "SMARTPHONE"}</div>

          <h1>{product.title}</h1>

          <p className="detail-price">{money(product.price)}</p>

          <p className="detail-intro">
            Подробные характеристики устройства собраны в одном месте — от
            экрана и процессора до интерфейсов и аккумулятора.
          </p>

          <div className="detail-cart-actions">
            <button
              className={`button general-button button-large detail-cart-main ${
                quantityInCart ? "is-in-cart" : ""
              }`}
              onClick={add}
              disabled={adding}
            >
              {adding
                ? "Добавляем…"
                : quantityInCart
                  ? `✓ В корзине${
                      quantityInCart >= 2 ? ` · ${quantityInCart} шт.` : ""
                    }`
                  : "Добавить в корзину"}
            </button>

            {quantityInCart >= 2 && (
              <button
                className="button button-outline detail-cart-plus"
                onClick={() =>
                  changeQuantity(product.id, quantityInCart - 1).catch((e) =>
                    enqueueSnackbar(
                      getApiError(e, "Не удалось изменить количество"),
                      { variant: "error" },
                    ),
                  )
                }
                disabled={quantityInCart < 2}
                aria-label="Уменьшить количество на один"
                title="Уменьшить количество на один"
              >
                −1
              </button>
            )}
          </div>

          <button
            className="button button-outline detail-compare-button"
            onClick={() =>
              compared ? navigate("/compare") : toggleCompare(product)
            }
          >
            {compared ? "Перейти к сравнению" : "Добавить к сравнению"}
          </button>
        </div>
      </div>

      <section className="specs">
        <div className="section-kicker">TECH SPECS</div>

        <h2>Характеристики</h2>

        <div className="spec-grid">
          {groups.map(([title, rows]) => (
            <div className="spec-card" key={title}>
              <h3>{title}</h3>
              {renderRows(rows)}
              {renderExtras(extraGroups[title])}
            </div>
          ))}
        </div>

        {extraGroups["Прочее"].length > 0 && (
          <div className="spec-card spec-card-full">
            <h3>Прочее</h3>
            {renderExtras(extraGroups["Прочее"])}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductDetails;
