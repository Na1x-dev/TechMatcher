import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReq, getApiError } from "../Api";
import { useSnackbar } from "notistack";
import { useCompare } from "../context/CompareContext";
import Loading from "../components/Loading";

const fields = [
  { section: "Цена", label: "Цена", key: "price", direction: "lower", weight: 3, suffix: " ₽" },
  { section: "Основное", label: "Год выпуска", key: "launch_year", direction: "higher", weight: 1, suffix: "" },
  { section: "Основное", label: "Вес", key: "weight", direction: "lower", weight: 2, suffix: " г" },
  { section: "Дисплей", label: "Диагональ", key: "screen_size", direction: "higher", weight: 1, suffix: "″" },
  { section: "Дисплей", label: "Частота обновления", key: "screen_fps", direction: "higher", weight: 2, suffix: " Гц" },
  { section: "Дисплей", label: "Плотность пикселей", key: "ppi", direction: "higher", weight: 2, suffix: " PPI" },
  { section: "Производительность", label: "ОЗУ", key: "ram_size", direction: "higher", weight: 2, suffix: " ГБ" },
  { section: "Производительность", label: "Встроенная память", key: "rom_size", direction: "higher", weight: 1, suffix: " ГБ" },
  { section: "Производительность", label: "Техпроцесс", key: "tech_process", direction: "lower", weight: 2, suffix: " нм" },
  { section: "Камеры", label: "Основная камера", key: "main_camera_mp", direction: "higher", weight: 1, suffix: " Мп" },
  { section: "Батарея", label: "Ёмкость аккумулятора", key: "accum_volume", direction: "higher", weight: 2, suffix: " мА·ч" },
  { section: "Батарея", label: "Мощность зарядки", key: "charging_power", direction: "higher", weight: 1, suffix: " Вт" },
  { section: "Интерфейсы", label: "5G", key: "has_5g", direction: "boolean", weight: 1 },
  { section: "Интерфейсы", label: "NFC", key: "nfc", direction: "boolean", weight: 1 },
  { section: "Интерфейсы", label: "Беспроводная зарядка", key: "wireless_charging", direction: "boolean", weight: 1 },
];

const numeric = (value) => {
  if (value === null || value === undefined || value === "" || value === false) {
    return null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  const match = String(value).replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const shown = (product, field) => {
  const value = product[field.key] ?? product.specifications?.[field.label];
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "Есть" : "Нет";
  }
  return `${value}${field.suffix || ""}`;
};

const Compare = () => {
  const { ids, toggleCompare, clearCompare } = useCompare();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (!ids.length) {
      setProducts([]);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    Promise.all(ids.map((id) => getReq(`smartphones/${id}/`)))
      .then((data) => {
        if (active) {
          setProducts(data);
        }
      })
      .catch((error) => {
        if (active) {
          enqueueSnackbar(getApiError(error, "Не удалось загрузить сравнение"), {
            variant: "error",
          });
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [ids, enqueueSnackbar]);

  const rows = useMemo(() => {
    const result = [];

    fields.forEach((field) => {
      const values = products.map((product) => {
        if (field.direction === "boolean") {
          const raw = product[field.key] ?? product.specifications?.[field.label];
          return typeof raw === "boolean" ? (raw ? 1 : 0) : null;
        }

        return numeric(product[field.key] ?? product.specifications?.[field.label]);
      });

      const known = values.filter((value) => value !== null);
      let best = null;

      if (known.length > 1 && known.some((value) => value !== known[0])) {
        best = field.direction === "lower" ? Math.min(...known) : Math.max(...known);
      }

      result.push({ ...field, values, best });
    });

    return result;
  }, [products]);

  if (loading) {
    return (
      <main className="compare-page">
        <Loading />
      </main>
    );
  }

  return (
    <main className="compare-page">
      <div className="compare-heading">
        <div>
          <div className="section-kicker">TECHMATCHER / COMPARE</div>
          <h1>Сравнение смартфонов</h1>
          <p>
            Лучшие значения характеристик выделены бирюзовым. Равные и
            неизвестные значения остаются без подсветки.
          </p>
        </div>

        <div className="compare-heading-actions">
          <button className="button button-outline" onClick={() => navigate("/")}>
            ← Назад в каталог
          </button>
          {products.length > 0 && (
            <button className="button button-outline" onClick={clearCompare}>
              Очистить сравнение
            </button>
          )}
        </div>
      </div>

      {!products.length ? (
        <div className="empty-state">
          <div>⇄</div>
          <h3>Пока нечего сравнивать</h3>
          <p>
            Добавьте смартфоны в сравнение с карточки товара или из каталога.
          </p>
          <button className="button button-outline" onClick={() => navigate("/")}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="compare-columns" style={{ "--compare-count": products.length }}>
          {products.map((product, productIndex) => (
            <article className="compare-column" key={product.id}>
              <div className="compare-product-top">
                <button
                  className="compare-remove"
                  onClick={() => toggleCompare(product)}
                  aria-label={`Убрать ${product.title} из сравнения`}
                  title="Убрать из сравнения"
                >
                  ×
                </button>

                <img
                  src={product.image_url || "/default-phone.png"}
                  alt={product.title}
                />

                <h2 title={product.title}>{product.title}</h2>

                <strong>
                  {product.price == null
                    ? "Цена не указана"
                    : `${Number(product.price).toLocaleString("ru-RU")} ₽`}
                </strong>

                <button
                  className="button button-outline compare-open"
                  onClick={() => navigate(`/smartphones/${product.id}`)}
                >
                  Открыть товар
                </button>
              </div>

              <div className="compare-spec-list">
                {rows.map((field) => (
                  <div
                    className={`compare-spec ${
                      field.best !== null && field.values[productIndex] === field.best
                        ? "is-best"
                        : ""
                    }`}
                    key={field.key}
                  >
                    <span>{field.label}</span>
                    <strong>{shown(product, field)}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Compare;
