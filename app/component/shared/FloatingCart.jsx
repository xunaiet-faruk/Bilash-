"use client";

import { useCart } from "./Cartcontext";
import CartDrawer from "./CartDrawer";

// "You May Also Like" er fake data. Backend ashle API theke ashbe.
// (Constant rakhben, jate CartDrawer er auto-slide bar bar restart na hoy)
const SUGGESTIONS = [
  { id: "sg-1", name: "Black Seed Honey 500g", price: 800, emoji: "🍯" },
  { id: "sg-2", name: "Gawa Ghee 1kg", price: 1990, emoji: "🧈" },
  { id: "sg-3", name: "Chili (Morich) Powder 500g", price: 400, emoji: "🌶️" },
  { id: "sg-4", name: "Cashew Nuts Medium Size 1kg", price: 2000, emoji: "🥜" },
  { id: "sg-5", name: "Organic Extra Virgin Coconut Oil 500ml", price: 1260, emoji: "🥥" },
  { id: "sg-6", name: "Organic Spirulina Powder 250gm", price: 1140, oldPrice: 1200, emoji: "🌱" },
];

export default function FloatingCart() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    addTick,
    openCart,
    closeCart,
    addItem,
    changeQty,
    removeItem,
  } = useCart();

  const formattedTotal = `৳${subtotal.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <>
      <style>{`
        @keyframes cartBump {
          0% { transform: scale(1); }
          40% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .cart-bump { animation: cartBump 0.4s ease-out; }
        }
      `}</style>

      {/* Screen er right side, ekdom majhkhane fixed */}
      <button
        type="button"
        onClick={openCart}
        aria-label={`Open cart: ${itemCount} items, ${formattedTotal}`}
        className="fixed right-0 top-1/2 z-50 w-[88px] -translate-y-1/2 overflow-hidden rounded-l-xl shadow-lg transition-transform hover:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        {/* key={addTick}: prottek add e remount hoy, tai animation abar chole */}
        <div
          key={addTick}
          className={`flex flex-col items-center gap-1 bg-orange-500 px-2 py-3 text-white ${
            addTick > 0 ? "cart-bump" : ""
          }`}
        >
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
        open={isOpen}
        onClose={closeCart}
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