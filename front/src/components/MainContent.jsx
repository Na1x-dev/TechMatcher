import React, { useCallback, useEffect, useState } from "react";
import { getReq, getApiError } from "../Api";
import { useSnackbar } from "notistack";
import ProductCard from "./ProductCard";
import Loading from "./Loading";
import CatalogFilters from "./CatalogFilters";

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
          <CatalogFilters filters={filters} changeFilter={changeFilter} resetFilters={resetFilters} />
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
