import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiError, getReq } from "../Api";
import { useSnackbar } from "notistack";
import { useCart } from "../context/CartContext";
import Loading from "./Loading";

const money = (value) => value == null || value === "" ? "Цена не указана" : `${Number(value).toLocaleString("ru-RU")} ₽`;
const groups = [
  ["Основное", [["Год релиза", "launch_year"], ["Операционная система", "os_version"], ["Материал задней панели", "back_material"], ["Материал граней", "edges_material"], ["Цвет", "back_color"], ["Класс защиты", "protection"]]],
  ["Дисплей", [["Диагональ", "screen_size", '"'], ["Разрешение", "screen_res"], ["Тип матрицы", "screen_type"], ["Частота обновления", "screen_fps", " Гц"], ["Плотность пикселей", "ppi", " PPI"]]],
  ["Процессор и память", [["Процессор", "cpu"], ["Техпроцесс", "tech_process"], ["Графика", "gpu"], ["ОЗУ", "ram_size", " ГБ"], ["Тип ОЗУ", "ram_type"], ["Накопитель", "rom_size", " ГБ"], ["Тип накопителя", "rom_type"]]],
  ["Батарея и интерфейсы", [["Аккумулятор", "accum_volume", " мАч"], ["Зарядка", "charging_power", " Вт"], ["Беспроводная зарядка", "wireless_charging"], ["NFC", "nfc"], ["5G", "has_5g"], ["Порт зарядки", "charge_port"], ["Аудиоразъём", "audio_port"]]],
];
const displayValue = (v, suffix = "") => typeof v === "boolean" ? (v ? "Есть" : "Нет") : `${v}${suffix}`;

const ProductDetails = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { enqueueSnackbar } = useSnackbar(); const { addToCart } = useCart();
  const [product, setProduct] = useState(null); const [loading, setLoading] = useState(true); const [adding, setAdding] = useState(false);
  useEffect(() => { setLoading(true); getReq(`smartphones/${id}/`).then(setProduct).catch((e) => enqueueSnackbar(getApiError(e, "Смартфон не найден"), { variant: "error" })).finally(() => setLoading(false)); }, [id, enqueueSnackbar]);
  if (loading) return <Loading />;
  if (!product) return <div className="state-screen"><h2>Смартфон не найден</h2><button className="button button-primary" onClick={() => navigate("/")}>В каталог</button></div>;
  const add = async () => { setAdding(true); try { await addToCart(product); enqueueSnackbar("Товар добавлен в корзину", { variant: "success" }); } catch (e) { enqueueSnackbar(getApiError(e, "Не удалось добавить товар"), { variant: "error" }); } finally { setAdding(false); } };
  return <main className="product-page"><button className="back-link" onClick={() => navigate(-1)}>← Назад</button><div className="product-layout">
    <div className="detail-visual"><div className="detail-image"><img src={product.image_url || "/default-phone.png"} alt={product.title} /></div><div className="detail-note">TECHMATCHER<br /><span>ORIGINAL CATALOG</span></div></div>
    <div className="detail-copy"><div className="eyebrow">{product.brand || "SMARTPHONE"}</div><h1>{product.title}</h1><p className="detail-price">{money(product.price)}</p><p className="detail-intro">Подробные характеристики устройства собраны в одном месте — от экрана и процессора до интерфейсов и аккумулятора.</p><button className="button button-primary button-large" onClick={add} disabled={adding}>{adding ? "Добавляем…" : "Добавить в корзину"}</button></div>
  </div><section className="specs"><div className="section-kicker">TECH SPECS</div><h2>Характеристики</h2><div className="spec-grid">{groups.map(([title, rows]) => <div className="spec-card" key={title}><h3>{title}</h3>{rows.map(([label, key, suffix = ""]) => product[key] !== undefined && product[key] !== null && product[key] !== "" ? <div className="spec-row" key={key}><span>{label}</span><strong>{displayValue(product[key], suffix)}</strong></div> : null)}</div>)}</div></section>
  </main>;
};
export default ProductDetails;
