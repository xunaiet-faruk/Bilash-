"use client";

import { useEffect, useMemo, useState } from "react";

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const initialOrders = [
  {
    id: "A-2291",
    customer: "Mahin Chowdhury",
    phone: "+880 1711-000111",
    address: "House 12, Road 4, Chattogram",
    placed: "26 Sep, 10:14 AM",
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Card",
    courier: "Steadfast",
    district: "Chattogram",
    risk: "low",
    items: [
      { name: "Wireless Earbuds Pro", reseller: "Bilash Traders", qty: 1, price: 34.99, emoji: "🎧" },
      { name: "USB-C Hub 7-in-1", reseller: "Nur Enterprise", qty: 1, price: 22.5, emoji: "🔌" },
    ],
    timeline: [
      ["Pending", "26 Sep, 10:14 AM"],
      ["Processing", "26 Sep, 11:02 AM"],
      ["Shipped", "26 Sep, 4:40 PM"],
      ["Delivered", "27 Sep, 1:15 PM"],
    ],
  },
  {
    id: "A-2290",
    customer: "Nusrat Jahan",
    phone: "+880 1811-000222",
    address: "Flat 3B, Banani, Dhaka",
    placed: "26 Sep, 9:02 AM",
    status: "Refunded",
    payment: "Refunded",
    paymentMethod: "bKash",
    courier: "Pathao",
    district: "Dhaka",
    risk: "low",
    items: [
      { name: "Smart LED Strip 5m", reseller: "Nur Enterprise", qty: 1, price: 18.5, emoji: "💡" },
    ],
    timeline: [
      ["Pending", "26 Sep, 9:02 AM"],
      ["Processing", "26 Sep, 9:40 AM"],
      ["Refunded", "26 Sep, 6:12 PM"],
    ],
    refundReason: "Item arrived damaged",
  },
  {
    id: "A-2289",
    customer: "Tanvir Ahmed",
    phone: "+880 1911-000333",
    address: "Uposhohor, Sylhet",
    placed: "25 Sep, 6:45 PM",
    status: "Shipped",
    payment: "Paid",
    paymentMethod: "Card",
    courier: "RedX",
    district: "Sylhet",
    risk: "low",
    items: [
      { name: "Yoga Mat Anti-Slip", reseller: "Bilash Traders", qty: 2, price: 19.75, emoji: "🧘" },
      { name: "Trail Running Socks", reseller: "Nur Enterprise", qty: 3, price: 7.8, emoji: "🧦" },
      { name: "Fitness Tracker Band", reseller: "Zaman Retail", qty: 1, price: 21.4, emoji: "⌚" },
    ],
    timeline: [
      ["Pending", "25 Sep, 6:45 PM"],
      ["Processing", "25 Sep, 8:10 PM"],
      ["Shipped", "26 Sep, 9:00 AM"],
    ],
  },
  {
    id: "A-2288",
    customer: "Farzana Akter",
    phone: "+880 1611-000444",
    address: "Shahjalal Road, Rajshahi",
    placed: "25 Sep, 3:12 PM",
    status: "Processing",
    payment: "Paid",
    paymentMethod: "bKash",
    courier: "Steadfast",
    district: "Rajshahi",
    risk: "low",
    items: [
      { name: "Ceramic Coffee Mug Set", reseller: "Zaman Retail", qty: 1, price: 15.2, emoji: "☕" },
    ],
    timeline: [
      ["Pending", "25 Sep, 3:12 PM"],
      ["Processing", "25 Sep, 3:50 PM"],
    ],
  },
  {
    id: "A-2287",
    customer: "Sadman Rahman",
    phone: "+880 1511-000555",
    address: "Green Road, Dhaka",
    placed: "24 Sep, 11:30 AM",
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Card",
    courier: "Pathao",
    district: "Dhaka",
    risk: "low",
    items: [
      { name: "Bluetooth Neck Speaker", reseller: "Green Valley Shop", qty: 1, price: 27.75, emoji: "🔊" },
    ],
    timeline: [
      ["Pending", "24 Sep, 11:30 AM"],
      ["Processing", "24 Sep, 12:05 PM"],
      ["Shipped", "24 Sep, 5:00 PM"],
      ["Delivered", "25 Sep, 2:30 PM"],
    ],
  },
  {
    id: "A-2286",
    customer: "Imran Kabir",
    phone: "+880 1311-000666",
    address: "GEC Circle, Chattogram",
    placed: "24 Sep, 9:00 AM",
    status: "Cancelled",
    payment: "Refunded",
    paymentMethod: "Card",
    courier: "RedX",
    district: "Chattogram",
    risk: "medium",
    items: [
      { name: "Matte Lipstick Trio", reseller: "Al-Amin Store", qty: 1, price: 16.9, emoji: "💄" },
    ],
    timeline: [
      ["Pending", "24 Sep, 9:00 AM"],
      ["Cancelled", "24 Sep, 9:40 AM"],
    ],
    cancelReason: "Customer changed their mind",
  },
  {
    id: "A-2285",
    customer: "Rumana Islam",
    phone: "+880 1211-000777",
    address: "Agrabad, Chattogram",
    placed: "23 Sep, 5:20 PM",
    status: "Pending",
    payment: "COD",
    paymentMethod: "Cash on delivery",
    courier: "Steadfast",
    district: "Chattogram",
    risk: "high",
    codAmount: 24.6,
    items: [
      { name: "Kids Puzzle 100pc", reseller: "Al-Amin Store", qty: 2, price: 12.3, emoji: "🧩" },
    ],
    timeline: [["Pending", "23 Sep, 5:20 PM"]],
  },
  {
    id: "A-2284",
    customer: "Kamal Hossain",
    phone: "+880 1911-000888",
    address: "Mirpur, Dhaka",
    placed: "23 Sep, 1:05 PM",
    status: "Delivered",
    payment: "Paid",
    paymentMethod: "Card",
    courier: "Pathao",
    district: "Dhaka",
    risk: "low",
    items: [
      { name: "Cotton Crew Tee", reseller: "Green Valley Shop", qty: 3, price: 11.5, emoji: "👕" },
    ],
    timeline: [
      ["Pending", "23 Sep, 1:05 PM"],
      ["Processing", "23 Sep, 1:40 PM"],
      ["Shipped", "23 Sep, 6:00 PM"],
      ["Delivered", "24 Sep, 3:00 PM"],
    ],
  },
];

const STATUS_TONE = {
  Pending: { dot: "bg-[var(--color-brand-navy-light)]", bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200" },
  Processing: { dot: "bg-[var(--color-brand-orange)]", bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
  Shipped: { dot: "bg-[var(--color-brand-navy)]", bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  Delivered: { dot: "bg-[var(--color-brand-teal)]", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  Cancelled: { dot: "bg-[var(--color-ink)]/30", bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-200" },
  Refunded: { dot: "bg-[var(--color-ink)]/40", bg: "bg-slate-100", text: "text-slate-700", ring: "ring-slate-200" },
};

const PAYMENT_TONE = {
  Paid: "text-[var(--color-brand-teal)]",
  Refunded: "text-[var(--color-ink)]/50",
  COD: "text-[var(--color-brand-orange-dark)]",
};

const COURIER_TONE = {
  Steadfast: "text-emerald-600",
  Pathao: "text-[var(--color-brand-orange-dark)]",
  RedX: "text-sky-600",
};

const RISK_TONE = {
  low: { label: "Low risk", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  medium: { label: "Medium", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  high: { label: "⚠ High", bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
};

const orderTotal = (o) => o.items.reduce((s, i) => s + i.price * i.qty, 0);
const initials = (s) =>
  s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const money = (n) => `$${n.toFixed(2)}`;

const tabs = [
  { key: "all", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Processing", label: "Processing" },
  { key: "Shipped", label: "Shipped" },
  { key: "Delivered", label: "Delivered" },
  { key: "Cancelled", label: "Cancelled/Refunded" },
];

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  x: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  box: "M3.3 7 12 12l8.7-5M12 12v9M3.3 7 12 3l8.7 4v10L12 21l-8.7-4Z",
  truck: "M3 7h11v10H3zM14 10h4l3 3v4h-7z",
  print: "M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z",
  copy: "M8 4h10a2 2 0 0 1 2 2v10M4 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  download: "M12 3v12M7 10l5 5 5-5M4 20h16",
  filter: "M3 5h18l-7 8v6l-4-2v-4L3 5Z",
  wallet: "M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
};

const belongsTab = (o, tab) =>
  tab === "all"
    ? true
    : tab === "Cancelled"
    ? ["Cancelled", "Refunded"].includes(o.status)
    : o.status === tab;

const Page = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("Customer requested");
  const [toast, setToast] = useState(null);

  const flash = (m) => setToast(m);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        belongsTab(o, tab) &&
        (!q ||
          `${o.id} ${o.customer} ${o.phone}`.toLowerCase().includes(q) ||
          o.items.some((i) => i.reseller.toLowerCase().includes(q)))
    );
  }, [orders, tab, query]);

  const count = (t) => orders.filter((o) => belongsTab(o, t)).length;
  const opened = orders.find((o) => o.id === openId) || null;
  const openIdx = filtered.findIndex((o) => o.id === openId);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.payment === "Paid")
      .reduce((s, o) => s + orderTotal(o), 0);
    const codPending = orders
      .filter((o) => o.payment === "COD" && !["Delivered", "Cancelled"].includes(o.status))
      .reduce((s, o) => s + orderTotal(o), 0);
    return {
      total: orders.length,
      revenue,
      codPending,
      pending: orders.filter((o) => o.status === "Pending").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
    };
  }, [orders]);

  const advance = (o) => {
    const idx = STEPS.indexOf(o.status);
    if (idx === -1 || idx === STEPS.length - 1) return;
    const next = STEPS[idx + 1];
    const now = new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setOrders((cur) =>
      cur.map((x) =>
        x.id === o.id
          ? { ...x, status: next, timeline: [...x.timeline, [next, now]] }
          : x
      )
    );
    flash(`Order #${o.id} marked ${next}`);
  };

  const cancel = (o, why) => {
    const now = new Date().toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setOrders((cur) =>
      cur.map((x) =>
        x.id === o.id
          ? {
              ...x,
              status: "Cancelled",
              payment: x.payment === "Paid" ? "Refunded" : x.payment,
              cancelReason: why,
              timeline: [...x.timeline, ["Cancelled", now]],
            }
          : x
      )
    );
    setCancelling(false);
    flash(`Order #${o.id} cancelled`);
  };

  const go = (dir) => {
    const t = filtered[openIdx + dir];
    if (t) {
      setOpenId(t.id);
      setCancelling(false);
    }
  };

  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 text-[var(--color-ink)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-brand-orange)] shadow-[0_0_10px_rgba(255,90,31,1)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]/45 sm:text-[11px]">
              Order Management
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Every order placed across the marketplace, with items grouped by reseller.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => flash("Exported orders as CSV")}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--color-ink)]"
          >
            <Ico d={I.download} className="h-3.5 w-3.5" /> Export
          </button>
          <button
            onClick={() => flash("Courier sync started…")}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[var(--color-brand-orange)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]"
          >
            <Ico d={I.refresh} className="h-3.5 w-3.5" /> Sync couriers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total Orders", value: stats.total, sub: `${stats.pending} pending`, tone: "navy" },
          { label: "In Transit", value: stats.shipped, sub: "shipped today", tone: "orange" },
          { label: "Revenue Collected", value: money(stats.revenue), sub: "from paid orders", tone: "teal" },
          { label: "COD Pending", value: money(stats.codPending), sub: "to reconcile", tone: "ink" },
        ].map((s) => {
          const tones = {
            navy: { bg: "bg-[var(--color-brand-navy)]/5", bar: "from-[var(--color-brand-navy-light)] to-[var(--color-brand-navy)]" },
            orange: { bg: "bg-[var(--color-brand-orange)]/10", bar: "from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" },
            teal: { bg: "bg-[var(--color-brand-teal)]/10", bar: "from-[var(--color-brand-teal)] to-[var(--color-brand-teal)]" },
            ink: { bg: "bg-[var(--color-ink)]/5", bar: "from-[var(--color-ink)]/60 to-[var(--color-ink)]" },
          };
          const t = tones[s.tone];
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`pointer-events-none absolute -top-10 -right-10 h-20 w-20 rounded-full ${t.bg} blur-2xl`} />
              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-xl font-bold tabular-nums text-[var(--color-ink)]">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/45">
                    {s.sub}
                  </p>
                </div>
                <div className={`h-10 w-1 shrink-0 rounded-full bg-gradient-to-b ${t.bar}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
        <div className="flex flex-col gap-3 border-b border-[var(--color-line)] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-[var(--color-ink)]/[0.04] p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all " +
                  (tab === t.key
                    ? "bg-white text-[var(--color-ink)] shadow-sm"
                    : "text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]")
                }
              >
                {t.label}
                <span className="text-xs tabular-nums text-[var(--color-ink)]/40">
                  {count(t.key)}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative block flex-1 lg:flex-none">
              <Ico
                d={I.search}
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/35"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order, customer, reseller"
                className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-navy)] lg:w-72"
              />
            </label>
            <button
              onClick={() => flash("Filters coming soon")}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-medium transition-colors hover:border-[var(--color-ink)]"
            >
              <Ico d={I.filter} className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Items</th>
                <th className="px-3 py-3 text-right font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Payment</th>
                <th className="px-3 py-3 font-medium">Courier</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {filtered.map((o) => {
                const st = STATUS_TONE[o.status] || STATUS_TONE.Pending;
                const risk = RISK_TONE[o.risk] || RISK_TONE.low;
                const resellerNames = [...new Set(o.items.map((i) => i.reseller))];
                const canAdvance =
                  STEPS.includes(o.status) && o.status !== "Delivered";
                return (
                  <tr
                    key={o.id}
                    className="group transition-colors hover:bg-[var(--color-brand-cream)]/60"
                  >
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          setOpenId(o.id);
                          setCancelling(false);
                        }}
                        className="cursor-pointer text-left"
                      >
                        <p className="font-mono text-xs font-semibold text-[var(--color-ink)]">
                          #{o.id}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/45">
                          {o.placed}
                        </p>
                      </button>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white">
                          {initials(o.customer)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {o.customer}
                          </p>
                          <p className="truncate text-[10px] text-[var(--color-ink)]/45">
                            {resellerNames.length > 1
                              ? `${resellerNames.length} resellers`
                              : resellerNames[0]}
                          </p>
                        </div>
                        {o.risk === "high" && (
                          <span
                            className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset ${risk.bg} ${risk.text} ${risk.ring}`}
                          >
                            ⚠
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1">
                        {o.items.slice(0, 3).map((it, i) => (
                          <span
                            key={i}
                            className="grid h-6 w-6 place-items-center rounded-md bg-[var(--color-brand-cream)] text-[11px]"
                            title={it.name}
                          >
                            {it.emoji}
                          </span>
                        ))}
                        {o.items.length > 3 && (
                          <span className="text-[10px] font-semibold text-[var(--color-ink)]/50">
                            +{o.items.length - 3}
                          </span>
                        )}
                        <span className="ml-1 text-[10px] tabular-nums text-[var(--color-ink)]/50">
                          {o.items.reduce((s, i) => s + i.qty, 0)} pcs
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right font-semibold tabular-nums">
                      {money(orderTotal(o))}
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={
                          "text-xs font-medium " +
                          (PAYMENT_TONE[o.payment] || "text-[var(--color-ink)]/60")
                        }
                      >
                        {o.payment}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`text-[11px] font-semibold ${COURIER_TONE[o.courier] || "text-[var(--color-ink)]/60"}`}
                      >
                        {o.courier}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${st.bg} ${st.text} ${st.ring}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {canAdvance && (
                          <button
                            onClick={() => advance(o)}
                            className="hidden cursor-pointer rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal)] hover:text-white sm:inline-block"
                          >
                            Mark {STEPS[STEPS.indexOf(o.status) + 1]}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setOpenId(o.id);
                            setCancelling(false);
                          }}
                          className="cursor-pointer rounded-lg bg-[var(--color-brand-navy)] px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-85"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-[var(--color-ink)]/40">
                    No orders match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[var(--color-line)] px-5 py-3 text-xs text-[var(--color-ink)]/45">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      {opened && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6">
          <div
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-[var(--color-brand-navy)]/50 backdrop-blur-[2px]"
          />
          <div className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-ink)]/45">
                  Placed {opened.placed}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold sm:text-xl">
                    Order #{opened.id}
                  </h2>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_TONE[opened.status].bg} ${STATUS_TONE[opened.status].text} ${STATUS_TONE[opened.status].ring}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_TONE[opened.status].dot}`} />
                    {opened.status}
                  </span>
                  {opened.risk === "high" && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${RISK_TONE.high.bg} ${RISK_TONE.high.text} ${RISK_TONE.high.ring}`}>
                      ⚠ High risk
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="mr-1 hidden text-xs tabular-nums text-[var(--color-ink)]/40 sm:block">
                  {openIdx + 1} / {filtered.length}
                </span>
                <button
                  onClick={() => go(-1)}
                  disabled={openIdx <= 0}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/60 hover:bg-[var(--color-ink)]/5 disabled:cursor-default disabled:opacity-30"
                  aria-label="Previous"
                >
                  <Ico d={I.left} />
                </button>
                <button
                  onClick={() => go(1)}
                  disabled={openIdx === -1 || openIdx >= filtered.length - 1}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/60 hover:bg-[var(--color-ink)]/5 disabled:cursor-default disabled:opacity-30"
                  aria-label="Next"
                >
                  <Ico d={I.right} />
                </button>
                <button
                  onClick={() => setOpenId(null)}
                  className="ml-1 grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/60 hover:bg-[var(--color-ink)]/5"
                  aria-label="Close"
                >
                  <Ico d={I.x} />
                </button>
              </div>
            </div>

            <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1.3fr_1fr]">
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="text-sm font-semibold">Timeline</h3>
                  <ol className="mt-3 space-y-0">
                    {opened.timeline.map(([label, time], idx) => (
                      <li key={label + time} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={
                              "grid h-6 w-6 shrink-0 place-items-center rounded-full text-white " +
                              (["Cancelled", "Refunded"].includes(label)
                                ? "bg-[var(--color-ink)]/40"
                                : "bg-[var(--color-brand-navy)]")
                            }
                          >
                            <Ico d={I.check} className="h-3.5 w-3.5" />
                          </span>
                          {idx < opened.timeline.length - 1 && (
                            <span className="w-px flex-1 bg-[var(--color-line)]" />
                          )}
                        </div>
                        <div className="pb-5">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-[var(--color-ink)]/45">
                            {time}
                          </p>
                        </div>
                      </li>
                    ))}
                    {opened.status !== "Delivered" &&
                      opened.status !== "Cancelled" &&
                      opened.status !== "Refunded" &&
                      STEPS.slice(STEPS.indexOf(opened.status) + 1).map((s) => (
                        <li key={s} className="flex gap-3 opacity-35">
                          <div className="flex flex-col items-center">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-dashed border-[var(--color-ink)]/30" />
                          </div>
                          <p className="pb-5 text-sm">{s}</p>
                        </li>
                      ))}
                  </ol>
                  {opened.cancelReason && (
                    <p className="mt-2 rounded-xl bg-[var(--color-ink)]/[0.05] px-4 py-3 text-sm">
                      <span className="font-semibold">Cancelled:</span>{" "}
                      {opened.cancelReason}
                    </p>
                  )}
                  {opened.refundReason && (
                    <p className="mt-2 rounded-xl bg-[var(--color-ink)]/[0.05] px-4 py-3 text-sm">
                      <span className="font-semibold">Refunded:</span>{" "}
                      {opened.refundReason}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    Items ({opened.items.length})
                  </h3>
                  <div className="mt-3 space-y-3">
                    {[...new Set(opened.items.map((i) => i.reseller))].map(
                      (rname) => (
                        <div
                          key={rname}
                          className="rounded-xl border border-[var(--color-line)]"
                        >
                          <div className="flex items-center gap-2 border-b border-[var(--color-line)] bg-[var(--color-brand-cream)]/60 px-3.5 py-2">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white">
                              {initials(rname)}
                            </span>
                            <span className="text-xs font-semibold">
                              {rname}
                            </span>
                            <span className="ml-auto text-[10px] text-[var(--color-ink)]/45">
                              {
                                opened.items.filter(
                                  (i) => i.reseller === rname
                                ).length
                              }{" "}
                              item
                              {opened.items.filter((i) => i.reseller === rname)
                                .length > 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                          <ul className="divide-y divide-[var(--color-line)]">
                            {opened.items
                              .filter((i) => i.reseller === rname)
                              .map((i) => (
                                <li
                                  key={i.name}
                                  className="flex items-center gap-3 px-3.5 py-2.5 text-sm"
                                >
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-brand-cream)] text-lg">
                                    {i.emoji}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate font-medium">
                                    {i.name}
                                  </span>
                                  <span className="tabular-nums text-[var(--color-ink)]/50">
                                    × {i.qty}
                                  </span>
                                  <span className="w-16 shrink-0 text-right font-semibold tabular-nums">
                                    {money(i.price * i.qty)}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-[var(--color-line)] pt-3 text-sm font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {money(orderTotal(opened))}
                    </span>
                  </div>
                </div>
              </div>

              <aside className="space-y-5 border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/60 p-5 sm:p-6 lg:border-l lg:border-t-0">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Customer
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-sm font-bold text-white">
                      {initials(opened.customer)}
                    </span>
                    <div>
                      <p className="font-semibold">{opened.customer}</p>
                      <p className="text-[11px] text-[var(--color-ink)]/45">
                        {opened.district}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink)]/75">
                    <li className="flex items-center gap-2.5">
                      <Ico
                        d={I.phone}
                        className="h-4 w-4 shrink-0 text-[var(--color-ink)]/40"
                      />
                      {opened.phone}
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Ico
                        d={I.pin}
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink)]/40"
                      />
                      {opened.address}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Payment
                  </h3>
                  <div className="mt-3 rounded-xl bg-white p-3.5 ring-1 ring-[var(--color-line)]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-ink)]/55">Method</span>
                      <span className="font-medium">
                        {opened.paymentMethod}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[var(--color-ink)]/55">Status</span>
                      <span
                        className={
                          "font-medium " +
                          (PAYMENT_TONE[opened.payment] || "")
                        }
                      >
                        {opened.payment}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[var(--color-ink)]/55">Amount</span>
                      <span className="font-semibold tabular-nums">
                        {money(orderTotal(opened))}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Fulfillment
                  </h3>
                  <div className="mt-3 rounded-xl bg-white p-3.5 ring-1 ring-[var(--color-line)]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-ink)]/55">Courier</span>
                      <span
                        className={`font-semibold ${COURIER_TONE[opened.courier] || ""}`}
                      >
                        {opened.courier}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[var(--color-ink)]/55">Resellers</span>
                      <span className="font-medium">
                        {[...new Set(opened.items.map((i) => i.reseller))].length}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${opened.phone}`}
                  className="block rounded-xl border border-[var(--color-line)] bg-white py-2.5 text-center text-sm font-medium transition-colors hover:border-[var(--color-ink)]"
                >
                  Call {opened.customer.split(" ")[0]}
                </a>
              </aside>
            </div>

            <div className="border-t border-[var(--color-line)] bg-white px-5 py-4">
              {cancelling ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)] sm:flex-1"
                  >
                    {[
                      "Customer requested",
                      "Out of stock",
                      "Payment failed",
                      "Fraud suspected",
                      "Other",
                    ].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 sm:justify-end">
                    <button
                      onClick={() => setCancelling(false)}
                      className="cursor-pointer rounded-xl border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--color-ink)]"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => cancel(opened, reason)}
                      className="cursor-pointer rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                    >
                      Confirm cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-ink)]/40">
                    <span className="hidden sm:inline">
                      ← → to move between orders · Esc to close
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      onClick={() => flash("Printing packing slip…")}
                      className="cursor-pointer rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-ink)]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Ico d={I.print} className="h-3.5 w-3.5" /> Print
                      </span>
                    </button>
                    <button
                      onClick={() => flash("Tracking ID copied")}
                      className="cursor-pointer rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-ink)]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Ico d={I.copy} className="h-3.5 w-3.5" /> Tracking
                      </span>
                    </button>
                    {!["Delivered", "Cancelled", "Refunded"].includes(
                      opened.status
                    ) && (
                      <button
                        onClick={() => setCancelling(true)}
                        className="cursor-pointer rounded-xl border border-[var(--color-line)] px-6 py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-ink)]"
                      >
                        Cancel order
                      </button>
                    )}
                    {STEPS.includes(opened.status) &&
                      opened.status !== "Delivered" && (
                        <button
                          onClick={() => advance(opened)}
                          className="cursor-pointer rounded-xl bg-[var(--color-brand-orange)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]"
                        >
                          Mark as {STEPS[STEPS.indexOf(opened.status) + 1]}
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[var(--color-brand-navy)] px-5 py-2.5 text-sm text-white shadow-2xl">
          <Ico d={I.check} className="h-4 w-4 text-[var(--color-brand-teal)]" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default Page;