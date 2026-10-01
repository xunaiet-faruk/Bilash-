"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Check,
  Share2,
  Trash2,
  Pencil,
  SlidersHorizontal,
  MessageCircle,
  Facebook,
  Send,
  Twitter,
  Linkedin,
  Mail,
  TrendingUp,
  AlertTriangle,
  PackageX,
  LayoutGrid,
  List,
  Sparkles,
  Wallet,
  Eye,
  ShoppingBag,
} from "lucide-react";

/* ====================================================================
   MOCK DATA WITH REAL UNSPLASH IMAGES
==================================================================== */
const initialMyProducts = [
  {
    id: "m1",
    productId: "p101",
    name: "Wireless ANC Headphones X1",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    basePrice: 1200,
    sellingPrice: 1650,
    stock: 45,
    status: "active",
    clicks: 340,
    sold: 28,
  },
  {
    id: "m2",
    productId: "p102",
    name: "Smart Watch Ultra Series 8",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    basePrice: 1800,
    sellingPrice: 2399,
    stock: 0,
    status: "active",
    clicks: 512,
    sold: 42,
  },
  {
    id: "m3",
    productId: "p103",
    name: "Minimalist Leather Sneaker",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    basePrice: 950,
    sellingPrice: 1350,
    stock: 18,
    status: "inactive",
    clicks: 89,
    sold: 6,
  },
  {
    id: "m4",
    productId: "p104",
    name: "Stainless Steel Vacuum Flask 1L",
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    basePrice: 420,
    sellingPrice: 650,
    stock: 80,
    status: "active",
    clicks: 145,
    sold: 19,
  },
];

const catalogProducts = [
  {
    id: "p201",
    name: "Ergonomic Gaming Mouse",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
    basePrice: 750,
    suggested: 1150,
    stock: 120,
  },
  {
    id: "p202",
    name: "Vintage Sunglasses Classic",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    basePrice: 310,
    suggested: 490,
    stock: 200,
  },
];

const categories = ["All", "Electronics", "Home & Kitchen", "Fashion", "Beauty & Health"];

const money = (n) => `৳${Number(n).toLocaleString()}`;
const marginOf = (sell, base) => (base > 0 ? Math.round(((sell - base) / base) * 100) : 0);

const shareChannels = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "hover:bg-emerald-500" },
  { key: "facebook", label: "Facebook", icon: Facebook, color: "hover:bg-blue-600" },
  { key: "telegram", label: "Telegram", icon: Send, color: "hover:bg-sky-500" },
  { key: "twitter", label: "Twitter", icon: Twitter, color: "hover:bg-cyan-500" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "hover:bg-blue-700" },
  { key: "email", label: "Email", icon: Mail, color: "hover:bg-slate-700" },
];

const tabs = [
  { key: "all", label: "All Products" },
  { key: "active", label: "Live Store" },
  { key: "inactive", label: "Hidden" },
  { key: "outOfStock", label: "Out of Stock" },
];

/* ====================================================================
   SHARE MODAL (SHARE BUTTON ACTUALLY WORKS HERE)
==================================================================== */
function ShareModal({ product, onClose }) {
  const url = `https://bilash.app/p/${product.productId}?ref=store`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">Share Product</h3>
              <p className="text-xs text-slate-500">
                Earn up to <span className="font-bold text-emerald-600">{money(product.sellingPrice - product.basePrice)}</span> per sale
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2">
            <span className="text-xs font-mono truncate text-slate-600">{url}</span>
            <button
              onClick={copy}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 transition-all cursor-pointer ${
                copied ? "bg-emerald-500" : "bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20"
              }`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2.5">Instant Social Share</p>
            <div className="grid grid-cols-3 gap-2.5">
              {shareChannels.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={copy}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-600 transition-all cursor-pointer ${color} hover:text-white hover:border-transparent hover:shadow-lg`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   ADD FROM CATALOG DRAWER
==================================================================== */
function AddDrawer({ open, onClose, onAdd, already }) {
  const [query, setQuery] = useState("");
  const list = catalogProducts.filter((p) => !already.includes(p.id) && p.name.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:w-[450px] border-l border-slate-100 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Catalog Products</h2>
            <p className="text-xs text-slate-500">Select trending items to add to your shop</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search catalog products..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto p-2">
          {list.map((p) => (
            <li key={p.id} className="flex items-center gap-3.5 p-3.5 hover:bg-slate-50 rounded-2xl transition">
              <img src={p.image} alt={p.name} className="h-14 w-14 rounded-2xl object-cover shrink-0 border border-slate-100" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span>{p.category}</span>
                  <span>•</span>
                  <span>Base: {money(p.basePrice)}</span>
                </div>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  Suggested: {money(p.suggested)} (+{marginOf(p.suggested, p.basePrice)}%)
                </p>
              </div>
              <button
                onClick={() => onAdd(p)}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

/* ====================================================================
   MAIN PAGE COMPONENT
   - Pass `onEditProduct` prop from parent to handle external edit modal
==================================================================== */
export default function Page({ onEditProduct }) {
  const [products, setProducts] = useState(initialMyProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState([]);
  const [shareProduct, setShareProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [toast, setToast] = useState(null);

  const flash = (m) => setToast(m);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const totalEarnings = products.reduce((acc, p) => acc + (p.sellingPrice - p.basePrice) * p.sold, 0);
    const totalSales = products.reduce((acc, p) => acc + p.sold, 0);
    const totalClicks = products.reduce((acc, p) => acc + p.clicks, 0);
    return { totalEarnings, totalSales, totalClicks };
  }, [products]);

  const matchesTab = (p) => (tab === "all" ? true : tab === "outOfStock" ? p.stock === 0 : p.status === tab);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(
      (p) => matchesTab(p) && (category === "All" || p.category === category) && (!q || p.name.toLowerCase().includes(q))
    );
    const sorters = {
      recent: () => 0,
      marginHigh: (a, b) => marginOf(b.sellingPrice, b.basePrice) - marginOf(a.sellingPrice, a.basePrice),
      soldHigh: (a, b) => b.sold - a.sold,
      stockLow: (a, b) => a.stock - b.stock,
    };
    return [...list].sort(sorters[sort]);
  }, [products, query, category, tab, sort]);

  const counts = {
    all: products.length,
    active: products.filter((p) => p.status === "active").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  const toggleSelect = (id) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const selectAll = () => setSelected(filtered.length === selected.length ? [] : filtered.map((p) => p.id));

  const toggleStatus = (p) => {
    setProducts((cur) =>
      cur.map((x) => (x.id === p.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x))
    );
    flash(`${p.name} is now ${p.status === "active" ? "Hidden" : "Live"}`);
  };

  const removeProduct = (p) => {
    setProducts((cur) => cur.filter((x) => x.id !== p.id));
    setConfirmRemove(null);
    flash(`${p.name} removed from your store`);
  };

  const bulkSetStatus = (status) => {
    setProducts((cur) => cur.map((x) => (selected.includes(x.id) ? { ...x, status } : x)));
    flash(`${selected.length} products updated`);
    setSelected([]);
  };

  const addFromCatalog = (p) => {
    const item = {
      id: `m${Date.now()}`,
      productId: p.id,
      name: p.name,
      category: p.category,
      image: p.image,
      basePrice: p.basePrice,
      sellingPrice: p.suggested,
      stock: p.stock,
      status: "active",
      clicks: 0,
      sold: 0,
    };
    setProducts((cur) => [item, ...cur]);
    flash(`${p.name} added to your storefront`);
  };

  // External Edit Modal Handler Function
  const handleEdit = (product) => {
    if (onEditProduct) {
      onEditProduct(product);
    } else {
      flash(`Editing product: ${product.name}`);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-slate-800 p-3 sm:p-6 font-sans">
      
      {/* 1. TOP ANALYTICS STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Estimated Net Profit</span>
            <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-400">{money(stats.totalEarnings)}</div>
            <div className="mt-2 text-xs text-slate-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Based on completed orders
            </div>
          </div>
          <Wallet className="absolute right-4 bottom-4 w-20 h-20 text-white/5 -rotate-12 pointer-events-none" />
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Items Sold</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{stats.totalSales} Units</div>
          <p className="mt-2 text-xs text-orange-500 font-medium">Active storefront items</p>
          <ShoppingBag className="absolute right-4 bottom-4 w-16 h-16 text-slate-100 -rotate-12 pointer-events-none" />
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Link Clicks</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{stats.totalClicks}</div>
          <p className="mt-2 text-xs text-slate-400">Shared product page views</p>
          <Eye className="absolute right-4 bottom-4 w-16 h-16 text-slate-100 -rotate-12 pointer-events-none" />
        </div>
      </div>

      {/* 2. HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-slate-900">My Products</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Set custom prices, manage live visibility, and share links to maximize profit.
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Product from Catalog
        </button>
      </div>

      {/* 3. CONTROLS TOOLBAR */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 overflow-x-auto gap-2">
          <div className="flex gap-1.5 min-w-max">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  tab === t.key
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {t.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "grid" ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "table" ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-orange-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                <option value="recent">Recently Added</option>
                <option value="marginHigh">Highest Margin %</option>
                <option value="soldHigh">Most Sold</option>
                <option value="stockLow">Low Stock First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS DISPLAY GRID */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
          <PackageX className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">No products found</h3>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => {
            const netProfit = p.sellingPrice - p.basePrice;
            const outOfStock = p.stock === 0;
            const isSel = selected.includes(p.id);

            return (
              <div
                key={p.id}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isSel ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-200/80"
                }`}
              >
                {/* Image Section */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />

                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => toggleSelect(p.id)}
                    className="absolute left-3.5 top-3.5 h-4 w-4 cursor-pointer accent-orange-500 rounded"
                  />

                  {/* SOFT ORANGE LIVE BADGE */}
                  <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 shadow-sm">
                    {p.status === "active" ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-orange-500/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-md">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full bg-slate-700/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-slate-200">
                        Hidden
                      </span>
                    )}
                  </div>

                  {outOfStock && (
                    <span className="absolute bottom-3 left-3.5 rounded-full bg-rose-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    <span>{p.category}</span>
                    <span>{p.stock} In Stock</span>
                  </div>

                  <h3 className="mt-1 font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-orange-500 transition-colors">
                    {p.name}
                  </h3>

                  {/* Pricing Display */}
                  <div className="mt-3 border border-slate-100 rounded-2xl p-3 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Selling Price</span>
                      <span className="text-lg font-extrabold text-slate-900">{money(p.sellingPrice)}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        +{money(netProfit)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Base: {money(p.basePrice)}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      onClick={() => toggleStatus(p)}
                      className="flex items-center gap-2 text-xs font-bold cursor-pointer transition text-slate-600 hover:text-slate-900"
                    >
                      <div className={`relative h-5 w-9 rounded-full transition-colors ${p.status === "active" ? "bg-orange-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all shadow ${p.status === "active" ? "left-[18px]" : "left-0.5"}`} />
                      </div>
                      <span className="text-xs">{p.status === "active" ? "Live" : "Hidden"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* EDIT BUTTON (TRIGGER EXTERNAL MODAL) */}
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* SHARE BUTTON (OPENS SHARE MODAL) */}
                      <button
                        onClick={() => setShareProduct(p)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition cursor-pointer"
                        title="Share Product Link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => setConfirmRemove(p)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition cursor-pointer"
                        title="Remove Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW MODE */
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10">
                    <input type="checkbox" onChange={selectAll} checked={selected.length === filtered.length} className="rounded accent-orange-500 cursor-pointer" />
                  </th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Selling Price</th>
                  <th className="p-4">Profit Margin</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((p) => {
                  const margin = marginOf(p.sellingPrice, p.basePrice);
                  const isSel = selected.includes(p.id);
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50 transition ${isSel ? "bg-orange-50/30" : ""}`}>
                      <td className="p-4">
                        <input type="checkbox" checked={isSel} onChange={() => toggleSelect(p.id)} className="rounded accent-orange-500 cursor-pointer" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="h-10 w-10 shrink-0 rounded-xl object-cover border border-slate-100" />
                          <div>
                            <div className="font-bold text-slate-800">{p.name}</div>
                            <div className="text-xs text-slate-400">{p.sold} sold • {p.clicks} clicks</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-slate-500">{p.category}</td>
                      <td className="p-4 font-semibold text-slate-500">{money(p.basePrice)}</td>
                      <td className="p-4 font-bold text-slate-800">{money(p.sellingPrice)}</td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          +{money(p.sellingPrice - p.basePrice)} ({margin}%)
                        </span>
                      </td>
                      <td className="p-4">
                        {p.status === "active" ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600">
                            Live
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-orange-50 text-orange-500 cursor-pointer" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setShareProduct(p)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer" title="Share">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmRemove(p)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4" />
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

      {/* MODALS */}
      {shareProduct && <ShareModal product={shareProduct} onClose={() => setShareProduct(null)} />}
      <AddDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={addFromCatalog} already={products.map((p) => p.productId)} />

      {/* CONFIRM DELETE MODAL */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setConfirmRemove(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl grid place-items-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Remove from Shop?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Removing <b>{confirmRemove.name}</b> will deactivate all shared links for this item.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(confirmRemove)}
                className="flex-1 rounded-2xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}