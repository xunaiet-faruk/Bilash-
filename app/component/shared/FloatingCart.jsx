"use client";

import { useState } from "react";
import CartDrawer from "./CartDrawer";

const INITIAL_ITEMS = [
  { id: 1, name: "Deshi Mustard Oil 5 liter", price: 1700, qty: 1, emoji: "🫙" },
  { id: 2, name: "Sundarban Honey 1kg", price: 2500, qty: 1, emoji: "🍯" },
  { id: 3, name: "Ajwa Premium Fresh Dates 500gm", price: 1100, qty: 2, emoji: "🌴" },
];

const SUGGESTIONS = [
  { id: 11, name: "Black Seed Honey 500g", price: 800, emoji: "🍯" },
  { id: 12, name: "Gawa Ghee 1kg", price: 1990, emoji: "🧈" },
  { id: 13, name: "Chili (Morich) Powder 500g", price: 400, emoji: "🌶️" },
  { id: 14, name: "Cashew Nuts Medium Size 1kg", price: 2000, emoji: "🥜" },
  { id: 15, name: "Organic Extra Virgin Coconut Oil 500ml", price: 1260, emoji: "🥥" },
  { id: 16, name: "Organic Spirulina Powder 250gm", price: 1140, oldPrice: 1200, emoji: "🌱" },
];

export default function FloatingCart() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const changeQty = (id, delta) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );

  const addItem = (product) =>
    setItems((prev) =>
      prev.some((i) => i.id === product.id)
        ? prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...product, qty: 1 }]
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const formattedTotal = `৳${subtotal.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <>
    
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open cart: ${itemCount} items, ${formattedTotal}`}
        className="cursor-pointer fixed right-0 top-1/2 z-50 w-[88px] -translate-y-1/2 overflow-hidden rounded-l-xl shadow-lg transition-transform hover:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        <div className="flex flex-col items-center gap-1 bg-orange-500 px-2 py-3 text-white">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="text-xs font-medium">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>
        <div className="bg-white px-1 py-1.5 text-center text-xs font-bold text-orange-500">
          {formattedTotal}
        </div>
      </button>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onChangeQty={changeQty}
        onRemove={removeItem}
        onAdd={addItem}
        suggestions={SUGGESTIONS}
        subtotal={subtotal}
      />
    </>
  );
}