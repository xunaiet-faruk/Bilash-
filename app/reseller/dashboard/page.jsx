"use client";

import { useState } from "react";

// ==================== FAKE DATA ====================
const statsData = [
  {
    label: "Total Sales",
    value: "৳ 48,320",
    change: "+12.4%",
    positive: true,
    accent: "var(--color-brand-orange)",
    icon: "💰",
  },
  {
    label: "Total Orders",
    value: "312",
    change: "+8.1%",
    positive: true,
    accent: "var(--color-brand-teal)",
    icon: "📦",
  },
  {
    label: "Total Profit",
    value: "৳ 9,650",
    change: "+15.2%",
    positive: true,
    accent: "var(--color-brand-navy)",
    icon: "📈",
  },
  {
    label: "Products in Catalog",
    value: "84",
    change: "-2.3%",
    positive: false,
    accent: "var(--color-brand-orange-dark)",
    icon: "🛍️",
  },
];

const weeklyOrders = [
  { day: "Mon", value: 8 },
  { day: "Tue", value: 12 },
  { day: "Wed", value: 10 },
  { day: "Thu", value: 15 },
  { day: "Fri", value: 22 },
  { day: "Sat", value: 18 },
  { day: "Sun", value: 9 },
];

const recentOrders = [
  {
    id: "#RS-1024",
    customer: "Mahin Chowdhury",
    product: "Wireless Mouse",
    amount: "৳ 850",
    status: "Delivered",
    time: "5m ago",
  },
  {
    id: "#RS-1023",
    customer: "Nusrat Jahan",
    product: "USB-C Hub",
    amount: "৳ 1,200",
    status: "Pending",
    time: "22m ago",
  },
  {
    id: "#RS-1022",
    customer: "Tanvir Ahmed",
    product: "Mechanical Keyboard",
    amount: "৳ 2,450",
    status: "Shipped",
    time: "1h ago",
  },
  {
    id: "#RS-1021",
    customer: "Farzana Akter",
    product: "Laptop Stand",
    amount: "৳ 700",
    status: "Delivered",
    time: "3h ago",
  },
  {
    id: "#RS-1020",
    customer: "Sadman Rahman",
    product: "Webcam HD",
    amount: "৳ 1,600",
    status: "Cancelled",
    time: "5h ago",
  },
];

const topProducts = [
  { name: "Wireless Mouse", sold: 45, revenue: "৳ 11,250", margin: "18%" },
  { name: "USB-C Hub", sold: 32, revenue: "৳ 12,800", margin: "22%" },
  { name: "Mechanical Keyboard", sold: 28, revenue: "৳ 23,800", margin: "15%" },
  { name: "Laptop Stand", sold: 21, revenue: "৳ 6,300", margin: "25%" },
];

const statusColors = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

// ==================== COMPONENT ====================
export default function ResellerOverviewPage() {
  const [activeTab, setActiveTab] = useState("week");

  const maxOrder = Math.max(...weeklyOrders.map((d) => d.value));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
            Reseller Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-ink)]/50">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button className="rounded-md bg-[var(--color-brand-orange)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-orange-dark)] transition-colors">
            + Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((s) => (
          <div
            key={s.label}
            className="rounded-md border-t-2 bg-white px-5 py-4"
            style={{ borderTopColor: s.accent }}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-[var(--color-ink)]/60">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-ink)]">
              {s.value}
            </p>
            <p
              className="mt-1 text-xs font-medium"
              style={{
                color: s.positive
                  ? "var(--color-brand-teal)"
                  : "var(--color-brand-orange-dark)",
              }}
            >
              {s.change} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-md border border-[var(--color-line)] bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--color-ink)]">
              Orders Overview
            </h2>
            <div className="flex gap-1 rounded-md bg-gray-100 p-1">
              {["week", "month", "year"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white text-[var(--color-ink)] shadow-sm font-medium"
                      : "text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex h-44 items-end gap-3">
            {weeklyOrders.map((d) => (
              <div
                key={d.day}
                className="flex flex-1 flex-col items-center gap-2 group"
              >
                <span className="text-xs font-medium text-[var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.value}
                </span>
                <div
                  className="w-full rounded-sm bg-[var(--color-brand-navy)] hover:bg-[var(--color-brand-orange)] transition-colors"
                  style={{ height: `${(d.value / maxOrder) * 100}%` }}
                />
                <span className="text-xs text-[var(--color-ink)]/50">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-md border border-[var(--color-line)] bg-white p-6">
          <h2 className="text-sm font-medium text-[var(--color-ink)]">
            Top Products
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-[var(--color-line)]">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-brand-cream)] text-xs font-semibold text-[var(--color-ink)]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[var(--color-ink)]">
                    {p.name}
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50">
                    {p.sold} sold · {p.margin} margin
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-[var(--color-ink)]">
                  {p.revenue}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-md border border-[var(--color-line)] bg-white">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-sm font-medium text-[var(--color-ink)]">
            Recent Orders
          </h2>
          <button className="text-xs font-medium text-[var(--color-brand-orange)] hover:underline">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-brand-cream)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-ink)]/60 uppercase tracking-wide">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[var(--color-brand-cream)]/50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm font-medium text-[var(--color-ink)]">
                    {order.id}
                  </td>
                  <td className="px-6 py-3 text-sm text-[var(--color-ink)]">
                    {order.customer}
                  </td>
                  <td className="px-6 py-3 text-sm text-[var(--color-ink)]/70">
                    {order.product}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium tabular-nums text-[var(--color-ink)]">
                    {order.amount}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-[var(--color-ink)]/50">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}