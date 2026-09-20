"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const money = (n, decimals = 0) =>
  `৳${n.toLocaleString("en-BD", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

export default function CartDrawer({
  open,
  onClose,
  items,
  onChangeQty,
  onRemove,
  onAdd,
  subtotal,
  suggestions = [],
}) {
  const closeBtnRef = useRef(null);
  const sliderRef = useRef(null);
  const autoSlideRef = useRef(null);
  const pausedRef = useRef(false);

  const inCartIds = new Set(items.map((i) => i.id));

  // Escape diye close + drawer khola thakle page scroll bondho
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // ===== Infinite Auto Slide =====
  useEffect(() => {
    if (!open || suggestions.length === 0) return;
    const slider = sliderRef.current;
    if (!slider) return;

    // Duplicate items for seamless infinite loop
    const originalCount = suggestions.length;
    const cardWidth = 150 + 12; // w-[150px] + gap-3 (12px)
    const totalOriginalWidth = cardWidth * originalCount;

    // Start at the beginning of the duplicated set (middle)
    // We render 3 sets: [clone][original][clone] for seamless looping
    let rafId;
    let lastTime = performance.now();
    const speed = 0.6; // px per frame (~36px/sec at 60fps)

    const step = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!pausedRef.current) {
        slider.scrollLeft += (speed * delta) / 16.67;

        // Reset to the start of the middle set when we've scrolled one full set
        if (slider.scrollLeft >= totalOriginalWidth * 2) {
          slider.scrollLeft -= totalOriginalWidth;
        } else if (slider.scrollLeft <= 0) {
          slider.scrollLeft += totalOriginalWidth;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [open, suggestions]);

  const pauseAuto = () => (pausedRef.current = true);
  const resumeAuto = () => (pausedRef.current = false);

  // Manual arrow slide (pauses auto briefly)
  const slide = (dir) => {
    const slider = sliderRef.current;
    if (!slider) return;
    pausedRef.current = true;
    slider.scrollBy({ left: dir * 324, behavior: "smooth" });
    clearTimeout(autoSlideRef.current);
    autoSlideRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 1500);
  };

  // Triple the suggestions for seamless infinite loop
  const loopedSuggestions = suggestions.length > 0
    ? [...suggestions, ...suggestions, ...suggestions]
    : [];

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${
        open ? "visible" : "invisible"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay: bairey click korle close hobe */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Right side drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scroll area: cart items + You May Also Like */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <p className="text-lg font-medium text-gray-800">No items in your cart!</p>
              <button onClick={onClose} className="text-sm font-medium text-orange-600 hover:underline">
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-3xl">
                    {item.emoji}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.name}</p>
                      <button
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-gray-300">
                        <button
                          onClick={() => onChangeQty(item.id, -1)}
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                          className="h-7 w-7 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => onChangeQty(item.id, 1)}
                          aria-label="Increase quantity"
                          className="h-7 w-7 text-gray-700 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-orange-600">
                        {money(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* You May Also Like: infinite auto sliding carousel */}
          {suggestions.length > 0 && (
            <section className="mt-2 border-t border-gray-200 bg-gray-50 py-4" aria-labelledby="also-like-title">
              <div className="mb-3 flex items-center justify-between px-5">
                <h3 id="also-like-title" className="text-base font-semibold text-gray-900">
                  You May Also Like
                </h3>
                <div className="flex gap-1.5">
                  {[-1, 1].map((dir) => (
                    <button
                      key={dir}
                      onClick={() => slide(dir)}
                      aria-label={dir < 0 ? "Previous products" : "Next products"}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:border-orange-500 hover:text-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={dir < 0 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <ul
                ref={sliderRef}
                onMouseEnter={pauseAuto}
                onMouseLeave={resumeAuto}
                onTouchStart={pauseAuto}
                onTouchEnd={resumeAuto}
                className="flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollBehavior: "auto" }}
              >
                {loopedSuggestions.map((p, idx) => {
                  const added = inCartIds.has(p.id);
                  return (
                    <li
                      key={`${p.id}-${idx}`}
                      className="w-[150px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <div className="flex h-24 items-center justify-center bg-orange-50 text-5xl">
                        {p.emoji}
                      </div>
                      <div className="p-2.5">
                        <p className="line-clamp-2 h-8 text-xs font-medium leading-4 text-gray-900">
                          {p.name}
                        </p>
                        <div className="mt-1.5 flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-orange-600">{money(p.price)}</span>
                          {p.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">{money(p.oldPrice)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => onAdd(p)}
                          disabled={added}
                          aria-label={added ? `${p.name} is in your cart` : `Add ${p.name} to cart`}
                          className={`mt-2 w-full rounded-md py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                            added
                              ? "bg-green-50 text-green-700"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {added ? "✓ In cart" : "Add To Cart"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-5 py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">{money(subtotal, 2)}</span>
            </div>
            <p className="mb-4 text-xs text-gray-500">Delivery charge is added at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="rounded-lg border border-orange-500 py-2.5 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="rounded-lg bg-orange-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-600"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}