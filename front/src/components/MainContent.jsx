import React, { useCallback, useEffect, useState } from "react";
import { getReq, getApiError } from "../Api";
import { useSnackbar } from "notistack";
import ProductCard from "./ProductCard";
import Loading from "./Loading";

const initialFilters = { brand: "", min_price: "", max_price: "", ram_size: "", rom_size: "", min_screen_size: "", max_screen_size: "", has_5g: false, nfc: false };
const MainContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      Object.entries(filters).forEach(([key, value]) => {
        if (value === true) params.set(key, "true");
        else if (value !== false && value !== "") params.set(key, value);
      });
      const data = await getReq(`smartphones/?${params}`);
      const list = Array.isArray(data) ? data : (data.results || []);
      setProducts(list);
      setTotalPages(data.count ? Math.max(1, Math.ceil(data.count / 24)) : (data.next || data.previous ? page + (data.next ? 1 : 0) : 1));
    } catch (error) {
      enqueueSnackbar(getApiError(error, "Не удалось загрузить каталог"), { variant: "error" });
    } finally { setLoading(false); }
  }, [page, filters, enqueueSnackbar]);

  useEffect(() => { load(); }, [load]);
  const changeFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1); };
  const resetFilters = () => { setFilters(initialFilters); setPage(1); };

  return <main>
    <section className="hero"><div><div className="hero-kicker">TECHMATCHER / CATALOG</div><h1>Техника, которую<br /><em>легко выбрать.</em></h1><p>Сравнивайте характеристики смартфонов и собирайте корзину без лишних шагов.</p></div><div className="hero-orb"><span>01</span><small>SMART<br />CHOICE</small></div></section>
    <section className="catalog-section" id="categories">
      <div className="section-head"><div><span className="section-kicker">КАТАЛОГ</span><h2>Смартфоны</h2></div></div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <div className="filter-heading"><h3>Фильтры</h3><button onClick={resetFilters}>Сбросить</button></div>
          <label className="filter-field"><span>Бренд</span><input value={filters.brand} onChange={(e) => changeFilter("brand", e.target.value)} placeholder="Например, Samsung" /></label>
          <div className="filter-field"><span>Цена, ₽</span><div className="filter-pair"><input type="number" min="0" value={filters.min_price} onChange={(e) => changeFilter("min_price", e.target.value)} placeholder="От" /><input type="number" min="0" value={filters.max_price} onChange={(e) => changeFilter("max_price", e.target.value)} placeholder="До" /></div></div>
          <label className="filter-field"><span>Оперативная память, от</span><select value={filters.ram_size} onChange={(e) => changeFilter("ram_size", e.target.value)}><option value="">Любая</option><option value="4">4 ГБ</option><option value="6">6 ГБ</option><option value="8">8 ГБ</option><option value="12">12 ГБ</option><option value="16">16 ГБ</option></select></label>
          <label className="filter-field"><span>Встроенная память, от</span><select value={filters.rom_size} onChange={(e) => changeFilter("rom_size", e.target.value)}><option value="">Любая</option><option value="64">64 ГБ</option><option value="128">128 ГБ</option><option value="256">256 ГБ</option><option value="512">512 ГБ</option><option value="1024">1 ТБ</option></select></label>
          <div className="filter-field"><span>Диагональ экрана, дюймы</span><div className="filter-pair"><input type="number" step="0.1" value={filters.min_screen_size} onChange={(e) => changeFilter("min_screen_size", e.target.value)} placeholder="От" /><input type="number" step="0.1" value={filters.max_screen_size} onChange={(e) => changeFilter("max_screen_size", e.target.value)} placeholder="До" /></div></div>
          <label className="filter-check"><input type="checkbox" checked={filters.has_5g} onChange={(e) => changeFilter("has_5g", e.target.checked)} /> Поддержка 5G</label>
          <label className="filter-check"><input type="checkbox" checked={filters.nfc} onChange={(e) => changeFilter("nfc", e.target.checked)} /> NFC</label>
        </aside>
        <div className="catalog-results">
          {loading ? <Loading /> : products.length ? <><div className="results-caption">Найдено на этой странице: {products.length}</div><div className="product-list">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>{totalPages > 1 && <div className="pagination"><button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Назад</button><span>{page} / {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Вперёд →</button></div>}</> : <div className="empty-state"><div>⌕</div><h3>Ничего не нашли</h3><p>Попробуйте изменить параметры фильтров или сбросить их.</p><button className="button button-outline" onClick={resetFilters}>Сбросить фильтры</button></div>}
        </div>
      </div>
    </section>
  </main>;
};
export default MainContent;
