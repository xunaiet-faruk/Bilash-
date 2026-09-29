"use client";

import { useState } from "react";

const STATS = [
  { label: "Pending", value: 24, tone: "amber", trend: "+5 today" },
  { label: "Approved", value: 18, tone: "emerald", trend: "+12%" },
  { label: "Rejected", value: 7, tone: "rose", trend: "-3%" },
  { label: "Live", value: 1284, tone: "cyan", trend: "+24" },
];

const TABS = [
  { key: "pending", label: "Pending", count: 24 },
  { key: "approved", label: "Approved", count: 1284 },
  { key: "rejected", label: "Rejected", count: 47 },
  { key: "flagged", label: "Flagged", count: 5 },
];

const PRODUCTS = [
  {
    id: "PRD-8841",
    name: "Wireless Earbuds Pro Max",
    sku: "WEP-MAX-BLK",
    category: "Electronics > Audio",
    brand: "SoundCore",
    price: 2450,
    comparePrice: 3200,
    costPrice: 1650,
    stock: 120,
    moq: 10,
    status: "pending",
    origin: "China",
    risk: "low",
    submitted: "2h ago",
    images: ["🎧", "🎵", "🔊", "📦"],
    completion: 95,
    description:
      "Premium wireless earbuds with active noise cancellation, 40-hour battery life, Bluetooth 5.3, IPX5 water resistance, and premium charging case with LED indicator.",
    variants: [
      { name: "Black", stock: 60, price: 2450 },
      { name: "White", stock: 40, price: 2450 },
      { name: "Blue", stock: 20, price: 2550 },
    ],
    specs: {
      battery: "40 hours",
      bluetooth: "5.3",
      waterproof: "IPX5",
      weight: "52g",
    },
    seller: {
      name: "TechBazar BD",
      avatar: "TB",
      rating: 4.7,
      orders: 1240,
      joined: "Jan 2023",
      email: "contact@techbazar.bd",
      phone: "+880 1711-XXXXXX",
      location: "Dhaka, Bangladesh",
      verified: true,
      badges: ["Top Seller", "Fast Shipping", "Verified NID"],
      avgResponse: "2h",
      returnRate: "1.2%",
      disputes: 3,
      totalProducts: 245,
      totalRevenue: "৳18,42,000",
      responseTime: "98%",
      onTimeDelivery: "96%",
      cancellationRate: "0.8%",
      courierPartner: "Steadfast",
      payoutMethod: "bKash Business",
      lastPayout: "৳42,500 · 2 days ago",
    },
  },
  {
    id: "PRD-8840",
    name: "Smart Watch S9 Ultra",
    sku: "SWS9U-SLV",
    category: "Electronics > Wearables",
    brand: "TechFit",
    price: 5890,
    comparePrice: 7200,
    costPrice: 4200,
    stock: 45,
    moq: 5,
    status: "pending",
    origin: "Local BD",
    risk: "low",
    submitted: "4h ago",
    images: ["⌚", "📱", "💫", "🔋"],
    completion: 100,
    description:
      "Advanced smartwatch with AMOLED display, ECG monitoring, GPS, 7-day battery, 100+ sports modes, and Bluetooth calling with built-in speaker.",
    variants: [
      { name: "Silver", stock: 25, price: 5890 },
      { name: "Black", stock: 15, price: 5890 },
      { name: "Rose Gold", stock: 5, price: 6290 },
    ],
    specs: {
      display: "1.9\" AMOLED",
      battery: "7 days",
      sensor: "ECG, GPS, HR",
      waterproof: "IP68",
    },
    seller: {
      name: "GadgetHub",
      avatar: "GH",
      rating: 4.9,
      orders: 3820,
      joined: "Mar 2022",
      email: "hello@gadgethub.bd",
      phone: "+880 1811-XXXXXX",
      location: "Chattogram, Bangladesh",
      verified: true,
      badges: ["Top Seller", "Premium", "Verified NID", "5 Star Rating"],
      avgResponse: "45m",
      returnRate: "0.8%",
      disputes: 1,
      totalProducts: 512,
      totalRevenue: "৳52,18,000",
      responseTime: "99%",
      onTimeDelivery: "98%",
      cancellationRate: "0.4%",
      courierPartner: "Pathao",
      payoutMethod: "Bank Transfer",
      lastPayout: "৳1,24,000 · 1 day ago",
    },
  },
  {
    id: "PRD-8839",
    name: "4K Webcam HD Pro",
    sku: "4KW-HDP",
    category: "Electronics > Video",
    brand: "Generic",
    price: 3200,
    comparePrice: 6500,
    costPrice: 800,
    stock: 8,
    moq: 20,
    status: "pending",
    origin: "China",
    risk: "high",
    submitted: "6h ago",
    images: ["📷", "🎥", "📹", "🎞️"],
    completion: 62,
    description:
      "4K UHD webcam with autofocus, dual noise-cancelling mics, and privacy shutter.",
    variants: [{ name: "Standard", stock: 8, price: 3200 }],
    specs: {
      resolution: "4K UHD",
      fps: "30fps",
      mic: "Dual stereo",
      mount: "Clip-on",
    },
    seller: {
      name: "NewSeller99",
      avatar: "NS",
      rating: 3.2,
      orders: 12,
      joined: "5 days ago",
      email: "newseller99@gmail.com",
      phone: "+880 1911-XXXXXX",
      location: "Unknown",
      verified: false,
      badges: ["New Seller"],
      avgResponse: "12h",
      returnRate: "18.5%",
      disputes: 4,
      totalProducts: 3,
      totalRevenue: "৳42,000",
      responseTime: "45%",
      onTimeDelivery: "62%",
      cancellationRate: "12.5%",
      courierPartner: "Not Set",
      payoutMethod: "Not Set",
      lastPayout: "No payouts yet",
    },
  },
  {
    id: "PRD-8838",
    name: "USB-C Hub 12-in-1",
    sku: "UCH-12N1",
    category: "Accessories > Hub",
    brand: "Ugreen",
    price: 1850,
    comparePrice: 2400,
    costPrice: 1100,
    stock: 200,
    moq: 15,
    status: "pending",
    origin: "Local BD",
    risk: "low",
    submitted: "8h ago",
    images: ["🔌", "💻", "🖥️", "⚡"],
    completion: 88,
    description:
      "12-in-1 USB-C hub with HDMI 4K, USB 3.0, SD card reader, ethernet, and PD charging up to 100W.",
    variants: [
      { name: "Space Gray", stock: 120, price: 1850 },
      { name: "Silver", stock: 80, price: 1850 },
    ],
    specs: {
      ports: "12 ports",
      hdmi: "4K @ 60Hz",
      charging: "100W PD",
      ethernet: "Gigabit",
    },
    seller: {
      name: "TechBazar BD",
      avatar: "TB",
      rating: 4.7,
      orders: 1240,
      joined: "Jan 2023",
      email: "contact@techbazar.bd",
      phone: "+880 1711-XXXXXX",
      location: "Dhaka, Bangladesh",
      verified: true,
      badges: ["Top Seller", "Fast Shipping", "Verified NID"],
      avgResponse: "2h",
      returnRate: "1.2%",
      disputes: 3,
      totalProducts: 245,
      totalRevenue: "৳18,42,000",
      responseTime: "98%",
      onTimeDelivery: "96%",
      cancellationRate: "0.8%",
      courierPartner: "Steadfast",
      payoutMethod: "bKash Business",
      lastPayout: "৳42,500 · 2 days ago",
    },
  },
  {
    id: "PRD-8837",
    name: "Mechanical Keyboard RGB",
    sku: "MKB-RGB-BLK",
    category: "Electronics > Keyboard",
    brand: "KeyPro",
    price: 4200,
    comparePrice: 5000,
    costPrice: 2900,
    stock: 32,
    moq: 8,
    status: "pending",
    origin: "China",
    risk: "medium",
    submitted: "12h ago",
    images: ["⌨️", "🎮", "💡", "🔧"],
    completion: 78,
    description:
      "RGB mechanical gaming keyboard with blue switches, anti-ghosting, and durable aluminum frame.",
    variants: [
      { name: "Blue Switch", stock: 20, price: 4200 },
      { name: "Red Switch", stock: 12, price: 4400 },
    ],
    specs: {
      switches: "Blue/Red",
      layout: "TKL",
      backlight: "RGB",
      frame: "Aluminum",
    },
    seller: {
      name: "KeyboardKing",
      avatar: "KK",
      rating: 4.5,
      orders: 890,
      joined: "Aug 2023",
      email: "sales@keyboardking.bd",
      phone: "+880 1611-XXXXXX",
      location: "Sylhet, Bangladesh",
      verified: true,
      badges: ["Verified NID", "Fast Shipping"],
      avgResponse: "3h",
      returnRate: "2.1%",
      disputes: 5,
      totalProducts: 87,
      totalRevenue: "৳6,24,000",
      responseTime: "92%",
      onTimeDelivery: "89%",
      cancellationRate: "1.8%",
      courierPartner: "RedX",
      payoutMethod: "Nagad Business",
      lastPayout: "৳18,700 · 5 days ago",
    },
  },
  {
    id: "PRD-8836",
    name: "Gaming Mouse Pro 8K",
    sku: "GMP-8K",
    category: "Electronics > Mouse",
    brand: "Generic",
    price: 1650,
    comparePrice: 2900,
    costPrice: 450,
    stock: 15,
    moq: 25,
    status: "pending",
    origin: "China",
    risk: "medium",
    submitted: "1d ago",
    images: ["🖱️", "🎮", "🖥️", "⚡"],
    completion: 70,
    description:
      "8K polling rate gaming mouse with optical switches, 26000 DPI sensor, and RGB lighting.",
    variants: [{ name: "Black", stock: 15, price: 1650 }],
    specs: {
      dpi: "26000",
      polling: "8K Hz",
      switches: "Optical",
      weight: "68g",
    },
    seller: {
      name: "NewSeller99",
      avatar: "NS",
      rating: 3.2,
      orders: 12,
      joined: "5 days ago",
      email: "newseller99@gmail.com",
      phone: "+880 1911-XXXXXX",
      location: "Unknown",
      verified: false,
      badges: ["New Seller"],
      avgResponse: "12h",
      returnRate: "18.5%",
      disputes: 4,
      totalProducts: 3,
      totalRevenue: "৳42,000",
      responseTime: "45%",
      onTimeDelivery: "62%",
      cancellationRate: "12.5%",
      courierPartner: "Not Set",
      payoutMethod: "Not Set",
      lastPayout: "No payouts yet",
    },
  },
];

const TONE = {
  amber: { text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-200", bar: "from-amber-400 to-amber-600" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200", bar: "from-emerald-400 to-emerald-600" },
  rose: { text: "text-rose-600", bg: "bg-rose-50", ring: "ring-rose-200", bar: "from-rose-400 to-rose-600" },
  cyan: { text: "text-cyan-600", bg: "bg-cyan-50", ring: "ring-cyan-200", bar: "from-cyan-400 to-cyan-600" },
};

const RISK_TONE = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

const ORIGIN_TONE = {
  China: "bg-orange-50 text-orange-700 ring-orange-200",
  "Local BD": "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

export default function CatalogApprovalsPage() {
  const [tab, setTab] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState([]);
  const [query, setQuery] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [detailTab, setDetailTab] = useState("product");

  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.seller.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase())
  );

  const active = PRODUCTS.find((p) => p.id === selected) || filtered[0];

  const toggleCheck = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelect = (id) => {
    setSelected(id);
    setImageIndex(0);
    setDetailTab("product");
  };

  const profit = active ? active.price - active.costPrice : 0;
  const marginPct = active ? Math.round((profit / active.price) * 100) : 0;

  return (
    <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-4 sm:gap-5">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_10px_rgba(251,146,60,1)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">
              Moderation Queue · Live
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Catalog &amp; Approvals
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Review seller submissions before they go live on Bilash.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:text-sm">
            ⬆ Bulk import
          </button>
          <button className="cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-sm">
            + Add product
          </button>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => {
          const t = TONE[s.tone];
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className={`pointer-events-none absolute -top-10 -right-10 h-20 w-20 rounded-full ${t.bg} blur-2xl`} />
              <div className="relative flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
                    {s.value}
                  </p>
                  <p className={`mt-0.5 text-[10px] font-semibold ${t.text}`}>
                    {s.trend}
                  </p>
                </div>
                <div className={`h-10 w-1 shrink-0 rounded-full bg-gradient-to-b ${t.bar}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ MAIN GRID: List + Detail ============ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_460px]">
        {/* ---------- LEFT: LIST ---------- */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-3 sm:p-4">
            <div className="relative mb-3">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, sellers, or IDs..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((t) => {
                const isActive = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={
                      "shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all " +
                      (isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900")
                    }
                  >
                    {t.label}
                    <span
                      className={
                        "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums " +
                        (isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")
                      }
                    >
                      {t.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-h-[680px] overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-400">
                No products found.
              </div>
            )}

            {filtered.map((p) => {
              const isActive = active?.id === p.id;
              const isChecked = checked.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={
                    "group relative flex w-full cursor-pointer items-start gap-3 p-3.5 text-left transition-all sm:gap-4 sm:p-4 " +
                    (isActive
                      ? "bg-gradient-to-r from-orange-50 via-orange-50/50 to-transparent"
                      : "hover:bg-slate-50/60")
                  }
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-orange-500 shadow-[0_0_10px_rgba(251,146,60,0.9)]" />
                  )}

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleCheck(p.id)}
                    className="mt-2 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                    {p.images[0]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {p.name}
                      </p>
                      {p.risk === "high" && (
                        <span className="inline-flex items-center rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-700">
                          High risk
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                      <span className="font-mono text-slate-400">{p.id}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="font-medium text-slate-700">{p.seller.name}</span>
                        <span className="text-amber-500">★</span>
                        <span className="font-medium">{p.seller.rating}</span>
                      </span>
                      <span>·</span>
                      <span className="text-slate-400">{p.submitted}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          ৳{p.price.toLocaleString()}
                        </span>
                        {p.comparePrice > p.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ৳{p.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Stock <span className="font-semibold text-slate-700">{p.stock}</span>
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            p.completion >= 90
                              ? "from-emerald-400 to-emerald-600"
                              : p.completion >= 70
                              ? "from-amber-400 to-amber-600"
                              : "from-rose-400 to-rose-600"
                          }`}
                          style={{ width: `${p.completion}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold tabular-nums text-slate-400">
                        {p.completion}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- RIGHT: DETAIL ---------- */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          {active ? (
            <div className="flex max-h-[880px] flex-col">
              {/* Hero with image gallery */}
              <div className="relative border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4">
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-orange-500/[0.08] blur-3xl" />

                {/* Image carousel */}
                <div className="relative">
                  <div className="grid h-40 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-6xl">
                    {active.images[imageIndex]}
                  </div>

                  {active.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setImageIndex(
                            (imageIndex - 1 + active.images.length) % active.images.length
                          )
                        }
                        className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() =>
                          setImageIndex((imageIndex + 1) % active.images.length)
                        }
                        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Thumbnails */}
                  <div className="mt-2 flex justify-center gap-1.5">
                    {active.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImageIndex(i)}
                        className={
                          "grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-lg transition-all " +
                          (i === imageIndex
                            ? "bg-orange-100 ring-2 ring-orange-500"
                            : "bg-slate-100 hover:bg-slate-200")
                        }
                      >
                        {img}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="relative mt-4">
                  <h2 className="text-base font-bold leading-tight text-slate-900">
                    {active.name}
                  </h2>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                    {active.id} · {active.sku}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${RISK_TONE[active.risk]}`}>
                      {active.risk} risk
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${ORIGIN_TONE[active.origin]}`}>
                      {active.origin}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {active.brand}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail tabs */}
              <div className="flex gap-1 border-b border-slate-100 bg-slate-50/50 px-3 py-2">
                {[
                  { key: "product", label: "Product" },
                  { key: "seller", label: "Seller" },
                  { key: "verify", label: "Verification" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setDetailTab(t.key)}
                    className={
                      "cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all " +
                      (detailTab === t.key
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-900")
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* PRODUCT TAB */}
                {detailTab === "product" && (
                  <>
                    {/* Pricing card */}
                    <div className="rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Pricing Breakdown
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          ৳{active.price.toLocaleString()}
                        </span>
                        {active.comparePrice > active.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ৳{active.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cost price</span>
                          <span className="font-medium text-slate-700">
                            ৳{active.costPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Profit margin</span>
                          <span className="font-semibold text-emerald-600">
                            ৳{profit.toLocaleString()} ({marginPct}%)
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-1.5">
                          <span className="text-slate-500">Discount vs market</span>
                          <span className="font-semibold text-orange-600">
                            {Math.round(
                              ((active.comparePrice - active.price) / active.comparePrice) * 100
                            )}
                            % off
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info grid */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { label: "Category", value: active.category },
                        { label: "Stock", value: `${active.stock} units` },
                        { label: "MOQ", value: `${active.moq} units` },
                        { label: "Completion", value: `${active.completion}%` },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-slate-200/70 bg-white p-3"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-1 truncate text-xs font-medium text-slate-800">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Description
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                        {active.description}
                      </p>
                    </div>

                    {/* Variants */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Variants ({active.variants.length})
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {active.variants.map((v) => (
                          <div
                            key={v.name}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
                          >
                            <span className="font-medium text-slate-700">{v.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500">Stock {v.stock}</span>
                              <span className="font-semibold text-slate-900">
                                ৳{v.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Specifications
                      </p>
                      <div className="mt-2 space-y-1.5 text-xs">
                        {Object.entries(active.specs).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="capitalize text-slate-500">{k}</span>
                            <span className="font-medium text-slate-700">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* SELLER TAB */}
                {detailTab === "seller" && (
                  <>
                    {/* Seller header */}
                    <div className="rounded-xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-base font-bold text-white shadow-lg shadow-cyan-500/30">
                          {active.seller.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {active.seller.name}
                            </p>
                            {active.seller.verified && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            <span className="text-amber-500">★</span>{" "}
                            {active.seller.rating} · Joined {active.seller.joined}
                          </p>
                        </div>
                      </div>

                      {active.seller.badges?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {active.seller.badges.map((b) => (
                            <span
                              key={b}
                              className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Contact
                      </p>
                      <div className="mt-2 space-y-2 text-xs">
                        {[
                          { icon: "✉️", label: active.seller.email },
                          { icon: "📞", label: active.seller.phone },
                          { icon: "📍", label: active.seller.location },
                        ].map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-700">
                            <span className="text-sm">{c.icon}</span>
                            <span className="truncate">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business stats */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Business Overview
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <p className="text-[10px] text-slate-500">Total Orders</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">
                            {active.seller.orders.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <p className="text-[10px] text-slate-500">Products</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">
                            {active.seller.totalProducts}
                          </p>
                        </div>
                        <div className="col-span-2 rounded-lg bg-emerald-50 p-2.5">
                          <p className="text-[10px] text-emerald-700">
                            Lifetime Revenue
                          </p>
                          <p className="mt-0.5 text-base font-bold text-emerald-700">
                            {active.seller.totalRevenue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Trust metrics */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Performance Metrics
                      </p>
                      <div className="mt-3 space-y-3">
                        {[
                          {
                            label: "Response Rate",
                            value: active.seller.responseTime,
                            pct: parseInt(active.seller.responseTime),
                            invert: false,
                          },
                          {
                            label: "On-time Delivery",
                            value: active.seller.onTimeDelivery,
                            pct: parseInt(active.seller.onTimeDelivery),
                            invert: false,
                          },
                          {
                            label: "Return Rate",
                            value: active.seller.returnRate,
                            pct: parseFloat(active.seller.returnRate),
                            invert: true,
                          },
                          {
                            label: "Cancellation Rate",
                            value: active.seller.cancellationRate,
                            pct: parseFloat(active.seller.cancellationRate),
                            invert: true,
                          },
                        ].map((m) => {
                          const good = m.invert ? m.pct < 5 : m.pct >= 85;
                          const medium = m.invert ? m.pct < 12 : m.pct >= 60;
                          const color = good
                            ? "bg-emerald-500"
                            : medium
                            ? "bg-amber-500"
                            : "bg-rose-500";
                          const width = m.invert
                            ? Math.min(100 - m.pct * 3, 100)
                            : m.pct;
                          return (
                            <div key={m.label}>
                              <div className="mb-1 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500">{m.label}</span>
                                <span
                                  className={
                                    "font-semibold " +
                                    (good
                                      ? "text-emerald-600"
                                      : medium
                                      ? "text-amber-600"
                                      : "text-rose-600")
                                  }
                                >
                                  {m.value}
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${color}`}
                                  style={{ width: `${Math.max(width, 5)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fulfillment info */}
                    <div className="mt-3 rounded-xl border border-slate-200/70 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Fulfillment &amp; Payout
                      </p>
                      <div className="mt-2 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Courier Partner</span>
                          <span className="font-medium text-slate-700">
                            {active.seller.courierPartner}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Payout Method</span>
                          <span className="font-medium text-slate-700">
                            {active.seller.payoutMethod}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Last Payout</span>
                          <span className="font-medium text-slate-700">
                            {active.seller.lastPayout}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Disputes</span>
                          <span
                            className={
                              "font-semibold " +
                              (active.seller.disputes <= 2
                                ? "text-emerald-600"
                                : "text-rose-600")
                            }
                          >
                            {active.seller.disputes} open
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Seller actions */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                        Message seller
                      </button>
                      <button className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                        View store
                      </button>
                    </div>
                  </>
                )}

                {/* VERIFY TAB */}
                {detailTab === "verify" && (
                  <>
                    <div className="rounded-xl border border-slate-200/70 bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Verification Checklist
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {[
                          { label: "Images high quality", done: active.completion >= 90 },
                          { label: "Description complete", done: active.completion >= 80 },
                          { label: "Category accurate", done: true },
                          { label: "Price within range", done: active.risk !== "high" },
                          { label: "Seller verified", done: active.seller.verified },
                          { label: "No copyright images", done: active.risk !== "high" },
                          { label: "Stock verified", done: active.stock > 10 },
                        ].map((c) => (
                          <li key={c.label} className="flex items-center gap-2.5 text-sm">
                            <span
                              className={
                                "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold " +
                                (c.done
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700")
                              }
                            >
                              {c.done ? "✓" : "✕"}
                            </span>
                            <span
                              className={
                                c.done
                                  ? "text-slate-700"
                                  : "font-medium text-rose-600"
                              }
                            >
                              {c.label}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 rounded-lg bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Overall Score
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {active.completion}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              active.completion >= 90
                                ? "from-emerald-400 to-emerald-600"
                                : active.completion >= 70
                                ? "from-amber-400 to-amber-600"
                                : "from-rose-400 to-rose-600"
                            }`}
                            style={{ width: `${active.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                      <p className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                        ⚠️ AI Moderation Notes
                      </p>
                      <ul className="mt-2 space-y-1.5 text-[11px] text-amber-800/80">
                        {active.risk === "high" && (
                          <li>• Image similarity detected with another seller</li>
                        )}
                        {active.completion < 80 && (
                          <li>• Description is too short</li>
                        )}
                        {active.stock < 20 && <li>• Very low stock level</li>}
                        {!active.seller.verified && (
                          <li>• Seller account not verified</li>
                        )}
                        {active.risk === "low" && active.completion >= 90 && (
                          <li>• No issues detected — safe to approve</li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Actions footer */}
              <div className="border-t border-slate-100 bg-slate-50/60 p-3">
                <div className="grid grid-cols-3 gap-2">
                  <button className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                    Flag
                  </button>
                  <button className="col-span-2 cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-orange-600  px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    ✓ Approve product
                  </button>
                </div>
                <button className="mt-2 w-full cursor-pointer rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-xs font-semibold text-rose-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-md">
                  ✕ Reject with reason
                </button>
              </div>
            </div>
          ) : (
            <div className="grid h-full place-items-center p-10 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
                  👈
                </div>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  Select a product
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Click a product on the left to review details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ BULK ACTION BAR ============ */}
      {checked.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {checked.length}
            </span>
            <span className="text-sm font-medium text-slate-700">selected</span>
            <div className="h-6 w-px bg-slate-200" />
            <button className="cursor-pointer rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600">
              ✓ Approve all
            </button>
            <button className="cursor-pointer rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600">
              ✕ Reject all
            </button>
            <button
              onClick={() => setChecked([])}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}