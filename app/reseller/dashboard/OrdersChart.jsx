"use client";

import { useState } from "react";

/* ============================================================
   1. ORDER TREND — Card List with Progress Bars
   ============================================================ */
const ORDER_DATA = [
  { label: "Monday", short: "Mon", value: 12 },
  { label: "Tuesday", short: "Tue", value: 18 },
  { label: "Wednesday", short: "Wed", value: 15 },
  { label: "Thursday", short: "Thu", value: 22 },
  { label: "Friday", short: "Fri", value: 28 },
  { label: "Saturday", short: "Sat", value: 24 },
  { label: "Sunday", short: "Sun", value: 16 },
];

export function OrdersLineChart() {
  const max = Math.max(...ORDER_DATA.map((d) => d.value));
  const total = ORDER_DATA.reduce((s, d) => s + d.value, 0);
  const avg = Math.round(total / ORDER_DATA.length);
  const best = ORDER_DATA.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
            Order Trend
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-[var(--color-ink)]">
            {total} orders
            <span className="ml-2 text-sm font-medium text-[var(--color-ink)]/40">
              this week
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-lg bg-[var(--color-brand-teal)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-brand-teal)]">
            Avg {avg}/day
          </span>
          <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
            Best {best.short}
          </span>
        </div>
      </div>

      {/* List */}
      <ul className="mt-5 flex flex-col gap-2.5">
        {ORDER_DATA.map((d) => {
          const pct = (d.value / max) * 100;
          const isBest = d.value === best.value;
          return (
            <li key={d.label} className="flex items-center gap-3">
              {/* Day name */}
              <span className="w-10 shrink-0 text-[11px] font-semibold text-[var(--color-ink)]/60">
                {d.short}
              </span>

              {/* Bar track */}
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[var(--color-brand-cream)]">
                <div
                  className={`h-full rounded-lg transition-all duration-500 ${
                    isBest
                      ? "bg-gradient-to-r from-orange-400 to-orange-600"
                      : "bg-gradient-to-r from-teal-400 to-teal-500"
                  }`}
                  style={{ width: `${Math.max(pct, 5)}%` }}
                />
              </div>

              {/* Value */}
              <span
                className={`w-8 shrink-0 text-right text-sm font-bold tabular-nums ${
                  isBest ? "text-orange-600" : "text-[var(--color-ink)]"
                }`}
              >
                {d.value}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Footer hint */}
      <p className="mt-4 rounded-lg bg-[var(--color-brand-cream)]/60 px-3 py-2 text-[11px] text-[var(--color-ink)]/55">
        💡 Each bar shows orders on that day. Orange = best day.
      </p>
    </div>
  );
}

/* ============================================================
   2. SALES VOLUME — Card Grid with Big Numbers
   ============================================================ */
const SALES_DATA = {
  week: {
    total: 114,
    unit: "units",
    period: "This week",
    items: [
      { label: "Mon", value: 8 },
      { label: "Tue", value: 12 },
      { label: "Wed", value: 10 },
      { label: "Thu", value: 15 },
      { label: "Fri", value: 22 },
      { label: "Sat", value: 18 },
      { label: "Sun", value: 9 },
    ],
  },
  month: {
    total: 323,
    unit: "units",
    period: "This month",
    items: [
      { label: "Week 1", value: 62 },
      { label: "Week 2", value: 78 },
      { label: "Week 3", value: 95 },
      { label: "Week 4", value: 88 },
    ],
  },
  year: {
    total: 3680,
    unit: "units",
    period: "This year",
    items: [
      { label: "Q1", value: 630 },
      { label: "Q2", value: 820 },
      { label: "Q3", value: 1050 },
      { label: "Q4", value: 1180 },
    ],
  },
};

const SALES_TABS = [
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

export function SalesBarChart() {
  const [tab, setTab] = useState("week");
  const data = SALES_DATA[tab];
  const max = Math.max(...data.items.map((d) => d.value));
  const best = data.items.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
            Sales Volume
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-[var(--color-ink)]">
              {data.total}
            </p>
            <span className="text-sm font-medium text-[var(--color-ink)]/40">
              {data.unit}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
            {data.period} · Best: {best.label}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-0.5 rounded-lg bg-[var(--color-brand-cream)] p-0.5">
        {SALES_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 cursor-pointer rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
              tab === t.id
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div
        className={`mt-5 grid gap-3 ${
          data.items.length > 4 ? "grid-cols-4 sm:grid-cols-7" : "grid-cols-2 sm:grid-cols-4"
        }`}
      >
        {data.items.map((d) => {
          const isBest = d.value === best.value;
          const pct = (d.value / max) * 100;
          return (
            <div
              key={d.label}
              className={`group relative overflow-hidden rounded-xl border p-3 transition-all hover:-translate-y-0.5 ${
                isBest
                  ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
                  : "border-[var(--color-line)] bg-white hover:border-[var(--color-brand-orange)]/30"
              }`}
            >
              {isBest && (
                <span className="absolute right-2 top-2 text-[10px]">🔥</span>
              )}
              <p
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isBest ? "text-orange-600" : "text-[var(--color-ink)]/45"
                }`}
              >
                {d.label}
              </p>
              <p
                className={`mt-1 text-xl font-bold tabular-nums tracking-tight ${
                  isBest ? "text-orange-600" : "text-[var(--color-ink)]"
                }`}
              >
                {d.value}
              </p>
              {/* Mini progress */}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                <div
                  className={`h-full rounded-full ${
                    isBest ? "bg-orange-500" : "bg-[var(--color-brand-teal)]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="mt-4 rounded-lg bg-[var(--color-brand-cream)]/60 px-3 py-2 text-[11px] text-[var(--color-ink)]/55">
        💡 Higher number = more sales. 🔥 marks your best {tab}.
      </p>
    </div>
  );
}

/* ============================================================
   3. DONUT CHART — Profit Breakdown (kept, simple already)
   ============================================================ */
const DONUT_SEGMENTS = [
  { label: "Product Sales", value: 5820, color: "#f97316" },
  { label: "Shipping", value: 1450, color: "#14b8a6" },
  { label: "Referral Bonus", value: 1250, color: "#0f172a" },
  { label: "Other", value: 1130, color: "#94a3b8" },
];

export function ProfitDonutChart() {
  const [active, setActive] = useState(0);
  const R = 70;
  const STROKE = 24;
  const CIRC = 2 * Math.PI * R;
  const total = DONUT_SEGMENTS.reduce((s, d) => s + d.value, 0);

  let cumulative = 0;
  const arcs = DONUT_SEGMENTS.map((seg, i) => {
    const pct = seg.value / total;
    const dash = pct * CIRC;
    const offset = -cumulative * CIRC;
    cumulative += pct;
    return { ...seg, dash, offset, pct, index: i };
  });

  const activeSeg = DONUT_SEGMENTS[active];

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
          Profit Breakdown
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-[var(--color-ink)]">
          ৳{(total / 1000).toFixed(1)}k
          <span className="ml-2 text-sm font-medium text-[var(--color-ink)]/40">
            total profit
          </span>
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
          Where your earnings come from
        </p>
      </div>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative shrink-0">
          <svg viewBox="0 0 200 200" className="h-44 w-44 -rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
            {arcs.map((a) => (
              <circle
                key={a.label}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={active === a.index ? STROKE + 4 : STROKE}
                strokeDasharray={`${a.dash} ${CIRC - a.dash}`}
                strokeDashoffset={a.offset}
                strokeLinecap="butt"
                onMouseEnter={() => setActive(a.index)}
                className="cursor-pointer transition-all duration-300"
                style={{ opacity: active === a.index ? 1 : 0.7 }}
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
              {activeSeg.label}
            </p>
            <p
              className="mt-0.5 text-xl font-bold tabular-nums tracking-tight"
              style={{ color: activeSeg.color }}
            >
              ৳{activeSeg.value.toLocaleString()}
            </p>
            <p className="text-[10px] font-medium text-[var(--color-ink)]/40">
              {((activeSeg.value / total) * 100).toFixed(0)}% of total
            </p>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2.5">
          {arcs.map((a) => (
            <li
              key={a.label}
              onMouseEnter={() => setActive(a.index)}
              className={`cursor-pointer rounded-xl px-3 py-2 transition-all ${
                active === a.index
                  ? "bg-[var(--color-brand-cream)]/70 ring-1 ring-[var(--color-brand-orange)]/20"
                  : "hover:bg-[var(--color-brand-cream)]/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: a.color }} />
                <span className="flex-1 truncate text-xs font-semibold text-[var(--color-ink)]/75">
                  {a.label}
                </span>
                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color: active === a.index ? a.color : "var(--color-ink)" }}
                >
                  ৳{a.value.toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${a.pct * 100}%`,
                      backgroundColor: a.color,
                      opacity: active === a.index ? 1 : 0.6,
                    }}
                  />
                </div>
                <span className="text-[10px] font-semibold tabular-nums text-[var(--color-ink)]/50">
                  {(a.pct * 100).toFixed(0)}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}