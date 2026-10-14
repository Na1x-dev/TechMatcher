import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";

const money = (v) => `${Number(v || 0).toLocaleString("ru-RU")} ₽`;
const Basket = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    items,
    total,
    itemCount,
    loading,
    addToCart,
    changeQuantity,
    removeFromCart,
    isGuest,
  } = useCart();
  if (loading) return <Loading />;
  return (
    <main className="cart-page">
      <div className="cart-head">
        <div>
          <div className="section-kicker">YOUR CART</div>
          <h1>Корзина</h1>
        </div>
        <div className="cart-head-actions">
          <span>
            {itemCount} {itemCount === 1 ? "товар" : "товаров"}
          </span>
          <button
            className="button button-outline"
            onClick={() => navigate("/")}
          >
            Продолжить покупки
          </button>
        </div>
      </div>
      {isGuest && items.length > 0 && (
        <div className="guest-banner">
          <strong>Корзина сохранена на этом устройстве.</strong>
          <span>
            Войдите позже — товары синхронизируются с вашим аккаунтом.
          </span>
          <button onClick={() => navigate("/login")}>Войти</button>
        </div>
      )}
      {!items.length ? (
        <div className="empty-state cart-empty">
          <div>🛒</div>
          <h2>Корзина пока пустая</h2>
          <p>Добавьте смартфоны из каталога — они появятся здесь.</p>
          <button
            className="button button-primary"
            onClick={() => navigate("/")}
          >
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => {
              const p = item.smartphone || item.product;
              return (
                <article className="cart-item" key={item.id || p.id}>
                  <button
                    className="cart-product"
                    onClick={() => navigate(`/smartphones/${p.id}`)}
                  >
                    <div className="cart-image">
                      <img
                        src={p.image_url || "/default-phone.png"}
                        alt={p.title}
                      />
                    </div>
                    <div>
                      <div className="eyebrow">{p.brand}</div>
                      <h3>{p.title}</h3>
                      <span>Количество: {item.quantity}</span>
                    </div>
                  </button>
                  <div className="cart-item-side">
                    <div className="cart-item-pricing">
                      {Number(item.quantity) > 1 && (
                        <span>
                          {Number(item.quantity)} × {money(p.price)}
                        </span>
                      )}
                      <strong>
                        {money(Number(p.price) * Number(item.quantity))}
                      </strong>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-quantity-controls">
                        {Number(item.quantity) > 1 && (
                          <button
                            type="button"
                            aria-label="Уменьшить количество"
                            title="Уменьшить количество"
                            onClick={() =>
                              changeQuantity(
                                p.id,
                                Number(item.quantity) - 1,
                              ).catch(() =>
                                enqueueSnackbar(
                                  "Не удалось изменить количество",
                                  { variant: "error" },
                                ),
                              )
                            }
                          >
                            −1
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Добавить ещё один экземпляр"
                          title="Добавить ещё один экземпляр"
                          onClick={() =>
                            addToCart(p).catch(() =>
                              enqueueSnackbar("Не удалось добавить товар", {
                                variant: "error",
                              }),
                            )
                          }
                        >
                          +1
                        </button>
                      </div>
                      <button
                        className="remove"
                        onClick={() =>
                          removeFromCart(p.id).catch(() =>
                            enqueueSnackbar("Не удалось удалить товар", {
                              variant: "error",
                            }),
                          )
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="cart-summary">
            <span className="section-kicker">ORDER SUMMARY</span>
            <h2>Итого</h2>
            <div className="summary-row">
              <span>Товары</span>
              <strong>{money(total)}</strong>
            </div>
            <div className="summary-row">
              <span>Доставка</span>
              <strong>По условиям заказа</strong>
            </div>
            <div className="summary-total">
              <span>К оплате</span>
              <strong>{money(total)}</strong>
            </div>
            <button
              className="button button-primary button-large"
              onClick={() =>
                enqueueSnackbar(
                  "Оформление заказа пока не подключено к API бэкенда",
                  { variant: "info" },
                )
              }
            >
              Оформить заказ
            </button>
          </aside>
        </div>
      )}
    </main>
  );
};
export default Basket;
