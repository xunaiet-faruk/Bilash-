"use client";

import {
  OrdersLineChart,
  SalesBarChart,
  ProfitDonutChart,
} from "./OrdersChart";

// ==================== FAKE DATA (API ready) ====================
const STATS = [
  {
    label: "Total Sales",
    value: "48,320",
    currency: "৳",
    change: "+12.4%",
    positive: true,
    accent: "orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Total Orders",
    value: "312",
    change: "+8.1%",
    positive: true,
    accent: "teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M21 8 12 3 3 8l9 5 9-5Z" strokeLinejoin="round" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Total Profit",
    value: "9,650",
    currency: "৳",
    change: "+15.2%",
    positive: true,
    accent: "navy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M3 17l6-6 4 4 8-8M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Products",
    value: "84",
    change: "-2.3%",
    positive: false,
    accent: "slate",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M3 3h18v4H3zM5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7M9 12h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const TOP_PRODUCTS = [
  { name: "Wireless Mouse", sold: 45, revenue: 11250, margin: 18 },
  { name: "USB-C Hub", sold: 32, revenue: 12800, margin: 22 },
  { name: "Mechanical Keyboard", sold: 28, revenue: 23800, margin: 15 },
  { name: "Laptop Stand", sold: 21, revenue: 6300, margin: 25 },
];

const ACTIVITY = [
  { name: "Mahin Chowdhury", action: "placed an order", time: "2m ago", color: "bg-teal-500" },
  { name: "Admin approved payout", action: "৳12,500", time: "1h ago", color: "bg-orange-500" },
  { name: "Nusrat Jahan", action: "left a 5★ review", time: "3h ago", color: "bg-amber-500" },
  { name: "New order cancelled", action: "#RS-1019", time: "5h ago", color: "bg-red-500" },
];

const RECENT_ORDERS = [
  { id: "#RS-1024", customer: "Mahin Chowdhury", initials: "MC", product: "Wireless Mouse", amount: 850, status: "Delivered", time: "5m ago" },
  { id: "#RS-1023", customer: "Nusrat Jahan", initials: "NJ", product: "USB-C Hub", amount: 1200, status: "Pending", time: "22m ago" },
  { id: "#RS-1022", customer: "Tanvir Ahmed", initials: "TA", product: "Mechanical Keyboard", amount: 2450, status: "Shipped", time: "1h ago" },
  { id: "#RS-1021", customer: "Farzana Akter", initials: "FA", product: "Laptop Stand", amount: 700, status: "Delivered", time: "3h ago" },
  { id: "#RS-1020", customer: "Sadman Rahman", initials: "SR", product: "Webcam HD", amount: 1600, status: "Cancelled", time: "5h ago" },
];

const statusMeta = {
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Shipped: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const accentBg = {
  orange: "bg-orange-50 text-orange-600",
  teal: "bg-teal-50 text-teal-600",
  navy: "bg-slate-100 text-slate-700",
  slate: "bg-slate-100 text-slate-500",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);

// ==================== MAIN ====================
export default function ResellerOverviewPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)]">
            ◆ Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            Welcome back, Sadia
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[var(--color-ink)]/45">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
          <button
            type="button"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/40"
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-white/20 text-xs transition-transform group-hover:rotate-90">
              +
            </span>
            Add Product
          </button>
        </div>
      </div>

      {/* ============ STATS ============ */}
     {/* ============ STATS ============ */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {STATS.map((s) => (
    <div
      key={s.label}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10"
    >
      {/* Full background gradient tint */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.06] ${
          s.accent === "orange"
            ? "bg-gradient-to-br from-orange-400 to-transparent"
            : s.accent === "teal"
            ? "bg-gradient-to-br from-teal-400 to-transparent"
            : s.accent === "navy"
            ? "bg-gradient-to-br from-slate-500 to-transparent"
            : "bg-gradient-to-br from-slate-400 to-transparent"
        }`}
      />

      {/* Corner glow on hover */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-70 ${
          s.accent === "orange"
            ? "bg-orange-400"
            : s.accent === "teal"
            ? "bg-teal-400"
            : "bg-slate-400"
        }`}
      />

      <div className="relative flex items-start justify-between">
        {/* Icon - bigger with gradient bg */}
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm ${
            s.accent === "orange"
              ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600"
              : s.accent === "teal"
              ? "bg-gradient-to-br from-teal-100 to-teal-200 text-teal-600"
              : s.accent === "navy"
              ? "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700"
              : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500"
          }`}
        >
          {s.icon}
        </div>

        {/* Trend chip */}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
            s.positive
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
              : "bg-red-50 text-red-700 ring-1 ring-red-100"
          }`}
        >
          <svg
            viewBox="0 0 12 12"
            className={`h-2.5 w-2.5 ${s.positive ? "" : "rotate-180"}`}
            fill="currentColor"
          >
            <path d="M6 2l4 5H2z" />
          </svg>
          {s.change}
        </span>
      </div>

      {/* Label + Value */}
      <div className="relative mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
          {s.label}
        </p>
        <p className="mt-1.5 flex items-baseline gap-1">
          {s.currency && (
            <span
              className={`text-lg font-bold ${
                s.accent === "orange"
                  ? "text-orange-500"
                  : s.accent === "teal"
                  ? "text-teal-500"
                  : "text-slate-400"
              }`}
            >
              {s.currency}
            </span>
          )}
          <span className="text-3xl font-bold tabular-nums tracking-tight text-[var(--color-ink)]">
            {s.value}
          </span>
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className={`relative mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--color-line)]`}
      >
        <div
          className={`h-full rounded-full ${
            s.accent === "orange"
              ? "bg-gradient-to-r from-orange-400 to-amber-500"
              : s.accent === "teal"
              ? "bg-gradient-to-r from-teal-400 to-teal-500"
              : "bg-gradient-to-r from-slate-400 to-slate-500"
          }`}
          style={{ width: `${Math.abs(parseFloat(s.change)) * 4}%` }}
        />
      </div>
    </div>
  ))}
</div>

      {/* ============ LINE CHART (Full Width) ============ */}
      <OrdersLineChart />

      {/* ============ BAR + DONUT ============ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SalesBarChart />
        <ProfitDonutChart />
      </div>

      {/* ============ TOP PRODUCTS + ACTIVITY ============ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                Top Products
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
                Best sellers this month
              </p>
            </div>
            <button
              type="button"
              className="cursor-pointer text-xs font-semibold text-[var(--color-brand-orange)] hover:underline"
            >
              View all →
            </button>
          </div>

          <ul className="mt-5 flex flex-col divide-y divide-[var(--color-line)]">
            {TOP_PRODUCTS.map((p, i) => {
              const maxRev = Math.max(...TOP_PRODUCTS.map((x) => x.revenue));
              const pct = (p.revenue / maxRev) * 100;
              return (
                <li key={p.name} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--color-brand-cream)] text-xs font-bold text-[var(--color-ink)]/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                        {p.name}
                      </p>
                      <p className="text-xs tabular-nums text-[var(--color-ink)]/50">
                        {p.sold} sold · {p.margin}% margin
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-[var(--color-ink)]">
                      ৳{fmt(p.revenue)}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Live Activity
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3.5">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {a.name}
                  </p>
                  <p className="truncate text-xs text-[var(--color-ink)]/50">
                    {a.action}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-[var(--color-ink)]/40">
                  {a.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============ RECENT ORDERS TABLE ============ */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] p-5">
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Recent Orders
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
              Latest {RECENT_ORDERS.length} orders
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-semibold text-[var(--color-brand-orange)] hover:underline"
          >
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-[var(--color-brand-cream)]/60">
              <tr>
                {["Order", "Customer", "Product", "Amount", "Status", "Time"].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50 ${
                      h === "Amount" ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {RECENT_ORDERS.map((order) => {
                const meta = statusMeta[order.status];
                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[var(--color-brand-cream)]/40"
                  >
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">
                        {order.id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white">
                          {order.initials}
                        </span>
                        <span className="truncate text-sm font-medium text-[var(--color-ink)]">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="truncate text-sm text-[var(--color-ink)]/70">
                        {order.product}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-bold tabular-nums text-[var(--color-ink)]">
                        ৳{fmt(order.amount)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.bg} ${meta.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-[var(--color-ink)]/50">
                      {order.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}