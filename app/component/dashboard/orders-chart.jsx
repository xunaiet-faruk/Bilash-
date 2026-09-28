"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

const WEEK_DATA = [
  { day: "Mon", orders: 38 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 44 },
  { day: "Thu", orders: 61 },
  { day: "Fri", orders: 70 },
  { day: "Sat", orders: 47 },
  { day: "Sun", orders: 30 },
];

const DAY_DATA = [
  { day: "9AM", orders: 4 },
  { day: "12PM", orders: 9 },
  { day: "3PM", orders: 12 },
  { day: "6PM", orders: 15 },
  { day: "9PM", orders: 7 },
];

const MONTH_DATA = [
  { day: "W1", orders: 210 },
  { day: "W2", orders: 268 },
  { day: "W3", orders: 245 },
  { day: "W4", orders: 312 },
];

const DATA_MAP = { D: DAY_DATA, W: WEEK_DATA, M: MONTH_DATA };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 flex items-baseline gap-1">
        <span className="text-lg font-bold tabular-nums text-slate-900">
          {payload[0].value}
        </span>
        <span className="text-[11px] text-slate-500">orders</span>
      </p>
    </div>
  );
}

export default function OrdersChart() {
  const [range, setRange] = useState("W");
  const data = DATA_MAP[range];
  const max = Math.max(...data.map((d) => d.orders));
  const maxPoint = data.find((d) => d.orders === max);
  const total = data.reduce((sum, d) => sum + d.orders, 0);
  const avg = Math.round(total / data.length);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/50 p-4 shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-orange-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/[0.05] blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Orders trend
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <div>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                  {total}
                </p>
                <p className="text-[11px] text-slate-500">total orders</p>
              </div>
              <div className="hidden h-10 w-px bg-slate-200 sm:block" />
              <div className="hidden sm:block">
                <p className="text-lg font-semibold tabular-nums text-slate-700">
                  {avg}
                </p>
                <p className="text-[11px] text-slate-500">daily average</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            {["D", "W", "M"].map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={
                  "cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs " +
                  (range === t
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30"
                    : "text-slate-400 hover:text-slate-700")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-6 h-44 sm:mt-8 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#fb923c" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                strokeOpacity={0.6}
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                width={30}
              />

              <Tooltip
                cursor={{
                  stroke: "#fb923c",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={<CustomTooltip />}
              />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="url(#lineStroke)"
                strokeWidth={2.5}
                fill="url(#areaFill)"
                dot={{
                  r: 4,
                  fill: "#fff",
                  stroke: "#fb923c",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#fb923c",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />

              {maxPoint && (
                <ReferenceDot
                  x={maxPoint.day}
                  y={maxPoint.orders}
                  r={7}
                  fill="#fb923c"
                  stroke="#fff"
                  strokeWidth={3}
                  isFront
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
            <span>
              Peak: <span className="font-semibold text-slate-700">{max} orders</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>
              Trend:{" "}
              <span className="font-semibold text-emerald-600">
                +18.2% vs last week
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}