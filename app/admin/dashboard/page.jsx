"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OrdersChart from "../../component/dashboard/orders-chart";

/* ═══════════════════════════════════════════════════════════
   MOCK DATA — 8 STATS (সব card একই ডিজাইনে)
   ═══════════════════════════════════════════════════════════ */
const stats = [
  { label: "Total revenue", value: "৳48.32L", change: "+12.4%", positive: true, accent: "orange", trend: [12, 18, 15, 22, 28, 24, 32] },
  { label: "Orders today", value: "312", change: "+8.2%", positive: true, accent: "cyan", trend: [8, 12, 10, 15, 14, 18, 22] },
  { label: "Active resellers", value: "148", change: "+4.1%", positive: true, accent: "emerald", trend: [20, 18, 22, 19, 25, 27, 30] },
  { label: "Avg. order value", value: "৳1,548", change: "-2.3%", positive: false, accent: "rose", trend: [20, 18, 22, 19, 15, 17, 14] },
  
  // Row 2
  { label: "Total Users", value: "2,845", change: "+12%", positive: true, accent: "blue", trend: [10, 15, 18, 22, 24, 28, 35] },
  { label: "Pending payouts", value: "৳18.4L", change: "3 req", positive: false, accent: "violet", trend: [10, 12, 14, 16, 18, 20, 22] },
  { label: "Open disputes", value: "2", change: "Action", positive: false, accent: "amber", trend: [4, 3, 5, 4, 3, 2, 2] },
  { label: "KYC pending", value: "3", change: "Review", positive: false, accent: "red", trend: [8, 6, 5, 4, 4, 3, 3] },
];

const pendingAlerts = [
  { type: "KYC", label: "3 KYC pending", desc: "Resellers awaiting verification", icon: "🛡️", tone: "orange", href: "/admin/dashboard/kyc" },
  { type: "Disputes", label: "2 open disputes", desc: "Escrow blocked until resolved", icon: "⚠️", tone: "red", href: "/admin/dashboard/disputes" },
  { type: "Stock", label: "3 low stock items", desc: "Reorder before stock-out", icon: "📦", tone: "amber", href: "/admin/dashboard/inventory" },
  { type: "Payouts", label: "4 payouts to approve", desc: "৳1.2L waiting for release", icon: "💰", tone: "blue", href: "/admin/dashboard/finance" },
];

const activity = [
  { name: "Mahin Chowdhury", action: "placed an order · #A-2291", time: "2m ago", color: "cyan" },
  { name: "Nusrat Jahan", action: "requested a refund · #A-2287", time: "18m ago", color: "orange" },
  { name: "Tanvir Ahmed", action: "upgraded to Pro plan", time: "1h ago", color: "emerald" },
  { name: "Farzana Akter", action: "left a product review", time: "3h ago", color: "violet" },
  { name: "Sadman Rahman", action: "placed an order · #A-2280", time: "5h ago", color: "cyan" },
];

const topProducts = [
  { name: "Wireless Earbuds Pro", sales: 128, revenue: "৳3.13L", growth: "+18%" },
  { name: "Smart Watch S9", sales: 96, revenue: "৳5.65L", growth: "+12%" },
  { name: "USB-C Hub 7-in-1", sales: 74, revenue: "৳1.37L", growth: "+9%" },
  { name: "4K Webcam", sales: 58, revenue: "৳1.86L", growth: "+6%" },
];

const topResellers = [
  { name: "Bilash Traders", revenue: "৳4.82L", orders: 128, growth: "+18%", rating: 4.8 },
  { name: "Nur Enterprise", revenue: "৳2.98L", orders: 89, growth: "+12%", rating: 4.5 },
  { name: "Green Valley Shop", revenue: "৳1.84L", orders: 64, growth: "+8%", rating: 4.6 },
  { name: "Al-Amin Store", revenue: "৳1.28L", orders: 42, growth: "+3%", rating: 4.2 },
];

const stockAlerts = [
  { name: "Wireless Earbuds Pro", sku: "WE-001", qty: 0, threshold: 30, emoji: "🎧" },
  { name: "Mechanical Keyboard RGB", sku: "MK-005", qty: 3, threshold: 10, emoji: "⌨️" },
  { name: "Bluetooth Speaker Mini", sku: "BS-007", qty: 3, threshold: 12, emoji: "🔊" },
];

const quickActions = [
  { label: "Add new product", href: "/admin/dashboard/products/add", icon: "➕", grad: "from-orange-500 to-orange-600" },
  { label: "Review KYC", href: "/admin/dashboard/kyc", icon: "🛡️", grad: "from-emerald-500 to-emerald-600" },
  { label: "Open disputes", href: "/admin/dashboard/disputes", icon: "⚠️", grad: "from-red-500 to-red-600" },
  { label: "Release payout", href: "/admin/dashboard/finance", icon: "💰", grad: "from-blue-500 to-blue-600" },
  { label: "Create coupon", href: "/admin/dashboard/coupons", icon: "🎟️", grad: "from-violet-500 to-violet-600" },
];

const accentMap = {
  orange: { text: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/20", dot: "bg-orange-400" },
  cyan: { text: "text-cyan-500", bg: "bg-cyan-500/10", ring: "ring-cyan-500/20", dot: "bg-cyan-400" },
  rose: { text: "text-rose-500", bg: "bg-rose-500/10", ring: "ring-rose-500/20", dot: "bg-rose-400" },
  emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", dot: "bg-emerald-400" },
  violet: { text: "text-violet-500", bg: "bg-violet-500/10", ring: "ring-violet-500/20", dot: "bg-violet-400" },
  amber: { text: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20", dot: "bg-amber-400" },
  blue: { text: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20", dot: "bg-blue-400" },
  red: { text: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/20", dot: "bg-red-400" },
};

/* ═══════════════════════════════════════════════════════════
   SPARKLINE
   ═══════════════════════════════════════════════════════════ */
function Sparkline({ data, id }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 30;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full sm:h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={areaPoints} fill={`url(#spark-${id})`} stroke="none" />
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIVE CLOCK — Bangladesh Time with seconds
   ═══════════════════════════════════════════════════════════ */
function LiveClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const bdTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setTime(bdTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm sm:px-4 sm:py-2 sm:text-base">
      {/* Watch icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4 shrink-0 text-orange-500 sm:h-5 sm:w-5"
      >
        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Time */}
      <span className="tabular-nums">{time}</span>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
const Page = () => {
  const [dismissed, setDismissed] = useState([]);
  const pendingActions = pendingAlerts.filter((a) => !dismissed.includes(a.type));

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
      
      {/* ===== HEADER ===== */}
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-[11px]">
              Live overview
            </span>
          </div>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Good morning, Rafiul 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">
            Here&apos;s what&apos;s happening with <span className="font-semibold text-slate-700">Bilash</span> today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <LiveClock />
          <button className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:flex-none sm:px-4 sm:text-sm">
            Download report
          </button>
          <Link
            href="/admin/dashboard/products/add"
            className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 text-center text-xs font-semibold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex-none sm:px-4 sm:text-sm"
          >
            + New order
          </Link>
        </div>
      </div>

      {/* ===== NEEDS ATTENTION ===== */}
      {pendingActions.length > 0 && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-500 text-sm text-white">⚠️</span>
              <p className="text-sm font-bold text-orange-900">
                {pendingActions.length} thing{pendingActions.length > 1 ? "s" : ""} need your attention
              </p>
            </div>
            <button
              onClick={() => setDismissed(pendingAlerts.map((a) => a.type))}
              className="cursor-pointer text-xs font-medium text-orange-700 hover:text-orange-900"
            >
              Dismiss all
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {pendingActions.map((a) => {
              const ac = accentMap[a.tone] || accentMap.orange;
              return (
                <Link
                  key={a.type}
                  href={a.href}
                  className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base ${ac.bg}`}>{a.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-800">{a.label}</p>
                    <p className="truncate text-[10px] text-slate-500">{a.desc}</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-orange-500">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== KPI GRID — 2 Rows × 4 Cards (Same Design) ===== */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => {
          const a = accentMap[s.accent];
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
            >
              <div className={`pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full ${a.bg} blur-2xl transition-opacity group-hover:opacity-80`} />
              <div className="relative">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                    {s.label}
                  </p>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${a.bg} ring-1 ring-inset ${a.ring} ${a.text} sm:h-7 sm:w-7`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 sm:h-3.5 sm:w-3.5">
                      {s.positive ? (
                        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </span>
                </div>

                <p className="mt-2.5 text-xl font-bold tabular-nums tracking-tight text-slate-900 sm:mt-3 sm:text-2xl">
                  {s.value}
                </p>

                <div className={`mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold sm:mt-2 sm:text-xs ${s.positive ? "text-emerald-600" : "text-rose-600"}`}>
                  <span>{s.change}</span>
                  <span className="text-slate-400">vs last week</span>
                </div>

                <div className={`mt-2 sm:mt-3 ${a.text}`}>
                  <Sparkline data={s.trend} id={`s-${i}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== CHART + ACTIVITY ===== */}
      <div className="relative grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2"><OrdersChart /></div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Recent activity</h2>
            <Link href="/admin/dashboard/orders" className="cursor-pointer whitespace-nowrap text-[11px] font-medium text-orange-600 hover:text-orange-700 sm:text-xs">View all</Link>
          </div>
          <ul className="mt-3 flex flex-col sm:mt-4">
            {activity.map((a) => {
              const ac = accentMap[a.color];
              return (
                <li key={a.name + a.time} className="flex items-start gap-2.5 border-b border-slate-100 py-2.5 last:border-0 sm:gap-3 sm:py-3">
                  <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + ac.dot} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">{a.name}</p>
                    <p className="truncate text-[11px] text-slate-500 sm:text-xs">{a.action}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400 sm:text-[11px]">{a.time}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ===== TOP PRODUCTS ===== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Top products</h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Best performers this week</p>
          </div>
          <Link href="/admin/dashboard/allproducts" className="cursor-pointer whitespace-nowrap text-[11px] font-medium text-orange-600 hover:text-orange-700 sm:text-xs">View all</Link>
        </div>
        <div className="mt-4 -mx-4 overflow-x-auto sm:mx-0 sm:mt-5">
          <table className="w-full min-w-[520px] text-xs sm:min-w-0 sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                <th className="px-4 pb-3 font-medium sm:px-0 sm:pr-4">#</th>
                <th className="pr-4 pb-3 font-medium">Product</th>
                <th className="pr-4 pb-3 font-medium">Sales</th>
                <th className="pr-4 pb-3 font-medium">Revenue</th>
                <th className="px-4 pb-3 text-right font-medium sm:px-0">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((p, i) => (
                <tr key={p.name} className="group transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3 pr-4 sm:px-0 sm:py-3.5">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 sm:h-7 sm:w-7 sm:text-xs">{i + 1}</span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-800 sm:py-3.5">
                    <span className="block max-w-[140px] truncate sm:max-w-none">{p.name}</span>
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-slate-600 sm:py-3.5">{p.sales}</td>
                  <td className="py-3 pr-4 tabular-nums font-semibold text-slate-800 sm:py-3.5">{p.revenue}</td>
                  <td className="px-4 py-3 text-right sm:px-0 sm:py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:text-[11px]">↑ {p.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== TOP RESELLERS + STOCK ALERTS ===== */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {/* Top Resellers */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Top resellers</h2>
              <p className="mt-0.5 text-xs text-slate-500">Highest revenue this week</p>
            </div>
            <Link href="/admin/dashboard/resellers" className="cursor-pointer text-[11px] font-medium text-orange-600 hover:text-orange-700 sm:text-xs">View all</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {topResellers.map((r) => (
              <li key={r.name} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                  {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">{r.name}</p>
                  <p className="text-[10px] text-slate-500 sm:text-[11px]">
                    {r.orders} orders · <span className="text-amber-500">★</span> {r.rating}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold tabular-nums text-slate-800 sm:text-sm">{r.revenue}</p>
                  <p className={r.growth.startsWith("+") ? "text-[10px] font-semibold text-emerald-600" : "text-[10px] font-semibold text-rose-600"}>{r.growth}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Stock Alerts */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Stock alerts</h2>
              <p className="mt-0.5 text-xs text-slate-500">Running low — reorder soon</p>
            </div>
            <Link href="/admin/dashboard/inventory" className="cursor-pointer text-[11px] font-medium text-orange-600 hover:text-orange-700 sm:text-xs">Go to inventory</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {stockAlerts.map((p) => (
              <li key={p.sku} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold tabular-nums ${p.qty === 0 ? "text-rose-600" : "text-orange-600"}`}>{p.qty}</p>
                    <p className="text-[10px] text-slate-400">of {p.threshold}</p>
                  </div>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${p.qty === 0 ? "bg-rose-500" : "bg-orange-500"}`}
                    style={{ width: `${Math.min((p.qty / p.threshold) * 100, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===== QUICK ACTIONS (Improved Bottom) ===== */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-orange-500/5 blur-3xl" />
        
        <div className="relative">
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">Quick actions</h2>
          <p className="mt-0.5 text-xs text-slate-500">Jump straight to the actions you need most</p>
          
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickActions.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${q.grad} text-xl text-white shadow-md transition-transform group-hover:scale-110`}>
                  {q.icon}
                </span>
                <p className="text-xs font-semibold text-slate-800 sm:text-sm">{q.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Page;