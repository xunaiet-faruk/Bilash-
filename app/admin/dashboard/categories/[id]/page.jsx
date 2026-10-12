"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ============================================================
   SEED — Categories (shorter version)
   ============================================================ */
const CATEGORIES = {
  c1: { id: "c1", name: "Electronics", commission: 8, revenue: 4280000 },
  c2: { id: "c2", name: "Home & Kitchen", commission: 10, revenue: 2860000 },
  c3: { id: "c3", name: "Fashion", commission: 12, revenue: 3520000 },
  c4: { id: "c4", name: "Beauty & Health", commission: 15, revenue: 1840000 },
  c5: { id: "c5", name: "Sports & Outdoor", commission: 9, revenue: 1280000 },
  c6: { id: "c6", name: "Toys & Baby", commission: 10, revenue: 840000 },
  c7: { id: "c7", name: "Gift Cards", commission: 5, revenue: 0 },
};

const SUBS_BY_CAT = {
  c1: ["Audio", "Phones & Accessories", "Wearables", "Computing"],
  c2: ["Kitchen Tools", "Lighting", "Storage", "Decor"],
  c3: ["Men", "Women", "Accessories"],
  c4: ["Skincare", "Makeup", "Wellness"],
  c5: ["Fitness", "Camping", "Cycling"],
  c6: ["Toys", "Baby Care"],
  c7: [],
};

const PRODUCTS = [
  { id: "PRD-8841", name: "Wireless Earbuds Pro Max", sku: "WEP-MAX-BLK", emoji: "🎧", catId: "c1", sub: "Audio", brand: "SoundCore", seller: "TechBazar BD", price: 2450, cost: 1650, stock: 120, sold: 340, status: "live", rating: 4.7 },
  { id: "PRD-8827", name: "Bluetooth Speaker Mini", sku: "BSM-BLK", emoji: "🔊", catId: "c1", sub: "Audio", brand: "SoundCore", seller: "Audio Zone", price: 1890, cost: 1200, stock: 22, sold: 95, status: "live", rating: 4.5 },
  { id: "PRD-8840", name: "Smart Watch S9 Ultra", sku: "SWS9U-SLV", emoji: "⌚", catId: "c1", sub: "Wearables", brand: "TechFit", seller: "GadgetHub", price: 5890, cost: 4200, stock: 45, sold: 180, status: "live", rating: 4.9 },
  { id: "PRD-8839", name: "4K Webcam HD Pro", sku: "4KW-HDP", emoji: "📷", catId: "c1", sub: "Computing", brand: "Generic", seller: "NewSeller99", price: 3200, cost: 800, stock: 8, sold: 12, status: "pending", rating: 3.2 },
  { id: "PRD-8838", name: "USB-C Hub 12-in-1", sku: "UCH-12N1", emoji: "🔌", catId: "c1", sub: "Computing", brand: "Ugreen", seller: "TechBazar BD", price: 1850, cost: 1100, stock: 200, sold: 450, status: "live", rating: 4.8 },
  { id: "PRD-8837", name: "Mechanical Keyboard RGB", sku: "MKB-RGB", emoji: "⌨️", catId: "c1", sub: "Computing", brand: "KeyPro", seller: "KeyboardKing", price: 4200, cost: 2900, stock: 32, sold: 89, status: "live", rating: 4.5 },
  { id: "PRD-8836", name: "Gaming Mouse Pro 8K", sku: "GMP-8K", emoji: "🖱️", catId: "c1", sub: "Computing", brand: "Generic", seller: "NewSeller99", price: 1650, cost: 450, stock: 15, sold: 22, status: "pending", rating: 3.5 },
  { id: "PRD-8833", name: "Cotton Crew Tee", sku: "CCT-BLK", emoji: "👕", catId: "c3", sub: "Men", brand: "BasicWear", seller: "Green Valley Shop", price: 450, cost: 220, stock: 500, sold: 1200, status: "live", rating: 4.7 },
  { id: "PRD-8832", name: "Matte Lipstick Trio", sku: "MLT-SET", emoji: "💄", catId: "c4", sub: "Makeup", brand: "GlowUp", seller: "Al-Amin Store", price: 590, cost: 280, stock: 80, sold: 156, status: "live", rating: 4.5 },
  { id: "PRD-8831", name: "Kids Puzzle 100pc", sku: "KP-100", emoji: "🧩", catId: "c6", sub: "Toys", brand: "PlayTime", seller: "Al-Amin Store", price: 290, cost: 150, stock: 150, sold: 340, status: "live", rating: 4.8 },
  { id: "PRD-8830", name: "Ceramic Coffee Mug Set", sku: "CCMS-4", emoji: "☕", catId: "c2", sub: "Kitchen Tools", brand: "HomeCraft", seller: "Zaman Retail", price: 520, cost: 280, stock: 45, sold: 89, status: "live", rating: 4.6 },
  { id: "PRD-8829", name: "Smart LED Strip 5m", sku: "SLS-5M", emoji: "💡", catId: "c2", sub: "Lighting", brand: "BrightHome", seller: "Nur Enterprise", price: 620, cost: 340, stock: 100, sold: 210, status: "live", rating: 4.3 },
  { id: "PRD-8835", name: "Yoga Mat Anti-Slip", sku: "YMA-PRO", emoji: "🧘", catId: "c5", sub: "Fitness", brand: "FitLife", seller: "SportsStore", price: 780, cost: 450, stock: 60, sold: 120, status: "live", rating: 4.6 },
];

const STATUS_META = {
  live: { label: "Live", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

const fmt = (n) => `৳${n.toLocaleString("en-IN")}`;
const fmtCompact = (n) => {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1)}K`;
  return `৳${n}`;
};

/* ============================================================
   MAIN
   ============================================================ */
export default function CategoryProductsPage() {
  const params = useParams();
  const catId = params?.id;
  const category = CATEGORIES[catId];
  const subs = SUBS_BY_CAT[catId] || [];

  const [activeSub, setActiveSub] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    setActiveSub("all");
    setQuery("");
  }, [catId]);

  const catProducts = useMemo(
    () => PRODUCTS.filter((p) => p.catId === catId),
    [catId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = catProducts.filter((p) => {
      if (activeSub !== "all" && p.sub !== activeSub) return false;
      if (!q) return true;
      return `${p.name} ${p.sku} ${p.seller} ${p.brand}`.toLowerCase().includes(q);
    });
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "sold") list = [...list].sort((a, b) => b.sold - a.sold);
    return list;
  }, [catProducts, activeSub, query, sortBy]);

  const subCounts = useMemo(() => {
    const c = { all: catProducts.length };
    subs.forEach((s) => {
      c[s] = catProducts.filter((p) => p.sub === s).length;
    });
    return c;
  }, [catProducts, subs]);

  if (!category) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-16 text-center">
        <p className="text-4xl">🔍</p>
        <p className="mt-3 text-sm font-bold text-[var(--color-ink)]">
          Category not found
        </p>
        <Link
          href="/admin/dashboard/categories"
          className="mt-4 inline-block rounded-xl bg-[var(--color-brand-orange)] px-4 py-2 text-xs font-bold text-white"
        >
          ← Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
      {/* ============ BREADCRUMB ============ */}
      <nav className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink)]/50">
        <Link
          href="/admin/dashboard/categories"
          className="transition-colors hover:text-[var(--color-brand-orange)]"
        >
          Categories
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink)]">{category.name}</span>
      </nav>

      {/* ============ HERO HEADER ============ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-brand-navy)] via-[#1a2547] to-[var(--color-brand-navy)] p-6 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--color-brand-orange)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[var(--color-brand-teal)]/10 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-orange)]">
                Category
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                {category.commission}% commission
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {category.name}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              All products listed under {category.name}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Products
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums">
                {catProducts.length}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-wider text-white/50">
                Subcategories
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums">
                {subs.length}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-brand-orange)] px-4 py-3 shadow-lg shadow-orange-500/30">
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Revenue
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums">
                {fmtCompact(category.revenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ SUBCATEGORY TABS ============ */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--color-line)] bg-white p-2">
        <button
          onClick={() => setActiveSub("all")}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
            activeSub === "all"
              ? "bg-[var(--color-brand-orange)] text-white shadow-md shadow-orange-500/25"
              : "text-[var(--color-ink)]/60 hover:bg-[var(--color-brand-cream)]"
          }`}
        >
          All
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
            activeSub === "all" ? "bg-white/20 text-white" : "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/60"
          }`}>
            {subCounts.all}
          </span>
        </button>

        {subs.map((s) => {
          const on = activeSub === s;
          return (
            <button
              key={s}
              onClick={() => setActiveSub(s)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                on
                  ? "bg-[var(--color-brand-orange)] text-white shadow-md shadow-orange-500/25"
                  : "text-[var(--color-ink)]/60 hover:bg-[var(--color-brand-cream)]"
              }`}
            >
              {s}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                on ? "bg-white/20 text-white" : "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/60"
              }`}>
                {subCounts[s] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============ SEARCH + SORT ============ */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-3">
        <div className="relative min-w-[200px] flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/40"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in this category..."
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)] focus:bg-white focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[var(--color-brand-orange)]"
        >
          <option value="recent">Recently added</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="sold">Best selling</option>
        </select>

        <span className="ml-auto text-xs font-medium tabular-nums text-[var(--color-ink)]/50">
          {filtered.length} of {catProducts.length}
        </span>
      </div>

      {/* ============ PRODUCTS GRID ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white py-20 text-center">
          <p className="text-4xl">📦</p>
          <p className="mt-3 text-sm font-bold text-[var(--color-ink)]">
            No products found
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink)]/50">
            Try a different subcategory or search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PRODUCT CARD
   ============================================================ */
function ProductCard({ product: p }) {
  const status = STATUS_META[p.status] || STATUS_META.live;
  const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand-orange)]/40 hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[var(--color-brand-cream)] to-white">
        <span className="text-5xl transition-transform group-hover:scale-110">
          {p.emoji}
        </span>

        {/* Status badge */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        {/* Margin badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            margin >= 30
              ? "bg-emerald-500 text-white"
              : margin >= 15
              ? "bg-amber-500 text-white"
              : "bg-rose-500 text-white"
          }`}
        >
          {margin}% margin
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
          {p.sub}
        </p>
        <p className="mt-1 truncate text-sm font-bold text-[var(--color-ink)]">
          {p.name}
        </p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-[var(--color-ink)]/40">
          {p.sku}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-[var(--color-line)] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink)]/40">
              Selling
            </p>
            <p className="text-lg font-bold tabular-nums text-[var(--color-ink)]">
              {fmt(p.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink)]/40">
              Cost
            </p>
            <p className="text-xs tabular-nums text-[var(--color-ink)]/45 line-through">
              {fmt(p.cost)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span
            className={`inline-flex items-center gap-1 font-medium ${
              p.stock === 0
                ? "text-rose-600"
                : p.stock < 20
                ? "text-amber-600"
                : "text-[var(--color-ink)]/60"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${p.stock === 0 ? "bg-rose-500" : p.stock < 20 ? "bg-amber-500" : "bg-emerald-500"}`} />
            {p.stock} in stock
          </span>
          <span className="text-[var(--color-ink)]/50">
            {p.sold} sold
          </span>
        </div>

        {/* Seller */}
        <div className="mt-2 flex items-center gap-2 border-t border-[var(--color-line)] pt-2 text-[11px]">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[9px] font-bold text-white">
            {p.seller[0]}
          </span>
          <span className="truncate text-[var(--color-ink)]/60">
            {p.seller}
          </span>
          <span className="ml-auto shrink-0 text-amber-500">★</span>
          <span className="shrink-0 font-medium text-[var(--color-ink)]/60">
            {p.rating}
          </span>
        </div>
      </div>
    </div>
  );
}