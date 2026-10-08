"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

// ==================== DEMO DATA ====================
const DEMO_PRODUCTS = [
  {
    id: "EB-204",
    name: "Wireless Earbuds Pro",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop",
    wholesalePrice: 500,
    marginOptions: [20, 30],
    category: "Electronics",
    stock: 120,
    description: "Premium wireless earbuds with active noise cancellation and 30-hour battery life. Perfect for music lovers and commuters.",
  },
  {
    id: "WT-118",
    name: "Smart Watch Series 3",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop",
    wholesalePrice: 1200,
    marginOptions: [15, 25],
    category: "Electronics",
    stock: 45,
    description: "Track your fitness, monitor heart rate, and stay connected with this sleek smartwatch. Water-resistant and 7-day battery.",
  },
  {
    id: "PB-077",
    name: "Power Bank 10000mAh",
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f2e8?w=200&h=200&fit=crop",
    wholesalePrice: 650,
    marginOptions: [20],
    category: "Accessories",
    stock: 80,
    description: "Fast-charging power bank with dual USB ports. Charge two devices at once. Slim design fits in your pocket.",
  },
  {
    id: "BG-310",
    name: "Leather Laptop Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    wholesalePrice: 900,
    marginOptions: [25, 35],
    category: "Fashion",
    stock: 30,
    description: "Genuine leather laptop bag with padded compartment. Fits up to 15-inch laptops. Multiple pockets for organization.",
  },
  {
    id: "LM-052",
    name: "LED Desk Lamp",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop",
    wholesalePrice: 380,
    marginOptions: [30, 40],
    category: "Home",
    stock: 95,
    description: "Adjustable LED desk lamp with 3 color modes and 5 brightness levels. Eye-caring technology reduces strain.",
  },
];

// ==================== HELPERS ====================
const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(
    Math.round(n || 0)
  );

const compact = (n) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(n || 0));

const priceFor = (cost, marginPct) => Math.round(cost / (1 - marginPct / 100));

const QTY_STEPS = [1, 5, 10, 25, 50, 100];

const defaultState = (item) => ({
  pick: (item.marginOptions || []).length ? 0 : "custom",
  customIn: "",
  qty: 10,
  goalIn: "",
  note: "",
  status: "idle",
});

function compute(item, st) {
  const cost = Number(item.wholesalePrice) || 0;
  const options = item.marginOptions || [];
  const selling =
    st.pick === "custom"
      ? Number(st.customIn) || 0
      : priceFor(cost, options[st.pick]);
  const valid = selling > 0;
  const profit = valid ? selling - cost : 0;
  const margin = valid ? (profit / selling) * 100 : 0;
  const markup = cost > 0 && valid ? (profit / cost) * 100 : 0;
  return { cost, options, selling, valid, profit, margin, markup };
}

const offerLabel = (item) => {
  const o = item.marginOptions || [];
  if (!o.length) return "Set your own price";
  if (o.length === 1) return `${o[0]}% profit`;
  return `${Math.min(...o)}–${Math.max(...o)}% profit`;
};

// ==================== MAIN PAGE ====================
export default function MarginCalculatorPage({ products = DEMO_PRODUCTS, onAccept } = {}) {
  const list = Array.isArray(products) && products.length ? products : DEMO_PRODUCTS;

  const [activeId, setActiveId] = useState(list[0].id);
  const [states, setStates] = useState({});
  const [query, setQuery] = useState("");
  const [detailsProduct, setDetailsProduct] = useState(null);
  const calcRef = useRef(null);

  // AUTO-SLIDE STATE
  const scrollerRef = useRef(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const pauseUntilRef = useRef(0);
  const hoverRef = useRef(false);

  const active = list.find((p) => p.id === activeId) || list[0];
  const getState = (p) => ({ ...defaultState(p), ...states[p.id] });

  const patch = (id, change) =>
    setStates((prev) => {
      const item = list.find((p) => p.id === id);
      return {
        ...prev,
        [id]: { ...defaultState(item), ...prev[id], ...change },
      };
    });

  const scrollCardIntoView = useCallback((id) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector(`[data-card-id="${id}"]`);
    if (!card) return;
    const sWidth = scroller.clientWidth;
    const cLeft = card.offsetLeft;
    const cWidth = card.offsetWidth;
    const targetLeft = cLeft - sWidth / 2 + cWidth / 2;
    scroller.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollCardIntoView(activeId);
  }, [activeId, scrollCardIntoView]);

  useEffect(() => {
    if (!autoPlay) return;
    if (list.length < 2) return;

    const interval = setInterval(() => {
      if (hoverRef.current) return;
      if (Date.now() < pauseUntilRef.current) return;

      setActiveId((curr) => {
        const idx = list.findIndex((p) => p.id === curr);
        const next = list[(idx + 1) % list.length];
        return next.id;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlay, list]);

  const scrollByCards = (dir) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: dir * 200, behavior: "smooth" });
    pauseUntilRef.current = Date.now() + 8000;
  };

  const select = (id, scroll) => {
    setActiveId(id);
    pauseUntilRef.current = Date.now() + 8000;
    if (scroll) {
      requestAnimationFrame(() =>
        calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  };

  // ---------- overview numbers ----------
  const rows = list.map((p) => {
    const st = getState(p);
    return { item: p, st, calc: compute(p, st) };
  });
  const acceptedRows = rows.filter((r) => r.st.status === "sent");
  const acceptedCount = acceptedRows.length;
  const acceptedProfit = acceptedRows.reduce(
    (sum, r) => sum + r.calc.profit * r.st.qty,
    0
  );

  const activeIndex = list.findIndex((p) => p.id === active.id);
  const nextPending =
    [...list.slice(activeIndex + 1), ...list.slice(0, activeIndex)].find(
      (p) => getState(p).status !== "sent"
    ) || null;

  const filtered =
    list.length > 6 && query.trim()
      ? list.filter((p) =>
          p.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      : list;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-3xl bg-[var(--color-brand-cream)] p-4 sm:p-6">
      {/* ========== PAGE HEADER ========== */}
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-ink)]">
          Offers from admin
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Check your profit on each product, then accept the ones you want to sell.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
            <div
              className="h-full rounded-full bg-[var(--color-brand-teal)] transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(acceptedCount / list.length) * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-[var(--color-ink)]/60">
            {acceptedCount} of {list.length} accepted
          </span>
        </div>
      </div>

      {/* ========== PRODUCT SWITCHER ========== */}
      <section aria-label="Products from admin" className="relative">
        {list.length > 6 && (
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="mb-3 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm outline-none placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)]"
          />
        )}

        <div className="relative">
          {/* LEFT FADE + ARROW */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[var(--color-brand-cream)] to-transparent" />
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous product"
            className="absolute left-1 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-line)] bg-white/95 text-[var(--color-ink)]/60 shadow-sm backdrop-blur transition-all hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* RIGHT FADE + ARROW */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[var(--color-brand-cream)] to-transparent" />
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Next product"
            className="absolute right-1 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[var(--color-line)] bg-white/95 text-[var(--color-ink)]/60 shadow-sm backdrop-blur transition-all hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* SCROLLER */}
          <div
            ref={scrollerRef}
            onMouseEnter={() => (hoverRef.current = true)}
            onMouseLeave={() => (hoverRef.current = false)}
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((p) => {
              const st = getState(p);
              const isActive = p.id === active.id;
              const done = st.status === "sent";
              return (
                <button
                  key={p.id}
                  data-card-id={p.id}
                  type="button"
                  onClick={() => select(p.id, false)}
                  aria-pressed={isActive}
                  className={`relative min-w-[190px] shrink-0 snap-center rounded-2xl border-2 p-3 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] ${
                    isActive
                      ? "scale-[1.03] border-[var(--color-brand-navy)] bg-white shadow-lg shadow-[var(--color-brand-navy)]/10"
                      : "scale-100 border-transparent bg-white/70 hover:bg-white"
                  }`}
                >
                  {/* Details (info) button — top left */}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailsProduct(p);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        setDetailsProduct(p);
                      }
                    }}
                    aria-label={`View details of ${p.name}`}
                    className="absolute left-2 top-2 z-10 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-white/95 text-[var(--color-ink)]/60 shadow-sm backdrop-blur transition-all hover:bg-[var(--color-brand-navy)] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                    </svg>
                  </span>

                  {isActive && autoPlay && (
                    <span className="absolute right-2 top-2 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-orange)] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-brand-orange)]" />
                    </span>
                  )}

                  <div className="flex items-center gap-2.5">
                    <Thumb item={p} size="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                        {p.name}
                      </p>
                      <p className="text-xs tabular-nums text-[var(--color-ink)]/55">
                        ৳{fmt(p.wholesalePrice)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-[var(--color-ink)]/55">
                      {offerLabel(p)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        done
                          ? "bg-[var(--color-brand-teal)]/15 text-[var(--color-brand-teal)]"
                          : "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-dark)]"
                      }`}
                    >
                      {done ? "Accepted" : "Waiting"}
                    </span>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-4 text-sm text-[var(--color-ink)]/50">
                No product found for "{query}".
              </p>
            )}
          </div>
        </div>

        {/* DOTS + AUTOPLAY TOGGLE */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {list.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => select(p.id, false)}
                aria-label={`Go to ${p.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  p.id === active.id
                    ? "w-6 bg-[var(--color-brand-orange)]"
                    : "w-1.5 bg-[var(--color-ink)]/20 hover:bg-[var(--color-ink)]/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAutoPlay((v) => !v)}
            aria-label={autoPlay ? "Pause auto-slide" : "Play auto-slide"}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--color-ink)]/60 transition-colors hover:border-[var(--color-brand-orange)]/40 hover:text-[var(--color-ink)]"
          >
            {autoPlay ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <path d="M6 5v14l12-7z" />
                </svg>
                Play
              </>
            )}
          </button>
        </div>
      </section>

      {/* ========== CALCULATOR ========== */}
      <div ref={calcRef} className="scroll-mt-4">
        <ProductCalculator
          key={active.id}
          item={active}
          position={activeIndex + 1}
          total={list.length}
          st={getState(active)}
          patch={(change) => patch(active.id, change)}
          onAccept={onAccept}
          nextPending={nextPending}
          onNext={() => nextPending && select(nextPending.id, true)}
          onDetails={() => setDetailsProduct(active)}
        />
      </div>

      {/* ========== ALL PRODUCTS OVERVIEW ========== */}
      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[var(--color-ink)]">
          All your products
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Tap a product to open it again.
        </p>

        <ul className="mt-3 divide-y divide-dashed divide-[var(--color-line)]">
          {rows.map(({ item, st, calc }) => {
            const done = st.status === "sent";
            return (
              <li
                key={item.id}
                className="flex items-center gap-2 py-3 transition-colors hover:bg-[var(--color-brand-cream)]/60"
              >
                <button
                  type="button"
                  onClick={() => select(item.id, true)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
                >
                  <Thumb item={item} size="h-9 w-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                      {item.name}
                    </p>
                    <p className="text-xs tabular-nums text-[var(--color-ink)]/55">
                      {calc.valid && calc.profit > 0
                        ? `Sell at ৳${fmt(calc.selling)} · ${fmt(st.qty)} pieces`
                        : "Choose a price with profit"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        calc.profit > 0
                          ? "text-[var(--color-brand-teal)]"
                          : "text-[var(--color-ink)]/35"
                      }`}
                    >
                      {calc.profit > 0 ? `৳${fmt(calc.profit * st.qty)}` : "—"}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${
                        done
                          ? "text-[var(--color-brand-teal)]"
                          : "text-[var(--color-ink)]/45"
                      }`}
                    >
                      {done ? "Accepted" : "Not accepted yet"}
                    </p>
                  </div>
                </button>

                {/* Details button */}
                <button
                  type="button"
                  onClick={() => setDetailsProduct(item)}
                  aria-label={`View details of ${item.name}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-ink)]/40 transition-colors hover:bg-[var(--color-brand-navy)] hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-2 flex items-center justify-between rounded-xl bg-[var(--color-brand-cream)] px-4 py-3">
          <span className="text-sm text-[var(--color-ink)]/70">
            Expected profit from accepted products
          </span>
          <span className="text-lg font-bold tabular-nums text-[var(--color-brand-teal)]">
            ৳{fmt(acceptedProfit)}
          </span>
        </div>
      </section>

      {/* ========== PRODUCT DETAILS MODAL ========== */}
      {detailsProduct && (
        <ProductDetailsModal
          item={detailsProduct}
          onClose={() => setDetailsProduct(null)}
        />
      )}
    </div>
  );
}

// ==================== PRODUCT CALCULATOR ====================
function ProductCalculator({ item, position, total, st, patch, onAccept, nextPending, onNext, onDetails }) {
  const { cost, options, selling, valid, profit, margin, markup } = compute(item, st);
  const { pick, customIn, qty, goalIn, note, status } = st;
  const minOpt = options.length ? Math.min(...options) : null;
  const maxOpt = options.length ? Math.max(...options) : null;
  const locked = status === "sent";
  const canAccept = valid && profit > 0;

  const setQtyClean = (v) =>
    patch({ qty: Math.max(1, Math.floor(Number(v)) || 1) });

  const totalSales = valid ? selling * qty : 0;
  const totalCost = cost * qty;
  const totalProfit = valid ? profit * qty : 0;

  const goal = Number(goalIn) || 0;
  const needPieces = profit > 0 && goal > 0 ? Math.ceil(goal / profit) : 0;

  let verdict = null;
  if (valid) {
    if (profit < 0)
      verdict = {
        tone: "bad",
        title: "You will lose money",
        text: `This price is ৳${fmt(-profit)} below what admin charges you. Raise your price.`,
      };
    else if (profit === 0)
      verdict = {
        tone: "bad",
        title: "No profit at this price",
        text: "You are selling at the admin price. Delivery or return costs will come out of your pocket.",
      };
    else if (minOpt !== null && margin < minOpt - 0.05)
      verdict = {
        tone: "warn",
        title: `Lower than admin's ${minOpt}%`,
        text: "You earn less than the admin offers. Fine for a quick sale, but thin if there are returns.",
      };
    else if (maxOpt !== null && margin > maxOpt + 0.05)
      verdict = {
        tone: "warn",
        title: `Higher than admin's ${maxOpt}%`,
        text: "More profit per sale, but check other shops first. A high price can slow down sales.",
      };
    else
      verdict = {
        tone: "good",
        title: "Good price",
        text:
          minOpt !== null
            ? "This is inside the profit range admin offers."
            : "This is a healthy profit for most products.",
      };
  }

  const toneColor =
    verdict?.tone === "good"
      ? "var(--color-brand-teal)"
      : verdict
      ? "var(--color-brand-orange-dark)"
      : "var(--color-ink)";

  const tagBg = !valid
    ? "rgba(27,31,39,0.12)"
    : profit <= 0
    ? "var(--color-brand-orange-dark)"
    : "var(--color-brand-orange)";

  const maxEarn = profit > 0 ? profit * QTY_STEPS[QTY_STEPS.length - 1] : 0;
  const adminPct = valid && profit > 0 ? (cost / selling) * 100 : 100;

  const steps = [
    { title: "Admin sets price and profit", done: true },
    { title: "Check what you earn", done: canAccept },
    { title: "Accept. Admin gets notified", done: locked },
  ];
  const currentStep = steps.findIndex((s) => !s.done);

  const send = async () => {
    patch({ status: "sending" });
    const payload = {
      productId: item.id,
      productName: item.name,
      costPrice: cost,
      sellingPrice: selling,
      profitPerPiece: profit,
      marginPercent: Number(margin.toFixed(2)),
      plannedQty: qty,
      expectedTotalProfit: totalProfit,
      note: note.trim(),
    };
    try {
      if (onAccept) await onAccept(payload);
      else await new Promise((r) => setTimeout(r, 900));
      patch({ status: "sent" });
    } catch {
      patch({ status: "error" });
    }
  };

  useEffect(() => {
    if (status !== "confirm" && status !== "error") return;
    const onKey = (e) => {
      if (e.key === "Escape") patch({ status: "idle" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const dialogOpen =
    status === "confirm" || status === "sending" || status === "error";

  return (
    <div className="flex flex-col gap-5">
      {/* ========== PRODUCT STRIP ========== */}
      <div className="flex items-center gap-4 rounded-2xl bg-[var(--color-brand-navy)] p-4 text-white">
        <Thumb item={item} size="h-14 w-14" dark />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{item.name}</p>
          <p className="mt-0.5 text-xs text-white/55">
            Product {position} of {total}
          </p>
          <button
            type="button"
            onClick={onDetails}
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-white/60 underline-offset-2 transition-colors hover:text-white hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
            </svg>
            View details
          </button>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-white/55">Admin price (your cost)</p>
          <p className="text-xl font-bold tabular-nums">৳{fmt(cost)}</p>
        </div>
      </div>

      {/* ========== HOW IT WORKS ========== */}
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((s, i) => {
          const current = i === currentStep;
          return (
            <li
              key={s.title}
              className="flex flex-col items-start gap-2 rounded-xl bg-white/70 p-3"
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                  s.done
                    ? "bg-[var(--color-brand-teal)] text-white"
                    : current
                    ? "border-2 border-[var(--color-brand-orange)] text-[var(--color-brand-orange)]"
                    : "border-2 border-[var(--color-line)] text-[var(--color-ink)]/35"
                }`}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs leading-snug ${
                  current
                    ? "font-semibold text-[var(--color-ink)]"
                    : "text-[var(--color-ink)]/60"
                }`}
              >
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>

      {/* ========== ADMIN'S OFFER ========== */}
      <section>
        <h2 className="text-base font-semibold text-[var(--color-ink)]">
          Admin's profit offer for you
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          {options.length
            ? "Pick one of the profits below, or set your own selling price."
            : "Set the price you want to sell at."}
        </p>

        <div
          role="radiogroup"
          aria-label="Profit offer"
          className={`mt-3 grid grid-cols-1 gap-3 ${
            options.length >= 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {options.map((m, i) => {
            const isOn = pick === i;
            const p = priceFor(cost, m);
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={isOn}
                disabled={locked}
                onClick={() => patch({ pick: i })}
                className={`rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] disabled:cursor-not-allowed ${
                  isOn
                    ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]/30 disabled:opacity-60"
                }`}
              >
                <span
                  className={`text-xs ${
                    isOn ? "text-white/60" : "text-[var(--color-ink)]/50"
                  }`}
                >
                  Admin offers
                </span>
                <span className="mt-1 block text-4xl font-bold tabular-nums tracking-tight">
                  {m}%
                </span>
                <span
                  className={`mt-3 block text-sm ${
                    isOn ? "text-white/75" : "text-[var(--color-ink)]/60"
                  }`}
                >
                  Sell at <b className="tabular-nums">৳{fmt(p)}</b>
                </span>
                <span className="block text-sm font-semibold tabular-nums text-[var(--color-brand-teal)]">
                  You earn ৳{fmt(p - cost)} per piece
                </span>
              </button>
            );
          })}

          <div
            role="radio"
            aria-checked={pick === "custom"}
            aria-disabled={locked}
            tabIndex={locked ? -1 : 0}
            onClick={() => !locked && patch({ pick: "custom" })}
            onKeyDown={(e) => {
              if (locked) return;
              if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
                e.preventDefault();
                patch({ pick: "custom" });
              }
            }}
            className={`rounded-2xl border-2 p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] ${
              locked ? "opacity-60" : "cursor-pointer"
            } ${
              pick === "custom"
                ? "border-[var(--color-brand-orange)] bg-white"
                : "border-dashed border-[var(--color-line)] bg-white/60 hover:border-[var(--color-ink)]/30"
            }`}
          >
            <span className="text-xs text-[var(--color-ink)]/50">My own price</span>
            <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-[var(--color-brand-cream)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-brand-orange)]">
              <span className="text-lg font-semibold text-[var(--color-ink)]/35">৳</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                disabled={locked}
                value={customIn}
                onFocus={() => pick !== "custom" && patch({ pick: "custom" })}
                onChange={(e) =>
                  patch({ pick: "custom", customIn: e.target.value })
                }
                placeholder={String(Math.round(cost * 1.25))}
                aria-label="My own selling price"
                className="w-full min-w-0 bg-transparent text-2xl font-bold tabular-nums text-[var(--color-ink)] outline-none placeholder:font-normal placeholder:text-[var(--color-ink)]/20"
              />
            </div>
            <span className="mt-3 block text-sm text-[var(--color-ink)]/60">
              {pick === "custom" && valid ? (
                <>
                  That is{" "}
                  <b className="tabular-nums" style={{ color: toneColor }}>
                    {margin.toFixed(1)}%
                  </b>{" "}
                  profit
                </>
              ) : (
                "Type the price you want to sell at"
              )}
            </span>
          </div>
        </div>
      </section>

      {/* ========== PER PIECE RESULT ========== */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4">
          <div
            className="relative py-5 pl-14 pr-6 text-white transition-colors duration-300"
            style={{
              background: tagBg,
              clipPath: "polygon(30px 0, 100% 0, 100% 100%, 30px 100%, 0 50%)",
            }}
          >
            <span className="absolute left-[26px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white" />
            <p className="text-xs text-white/80">Customer pays</p>
            <p
              className="text-4xl font-bold tabular-nums tracking-tight"
              style={{ color: valid ? "#fff" : "rgba(27,31,39,0.3)" }}
            >
              {valid ? `৳${fmt(selling)}` : "৳ —"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-ink)]/60">
              You earn on every piece
            </p>
            <p
              className="text-4xl font-bold tabular-nums tracking-tight"
              style={{ color: valid ? toneColor : "rgba(27,31,39,0.25)" }}
            >
              {valid ? `${profit < 0 ? "−" : ""}৳${fmt(Math.abs(profit))}` : "৳ —"}
            </p>
          </div>

          <div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
              <div
                className="h-full bg-[var(--color-brand-navy)] transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${adminPct}%` }}
              />
              <div
                className="h-full bg-[var(--color-brand-teal)] transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${100 - adminPct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-[var(--color-ink)]/60">
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-navy)]" />
                Admin gets ৳{fmt(cost)}
              </span>
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-teal)]" />
                You keep ৳{fmt(Math.max(profit, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl border-l-4 bg-white p-4"
            style={{ borderColor: valid ? toneColor : "var(--color-line)" }}
          >
            <p className="text-base font-semibold text-[var(--color-ink)]">
              {verdict ? verdict.title : "Pick a profit above"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/65">
              {verdict
                ? verdict.text
                : "Choose one of the offers, or type your own price. Your result shows up here."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[var(--color-ink)]/55">Margin</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
                {valid ? `${margin.toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink)]/45">
                Profit out of the selling price
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[var(--color-ink)]/55">Markup</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
                {valid ? `${markup.toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink)]/45">
                Added on top of admin price
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EARNING PLAN ========== */}
      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              How many pieces will you sell?
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">
              Tap a bar or type a number to see your total earning.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Fewer pieces"
              disabled={locked}
              onClick={() => setQtyClean(qty - 1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-brand-cream)] text-lg text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-line)] disabled:opacity-50"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              disabled={locked}
              value={qty}
              onChange={(e) => setQtyClean(e.target.value)}
              aria-label="Number of pieces"
              className="w-20 rounded-xl border border-[var(--color-line)] bg-white py-1.5 text-center text-base font-semibold tabular-nums outline-none focus:border-[var(--color-brand-orange)] disabled:opacity-60"
            />
            <button
              type="button"
              aria-label="More pieces"
              disabled={locked}
              onClick={() => setQtyClean(qty + 1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-brand-cream)] text-lg text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-line)] disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {profit > 0 ? (
          <div className="mt-5 flex h-36 items-end gap-2 sm:gap-4">
            {QTY_STEPS.map((n) => {
              const t = profit * n;
              const h = Math.max((t / maxEarn) * 100, 4);
              const isOn = qty === n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={locked}
                  onClick={() => setQtyClean(n)}
                  aria-label={`${n} pieces, earn ৳${fmt(t)}`}
                  className="group flex h-full flex-1 flex-col items-center justify-end focus-visible:outline-none"
                >
                  <span
                    className={`mb-1 text-[11px] font-semibold tabular-nums ${
                      isOn
                        ? "text-[var(--color-brand-orange-dark)]"
                        : "text-[var(--color-ink)]/70"
                    }`}
                  >
                    ৳{compact(t)}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-[height,background-color] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-brand-orange)] motion-reduce:transition-none"
                    style={{
                      height: `${h}%`,
                      background: isOn
                        ? "var(--color-brand-orange)"
                        : "var(--color-brand-navy)",
                      opacity: isOn ? 1 : 0.8,
                    }}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-[var(--color-brand-cream)] p-4 text-sm text-[var(--color-ink)]/60">
            {valid
              ? `Set a price above ৳${fmt(cost)} to see how much you can earn.`
              : "Pick a profit above to see your earnings."}
          </p>
        )}
        {profit > 0 && (
          <div className="mt-2 flex gap-2 sm:gap-4">
            {QTY_STEPS.map((n) => (
              <span
                key={n}
                className="flex-1 text-center text-[11px] text-[var(--color-ink)]/50"
              >
                {n} {n === 1 ? "piece" : "pieces"}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-[var(--color-brand-cream)] p-4">
          <div>
            <p className="text-[11px] text-[var(--color-ink)]/55">Customers pay you</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
              {valid ? `৳${fmt(totalSales)}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--color-ink)]/55">You pay admin</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
              ৳{fmt(totalCost)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--color-ink)]/55">
              You keep for {qty} {qty === 1 ? "piece" : "pieces"}
            </p>
            <p
              className="mt-0.5 text-lg font-bold tabular-nums"
              style={{ color: profit > 0 ? "var(--color-brand-teal)" : "var(--color-ink)" }}
            >
              {valid ? `${totalProfit < 0 ? "−" : ""}৳${fmt(Math.abs(totalProfit))}` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-line)] p-4">
          <label htmlFor={`goal-${item.id}`} className="text-sm font-semibold text-[var(--color-ink)]">
            Want to earn a target amount?
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-[var(--color-brand-cream)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-brand-orange)]">
              <span className="font-semibold text-[var(--color-ink)]/35">৳</span>
              <input
                id={`goal-${item.id}`}
                type="number"
                inputMode="decimal"
                min="0"
                disabled={locked}
                value={goalIn}
                onChange={(e) => patch({ goalIn: e.target.value })}
                placeholder="5000"
                className="w-28 bg-transparent text-base font-semibold tabular-nums outline-none placeholder:font-normal placeholder:text-[var(--color-ink)]/25"
              />
            </div>
            {needPieces > 0 ? (
              <>
                <p className="text-sm text-[var(--color-ink)]/70">
                  Sell <b className="tabular-nums text-[var(--color-ink)]">{fmt(needPieces)} pieces</b>{" "}
                  to earn ৳{fmt(goal)}.
                </p>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setQtyClean(needPieces)}
                  className="rounded-full bg-[var(--color-brand-navy)] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-brand-navy-light)] disabled:opacity-50"
                >
                  Use {fmt(needPieces)} pieces
                </button>
              </>
            ) : (
              <p className="text-sm text-[var(--color-ink)]/50">
                {profit > 0
                  ? "Type an amount to see how many pieces you need to sell."
                  : "Pick a price with profit first."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ========== SUMMARY + ACCEPT ========== */}
      <section className="rounded-2xl bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[var(--color-ink)]">
          Your offer summary
        </h2>

        <dl className="mt-3 divide-y divide-dashed divide-[var(--color-line)] text-sm">
          <SummaryRow label="Admin price (your cost)" value={`৳${fmt(cost)}`} />
          <SummaryRow label="Your selling price" value={valid ? `৳${fmt(selling)}` : "—"} />
          <SummaryRow
            label="Profit per piece"
            value={valid ? `৳${fmt(profit)} (${margin.toFixed(1)}%)` : "—"}
          />
          <SummaryRow label="Pieces you plan to sell" value={fmt(qty)} />
          <SummaryRow
            label="Total profit you can earn"
            value={canAccept ? `৳${fmt(totalProfit)}` : "—"}
            strong
          />
        </dl>

        {locked ? (
          <div className="mt-5 rounded-2xl bg-[var(--color-brand-teal)]/10 p-4">
            <p className="text-base font-semibold text-[var(--color-brand-teal)]">
              Offer accepted. Admin has been notified.
            </p>
            <ol className="mt-3 flex flex-col gap-2.5 text-sm text-[var(--color-ink)]/75">
              <TimelineItem done>You accepted this offer</TimelineItem>
              <TimelineItem done>Admin received your notification</TimelineItem>
              <TimelineItem>Waiting for admin to confirm</TimelineItem>
            </ol>
            {nextPending ? (
              <button
                type="button"
                onClick={onNext}
                className="mt-4 w-full rounded-xl bg-[var(--color-brand-navy)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-navy-light)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-navy)]/30"
              >
                Next product: {nextPending.name}
              </button>
            ) : (
              <p className="mt-4 text-sm font-medium text-[var(--color-ink)]/70">
                You have accepted all products from admin.
              </p>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={!canAccept}
              onClick={() => patch({ status: "confirm" })}
              className="mt-5 w-full rounded-2xl bg-[var(--color-brand-orange)] py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)]/40 disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30"
            >
              Accept this offer
            </button>
            <p className="mt-2 text-center text-xs text-[var(--color-ink)]/50">
              {canAccept
                ? "When you accept, admin gets a notification right away."
                : "Choose a price with profit to accept."}
            </p>
            {nextPending && (
              <button
                type="button"
                onClick={onNext}
                className="mx-auto mt-3 block text-sm font-medium text-[var(--color-ink)]/60 underline-offset-4 hover:text-[var(--color-ink)] hover:underline"
              >
                Skip for now. Go to {nextPending.name}
              </button>
            )}
          </>
        )}
      </section>

      {/* ========== CONFIRM DIALOG ========== */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-brand-navy)]/60 p-0 sm:items-center sm:p-4"
          onClick={() => status !== "sending" && patch({ status: "idle" })}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
          >
            <h3 id="confirm-title" className="text-lg font-semibold text-[var(--color-ink)]">
              Send this to admin?
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">
              Admin will get a notification that you accepted this offer.
            </p>

            <div className="mt-4 rounded-2xl bg-[var(--color-brand-cream)] p-4 text-sm">
              <p className="font-semibold text-[var(--color-ink)]">{item.name}</p>
              <p className="mt-1 text-[var(--color-ink)]/70">
                Sell at <b className="tabular-nums">৳{fmt(selling)}</b>, earn{" "}
                <b className="tabular-nums">৳{fmt(profit)}</b> per piece
              </p>
              <p className="text-[var(--color-ink)]/70">
                {fmt(qty)} pieces = ৳{fmt(totalProfit)} profit
              </p>
            </div>

            <label htmlFor="note" className="mt-4 block text-sm font-medium text-[var(--color-ink)]">
              Message for admin{" "}
              <span className="font-normal text-[var(--color-ink)]/45">(optional)</span>
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(e) => patch({ note: e.target.value })}
              placeholder="Example: I will start selling from next week."
              className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-line)] p-3 text-sm outline-none placeholder:text-[var(--color-ink)]/30 focus:border-[var(--color-brand-orange)]"
            />

            {status === "error" && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-[var(--color-brand-orange)]/10 p-3 text-sm text-[var(--color-brand-orange-dark)]"
              >
                Could not send to admin. Check your internet and try again.
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={status === "sending"}
                onClick={() => patch({ status: "idle" })}
                className="flex-1 rounded-xl border border-[var(--color-line)] py-3 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={status === "sending"}
                onClick={send}
                className="flex-[1.6] rounded-xl bg-[var(--color-brand-orange)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] disabled:opacity-70"
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "error"
                  ? "Try again"
                  : "Accept and notify admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SMALL PIECES ====================
function Thumb({ item, size, dark }) {
  const initials = (item.name || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.name}
        className={`${size} shrink-0 rounded-xl object-cover`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${size} grid shrink-0 place-items-center rounded-xl text-xs font-bold ${
        dark
          ? "bg-[var(--color-brand-navy-light)] text-white/80"
          : "bg-[var(--color-brand-navy)] text-white"
      }`}
    >
      {initials}
    </div>
  );
}

function SummaryRow({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-[var(--color-ink)]/60">{label}</dt>
      <dd
        className={`tabular-nums ${
          strong
            ? "text-lg font-bold text-[var(--color-brand-teal)]"
            : "font-semibold text-[var(--color-ink)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineItem({ done, children }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-[var(--color-brand-teal)] text-white"
            : "border-2 border-[var(--color-line)] text-transparent"
        }`}
      >
        ✓
      </span>
      <span className={done ? "" : "text-[var(--color-ink)]/50"}>{children}</span>
    </li>
  );
}