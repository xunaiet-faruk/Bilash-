"use client";

import { useState, useMemo } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import SendToCourierModal from "../../../component/shipping/SendToCourierModal";

/* ============================================================ */
const ago = (days) => new Date(Date.now() - days * 86400000).toISOString();

const INITIAL_ORDERS = [
  { id: "ORD-2041", customer: { name: "Mahin Chowdhury", initials: "MC", phone: "+880 1712-345678", address: "House 12, Road 5, Dhanmondi, Dhaka 1205" }, products: [{ name: "Wireless Earbuds Pro X", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop", qty: 2, price: 700 }], total: 1400, profit: 280, status: "delivered", payment: "paid", placedAt: ago(0), updatedAt: "Today, 9:30 AM", trackingId: "SP-8829471", courier: "Steadfast" },
  { id: "ORD-2040", customer: { name: "Nusrat Jahan", initials: "NJ", phone: "+880 1712-345679", address: "Flat 3B, Gulshan 2, Dhaka" }, products: [{ name: "Smart Watch Series 3", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop", qty: 1, price: 1200 }], total: 1200, profit: 240, status: "shipped", payment: "paid", placedAt: ago(0.1), updatedAt: "Today, 8:00 AM", trackingId: "SP-8829470", courier: "Steadfast" },
  { id: "ORD-2039", customer: { name: "Tanvir Ahmed", initials: "TA", phone: "+880 1712-345680", address: "House 42, Uttara Sector 7, Dhaka" }, products: [{ name: "Mechanical Keyboard", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop", qty: 1, price: 2450 }, { name: "Wireless Mouse", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop", qty: 1, price: 850 }], total: 3300, profit: 660, status: "packed", payment: "paid", placedAt: ago(1), updatedAt: "Today, 7:45 AM", trackingId: null, courier: "Preparing" },
  { id: "ORD-2038", customer: { name: "Farzana Akter", initials: "FA", phone: "+880 1712-345681", address: "Mirpur 10, Dhaka" }, products: [{ name: "Laptop Stand Aluminum", image: "https://images.unsplash.com/photo-1616353071855-2c045c4458ae?w=200&h=200&fit=crop", qty: 3, price: 700 }], total: 2100, profit: 420, status: "placed", payment: "pending", placedAt: ago(1.2), updatedAt: "Feb 11", trackingId: null, courier: "Not assigned" },
  { id: "ORD-2037", customer: { name: "Sadman Rahman", initials: "SR", phone: "+880 1712-345682", address: "Agrabad, Chittagong" }, products: [{ name: "USB-C Hub 7-in-1", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&h=200&fit=crop", qty: 1, price: 1200 }], total: 1200, profit: 240, status: "cancelled", payment: "refunded", placedAt: ago(3), updatedAt: "Feb 11", trackingId: null, courier: "—" },
  { id: "ORD-2036", customer: { name: "Rifat Hossain", initials: "RH", phone: "+880 1712-345683", address: "Banani, Dhaka" }, products: [{ name: "Bluetooth Speaker Mini", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop", qty: 2, price: 900 }], total: 1800, profit: 360, status: "delivered", payment: "paid", placedAt: ago(4), updatedAt: "Feb 12", trackingId: "SP-8829465", courier: "Pathao" },
  { id: "ORD-2035", customer: { name: "Sadia Islam", initials: "SI", phone: "+880 1712-345684", address: "Bashundhara, Dhaka" }, products: [{ name: "Wireless Earbuds Pro X", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop", qty: 1, price: 700 }], total: 700, profit: 140, status: "delivered", payment: "paid", placedAt: ago(6), updatedAt: "Feb 11", trackingId: "SP-8829460", courier: "Steadfast" },
  { id: "ORD-2034", customer: { name: "Rakib Hasan", initials: "RH", phone: "+880 1712-345685", address: "Mohakhali, Dhaka" }, products: [{ name: "Wireless Mouse", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop", qty: 2, price: 850 }], total: 1700, profit: 340, status: "delivered", payment: "paid", placedAt: ago(9), updatedAt: "Feb 5", trackingId: "SP-8829455", courier: "Steadfast" },
  { id: "ORD-2033", customer: { name: "Mehedi Hasan", initials: "MH", phone: "+880 1712-345686", address: "Sylhet City" }, products: [{ name: "Smart Watch Series 3", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop", qty: 1, price: 1200 }], total: 1200, profit: 240, status: "delivered", payment: "paid", placedAt: ago(11), updatedAt: "Feb 3", trackingId: "SP-8829450", courier: "Pathao" },
  { id: "ORD-2032", customer: { name: "Sumaiya Akter", initials: "SA", phone: "+880 1712-345687", address: "Dhanmondi, Dhaka" }, products: [{ name: "Wireless Earbuds Pro X", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop", qty: 3, price: 700 }], total: 2100, profit: 420, status: "delivered", payment: "paid", placedAt: ago(35), updatedAt: "Jan 15", trackingId: "SP-8829400", courier: "Steadfast" },
  { id: "ORD-2031", customer: { name: "Imran Khan", initials: "IK", phone: "+880 1712-345688", address: "Wari, Dhaka" }, products: [{ name: "Laptop Stand Aluminum", image: "https://images.unsplash.com/photo-1616353071855-2c045c4458ae?w=200&h=200&fit=crop", qty: 2, price: 700 }], total: 1400, profit: 280, status: "delivered", payment: "paid", placedAt: ago(45), updatedAt: "Jan 5", trackingId: "SP-8829390", courier: "Pathao" },
  { id: "ORD-2030", customer: { name: "Nabila Islam", initials: "NI", phone: "+880 1712-345689", address: "Rajshahi City" }, products: [{ name: "Mechanical Keyboard", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop", qty: 1, price: 2450 }], total: 2450, profit: 490, status: "delivered", payment: "paid", placedAt: ago(65), updatedAt: "Dec 15", trackingId: "SP-8829350", courier: "Steadfast" },
  { id: "ORD-2020", customer: { name: "Old Customer", initials: "OC", phone: "+880 1712-345690", address: "Khulna" }, products: [{ name: "Wireless Mouse", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop", qty: 1, price: 850 }], total: 850, profit: 170, status: "delivered", payment: "paid", placedAt: ago(400), updatedAt: "Jan 2025", trackingId: "SP-8820000", courier: "Steadfast" },
];

const STATUS = {
  placed:    { label: "Placed",    dot: "bg-[var(--color-ink)]/40", text: "text-[var(--color-ink)]/70",   bg: "bg-[var(--color-brand-cream)]" },
  packed:    { label: "Packed",    dot: "bg-[var(--color-brand-navy)]", text: "text-[var(--color-brand-navy)]",    bg: "bg-[var(--color-brand-navy)]/5" },
  shipped:   { label: "Shipped",   dot: "bg-[var(--color-brand-orange)]", text: "text-[var(--color-brand-orange-dark)]",   bg: "bg-[var(--color-brand-orange)]/10" },
  delivered: { label: "Delivered", dot: "bg-[var(--color-brand-teal)]", text: "text-[var(--color-brand-teal)]", bg: "bg-[var(--color-brand-teal)]/10" },
  cancelled: { label: "Cancelled", dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50" },
};

const PAYMENT = {
  paid:     { label: "Paid",     cls: "text-[var(--color-brand-teal)]" },
  pending:  { label: "Pending",  cls: "text-[var(--color-brand-orange-dark)]" },
  refunded: { label: "Refunded", cls: "text-[var(--color-ink)]/50" },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "placed", label: "Placed" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);

function getGroupLabel(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return { label: "Today", order: 0, type: "day" };
  if (diffDays === 1) return { label: "Yesterday", order: 1, type: "day" };
  if (diffDays < 7) return { label: d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }), order: diffDays, type: "day" };
  if (diffDays < 28) {
    const w = Math.floor(diffDays / 7);
    return { label: w === 1 ? "Last week" : `${w} weeks ago`, order: diffDays, type: "week" };
  }
  const m = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  if (m < 12) return { label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }), order: diffDays, type: "month" };
  return { label: `${d.getFullYear()}`, order: diffDays, type: "year" };
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState("recent");
  const [detailOrder, setDetailOrder] = useState(null);
  const [courierOrder, setCourierOrder] = useState(null);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    FILTERS.forEach((f) => {
      if (f.id !== "all") c[f.id] = orders.filter((o) => o.status === f.id).length;
    });
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      const hay = `${o.id} ${o.customer.name} ${o.trackingId ?? ""} ${o.products.map((p) => p.name).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
    if (viewMode === "recent") {
      list = list.filter((o) => Math.floor((new Date() - new Date(o.placedAt)) / 86400000) < 30);
    } else if (viewMode === "archived") {
      list = list.filter((o) => Math.floor((new Date() - new Date(o.placedAt)) / 86400000) >= 30);
    }
    return list.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  }, [orders, filter, query, viewMode]);

  const groups = useMemo(() => {
    const g = [];
    const seen = {};
    visible.forEach((o) => {
      const { label, order, type } = getGroupLabel(o.placedAt);
      const key = `${type}-${label}`;
      if (seen[key] === undefined) {
        seen[key] = g.length;
        g.push({ label, order, type, items: [] });
      }
      g[seen[key]].items.push(o);
    });
    return g.sort((a, b) => a.order - b.order);
  }, [visible]);

  // Update order after courier send
  const handleCourierSuccess = (data) => {
    if (!courierOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === courierOrder.id
          ? {
              ...o,
              status: "shipped",
              trackingId: data.trackingId,
              courier: data.courier,
              updatedAt: "Just now",
            }
          : o
      )
    );
    setCourierOrder(null);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* HEADER */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)]">◆ Orders</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">My Orders</h1>
        <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
          {orders.length} total · {orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length} active · {groups.length} groups
        </p>
      </div>

      {/* VIEW MODE */}
      <div className="flex gap-1 rounded-xl border border-[var(--color-line)] bg-white p-1">
        {[
          { id: "recent", label: "Recent", sub: "30 days" },
          { id: "all", label: "All Orders", sub: null },
          { id: "archived", label: "Archived", sub: "30+ days" },
        ].map((v) => {
          const on = viewMode === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setViewMode(v.id)}
              className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                on
                  ? "bg-[var(--color-brand-navy)] text-white shadow-sm"
                  : "text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]"
              }`}
            >
              <span>{v.label}</span>
              {v.sub && (
                <span className={`text-[9px] ${on ? "text-white/60" : "text-[var(--color-ink)]/40"}`}>
                  {v.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/40"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID, customer, or tracking"
            className="w-full rounded-xl border border-[var(--color-line)] bg-white py-3 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  on
                    ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)] text-white shadow-sm"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink)]/60 hover:border-[var(--color-ink)]/40"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                    on ? "bg-white/20" : "bg-[var(--color-brand-cream)]"
                  }`}
                >
                  {counts[f.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ORDERS */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white py-16 text-center">
          <p className="text-3xl">📦</p>
          <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">No orders found</p>
          <p className="mt-1 text-xs text-[var(--color-ink)]/50">
            {query ? "Try a different search." : viewMode === "archived" ? "No archived orders yet." : "Nothing matches this filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <OrderGroup
              key={`${group.type}-${group.label}`}
              group={group}
              expanded={expanded}
              setExpanded={setExpanded}
              onOpenDetails={setDetailOrder}
              onSendCourier={setCourierOrder}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      {detailOrder && (
        <OrderDetailsModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      )}
      {courierOrder && (
        <SendToCourierModal
          order={courierOrder}
          role="reseller"
          onClose={() => setCourierOrder(null)}
          onSuccess={handleCourierSuccess}
        />
      )}
    </div>
  );
}

/* ORDER GROUP */
function OrderGroup({ group, expanded, setExpanded, onOpenDetails, onSendCourier }) {
  const groupTone = {
    day: "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/70",
    week: "bg-[var(--color-brand-navy)]/5 text-[var(--color-brand-navy)]",
    month: "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-dark)]",
    year: "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/60",
  };
  const totalAmount = group.items.reduce((s, o) => s + o.total, 0);
  const totalProfit = group.items.reduce((s, o) => s + o.profit, 0);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${groupTone[group.type]}`}>
          {group.type}
        </span>
        <span className="text-sm font-bold text-[var(--color-ink)]">{group.label}</span>
        <span className="text-xs text-[var(--color-ink)]/45">{group.items.length} orders</span>
        <span className="h-px flex-1 bg-[var(--color-line)]" />
        <span className="text-xs font-semibold tabular-nums text-[var(--color-ink)]/60">
          ৳{new Intl.NumberFormat("en-BD").format(totalAmount)}
        </span>
        <span className="text-xs font-semibold tabular-nums text-[var(--color-brand-teal)]">
          +৳{new Intl.NumberFormat("en-BD").format(totalProfit)}
        </span>
      </div>

      <div className="relative flex flex-col gap-3 pl-6">
        <span className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-gradient-to-b from-[var(--color-line)] via-[var(--color-line)] to-transparent" />
        {group.items.map((order) => (
          <OrderEntry
            key={order.id}
            order={order}
            expanded={expanded === order.id}
            onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
            onViewDetails={() => onOpenDetails(order)}
            onSendCourier={() => onSendCourier(order)}
          />
        ))}
      </div>
    </div>
  );
}

/* ORDER ENTRY */
function OrderEntry({ order, expanded, onToggle, onViewDetails, onSendCourier }) {
  const status = STATUS[order.status];
  const payment = PAYMENT[order.payment];
  const totalQty = order.products.reduce((s, p) => s + p.qty, 0);
  const time = new Date(order.placedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const canSendCourier = order.status === "packed";
  const wasSentToCourier = order.status === "shipped" && order.trackingId;

  return (
    <div className="relative">
      <span className={`absolute -left-6 top-5 h-3.5 w-3.5 rounded-full ring-4 ring-white ${status.dot}`} />

      <div
        className={`group overflow-hidden rounded-2xl border bg-white transition-all ${
          expanded
            ? "border-[var(--color-ink)]/20 shadow-md"
            : "border-[var(--color-line)] hover:border-[var(--color-ink)]/20 hover:shadow-sm"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left"
        >
          <div className="relative h-12 w-12 shrink-0">
            {order.products.slice(0, 2).map((p, i) => (
              <img
                key={i}
                src={p.image}
                alt={p.name}
                className={`absolute h-12 w-12 rounded-xl border-2 border-white object-cover shadow-sm ${
                  i === 0 ? "left-0 top-0" : "left-3 top-2 opacity-75"
                }`}
              />
            ))}
            {totalQty > 1 && (
              <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white ring-2 ring-white">
                {totalQty}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--color-ink)]">{order.id}</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${payment.cls}`}>· {payment.label}</span>
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-[var(--color-ink)]">
              {order.products.map((p) => p.name).join(" + ")}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--color-ink)]/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--color-brand-cream)] text-[8px] font-bold text-[var(--color-ink)]/70">
                  {order.customer.initials}
                </span>
                {order.customer.name}
              </span>
              <span className="text-[var(--color-ink)]/25">•</span>
              <span>{time}</span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-base font-bold tabular-nums text-[var(--color-ink)]">৳{fmt(order.total)}</p>
            <p className="text-[11px] font-semibold tabular-nums text-[var(--color-brand-teal)]">+৳{fmt(order.profit)}</p>
          </div>

          <span className={`shrink-0 text-[var(--color-ink)]/30 transition-transform group-hover:text-[var(--color-ink)]/60 ${expanded ? "rotate-90" : ""}`}>
            ›
          </span>
        </button>

        {expanded && (
          <div className="border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/50 p-4">
            <div className="mb-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">Progress</p>
              <div className="flex items-center gap-1">
                {["placed", "packed", "shipped", "delivered"].map((key, i) => {
                  const stepStatus = STATUS[key];
                  const isDone =
                    STATUS[order.status].label !== "Cancelled" &&
                    ["placed", "packed", "shipped", "delivered"].indexOf(order.status) >= i;
                  const isCurrent = order.status === key;
                  return (
                    <div key={key} className="flex flex-1 items-center gap-1">
                      <div className="flex flex-1 flex-col items-center gap-1">
                        <span
                          className={`grid h-6 w-6 place-items-center rounded-full border-2 text-[10px] font-bold ${
                            isDone
                              ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)] text-white"
                              : isCurrent
                              ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-dark)]"
                              : "border-[var(--color-line)] bg-white text-[var(--color-ink)]/30"
                          }`}
                        >
                          {isDone ? "✓" : i + 1}
                        </span>
                        <span className={`text-[10px] font-semibold ${isDone || isCurrent ? "text-[var(--color-ink)]" : "text-[var(--color-ink)]/40"}`}>
                          {stepStatus.label}
                        </span>
                      </div>
                      {i < 3 && <span className={`h-0.5 flex-1 ${isDone ? "bg-[var(--color-brand-teal)]" : "bg-[var(--color-line)]"}`} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[var(--color-line)] pt-3">
              <Detail label="Customer" value={order.customer.name} />
              <Detail label="Phone" value={order.customer.phone} />
              <Detail label="Courier" value={order.courier} />
              <Detail label="Tracking" value={order.trackingId ?? "Not assigned"} mono />
              <Detail label="Updated" value={order.updatedAt} />
              <Detail label="Items" value={`${totalQty} pieces`} />
            </div>

            <div className="mt-3 border-t border-[var(--color-line)] pt-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
                Items in this order
              </p>
              <div className="flex flex-col gap-1.5">
                {order.products.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white p-2">
                    <img src={p.image} alt={p.name} className="h-8 w-8 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[var(--color-ink)]">{p.name}</p>
                      <p className="text-[10px] text-[var(--color-ink)]/55">
                        Qty {p.qty} × ৳{fmt(p.price)}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs font-bold tabular-nums text-[var(--color-ink)]">
                      ৳{fmt(p.qty * p.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {/* ✅ Send to Courier — only if packed */}
              {canSendCourier && (
                <button
                  type="button"
                  onClick={onSendCourier}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  🚚 Send to Courier
                </button>
              )}

              {/* ✅ Already sent — disabled */}
              {wasSentToCourier && (
                <button
                  type="button"
                  disabled
                  title="This order has already been sent to courier"
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-[var(--color-ink)]/5 px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/40"
                >
                  ✓ Sent to Courier
                </button>
              )}

              <button
                type="button"
                onClick={onViewDetails}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
              >
                View Full Details
              </button>

              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
              >
                📄 Invoice
              </button>

              {order.trackingId && (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
                >
                  🚚 Track
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink)]/55">
        {label}
      </p>
      <p className={`mt-0.5 text-xs font-semibold text-[var(--color-ink)] ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}