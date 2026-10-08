import React, { useCallback, useEffect, useState } from "react";
import { getReq, getApiError } from "../Api";
import { useSnackbar } from "notistack";
import ProductCard from "./ProductCard";
import Loading from "./Loading";

const MainContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); const [query, setQuery] = useState(""); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  useEffect(() => { const t = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 450); return () => clearTimeout(t); }, [search]);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) }); if (query) params.set("search", query);
      const data = await getReq(`smartphones/?${params}`); const list = Array.isArray(data) ? data : (data.results || []);
      setProducts(list); setTotalPages(data.count ? Math.max(1, Math.ceil(data.count / 24)) : (data.next || data.previous ? page + (data.next ? 1 : 0) : 1));
    } catch (error) { enqueueSnackbar(getApiError(error, "Не удалось загрузить каталог"), { variant: "error" }); }
    finally { setLoading(false); }
  }, [page, query, enqueueSnackbar]);
  useEffect(() => { load(); }, [load]);
  return <main>
    <section className="hero"><div><div className="hero-kicker">TECHMATCHER / CATALOG</div><h1>Техника, которую<br /><em>легко выбрать.</em></h1><p>Сравнивайте характеристики смартфонов и собирайте корзину без лишних шагов.</p></div><div className="hero-orb"><span>01</span><small>SMART<br />CHOICE</small></div></section>
    <section className="catalog-section" id="categories">
      <div className="section-head"><div><span className="section-kicker">КАТАЛОГ</span><h2>Смартфоны</h2></div><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по модели или бренду…" /></div></div>
      {loading ? <Loading /> : products.length ? <><div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>{totalPages > 1 && <div className="pagination"><button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Назад</button><span>{page} / {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Вперёд →</button></div>}</> : <div className="empty-state"><div>⌕</div><h3>Ничего не нашли</h3><p>Попробуйте изменить поисковый запрос.</p></div>}
    </section>
  </main>;
};
export default MainContent;
