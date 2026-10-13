import React, { useCallback, useEffect, useState } from "react";
import { getReq, getApiError } from "../Api";
import { useSnackbar } from "notistack";
import ProductCard from "./ProductCard";
import Loading from "./Loading";

const PAGE_SIZE = 12;
const initialFilters = {
  brand: "",
  min_price: "",
  max_price: "",
  ram_size: "",
  rom_size: "",
  min_screen_size: "",
  max_screen_size: "",
  min_screen_fps: "",
  max_screen_fps: "",
  launch_year: "",
  screen_type: "",
  os_version: "",
  protection: "",
  has_5g: false,
  nfc: false,
  wireless_charging: false,
};
const MainContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
      });
      if (search.trim()) params.set("search", search.trim());
      Object.entries(filters).forEach(([key, value]) => {
        if (value === true) params.set(key, "true");
        else if (value !== false && value !== "") params.set(key, value);
      });
      const data = await getReq(`smartphones/?${params}`);
      const list = Array.isArray(data) ? data : data.results || [];
      setProducts(list);
      setTotalCount(
        Array.isArray(data) ? list.length : Number(data.count || 0),
      );
      setTotalPages(
        Array.isArray(data)
          ? 1
          : Math.max(1, Math.ceil(Number(data.count || 0) / PAGE_SIZE)),
      );
    } catch (error) {
      enqueueSnackbar(getApiError(error, "Не удалось загрузить каталог"), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, filters, search, enqueueSnackbar]);

  useEffect(() => {
    load();
  }, [load]);
  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };
  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch("");
    setPage(1);
  };
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== "" && value !== false,
  ).length;

  return (
    <main>
      <section className="hero">
        <div>
          <div className="hero-kicker">TECHMATCHER / CATALOG</div>
          <h1>
            Техника, которую
            <br />
            <em>легко выбрать.</em>
          </h1>
          <p>
            Сравнивайте характеристики смартфонов и собирайте корзину без лишних
            шагов.
          </p>
        </div>
        <div className="hero-orb">
          <span>01</span>
          <small>
            SMART
            <br />
            CHOICE
          </small>
        </div>
      </section>
      <section className="catalog-section" id="categories">
        <div className="section-head">
          <div>
            <span className="section-kicker">КАТАЛОГ</span>
            <h2>Смартфоны</h2>
          </div>
          <label className="search-box catalog-search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Поиск смартфонов"
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="Поиск по названию, бренду или процессору"
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => changeSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </label>
        </div>
        <div className="catalog-layout">
          <aside className="filter-sidebar">
            <div className="filter-heading">
              <h3>
                Фильтры{" "}
                {activeFilterCount > 0 && (
                  <span className="filter-count">{activeFilterCount}</span>
                )}
              </h3>
              <button onClick={resetFilters}>Сбросить</button>
            </div>
            <div className="filter-field">
              <span>Цена, ₽</span>
              <div className="filter-pair">
                <input
                  type="number"
                  min="0"
                  value={filters.min_price}
                  onChange={(e) => changeFilter("min_price", e.target.value)}
                  placeholder="От"
                />
                <input
                  type="number"
                  min="0"
                  value={filters.max_price}
                  onChange={(e) => changeFilter("max_price", e.target.value)}
                  placeholder="До"
                />
              </div>
            </div>
            <label className="filter-field">
              <span>Оперативная память, от</span>
              <select
                value={filters.ram_size}
                onChange={(e) => changeFilter("ram_size", e.target.value)}
              >
                <option value="">Любая</option>
                <option value="4">4 ГБ</option>
                <option value="6">6 ГБ</option>
                <option value="8">8 ГБ</option>
                <option value="12">12 ГБ</option>
                <option value="16">16 ГБ</option>
                <option value="24">24 ГБ</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Встроенная память, от</span>
              <select
                value={filters.rom_size}
                onChange={(e) => changeFilter("rom_size", e.target.value)}
              >
                <option value="">Любая</option>
                <option value="64">64 ГБ</option>
                <option value="128">128 ГБ</option>
                <option value="256">256 ГБ</option>
                <option value="512">512 ГБ</option>
                <option value="1024">1 ТБ</option>
              </select>
            </label>
            <div className="filter-field">
              <span>Диагональ экрана, ″</span>
              <div className="filter-pair">
                <input
                  type="number"
                  step="0.1"
                  value={filters.min_screen_size}
                  onChange={(e) =>
                    changeFilter("min_screen_size", e.target.value)
                  }
                  placeholder="От"
                />
                <input
                  type="number"
                  step="0.1"
                  value={filters.max_screen_size}
                  onChange={(e) =>
                    changeFilter("max_screen_size", e.target.value)
                  }
                  placeholder="До"
                />
              </div>
            </div>
            <div className="filter-field">
              <span>Частота экрана, Гц</span>
              <div className="filter-pair">
                <input
                  type="number"
                  min="0"
                  value={filters.min_screen_fps}
                  onChange={(e) =>
                    changeFilter("min_screen_fps", e.target.value)
                  }
                  placeholder="От"
                />
                <input
                  type="number"
                  min="0"
                  value={filters.max_screen_fps}
                  onChange={(e) =>
                    changeFilter("max_screen_fps", e.target.value)
                  }
                  placeholder="До"
                />
              </div>
            </div>
            <label className="filter-field">
              <span>Год выпуска, от</span>
              <select
                value={filters.launch_year}
                onChange={(e) => changeFilter("launch_year", e.target.value)}
              >
                <option value="">Любой</option>
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(
                  (year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="filter-field">
              <span>Тип экрана</span>
              <select
                value={filters.screen_type}
                onChange={(e) => changeFilter("screen_type", e.target.value)}
              >
                <option value="">Любой</option>
                <option value="AMOLED">AMOLED</option>
                <option value="OLED">OLED</option>
                <option value="IPS">IPS</option>
                <option value="LCD">LCD</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Операционная система</span>
              <select
                value={filters.os_version}
                onChange={(e) => changeFilter("os_version", e.target.value)}
              >
                <option value="">Любая</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Защита корпуса</span>
              <select
                value={filters.protection}
                onChange={(e) => changeFilter("protection", e.target.value)}
              >
                <option value="">Любая</option>
                <option value="IP68">IP68</option>
                <option value="IP67">IP67</option>
                <option value="IP54">IP54</option>
              </select>
            </label>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={filters.has_5g}
                onChange={(e) => changeFilter("has_5g", e.target.checked)}
              />{" "}
              Поддержка 5G
            </label>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={filters.nfc}
                onChange={(e) => changeFilter("nfc", e.target.checked)}
              />{" "}
              NFC
            </label>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={filters.wireless_charging}
                onChange={(e) =>
                  changeFilter("wireless_charging", e.target.checked)
                }
              />{" "}
              Беспроводная зарядка
            </label>
          </aside>
          <div className="catalog-results">
            {loading ? (
              <Loading />
            ) : products.length ? (
              <>
                <div className="results-caption">
                  Найдено смартфонов: <strong>{totalCount}</strong> · на
                  странице {products.length} из {PAGE_SIZE}
                </div>
                <div className="product-list">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Назад
                    </button>
                    <span>
                      {page} / {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Вперёд →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div>⌕</div>
                <h3>Ничего не нашли</h3>
                <p>
                  Попробуйте изменить поисковый запрос или параметры фильтров.
                </p>
                <button
                  className="button button-outline"
                  onClick={resetFilters}
                >
                  Сбросить поиск и фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
export default MainContent;
