import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCart } from "../context/CartContext";

const money = (value) => value == null || value === "" ? "Цена не указана" : `${Number(value).toLocaleString("ru-RU")} ₽`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const add = async (e) => {
    e.stopPropagation(); setAdding(true);
    try { await addToCart(product); enqueueSnackbar("Товар добавлен в корзину", { variant: "success" }); }
    catch { enqueueSnackbar("Не удалось добавить товар", { variant: "error" }); }
    finally { setAdding(false); }
  };
  return <article className="product-card" onClick={() => navigate(`/smartphones/${product.id}`)}>
    <div className="product-image-wrap"><img src={product.image_url || "/default-phone.png"} alt={product.title} loading="lazy" /></div>
    <div className="product-card-body">
      <div className="eyebrow">{product.brand || "Смартфон"}</div>
      <h3>{product.title}</h3>
      <div className="product-tags">
        {product.launch_year && <span>{product.launch_year} г.</span>}
        {product.ram_size && product.rom_size && <span>{product.ram_size}/{product.rom_size} ГБ</span>}
      </div>
      <div className="product-card-bottom"><strong>{money(product.price)}</strong><button className="button button-primary" onClick={add} disabled={adding}>{adding ? "…" : "В корзину"}</button></div>
    </div>
  </article>;
};
export default ProductCard;
