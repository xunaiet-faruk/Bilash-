"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import EditProductModal from "./EditProductModal";
import { useSearchParams } from "next/navigation";

const INITIAL_PRODUCTS = [
  { id: "PRD-8841", name: "Wireless Earbuds Pro Max", sku: "WEP-MAX-BLK", emoji: "🎧", category: "Electronics", subcategory: "Audio", brand: "SoundCore", seller: "TechBazar BD", price: 2450, cost: 1650, stock: 120, sold: 340, status: "live", rating: 4.7, createdAt: "2d ago" },
  { id: "PRD-8840", name: "Smart Watch S9 Ultra", sku: "SWS9U-SLV", emoji: "⌚", category: "Electronics", subcategory: "Wearables", brand: "TechFit", seller: "GadgetHub", price: 5890, cost: 4200, stock: 45, sold: 180, status: "live", rating: 4.9, createdAt: "4d ago" },
  { id: "PRD-8839", name: "4K Webcam HD Pro", sku: "4KW-HDP", emoji: "📷", category: "Electronics", subcategory: "Computing", brand: "Generic", seller: "NewSeller99", price: 3200, cost: 800, stock: 8, sold: 12, status: "pending", rating: 3.2, createdAt: "6h ago" },
  { id: "PRD-8838", name: "USB-C Hub 12-in-1", sku: "UCH-12N1", emoji: "🔌", category: "Electronics", subcategory: "Computing", brand: "Ugreen", seller: "TechBazar BD", price: 1850, cost: 1100, stock: 200, sold: 450, status: "live", rating: 4.8, createdAt: "8d ago" },
  { id: "PRD-8837", name: "Mechanical Keyboard RGB", sku: "MKB-RGB-BLK", emoji: "⌨️", category: "Electronics", subcategory: "Computing", brand: "KeyPro", seller: "KeyboardKing", price: 4200, cost: 2900, stock: 32, sold: 89, status: "live", rating: 4.5, createdAt: "12d ago" },
  { id: "PRD-8836", name: "Gaming Mouse Pro 8K", sku: "GMP-8K", emoji: "🖱️", category: "Electronics", subcategory: "Computing", brand: "Generic", seller: "NewSeller99", price: 1650, cost: 450, stock: 15, sold: 22, status: "pending", rating: 3.5, createdAt: "1d ago" },
  { id: "PRD-8835", name: "Yoga Mat Anti-Slip", sku: "YMA-PRO", emoji: "🧘", category: "Sports & Outdoor", subcategory: "Fitness", brand: "FitLife", seller: "SportsStore", price: 780, cost: 450, stock: 60, sold: 120, status: "live", rating: 4.6, createdAt: "3d ago" },
  { id: "PRD-8834", name: "Trail Running Socks", sku: "TRS-3PK", emoji: "🧦", category: "Sports & Outdoor", subcategory: "Fitness", brand: "RunPro", seller: "SportsStore", price: 320, cost: 180, stock: 200, sold: 340, status: "live", rating: 4.4, createdAt: "5d ago" },
  { id: "PRD-8833", name: "Cotton Crew Tee", sku: "CCT-BLK-M", emoji: "👕", category: "Fashion", subcategory: "Men", brand: "BasicWear", seller: "Green Valley Shop", price: 450, cost: 220, stock: 500, sold: 1200, status: "live", rating: 4.7, createdAt: "10d ago" },
  { id: "PRD-8832", name: "Matte Lipstick Trio", sku: "MLT-SET", emoji: "💄", category: "Beauty & Health", subcategory: "Makeup", brand: "GlowUp", seller: "Al-Amin Store", price: 590, cost: 280, stock: 80, sold: 156, status: "live", rating: 4.5, createdAt: "7d ago" },
  { id: "PRD-8831", name: "Kids Puzzle 100pc", sku: "KP-100", emoji: "🧩", category: "Toys & Baby", subcategory: "Toys", brand: "PlayTime", seller: "Al-Amin Store", price: 290, cost: 150, stock: 150, sold: 340, status: "live", rating: 4.8, createdAt: "15d ago" },
  { id: "PRD-8830", name: "Ceramic Coffee Mug Set", sku: "CCMS-4PK", emoji: "☕", category: "Home & Kitchen", subcategory: "Kitchen Tools", brand: "HomeCraft", seller: "Zaman Retail", price: 520, cost: 280, stock: 45, sold: 89, status: "live", rating: 4.6, createdAt: "20d ago" },
  { id: "PRD-8829", name: "Smart LED Strip 5m", sku: "SLS-5M", emoji: "💡", category: "Home & Kitchen", subcategory: "Lighting", brand: "BrightHome", seller: "Nur Enterprise", price: 620, cost: 340, stock: 100, sold: 210, status: "live", rating: 4.3, createdAt: "25d ago" },
  { id: "PRD-8828", name: "Laptop Backpack 15\"", sku: "LB-15", emoji: "🎒", category: "Fashion", subcategory: "Accessories", brand: "TravelMate", seller: "Green Valley Shop", price: 1450, cost: 780, stock: 35, sold: 78, status: "live", rating: 4.7, createdAt: "30d ago" },
  { id: "PRD-8827", name: "Bluetooth Speaker Mini", sku: "BSM-BLK", emoji: "🔊", category: "Electronics", subcategory: "Audio", brand: "SoundCore", seller: "Audio Zone", price: 1890, cost: 1200, stock: 22, sold: 95, status: "live", rating: 4.5, createdAt: "12d ago" },
  { id: "PRD-8826", name: "Desk Lamp LED", sku: "DLL-ADJ", emoji: "🔆", category: "Home & Kitchen", subcategory: "Lighting", brand: "HomeCraft", seller: "Home Decor BD", price: 890, cost: 480, stock: 18, sold: 45, status: "out-of-stock", rating: 4.4, createdAt: "40d ago" },
];

const STATUS_META = {
  live:         { label: "Live",         bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:      { label: "Pending",      bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  rejected:     { label: "Rejected",     bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500" },
  "out-of-stock": { label: "Out of stock", bg: "bg-slate-100", text: "text-slate-600",   dot: "bg-slate-400" },
};

const fmt = (n) => `৳${n.toLocaleString("en-IN")}`;

/* ============================================================
   ICONS
   ============================================================ */
const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  check: "M5 13l4 4L19 7",
  x: "M6 18L18 6M6 6l12 12",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  chevron: "M6 9l6 6 6-6",
  package: "M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
};

/* ============================================================
   MAIN
   ============================================================ */
export default function AllProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [expandedId, setExpandedId] = useState(null);
  const [editing, setEditing] = useState(null); 
  const [toast, setToast] = useState(null);

  const flash = (m) => setToast(m);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return `${p.name} ${p.sku} ${p.seller} ${p.category} ${p.brand}`.toLowerCase().includes(q);
    });

    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "stock-low") list = [...list].sort((a, b) => a.stock - b.stock);
    else if (sortBy === "sold") list = [...list].sort((a, b) => b.sold - a.sold);

    return list;
  }, [products, query, statusFilter, sortBy]);

  const counts = useMemo(() => {
    const c = { all: products.length };
    Object.keys(STATUS_META).forEach((k) => {
      c[k] = products.filter((p) => p.status === k).length;
    });
    return c;
  }, [products]);

  /* ---------- actions ---------- */
  const handleDelete = (id) => {
    if (!confirm("এই product টা delete করতে চাও?")) return;
    // TODO: API call
    // await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((cur) => cur.filter((p) => p.id !== id));
    flash("Product deleted");
  };

  const handleSave = (updated) => {
    // TODO: API call
    // await fetch(`/api/products/${updated.id}`, { method: "PATCH", body: JSON.stringify(updated) });
    setProducts((cur) => cur.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
    flash("Product updated");
  };

  const handleApprove = (id) => {
    // TODO: API call
    setProducts((cur) => cur.map((p) => (p.id === id ? { ...p, status: "live" } : p)));
    flash("Product approved");
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
      {/* ============ HEADER ============ */}
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-brand-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]/45">
              Product Catalog
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Every product across the marketplace. Click a row to see more.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/dashboard/products/add"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
          >
            <Ico d={I.package} className="h-3.5 w-3.5" />
            Add Product
          </Link>
        </div>
      </header>

      {/* ============ STATUS TABS ============ */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All Products", count: counts.all },
          { id: "live", label: "Live", count: counts.live },
          { id: "pending", label: "Pending", count: counts.pending },
          { id: "out-of-stock", label: "Out of stock", count: counts["out-of-stock"] },
          { id: "rejected", label: "Rejected", count: counts.rejected },
        ].map((t) => {
          const on = statusFilter === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                on
                  ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)] text-white shadow-md"
                  : "border-[var(--color-line)] bg-white text-[var(--color-ink)]/65 hover:border-[var(--color-ink)]/20 hover:bg-[var(--color-brand-cream)]"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                  on ? "bg-white/20 text-white" : "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/60"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-3">
        <div className="relative min-w-[200px] flex-1">
          <Ico
            d={I.search}
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/40"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU, seller, brand..."
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)] focus:bg-white focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-medium outline-none transition-colors focus:border-[var(--color-brand-orange)]"
        >
          <option value="recent">Recently added</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="stock-low">Stock: Low first</option>
          <option value="sold">Best selling</option>
        </select>

        <span className="ml-auto text-xs font-medium tabular-nums text-[var(--color-ink)]/50">
          {filtered.length} of {products.length}
        </span>
      </div>

      {/* ============ PRODUCT LIST ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white py-20 text-center">
          <p className="text-4xl">📦</p>
          <p className="mt-3 text-sm font-bold text-[var(--color-ink)]">
            No products found
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink)]/50">
            Try a different search or filter
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              expanded={expandedId === p.id}
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
              onEdit={() => setEditing(p)}
              onDelete={() => handleDelete(p.id)}
              onApprove={() => handleApprove(p.id)}
            />
          ))}
        </div>
      )}

      {/* ============ EDIT MODAL ============ */}
      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[var(--color-brand-navy)] px-5 py-2.5 text-sm text-white shadow-2xl">
          <Ico d={I.check} className="h-4 w-4 text-[var(--color-brand-teal)]" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PRODUCT ROW
   ============================================================ */
function ProductRow({ product: p, expanded, onToggle, onEdit, onDelete, onApprove }) {
  const status = STATUS_META[p.status] || STATUS_META.live;
  const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-all ${
        expanded
          ? "border-[var(--color-brand-orange)] shadow-lg"
          : "border-[var(--color-line)] hover:border-[var(--color-ink)]/20 hover:shadow-sm"
      }`}
    >
      {/* ============ MAIN ROW ============ */}
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-4 p-4 text-left"
      >
        <div className="relative shrink-0">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand-cream)] to-white text-3xl ring-1 ring-[var(--color-line)]">
            {p.emoji}
          </div>
       
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-bold text-[var(--color-ink)]">
              {p.name}
            </p>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--color-ink)]/55">
            <span className="font-mono text-[var(--color-ink)]/40">{p.sku}</span>
            <span className="text-[var(--color-ink)]/20">•</span>
            <span>{p.category} › {p.subcategory}</span>
            <span className="text-[var(--color-ink)]/20">•</span>
            <span>{p.seller}</span>
            <span className="text-[var(--color-ink)]/20">•</span>
            <span className="inline-flex items-center gap-0.5">
              <span className="text-amber-500">★</span>
              <span className="font-medium">{p.rating}</span>
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-6 md:flex">
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
              Price
            </p>
            <p className="text-sm font-bold tabular-nums text-[var(--color-ink)]">
              {fmt(p.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
              Stock
            </p>
            <p
              className={`text-sm font-bold tabular-nums ${
                p.stock === 0 ? "text-rose-600" : p.stock < 20 ? "text-amber-600" : "text-[var(--color-ink)]"
              }`}
            >
              {p.stock}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
              Sold
            </p>
            <p className="text-sm font-bold tabular-nums text-[var(--color-ink)]">
              {p.sold}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 text-[var(--color-ink)]/30 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <Ico d={I.chevron} className="h-5 w-5" />
        </span>
      </button>

      {/* ============ EXPANDED DETAILS ============ */}
      {expanded && (
        <div className="border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/30 p-5">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            {/* LEFT: details */}
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Pricing Breakdown
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white p-3 ring-1 ring-[var(--color-line)]">
                    <p className="text-[10px] text-[var(--color-ink)]/50">Cost</p>
                    <p className="mt-0.5 text-base font-bold tabular-nums">{fmt(p.cost)}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-[var(--color-line)]">
                    <p className="text-[10px] text-[var(--color-ink)]/50">Price</p>
                    <p className="mt-0.5 text-base font-bold tabular-nums">{fmt(p.price)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
                    <p className="text-[10px] text-emerald-700">Margin</p>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-emerald-700">
                      {margin}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Product Info
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <DetailRow label="Brand" value={p.brand} />
                  <DetailRow label="Category" value={p.category} />
                  <DetailRow label="Subcategory" value={p.subcategory} />
                  <DetailRow label="Seller" value={p.seller} />
                  <DetailRow label="Created" value={p.createdAt} />
                  <DetailRow label="Product ID" value={p.id} mono />
                </div>
              </div>
            </div>

            {/* RIGHT: actions */}
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Quick Actions
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {/* Pending হলে — একটা বাটন: Catalog & Approvals এ যাবে */}
              {p.status === "pending" && (
                    <Link
                        href={`/admin/dashboard/catalog?product=${p.id}`}
                        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-xs font-bold text-white transition-colors hover:bg-amber-600"
                    >
                        <Ico d={I.package} className="h-3.5 w-3.5" />
                        Review in Catalog &amp; Approvals
                    </Link>
                    )}

                  {/* Non-pending — View / Edit / Delete */}
                  {p.status !== "pending" && (
                    <>
                      <Link
                        href={`/admin/dashboard/products/${p.id}`}
                        className="w-full cursor-pointer rounded-lg bg-[var(--color-brand-navy)] py-2.5 text-center text-xs font-bold text-white transition-colors hover:bg-[var(--color-brand-navy-light,#1e293b)]"
                      >
                        View Full Details
                      </Link>
                      <button
                        onClick={onEdit}
                        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[var(--color-line)] py-2.5 text-xs font-bold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
                      >
                        <Ico d={I.edit} className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </>
                  )}

                  <button
                    onClick={onDelete}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rose-200 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <Ico d={I.trash} className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-[var(--color-brand-navy)] to-[#1e293b] p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Performance
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Units sold</span>
                    <span className="font-bold tabular-nums">{p.sold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Revenue</span>
                    <span className="font-bold tabular-nums text-[var(--color-brand-orange)]">
                      {fmt(p.sold * p.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Stock left</span>
                    <span className="font-bold tabular-nums">{p.stock}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-[var(--color-line)]">
      <p className="text-[10px] text-[var(--color-ink)]/45">{label}</p>
      <p className={`mt-0.5 truncate text-xs font-semibold text-[var(--color-ink)] ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}