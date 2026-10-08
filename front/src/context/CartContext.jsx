import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { deleteReq, getReq, postReq } from "../Api";
import { useAuth } from "../components/AuthContext";

const STORAGE_KEY = "techmatcher_guest_cart";
const CartContext = createContext(null);

const readGuestCart = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};
const writeGuestCart = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
const countItems = (items) => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [guestItems, setGuestItems] = useState(readGuestCart);
  const [serverBasket, setServerBasket] = useState(null);
  const [loading, setLoading] = useState(false);
  const previousUser = useRef(user);

  const refreshServerCart = useCallback(async () => {
    if (!user) { setServerBasket(null); return null; }
    setLoading(true);
    try {
      const basket = await getReq("basket/");
      setServerBasket(basket);
      return basket;
    } finally { setLoading(false); }
  }, [user]);

  const syncGuestCart = useCallback(async () => {
    const local = readGuestCart();
    if (!user || !local.length) return;
    setLoading(true);
    try {
      for (const item of local) {
        await postReq("basket/", { smartphone_id: item.id, quantity: item.quantity });
      }
      localStorage.removeItem(STORAGE_KEY);
      setGuestItems([]);
      await refreshServerCart();
    } finally { setLoading(false); }
  }, [refreshServerCart, user]);

  useEffect(() => {
    const becameAuthenticated = !previousUser.current && user;
    previousUser.current = user;
    if (user) {
      if (becameAuthenticated && readGuestCart().length) syncGuestCart().catch(() => {});
      else refreshServerCart().catch(() => {});
    } else {
      setServerBasket(null);
      setGuestItems(readGuestCart());
    }
  }, [user, refreshServerCart, syncGuestCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      const current = readGuestCart();
      const index = current.findIndex((item) => item.id === product.id);
      if (index >= 0) current[index] = { ...current[index], quantity: current[index].quantity + quantity };
      else current.push({ id: product.id, quantity, product });
      writeGuestCart(current); setGuestItems(current); return;
    }
    await postReq("basket/", { smartphone_id: product.id, quantity });
    await refreshServerCart();
  };

  const removeFromCart = async (id) => {
    if (!user) {
      const next = readGuestCart().filter((item) => item.id !== id);
      writeGuestCart(next); setGuestItems(next); return;
    }
    const updated = await deleteReq(`basket/?smartphone_id=${id}`);
    setServerBasket(updated);
  };

  const items = user ? (serverBasket?.items || []) : guestItems;
  const total = user
    ? Number(serverBasket?.total_price || 0)
    : guestItems.reduce((sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0), 0);
  const itemCount = countItems(items);

  const value = useMemo(() => ({ items, total, itemCount, loading, addToCart, removeFromCart, refresh: refreshServerCart, isGuest: !user }), [items, total, itemCount, loading, user, refreshServerCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart должен использоваться внутри CartProvider");
  return context;
};
