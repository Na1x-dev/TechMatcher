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
  const [imageFailed, setImageFailed] = useState(false);
  const add = async (e) => {
    e.stopPropagation(); setAdding(true);
    try { await addToCart(product); enqueueSnackbar("Товар добавлен в корзину", { variant: "success" }); }
    catch { enqueueSnackbar("Не удалось добавить товар", { variant: "error" }); }
    finally { setAdding(false); }
  };
  return <article className="product-card" onClick={() => navigate(`/smartphones/${product.id}`)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") navigate(`/smartphones/${product.id}`); }}>
    <div className="product-image-wrap"><img src={!imageFailed && product.image_url ? product.image_url : "/default-phone.png"} alt={product.title} loading="lazy" onError={() => setImageFailed(true)} /></div>
    <div className="product-card-body">
      <div className="eyebrow">{product.brand || "Смартфон"}</div>
      <h3>{product.title}</h3>
      <div className="product-description">{[
        product.screen_size ? `Экран ${product.screen_size}″` : null,
        product.cpu || null,
        product.ram_size ? `ОЗУ ${product.ram_size} ГБ` : null,
        product.rom_size ? `Память ${product.rom_size} ГБ` : null,
        product.has_5g ? "5G" : null,
        product.nfc ? "NFC" : null,
      ].filter(Boolean).slice(0, 5).join(" · ") || "Характеристики уточняются"}
      </div>
      <div className="product-tags">
        {product.launch_year && <span>{product.launch_year} г.</span>}
        {product.ram_size && product.rom_size && <span>{product.ram_size}/{product.rom_size} ГБ</span>}
      </div>
      <div className="product-card-bottom"><strong>{money(product.price)}</strong><button className="button button-primary" onClick={add} disabled={adding}>{adding ? "Добавляем…" : "В корзину"}</button></div>
    </div>
  </article>;
};
export default ProductCard;
