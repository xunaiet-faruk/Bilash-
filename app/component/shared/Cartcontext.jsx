"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart:v1";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Puro website er ekmatro cart. Sob page/component ei ekta jinis use kore.
 *
 * Backend connect korar shomoy shudhu ei file er bhitorer logic bodlate hobe
 * (localStorage -> API call). Page gulor kono code bodlate hobe na, karon
 * tara shudhu addItem / removeItem / changeQty / clearCart call kore.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Prottek add e +1 hoy. Floating button er bump animation er jonno.
  const [addTick, setAddTick] = useState(0);

  // 1) Page load e localStorage theke cart pora (SSR mismatch eray)
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);

    // Onno tab e cart change hole ei tab o update hobe
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 2) Cart change hole localStorage e save
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / private mode: ignore */
    }
  }, [items, hydrated]);

  // product e minimum lagbe: id, name, price. Baki gulo optional.
  // Image hishebe product.image ba product.images[0] duitai cholbe.
  const addItem = useCallback((product, qty = 1) => {
    const price =
      typeof product.price === "number"
        ? product.price
        : Number(String(product.price).replace(/[^0-9.-]/g, "")) || 0;
    const line = {
      id: product.id,
      name: product.name,
      price,
      oldPrice: product.oldPrice ?? null,
      image: product.image ?? product.images?.[0] ?? null,
      emoji: product.emoji ?? null,
      brand: product.brand ?? null,
    };

    setItems((prev) =>
      prev.some((i) => i.id === line.id)
        ? prev.map((i) => (i.id === line.id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { ...line, qty }]
    );
    setAddTick((t) => t + 1);
  }, []);

  const changeQty = useCallback((id, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      isOpen,
      addTick,
      addItem,
      changeQty,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }),
    [items, isOpen, addTick, addItem, changeQty, removeItem, clearCart, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}