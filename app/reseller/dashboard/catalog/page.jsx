"use client";

import { useState, useMemo } from "react";
import AddProductModal from "./AddProductModal";

// ==================== FAKE DATA (with images) ====================
const initialProducts = [
  { id: "p-001", name: "Wireless Mouse", category: "Electronics", supplier: "Tech Hub BD", costPrice: 450, sellingPrice: 850, stock: 42, sold: 128, status: "active", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop" },
  { id: "p-002", name: "USB-C Hub", category: "Accessories", supplier: "Gadget Store", costPrice: 950, sellingPrice: 1200, stock: 15, sold: 87, status: "active", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&h=200&fit=crop" },
  { id: "p-003", name: "Mechanical Keyboard", category: "Electronics", supplier: "Tech Hub BD", costPrice: 2200, sellingPrice: 2450, stock: 8, sold: 45, status: "active", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop" },
  { id: "p-004", name: "Laptop Stand", category: "Accessories", supplier: "Gadget Store", costPrice: 550, sellingPrice: 700, stock: 30, sold: 62, status: "active", image: "https://images.unsplash.com/photo-1616353071855-2c045c4458ae?w=200&h=200&fit=crop" },
  { id: "p-005", name: "Webcam HD", category: "Electronics", supplier: "Camera World", costPrice: 1400, sellingPrice: 1600, stock: 0, sold: 34, status: "out-of-stock", image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200&h=200&fit=crop" },
  { id: "p-006", name: "Desk Lamp LED", category: "Home", supplier: "Home Decor BD", costPrice: 800, sellingPrice: 1150, stock: 22, sold: 19, status: "active", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop" },
  { id: "p-007", name: "Bluetooth Speaker", category: "Electronics", supplier: "Audio Zone", costPrice: 1500, sellingPrice: 1800, stock: 5, sold: 8, status: "inactive", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop" },
];

const calcMargin = (cost, sell) => {
  if (!cost || !sell || sell <= cost) return 0;
  return Math.round(((sell - cost) / sell) * 100);
};

const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function CatalogPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categoriesInUse = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const m1 = p.name.toLowerCase().includes(search.toLowerCase());
    const m2 = activeCategory === "All" || p.category === activeCategory;
    const m3 = statusFilter === "all" || p.status === statusFilter;
    return m1 && m2 && m3;
  });

  const handleAdd = (np) => {
    setProducts((prev) => [np, ...prev]);
    setShowModal(false);
  };

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-2">
      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md text-orange-400 ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              Live Store Inventory
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              My Catalog
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Manage, monitor, and optimize your storefront inventory seamlessly.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20 transition-transform group-hover:rotate-90">
              +
            </span>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative min-w-[240px] flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search products by title or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100/80 p-1.5">
          {categoriesInUse.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg cursor-pointer px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="min-w-[140px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* ===== PRODUCT TABLE ===== */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-md text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
              <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" strokeLinejoin="round" />
              <path d="M3 7.5 12 12l9-4.5M12 12v9" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">No products found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            We couldn't find anything matching your search filters. Try resetting search criteria or add a new item.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Product Info</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Cost Price</th>
                  <th className="py-4 px-4">Selling Price</th>
                  <th className="py-4 px-4">Margin & Sales</th>
                  <th className="py-4 px-4">Stock Level</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const margin = calcMargin(p.costPrice, p.sellingPrice);
                  const status =
                    p.status === "active"
                      ? { dot: "bg-emerald-500", label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" }
                      : p.status === "inactive"
                      ? { dot: "bg-slate-400", label: "Inactive", cls: "bg-slate-100 text-slate-600 ring-slate-500/20" }
                      : { dot: "bg-rose-500", label: "Out of Stock", cls: "bg-rose-50 text-rose-700 ring-rose-600/20" };

                  const stockPct = Math.min((p.stock / 100) * 100, 100);

                  return (
                    <tr
                      key={p.id}
                      className="group transition-all duration-150 hover:bg-slate-50/80"
                    >
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-transform group-hover:scale-105">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-bold text-white">
                                {getInitials(p.name)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {p.name}
                            </p>
                            <p className="truncate text-xs text-slate-400 font-medium">
                              Supplier: {p.supplier}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {p.category}
                        </span>
                      </td>

                      {/* Cost Price */}
                      <td className="py-3.5 px-4 text-sm font-medium tabular-nums text-slate-500">
                        ৳{p.costPrice.toLocaleString()}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 text-sm font-bold tabular-nums text-slate-900">
                        ৳{p.sellingPrice.toLocaleString()}
                      </td>

                      {/* Margin & Sales */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-xs font-bold tabular-nums ${
                              margin >= 30
                                ? "text-emerald-600"
                                : margin >= 15
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`}
                          >
                            {margin}% Profit
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {p.sold} units sold
                          </span>
                        </div>
                      </td>

                      {/* Stock Progress */}
                      <td className="py-3.5 px-4">
                        <div className="flex w-24 flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`font-bold tabular-nums ${
                                p.stock === 0
                                  ? "text-rose-600"
                                  : p.stock < 10
                                  ? "text-amber-600"
                                  : "text-slate-800"
                              }`}
                            >
                              {p.stock}
                            </span>
                            <span className="text-[10px] text-slate-400">In Stock</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                p.stock === 0
                                  ? "bg-rose-500"
                                  : p.stock < 10
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${stockPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${status.cls}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            className="cursor-pointer grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                              <path d="M12 20h9" strokeLinecap="round" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="cursor-pointer grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Remove"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                              <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== ADD MODAL (EXACTLY UNCHANGED) ===== */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* ===== DELETE MODAL (EXACTLY UNCHANGED) ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start gap-3 border-b border-[var(--color-line)] p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  Remove product?
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/60">
                  <span className="font-medium">{deleteTarget.name}</span> will be
                  removed from your catalog.
                </p>
              </div>
            </div>
            <div className="flex gap-2 bg-[var(--color-brand-cream)]/40 p-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="cursor-pointer flex-1 rounded-lg border border-[var(--color-line)] bg-white py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}