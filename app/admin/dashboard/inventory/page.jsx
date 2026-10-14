"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */
const USE_MOCK = true;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commarse-three.vercel.app";
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");

async function request(path, { method = "GET", body, params } = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params || {}).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json?.data ?? json;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const cx = (...a) => a.filter(Boolean).join(" ");
const H = 3600e3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const n0 = (n) => Math.round(n).toLocaleString("en-IN");
const takaShort = (n = 0) => {
  const v = Math.abs(n);
  if (v >= 1e7) return `৳${(v / 1e7).toFixed(2)}Cr`;
  if (v >= 1e5) return `৳${(v / 1e5).toFixed(2)}L`;
  if (v >= 1e3) return `৳${(v / 1e3).toFixed(1)}K`;
  return `৳${Math.round(v).toLocaleString("en-IN")}`;
};
const hoursFrom = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / H : 0);
const timeAgo = (iso) => {
  if (!iso) return "—";
  const h = hoursFrom(iso);
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
};
const span = (ms) => {
  const h = Math.abs(ms) / H;
  return h < 1 ? `${Math.max(1, Math.round(h * 60))}m` : h < 24 ? `${Math.round(h)}h` : `${Math.round(h / 24)}d`;
};
const initials = (s = "") => s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/* ═══════════════════════════════════════════════════════════
   BUTTON STYLES
   ═══════════════════════════════════════════════════════════ */
const BTN = {
  primary:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
  success:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
  dark:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-neutral-900/20 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
};
const INPUT = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 disabled:opacity-60";

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */
const PATHS = {
  box: "M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5",
  alert: "M12 9v4m0 4h.01M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  building: "M4 21V5l8-2v18M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M3 21h18",
  transfer: "M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 13l4 4L19 7",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  download: "M12 3v12M7 10l5 5 5-5M4 20h16",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  arrowIn: "M12 4v12m0 0l-4-4m4 4l4-4M4 20h16",
  arrowOut: "M12 16V4m0 0l-4 4m4-4l4 4M4 20h16",
  sliders: "M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4",
  spark: "M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
};

const Icon = ({ name, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className} aria-hidden="true">
    <path d={PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   NORMALIZERS
   ═══════════════════════════════════════════════════════════ */
const first = (...v) => v.find((x) => x != null && x !== "");
const num = (...v) => Number(first(...v) ?? 0) || 0;
const str = (...v) => String(first(...v) ?? "");
const arr = (d, ...keys) => (Array.isArray(d) ? d : keys.map((k) => d?.[k]).find(Array.isArray) ?? []);

const normWarehouse = (r) => ({
  id: str(r.id, r.warehouse_id),
  name: str(r.name, "Warehouse"),
  city: str(r.city, r.location, r.address),
  capacity: num(r.capacity),
  active: r.is_active ?? r.active ?? true,
});

function normStock(rows) {
  const map = new Map();
  rows.forEach((r) => {
    const id = str(r.product_id, r.sku_id, r.id, r.sku);
    const cur = map.get(id) ?? {
      id,
      name: str(r.product?.name, r.product_name, r.name, "Product"),
      sku: str(r.sku, r.product?.sku),
      category: str(r.category, r.product?.category),
      image: str(r.image, r.product?.image, r.thumbnail),
      cost: num(r.cost_price, r.product?.cost_price),
      reorder: num(r.reorder_level, r.low_stock_threshold, r.min_stock) || 10,
      daily: num(r.daily_sales, r.avg_daily_sales, r.sales_velocity),
      reserved: 0,
      perWarehouse: [],
    };
    const list = Array.isArray(r.warehouses) ? r.warehouses : r.warehouse_id != null ? [r] : [{ id: "", quantity: r.quantity }];
    list.forEach((w) => cur.perWarehouse.push({ id: str(w.warehouse_id, w.id), qty: num(w.quantity, w.qty, w.on_hand, w.stock) }));
    cur.reserved += num(r.reserved, r.reserved_quantity);
    map.set(id, cur);
  });
  return [...map.values()].map((p) => {
    const onHand = sum(p.perWarehouse, (w) => w.qty);
    const available = onHand - p.reserved;
    return { ...p, onHand, available, status: available <= 0 ? "out" : available <= p.reorder ? "low" : "ok" };
  });
}

const normReservation = (r) => ({
  id: str(r.id, r.reservation_id),
  product: str(r.product?.name, r.product_name, "Product"),
  sku: str(r.sku, r.product?.sku),
  qty: num(r.quantity, r.qty),
  ref: str(r.order_id, r.order?.number, r.reference, r.cart_id),
  at: str(r.created_at, r.reserved_at),
  expiresAt: str(r.expires_at, r.expiry),
});

const normMovement = (r) => {
  const qty = num(r.quantity, r.qty, r.change);
  const t = str(r.type, r.movement_type).toLowerCase();
  const type = /transfer/.test(t) ? "transfer" : /release/.test(t) ? "release" : /reserve/.test(t) ? "reserve" : /adjust/.test(t) ? "adjust" : qty >= 0 ? "in" : "out";
  return {
    id: str(r.id),
    type, qty,
    product: str(r.product?.name, r.product_name, "Product"),
    productId: str(r.product_id, r.product?.id),
    sku: str(r.sku, r.product?.sku),
    from: str(r.from_warehouse?.name, r.from_warehouse),
    to: str(r.to_warehouse?.name, r.to_warehouse),
    warehouse: str(r.warehouse?.name, r.warehouse_name),
    reason: str(r.reason, r.notes, r.note),
    who: str(r.created_by?.name, r.admin_name, r.user?.name, "System"),
    at: str(r.created_at, r.at),
  };
};

/* ═══════════════════════════════════════════════════════════
   MOCK STORE
   ═══════════════════════════════════════════════════════════ */
const ago = (h) => new Date(Date.now() - h * H).toISOString();
const ahead = (h) => new Date(Date.now() + h * H).toISOString();

const db = {
  warehouses: [
    { id: "W1", name: "Dhaka Main", city: "Tejgaon, Dhaka", capacity: 5000, is_active: true },
    { id: "W2", name: "Chattogram Hub", city: "Agrabad, Chattogram", capacity: 2500, is_active: true },
    { id: "W3", name: "Sylhet Store", city: "Zindabazar, Sylhet", capacity: 1200, is_active: true },
    { id: "W4", name: "Old Tejgaon", city: "Closed in 2024", capacity: 800, is_active: false },
  ],
  products: [
    { id: "P1", name: "Wireless Earbuds Pro", sku: "WE-001", category: "Electronics", cost_price: 500, reorder_level: 30, daily_sales: 6.5, reserved: 8, w: { W1: 42, W2: 18, W3: 4 } },
    { id: "P2", name: "Smart Watch Series 3", sku: "SW-003", category: "Electronics", cost_price: 1200, reorder_level: 20, daily_sales: 3, reserved: 4, w: { W1: 11, W2: 6, W3: 0 } },
    { id: "P3", name: "USB-C Hub 7-in-1", sku: "UH-004", category: "Accessories", cost_price: 800, reorder_level: 25, daily_sales: 4, reserved: 6, w: { W1: 120, W2: 64, W3: 30 } },
    { id: "P4", name: "Mechanical Keyboard RGB", sku: "MK-005", category: "Electronics", cost_price: 2200, reorder_level: 10, daily_sales: 1.2, reserved: 2, w: { W1: 3, W2: 2, W3: 0 } },
    { id: "P5", name: "Laptop Stand Aluminum", sku: "LS-006", category: "Accessories", cost_price: 550, reorder_level: 15, daily_sales: 2, reserved: 0, w: { W1: 55, W2: 30, W3: 12 } },
    { id: "P6", name: "Bluetooth Speaker Mini", sku: "BS-007", category: "Electronics", cost_price: 1500, reorder_level: 12, daily_sales: 2.4, reserved: 3, w: { W1: 0, W2: 3, W3: 0 } },
    { id: "P7", name: "Wireless Mouse Silent", sku: "WM-008", category: "Accessories", cost_price: 450, reorder_level: 40, daily_sales: 9, reserved: 12, w: { W1: 140, W2: 70, W3: 25 } },
    { id: "P8", name: "Webcam HD 1080p", sku: "WC-009", category: "Electronics", cost_price: 1800, reorder_level: 10, reserved: 1, w: { W1: 22, W2: 9, W3: 0 } },
    { id: "P9", name: "Desk Lamp LED", sku: "DL-010", category: "Home", cost_price: 800, reorder_level: 20, daily_sales: 1.8, reserved: 0, w: { W1: 14, W2: 0, W3: 0 } },
    { id: "P10", name: "Phone Case Clear", sku: "PC-011", category: "Accessories", cost_price: 120, reorder_level: 50, daily_sales: 14, reserved: 20, w: { W1: 260, W2: 140, W3: 60 } },
  ],
  reservations: [
    { id: "R1", product_id: "P1", quantity: 3, order_id: "A-2296", created_at: ago(2), expires_at: ahead(22) },
    { id: "R2", product_id: "P7", quantity: 5, order_id: "A-2297", created_at: ago(5), expires_at: ahead(19) },
    { id: "R3", product_id: "P6", quantity: 3, order_id: "Cart #8841", created_at: ago(30), expires_at: ago(6) },
    { id: "R4", product_id: "P10", quantity: 12, order_id: "A-2298", created_at: ago(8), expires_at: ahead(1) },
    { id: "R5", product_id: "P2", quantity: 4, order_id: "A-2299", created_at: ago(26), expires_at: ago(2) },
  ],
  movements: [],
};

const pName = (id) => db.products.find((p) => p.id === id);
const whName = (id) => db.warehouses.find((w) => w.id === id)?.name ?? "";
const addMove = (m) => db.movements.unshift({ id: `m${Date.now()}${Math.random()}`, created_at: new Date().toISOString(), created_by: { name: "You" }, ...m });

db.movements.push(
  { id: "m1", type: "RESTOCK", product_id: "P7", quantity: 80, warehouse: { name: "Dhaka Main" }, notes: "Supplier delivery PO-221", created_by: { name: "Rahim" }, created_at: ago(5) },
  { id: "m2", type: "TRANSFER", product_id: "P1", quantity: 10, from_warehouse: { name: "Dhaka Main" }, to_warehouse: { name: "Chattogram Hub" }, notes: "Rebalance", created_by: { name: "Sumaiya" }, created_at: ago(20) },
  { id: "m3", type: "ADJUSTMENT", product_id: "P6", quantity: -2, warehouse: { name: "Dhaka Main" }, notes: "Damaged in storage", created_by: { name: "Rahim" }, created_at: ago(49) },
  { id: "m4", type: "SALE", product_id: "P10", quantity: -6, warehouse: { name: "Dhaka Main" }, notes: "Order A-2290", created_by: null, created_at: ago(51) },
  { id: "m5", type: "RESERVE", product_id: "P1", quantity: 3, warehouse: { name: "Dhaka Main" }, notes: "Order A-2296", created_by: null, created_at: ago(2) },
);
db.movements.forEach((m) => { const p = pName(m.product_id); m.product = { name: p.name, sku: p.sku }; });

const mockStockRows = () =>
  db.products.map((p) => ({
    product_id: p.id, product_name: p.name, sku: p.sku, category: p.category, cost_price: p.cost_price,
    reorder_level: p.reorder_level, daily_sales: p.daily_sales, reserved: p.reserved,
    warehouses: Object.entries(p.w).map(([wid, quantity]) => ({ warehouse_id: wid, quantity })),
  }));

/* ═══════════════════════════════════════════════════════════
   API
   ═══════════════════════════════════════════════════════════ */
async function fetchInventory() {
  if (USE_MOCK) {
    await sleep(400);
    return {
      stock: normStock(mockStockRows()),
      warehouses: db.warehouses.map(normWarehouse),
      reservations: db.reservations.map((r) => normReservation({ ...r, product_name: pName(r.product_id).name, sku: pName(r.product_id).sku })),
      movements: db.movements.map(normMovement),
    };
  }
  const [s, w, r, m] = await Promise.all([
    request("/api/v1/inventory/stock", { params: { limit: 200 } }),
    request("/api/v1/inventory/warehouses"),
    request("/api/v1/inventory/reservations"),
    request("/api/v1/inventory/movements", { params: { limit: 100 } }),
  ]);
  return {
    stock: normStock(arr(s, "items", "stock")),
    warehouses: arr(w, "items", "warehouses").map(normWarehouse),
    reservations: arr(r, "items", "reservations").map(normReservation),
    movements: arr(m, "items", "movements").map(normMovement),
  };
}

const API = {
  async adjust({ productId, warehouseId, delta, reason, note }) {
    if (USE_MOCK) {
      await sleep(500);
      const p = pName(productId);
      p.w[warehouseId] = (p.w[warehouseId] ?? 0) + delta;
      addMove({ type: "ADJUSTMENT", product_id: productId, product: { name: p.name, sku: p.sku }, quantity: delta, warehouse: { name: whName(warehouseId) }, notes: [reason, note].filter(Boolean).join(": ") });
      return;
    }
    return request("/api/v1/inventory/adjust", { method: "POST", body: { product_id: productId, warehouse_id: warehouseId, quantity: delta, reason, notes: note } });
  },
  async transfer({ productId, fromId, toId, qty, note }) {
    if (USE_MOCK) {
      await sleep(600);
      const p = pName(productId);
      p.w[fromId] -= qty;
      p.w[toId] = (p.w[toId] ?? 0) + qty;
      addMove({ type: "TRANSFER", product_id: productId, product: { name: p.name, sku: p.sku }, quantity: qty, from_warehouse: { name: whName(fromId) }, to_warehouse: { name: whName(toId) }, notes: note });
      return;
    }
    return request("/api/v1/inventory/transfer", { method: "POST", body: { product_id: productId, from_warehouse_id: fromId, to_warehouse_id: toId, quantity: qty, notes: note } });
  },
  async release(id) {
    if (USE_MOCK) {
      await sleep(450);
      const r = db.reservations.find((x) => x.id === id);
      const p = pName(r.product_id);
      p.reserved = Math.max(0, p.reserved - r.quantity);
      db.reservations = db.reservations.filter((x) => x.id !== id);
      addMove({ type: "RELEASE", product_id: r.product_id, product: { name: p.name, sku: p.sku }, quantity: r.quantity, notes: `Released ${r.order_id}` });
      return;
    }
    return request(`/api/v1/inventory/reservations/${id}/release`, { method: "PUT" });
  },
  async saveWarehouse(id, body) {
    if (USE_MOCK) {
      await sleep(500);
      if (id) Object.assign(db.warehouses.find((w) => w.id === id), body);
      else db.warehouses.push({ id: `W${Date.now()}`, ...body });
      return;
    }
    return request(id ? `/api/v1/inventory/warehouses/${id}` : "/api/v1/inventory/warehouses", { method: id ? "PUT" : "POST", body });
  },
};

/* ═══════════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════════ */
function Thumb({ p, className = "h-10 w-10 rounded-lg text-xs" }) {
  const [broken, setBroken] = useState(false);
  const tones = ["bg-neutral-900", "bg-neutral-700", "bg-neutral-800", "bg-neutral-600"];
  return (
    <span className={cx("grid shrink-0 place-items-center overflow-hidden font-bold text-white", tones[hash(p.id) % tones.length], className)}>
      {p.image && !broken ? <img src={p.image} alt="" loading="lazy" onError={() => setBroken(true)} className="h-full w-full object-cover" /> : initials(p.name)}
    </span>
  );
}

/* 🎯 Stock alert pills — visual, animated, colorful */
function StockAlert({ status, qty = 0 }) {
  if (status === "out") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-red-500/30">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        Out of stock
      </span>
    );
  }
  if (status === "low") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-orange-500/30">
        <Icon name="alert" className="h-3 w-3" sw={2.5} />
        Low · {qty}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
      <Icon name="check" className="h-3 w-3" sw={3} />
      In stock
    </span>
  );
}

function LevelBar({ p }) {
  const max = Math.max(p.reorder * 3, p.available, 1);
  const pct = Math.max(0, Math.min(100, (p.available / max) * 100));
  const tick = (p.reorder / max) * 100;
  const color = p.status === "out" ? "bg-gradient-to-r from-red-500 to-red-600" : p.status === "low" ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" : "bg-gradient-to-r from-teal-500 to-teal-600";
  return (
    <div className="relative h-2 w-full min-w-[110px] rounded-full bg-neutral-100" title={`Reorder at ${p.reorder}`}>
      <div className={cx("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      <span className="absolute -top-0.5 h-3 w-0.5 rounded bg-neutral-900/60" style={{ left: `${tick}%` }} />
    </div>
  );
}

function SplitBar({ p, whs }) {
  const total = Math.max(p.onHand, 1);
  const colors = ["bg-neutral-900", "bg-teal-600", "bg-orange-500", "bg-blue-500", "bg-neutral-400"];
  return (
    <div className="flex h-2 w-full min-w-[90px] gap-px overflow-hidden rounded-full bg-neutral-100">
      {p.perWarehouse.filter((w) => w.qty > 0).map((w) => {
        const idx = Math.max(0, whs.findIndex((x) => x.id === w.id));
        return <span key={w.id || "x"} className={colors[idx % colors.length]} style={{ width: `${(w.qty / total) * 100}%` }} title={`${whs.find((x) => x.id === w.id)?.name ?? "Unassigned"}: ${w.qty}`} />;
      })}
    </div>
  );
}

/* Empty stock alert — full visual */
function StockOutBanner({ count, lowCount, onClick }) {
  if (count === 0 && lowCount === 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative w-full cursor-pointer overflow-hidden rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg",
        count > 0 ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cx("relative grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-md", count > 0 ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30" : "bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] shadow-orange-500/30")}>
          <Icon name="alert" className="h-6 w-6" sw={2.5} />
          <span className="absolute inset-0 animate-ping rounded-xl bg-white/20" style={{ animationDuration: "2s" }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cx("text-base font-bold", count > 0 ? "text-red-900" : "text-orange-900")}>
            {count > 0 && <>{count} product{count > 1 ? "s" : ""} out of stock</>}
            {count > 0 && lowCount > 0 && " · "}
            {lowCount > 0 && <>{lowCount} running low</>}
          </p>
          <p className={cx("mt-0.5 text-xs", count > 0 ? "text-red-700" : "text-orange-700")}>
            Reorder now — tap to see the list
          </p>
        </div>
        <Icon name="arrowRight" className={cx("h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1", count > 0 ? "text-red-500" : "text-orange-500")} />
      </div>
    </button>
  );
}

const STATUS_TXT = {
  ok: ["In stock", "text-emerald-700"],
  low: ["Low stock", "text-orange-700"],
  out: ["Out", "text-red-700"],
};

function Segmented({ value, onChange, options, label }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex gap-1 rounded-full bg-neutral-100 p-1">
      {options.map(([id, text, count]) => (
        <button key={id} type="button" role="tab" aria-selected={value === id} onClick={() => onChange(id)}
          className={cx("inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all", value === id ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900")}>
          {text}{count != null && <span className={cx("rounded-full px-1.5 text-[10px] tabular-nums font-bold", value === id ? "bg-white/20 text-white" : "text-neutral-400")}>{count}</span>}
        </button>
      ))}
    </div>
  );
}

const Hint = ({ children }) => (
  <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs leading-relaxed text-neutral-600">
    {children}
  </p>
);

const Empty = ({ title, hint }) => (
  <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100 text-2xl">📦</div>
    <p className="mt-3 font-semibold text-neutral-900">{title}</p>
    {hint && <p className="mt-1 text-sm text-neutral-500">{hint}</p>}
  </div>
);

function KPICard({ icon, label, value, sub, gradient, alert, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative overflow-hidden rounded-2xl border bg-white p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg",
        alert ? "border-orange-200" : "border-neutral-200"
      )}
    >
      {alert && (
        <span className="absolute right-4 top-4 flex h-2.5 w-2.5">
          <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-orange-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
        </span>
      )}
      <span className={cx("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md", gradient)}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">{value}</p>
      <p className={cx("mt-0.5 text-xs", alert ? "font-semibold text-orange-600" : "text-neutral-500")}>{sub}</p>
    </button>
  );
}

function Modal({ onClose, busy, width = "max-w-md", label, side, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, busy]);
  return (
    <div className={cx("fixed inset-0 z-[70] flex bg-neutral-900/60 backdrop-blur-sm", side ? "justify-end" : "items-end justify-center sm:items-center sm:p-6")} onClick={() => !busy && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}
        className={cx("w-full overflow-y-auto bg-white shadow-2xl", width, side ? "h-full" : "max-h-[94vh] rounded-t-3xl sm:rounded-3xl")}>
        {children}
      </div>
    </div>
  );
}

const Line = ({ label, value, strong }) => (
  <li className="flex items-baseline gap-2 text-sm">
    <span className="text-neutral-500">{label}</span>
    <span className="min-w-4 flex-1 border-b border-dotted border-neutral-300" />
    <span className={cx("tabular-nums", strong ? "font-bold text-neutral-900" : "font-semibold text-neutral-700")}>{value}</span>
  </li>
);

const ProductHead = ({ p }) => (
  <div className="flex items-center gap-3">
    <Thumb p={p} className="h-12 w-12 rounded-xl text-sm" />
    <div className="min-w-0">
      <p className="truncate font-bold text-neutral-900">{p.name}</p>
      <p className="text-xs text-neutral-500">{p.sku} · {n0(p.available)} available</p>
    </div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <label className="mt-4 block">
    <span className="mb-1.5 flex items-baseline justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
      {label}{hint && <span className="text-xs font-normal normal-case tracking-normal text-neutral-400">{hint}</span>}
    </span>
    {children}
  </label>
);

function DialogActions({ onClose, busy, valid, label, error }) {
  return (
    <>
      {error && <p className="mt-4 flex gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"><Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}</p>}
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} disabled={busy} className={cx(BTN.ghost, "flex-1")}>Cancel</button>
        <button type="submit" disabled={!valid || busy} className={cx(BTN.primary, "flex-[1.4]")}>
          {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}{busy ? "Saving…" : label}
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIALOGS
   ═══════════════════════════════════════════════════════════ */
const REASONS = ["Restock received", "Customer return", "Damaged", "Lost or stolen", "Stock count correction", "Other"];

function AdjustDialog({ p, whs, preset, onClose, onDone }) {
  const active = whs.filter((w) => w.active);
  const qtyAt = (id) => p.perWarehouse.find((x) => x.id === id)?.qty ?? 0;
  const [wid, setWid] = useState(preset?.warehouseId ?? active[0]?.id ?? "");
  const [mode, setMode] = useState(preset?.mode ?? "add");
  const [qty, setQty] = useState(preset?.qty ? String(preset.qty) : "");
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const cur = qtyAt(wid), q = Number(qty);
  const next = mode === "add" ? cur + q : mode === "remove" ? cur - q : q;
  const delta = next - cur;
  const valid = qty !== "" && Number.isInteger(q) && q >= 0 && next >= 0 && delta !== 0 && !!wid;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError(null);
    try {
      await API.adjust({ productId: p.id, warehouseId: wid, delta, reason, note: note.trim() });
      await onDone(`${p.name}: ${delta > 0 ? "+" : ""}${delta} units`);
      onClose();
    } catch (err) { setError(err?.message || "Could not adjust stock"); setBusy(false); }
  };

  return (
    <Modal onClose={onClose} busy={busy} label="Adjust stock">
      <form onSubmit={submit} className="p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
            <Icon name="sliders" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Adjust stock</p>
            <h2 className="mt-0.5 text-base font-bold text-neutral-900">{p.name}</h2>
          </div>
        </div>

        <div className="mt-5">
          <ProductHead p={p} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1 rounded-lg bg-neutral-100 p-1">
          {[["add", "Add", "plus"], ["remove", "Remove", "minus"], ["set", "Set to"]].map(([id, label, icon]) => (
            <button key={id} type="button" onClick={() => setMode(id)} disabled={busy}
              className={cx("inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-all", mode === id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900")}>
              {icon && <Icon name={icon} className="h-3.5 w-3.5" sw={2.5} />}{label}
            </button>
          ))}
        </div>

        <Field label="Warehouse">
          <select value={wid} onChange={(e) => setWid(e.target.value)} disabled={busy} className={cx(INPUT, "cursor-pointer")}>
            {active.map((w) => <option key={w.id} value={w.id}>{w.name} ({n0(qtyAt(w.id))} in stock)</option>)}
          </select>
        </Field>
        <Field label={mode === "set" ? "New quantity" : "Quantity"}>
          <input type="number" min="0" step="1" value={qty} onChange={(e) => setQty(e.target.value)} disabled={busy} placeholder="0" autoFocus className={cx(INPUT, "tabular-nums")} />
        </Field>
        <Field label="Reason">
          <select value={reason} onChange={(e) => setReason(e.target.value)} disabled={busy} className={cx(INPUT, "cursor-pointer")}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Note" hint="optional">
          <input value={note} onChange={(e) => setNote(e.target.value)} disabled={busy} placeholder="e.g. Supplier invoice PO-221" className={INPUT} />
        </Field>

        {qty !== "" && (
          <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-neutral-50 p-4">
            <Line label={whs.find((w) => w.id === wid)?.name ?? "Warehouse"} value={`${n0(cur)} → ${next < 0 ? "?" : n0(next)}`} />
            <Line label="Change" value={`${delta > 0 ? "+" : ""}${delta}`} strong />
          </ul>
        )}
        {next < 0 && qty !== "" && <p className="mt-2 text-xs text-red-600">You can't remove more than the {n0(cur)} units in this warehouse.</p>}

        <DialogActions onClose={onClose} busy={busy} valid={valid} label="Save adjustment" error={error} />
      </form>
    </Modal>
  );
}

function TransferDialog({ p, whs, onClose, onDone }) {
  const qtyAt = (id) => p.perWarehouse.find((x) => x.id === id)?.qty ?? 0;
  const sources = whs.filter((w) => qtyAt(w.id) > 0);
  const [fromId, setFromId] = useState([...sources].sort((a, b) => qtyAt(b.id) - qtyAt(a.id))[0]?.id ?? "");
  const targets = whs.filter((w) => w.active && w.id !== fromId);
  const [toId, setToId] = useState(targets[0]?.id ?? "");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (!targets.find((w) => w.id === toId)) setToId(targets[0]?.id ?? ""); }, [fromId]); // eslint-disable-line

  const max = qtyAt(fromId), q = Number(qty);
  const valid = Number.isInteger(q) && q >= 1 && q <= max && !!toId && toId !== fromId;
  const name = (id) => whs.find((w) => w.id === id)?.name ?? "";

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError(null);
    try {
      await API.transfer({ productId: p.id, fromId, toId, qty: q, note: note.trim() });
      await onDone(`Moved ${q} × ${p.name} to ${name(toId)}`);
      onClose();
    } catch (err) { setError(err?.message || "Could not transfer stock"); setBusy(false); }
  };

  return (
    <Modal onClose={onClose} busy={busy} label="Transfer stock">
      <form onSubmit={submit} className="p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/30">
            <Icon name="transfer" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Transfer stock</p>
            <h2 className="mt-0.5 text-base font-bold text-neutral-900">{p.name}</h2>
          </div>
        </div>

        <div className="mt-5">
          <ProductHead p={p} />
        </div>

        {sources.length === 0 ? (
          <p className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">No warehouse has this product in stock, so there is nothing to move.</p>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Field label="From">
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} disabled={busy} className={cx(INPUT, "cursor-pointer")}>
                  {sources.map((w) => <option key={w.id} value={w.id}>{w.name} ({n0(qtyAt(w.id))})</option>)}
                </select>
              </Field>
              <Field label="To">
                <select value={toId} onChange={(e) => setToId(e.target.value)} disabled={busy} className={cx(INPUT, "cursor-pointer")}>
                  {targets.map((w) => <option key={w.id} value={w.id}>{w.name} ({n0(qtyAt(w.id))})</option>)}
                </select>
              </Field>
            </div>
            <Field label="Quantity" hint={`up to ${n0(max)}`}>
              <div className="flex gap-2">
                <input type="number" min="1" max={max} step="1" value={qty} onChange={(e) => setQty(e.target.value)} disabled={busy} placeholder="0" autoFocus className={cx(INPUT, "tabular-nums")} />
                <button type="button" onClick={() => setQty(String(max))} className={cx(BTN.ghost, "shrink-0")}>Max</button>
              </div>
            </Field>
            <Field label="Note" hint="optional">
              <input value={note} onChange={(e) => setNote(e.target.value)} disabled={busy} placeholder="e.g. Rebalance for weekend sale" className={INPUT} />
            </Field>
            {valid && (
              <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-neutral-50 p-4">
                <Line label={name(fromId)} value={`${n0(max)} → ${n0(max - q)}`} />
                <Line label={name(toId)} value={`${n0(qtyAt(toId))} → ${n0(qtyAt(toId) + q)}`} />
              </ul>
            )}
          </>
        )}
        {q > max && <p className="mt-2 text-xs text-red-600">Only {n0(max)} units available in {name(fromId)}.</p>}

        <DialogActions onClose={onClose} busy={busy} valid={valid} label="Move stock" error={error} />
      </form>
    </Modal>
  );
}

function WarehouseDialog({ w, onClose, onDone }) {
  const [name, setName] = useState(w?.name ?? "");
  const [city, setCity] = useState(w?.city ?? "");
  const [capacity, setCapacity] = useState(w ? String(w.capacity) : "");
  const [active, setActive] = useState(w?.active ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const valid = name.trim() && Number(capacity) > 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError(null);
    try {
      await API.saveWarehouse(w?.id, { name: name.trim(), city: city.trim(), capacity: Number(capacity), is_active: active });
      await onDone(w ? "Warehouse updated" : "Warehouse added");
      onClose();
    } catch (err) { setError(err?.message || "Could not save warehouse"); setBusy(false); }
  };

  return (
    <Modal onClose={onClose} busy={busy} label="Warehouse">
      <form onSubmit={submit} className="p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 text-white shadow-md">
            <Icon name="building" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {w ? "Edit" : "New warehouse"}
            </p>
            <h2 className="mt-0.5 text-base font-bold text-neutral-900">
              {w ? "Update warehouse" : "Add warehouse"}
            </h2>
          </div>
        </div>

        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={busy} placeholder="e.g. Khulna Depot" autoFocus className={INPUT} />
        </Field>
        <Field label="Location">
          <input value={city} onChange={(e) => setCity(e.target.value)} disabled={busy} placeholder="Area, City" className={INPUT} />
        </Field>
        <Field label="Capacity" hint="max units">
          <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} disabled={busy} placeholder="0" className={cx(INPUT, "tabular-nums")} />
        </Field>
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 transition-colors hover:bg-neutral-50">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 cursor-pointer accent-orange-500" />
          <span>
            <span className="block text-sm font-semibold text-neutral-900">Active</span>
            <span className="text-xs text-neutral-500">Inactive warehouses can't receive new stock.</span>
          </span>
        </label>

        <DialogActions onClose={onClose} busy={busy} valid={valid} label={w ? "Save changes" : "Add warehouse"} error={error} />
      </form>
    </Modal>
  );
}

function ReleaseDialog({ r, onClose, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const go = async () => {
    setBusy(true); setError(null);
    try {
      await API.release(r.id);
      await onDone(`${r.qty} × ${r.product} released`);
      onClose();
    } catch (err) { setError(err?.message || "Could not release"); setBusy(false); }
  };
  return (
    <Modal onClose={onClose} busy={busy} label="Release reservation">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md">
            <Icon name="lock" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Release reservation</p>
            <h2 className="mt-0.5 text-base font-bold text-neutral-900">Release this stock?</h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          The {r.qty} units go back to "available" so other customers can buy them. Do this only if the order or cart is no longer active.
        </p>
        <ul className="mt-4 flex flex-col gap-2 rounded-xl bg-neutral-50 p-4">
          <Line label="Product" value={r.product} />
          <Line label="Quantity" value={r.qty} />
          <Line label="Held for" value={r.ref || "—"} />
        </ul>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} disabled={busy} className={cx(BTN.ghost, "flex-1")}>Cancel</button>
          <button type="button" onClick={go} disabled={busy} className={cx(BTN.primary, "flex-[1.4]")}>{busy ? "Releasing…" : "Release stock"}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRODUCT DRAWER
   ═══════════════════════════════════════════════════════════ */
function ProductDrawer({ p, whs, movements, onClose, open }) {
  const maxQ = Math.max(...p.perWarehouse.map((w) => w.qty), 1);
  const daysLeft = p.daily > 0 ? Math.floor(p.available / p.daily) : null;
  const history = movements.filter((m) => (m.productId && m.productId === p.id) || m.sku === p.sku).slice(0, 5);
  const colors = ["bg-neutral-900", "bg-teal-600", "bg-orange-500", "bg-blue-500", "bg-neutral-400"];

  return (
    <Modal onClose={onClose} side width="max-w-md" label={`${p.name} stock`}>
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 p-5">
        <h2 className="text-base font-bold text-neutral-900">Stock details</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-neutral-400 hover:bg-neutral-100">
          <Icon name="x" />
        </button>
      </div>
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          <Thumb p={p} className="h-16 w-16 rounded-2xl text-lg" />
          <div className="min-w-0">
            <p className="font-bold text-neutral-900">{p.name}</p>
            <p className="text-sm text-neutral-500">{p.sku}{p.category && ` · ${p.category}`}</p>
            <div className="mt-1.5"><StockAlert status={p.status} qty={p.available} /></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[["On hand", p.onHand], ["Reserved", p.reserved], ["Available", p.available]].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-neutral-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{l}</p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-neutral-900">{n0(v)}</p>
            </div>
          ))}
        </div>

        <div>
          <LevelBar p={p} />
          <p className="mt-2 text-xs text-neutral-500">
            Reorder level is {p.reorder}.
            {daysLeft != null && <> Selling about {p.daily}/day, so stock lasts roughly <b className="text-neutral-900">{daysLeft} day{daysLeft === 1 ? "" : "s"}</b>.</>}
          </p>
        </div>

        <section>
          <h3 className="text-sm font-bold text-neutral-900">By warehouse</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {p.perWarehouse.length === 0 && <li className="text-sm text-neutral-500">No stock recorded.</li>}
            {whs.map((w, i) => {
              const qty = p.perWarehouse.find((x) => x.id === w.id)?.qty ?? 0;
              if (!w.active && qty === 0) return null;
              return (
                <li key={w.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-neutral-700">
                      {w.name}{!w.active && <span className="ml-1.5 text-xs text-neutral-400">inactive</span>}
                    </span>
                    <span className="font-bold tabular-nums text-neutral-900">{n0(qty)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div className={cx("h-full rounded-full", colors[i % colors.length])} style={{ width: `${(qty / maxQ) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-bold text-neutral-900">Recent movements</h3>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-neutral-500">No movements recorded yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
              {history.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate text-neutral-700">{MOVE_LABEL[m.type]}{m.reason && ` · ${m.reason}`}</span>
                    <span className="text-xs text-neutral-400">{m.who} · {timeAgo(m.at)}</span>
                  </span>
                  <span className={cx("shrink-0 font-bold tabular-nums", m.qty > 0 && m.type !== "reserve" ? "text-emerald-600" : "text-neutral-900")}>
                    {m.qty > 0 ? "+" : ""}{m.qty}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex gap-2">
          <button type="button" onClick={() => open("adjust", p)} className={cx(BTN.primary, "flex-1")}>
            <Icon name="sliders" className="h-4 w-4" /> Adjust
          </button>
          <button type="button" onClick={() => open("transfer", p)} className={cx(BTN.ghost, "flex-1")}>
            <Icon name="transfer" className="h-4 w-4" /> Transfer
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function InventoryPage() {
  const [tab, setTab] = useState("stock");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dlg, setDlg] = useState(null);

  const load = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try { setData(await fetchInventory()); setError(null); }
    catch (e) { setError(e?.message || "Could not load inventory"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const reload = useCallback(() => load(true), [load]);
  const notify = useCallback((m) => toast.success(m), []);
  const done = useCallback(async (m) => { await reload(); notify(m); }, [reload, notify]);

  const fresh = (p) => data?.stock.find((x) => x.id === p?.id) ?? p;
  const open = (kind, payload, preset) => setDlg({ kind, ...(kind === "warehouse" ? { w: payload } : kind === "release" ? { r: payload } : { p: payload }), preset });
  const close = () => setDlg(null);

  const t = useMemo(() => {
    if (!data) return null;
    const need = data.stock.filter((p) => p.status !== "ok");
    const expired = data.reservations.filter((r) => r.expiresAt && new Date(r.expiresAt) < new Date());
    return {
      units: sum(data.stock, (p) => p.onHand),
      value: sum(data.stock, (p) => p.onHand * p.cost),
      need,
      out: data.stock.filter((p) => p.status === "out").length,
      low: data.stock.filter((p) => p.status === "low").length,
      reservedUnits: sum(data.reservations, (r) => r.qty),
      expired: expired.length,
      activeWh: data.warehouses.filter((w) => w.active).length,
    };
  }, [data]);

  return (
    <div className="min-h-screen w-full bg-white">
      <Toaster position="bottom-center" toastOptions={{ className: "!rounded-full !bg-neutral-900 !text-white !text-sm !font-medium !shadow-2xl !border-0", duration: 3000 }} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 sm:p-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="spark" className="h-3.5 w-3.5 text-orange-500" sw={2.5} />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-500">Stock Control</p>
              {USE_MOCK && <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">DEMO</span>}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">Inventory</h1>
            <p className="mt-1 text-sm text-neutral-500">Know what you have, where it is, and what to reorder.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={reload} disabled={refreshing || loading} className={BTN.ghost}>
              <Icon name="refresh" className={cx("h-4 w-4", refreshing && "animate-spin")} /> Refresh
            </button>
            <button type="button" onClick={() => open("warehouse", null)} className={BTN.primary}>
              <Icon name="plus" className="h-4 w-4" /> Add warehouse
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <span className="flex items-center gap-2"><Icon name="alert" /> {error}</span>
            <button type="button" onClick={() => load()} className="cursor-pointer font-semibold underline">Try again</button>
          </div>
        )}

        {loading && !data ? (
          <Skeleton />
        ) : data && (
          <>
            {/* Stock alert banner */}
            <StockOutBanner count={t.out} lowCount={t.low} onClick={() => setTab("alerts")} />

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KPICard icon="box" label="Total SKUs" value={data.stock.length} sub={`${n0(t.units)} units on hand`} gradient="from-blue-500 to-blue-600" onClick={() => setTab("stock")} />
              <KPICard icon="alert" label="Needs restock" value={t.need.length} sub={t.out > 0 ? `${t.out} out of stock` : "nothing running low"} gradient="from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" alert={t.need.length > 0} onClick={() => setTab("alerts")} />
              <KPICard icon="building" label="Warehouses" value={t.activeWh} sub={`${data.warehouses.length} total`} gradient="from-teal-500 to-teal-600" onClick={() => setTab("warehouses")} />
              <KPICard icon="lock" label="Reserved" value={t.reservedUnits} sub={t.expired > 0 ? `${t.expired} expired — release` : `${data.reservations.length} active holds`} gradient="from-violet-500 to-violet-600" alert={t.expired > 0} onClick={() => setTab("reservations")} />
            </div>

            {/* Tab pills */}
            <div className="flex gap-1 overflow-x-auto rounded-full bg-neutral-100 p-1">
              {[
                { id: "stock", label: "Stock", badge: null },
                { id: "alerts", label: "Restock alerts", badge: t.need.length, danger: t.out > 0 },
                { id: "warehouses", label: "Warehouses", badge: null },
                { id: "reservations", label: "Reserved", badge: t.expired > 0 ? t.expired : null, danger: true },
                { id: "movements", label: "Movement log", badge: null },
              ].map((it) => {
                const active = tab === it.id;
                return (
                  <button key={it.id} type="button" onClick={() => setTab(it.id)}
                    className={cx("inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all", active ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900")}>
                    {it.label}
                    {it.badge > 0 && (
                      <span className={cx("rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums", it.danger ? "bg-red-500 text-white" : "bg-orange-500 text-white")}>
                        {it.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className={cx("transition-opacity", refreshing && "opacity-70")}>
              {tab === "stock" && <StockPanel data={data} open={open} />}
              {tab === "alerts" && <AlertsPanel data={data} open={open} />}
              {tab === "warehouses" && <WarehousesPanel data={data} open={open} />}
              {tab === "reservations" && <ReservationsPanel data={data} open={open} />}
              {tab === "movements" && <MovementsPanel data={data} />}
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      {dlg?.kind === "product" && <ProductDrawer p={fresh(dlg.p)} whs={data.warehouses} movements={data.movements} onClose={close} open={open} />}
      {dlg?.kind === "adjust" && <AdjustDialog p={fresh(dlg.p)} whs={data.warehouses} preset={dlg.preset} onClose={close} onDone={done} />}
      {dlg?.kind === "transfer" && <TransferDialog p={fresh(dlg.p)} whs={data.warehouses} onClose={close} onDone={done} />}
      {dlg?.kind === "warehouse" && <WarehouseDialog w={dlg.w} onClose={close} onDone={done} />}
      {dlg?.kind === "release" && <ReleaseDialog r={dlg.r} onClose={close} onDone={done} />}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-24 rounded-2xl bg-neutral-100" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-neutral-100" />)}
      </div>
      <div className="h-12 rounded-full bg-neutral-100" />
      <div className="h-96 rounded-2xl bg-neutral-100" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESTOCK LIST
   ═══════════════════════════════════════════════════════════ */
const suggestQty = (p) => Math.max(p.reorder * 2 - p.available, p.reorder);

function downloadRestockList(list) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = ["product,sku,available,reorder_level,suggested_order_qty", ...list.map((p) => [p.name, p.sku, p.available, p.reorder, suggestQty(p)].map(esc).join(","))];
  const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "restock-list.csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ═══════════════════════════════════════════════════════════
   1. STOCK PANEL
   ═══════════════════════════════════════════════════════════ */
function StockPanel({ data, open }) {
  const [q, setQ] = useState("");
  const [wh, setWh] = useState("all");
  const [status, setStatus] = useState("all");
  const searchRef = useRef(null);
  const colors = ["bg-neutral-900", "bg-teal-600", "bg-orange-500", "bg-blue-500", "bg-neutral-400"];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const rank = { out: 0, low: 1, ok: 2 };
    return data.stock
      .map((p) => (wh === "all" ? p : { ...p, onHand: p.perWarehouse.find((w) => w.id === wh)?.qty ?? 0, available: (p.perWarehouse.find((w) => w.id === wh)?.qty ?? 0) }))
      .filter((p) => (status === "all" || p.status === status) && (!s || `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(s)) && (wh === "all" || p.onHand > 0))
      .sort((a, b) => rank[a.status] - rank[b.status] || a.available / a.reorder - b.available / b.reorder);
  }, [data.stock, q, wh, status]);

  const need = data.stock.filter((p) => p.status !== "ok");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full sm:w-72">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product or SKU  ( / )" className={cx(INPUT, "pl-10")} />
        </label>
        <select value={wh} onChange={(e) => setWh(e.target.value)} aria-label="Warehouse filter" className={cx(INPUT, "w-auto cursor-pointer")}>
          <option value="all">All warehouses</option>
          {data.warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <Segmented label="Status" value={status} onChange={setStatus} options={[["all", "All"], ["low", "Low"], ["out", "Out"]]} />
        <button type="button" onClick={() => downloadRestockList(need)} disabled={need.length === 0} className={cx(BTN.ghost, "ml-auto")}>
          <Icon name="download" className="h-4 w-4" /> Restock list ({need.length})
        </button>
      </div>

      {rows.length === 0 ? (
        <Empty title="No products found" hint="Try a different search or filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-3 py-3">Level</th>
                  <th className="px-3 py-3 text-right">On hand</th>
                  <th className="px-3 py-3 text-right">Reserved</th>
                  <th className="px-3 py-3 text-right">Available</th>
                  <th className="px-3 py-3">Where</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => open("product", p)} className="flex cursor-pointer items-center gap-3 text-left">
                        <Thumb p={p} />
                        <span className="min-w-0">
                          <span className="block max-w-[200px] truncate font-semibold text-neutral-900 hover:text-orange-600">{p.name}</span>
                          <span className="text-xs text-neutral-500">{p.sku}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-3"><LevelBar p={p} /></td>
                    <td className="px-3 py-3 text-right tabular-nums">{n0(p.onHand)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-neutral-500">{n0(p.reserved)}</td>
                    <td className={cx("px-3 py-3 text-right font-bold tabular-nums", p.status === "out" ? "text-red-600" : p.status === "low" ? "text-orange-600" : "text-neutral-900")}>{n0(p.available)}</td>
                    <td className="px-3 py-3"><SplitBar p={data.stock.find((x) => x.id === p.id)} whs={data.warehouses} /></td>
                    <td className="px-3 py-3"><StockAlert status={p.status} qty={p.available} /></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={() => open("adjust", data.stock.find((x) => x.id === p.id))} title="Adjust stock" aria-label={`Adjust ${p.name}`} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900">
                          <Icon name="sliders" className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => open("transfer", data.stock.find((x) => x.id === p.id))} title="Transfer" aria-label={`Transfer ${p.name}`} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900">
                          <Icon name="transfer" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-5 py-3 text-xs text-neutral-500">
            <span>Showing {rows.length} of {data.stock.length} products</span>
            <span className="flex flex-wrap gap-3">
              {data.warehouses.filter((w) => w.active).map((w) => (
                <span key={w.id} className="inline-flex items-center gap-1.5">
                  <span className={cx("h-2 w-2 rounded-full", colors[data.warehouses.indexOf(w) % colors.length])} />
                  {w.name}
                </span>
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. ALERTS PANEL
   ═══════════════════════════════════════════════════════════ */

function AlertsPanel({ data, open }) {
  const list = data.stock
    .filter((p) => p.status !== "ok")
    .sort((a, b) => (a.status === "out" ? 0 : 1) - (b.status === "out" ? 0 : 1) || a.available / a.reorder - b.available / b.reorder);

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100 text-neutral-900">
          <Icon name="check" className="h-6 w-6" sw={2.5} />
        </div>
        <p className="mt-3 font-semibold text-neutral-900">Everything is well stocked</p>
        <p className="mt-1 text-sm text-neutral-500">Products that fall to their reorder level will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Hint>These products are at or below their reorder level. "Available" means on hand minus reserved.</Hint>
        <button type="button" onClick={() => downloadRestockList(list)} className={BTN.primary}>
          <Icon name="download" className="h-4 w-4" /> Restock list ({list.length})
        </button>
      </div>

      <ul className="grid gap-3 lg:grid-cols-2">
        {list.map((p) => {
          const days = p.daily > 0 ? Math.floor(p.available / p.daily) : null;
          const sug = suggestQty(p);
          const isOut = p.status === "out";

          return (
            <li
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300"
            >
              <div className="p-4">
                {/* Header row: thumb + name + tiny status text */}
                <div className="flex items-start gap-3">
                  <Thumb p={p} className="h-11 w-11 rounded-xl text-xs" />
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => open("product", p)}
                      className="block max-w-full cursor-pointer truncate text-left text-sm font-semibold text-neutral-900 hover:text-orange-600"
                    >
                      {p.name}
                    </button>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                      <span className={cx(
                        "inline-block h-1.5 w-1.5 rounded-full",
                        isOut ? "bg-red-500" : "bg-orange-500"
                      )} />
                      <span className="font-medium text-neutral-600">
                        {isOut ? "Out of stock" : "Running low"}
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span>{p.sku}</span>
                    </p>
                  </div>
                </div>

                {/* Metrics row: 3 columns, no bars */}
                <div className="mt-4 grid grid-cols-3 gap-3 border-y border-dashed border-neutral-200 py-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Available
                    </p>
                    <p className={cx(
                      "mt-1 text-xl font-bold tabular-nums",
                      isOut ? "text-red-600" : "text-orange-600"
                    )}>
                      {n0(p.available)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Reorder at
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-neutral-900">
                      {p.reorder}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Lasts
                    </p>
                    <p className="mt-1 text-xl font-bold text-neutral-900">
                      {p.available <= 0 ? "Now" : days != null ? `${days}d` : "—"}
                    </p>
                  </div>
                </div>

                {/* Action row */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-neutral-500">
                    Suggest <span className="font-bold text-neutral-900">{sug} units</span>
                  </p>
                  <div className="flex gap-2">
                    {p.perWarehouse.filter((w) => w.qty > 0).length > 1 && (
                      <button
                        type="button"
                        onClick={() => open("transfer", p)}
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                        title="Transfer from another warehouse"
                      >
                        <Icon name="transfer" className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => open("adjust", p, { mode: "add", qty: sug })}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800"
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" sw={2.5} />
                      Restock
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. WAREHOUSES PANEL
   ═══════════════════════════════════════════════════════════ */
function WarehousesPanel({ data, open }) {
  const colors = ["bg-neutral-900", "bg-teal-600", "bg-orange-500", "bg-blue-500", "bg-neutral-400"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Hint>Warehouses are your physical stock locations. Add new ones or edit capacity as your business grows.</Hint>
        <button type="button" onClick={() => open("warehouse", null)} className={BTN.primary}>
          <Icon name="plus" className="h-4 w-4" /> Add warehouse
        </button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.warehouses.map((w, i) => {
          const units = sum(data.stock, (p) => p.perWarehouse.find((x) => x.id === w.id)?.qty ?? 0);
          const skus = data.stock.filter((p) => (p.perWarehouse.find((x) => x.id === w.id)?.qty ?? 0) > 0).length;
          const pct = w.capacity ? Math.min(100, (units / w.capacity) * 100) : 0;
          const urgent = pct > 90;
          const warn = pct > 75 && !urgent;
          return (
            <li key={w.id} className={cx("overflow-hidden rounded-2xl border-2 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md", w.active ? "border-neutral-200" : "border-neutral-100 opacity-70")}>
              {!w.active && <div className="h-1 bg-neutral-300" />}
              {urgent && <div className="h-1 bg-gradient-to-r from-red-500 to-red-600" />}
              {warn && w.active && <div className="h-1 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" />}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-md", w.active ? colors[i % colors.length] : "bg-neutral-300")}>
                    <Icon name="building" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-neutral-900">{w.name}</p>
                    <p className="truncate text-xs text-neutral-500">{w.city || "No location"}</p>
                  </div>
                  <span className={cx(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                    w.active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200"
                  )}>
                    {w.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Capacity</span>
                    <span className="font-bold tabular-nums text-neutral-900">
                      {n0(units)} <span className="font-normal text-neutral-400">/ {n0(w.capacity)}</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div className={cx("h-full rounded-full transition-all", urgent ? "bg-gradient-to-r from-red-500 to-red-600" : warn ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" : "bg-gradient-to-r from-teal-500 to-teal-600")} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <p className="text-xs text-neutral-500">{skus} products</p>
                    <p className={cx("text-xs font-bold", urgent ? "text-red-600" : warn ? "text-orange-600" : "text-neutral-500")}>
                      {Math.round(pct)}% full
                    </p>
                  </div>
                </div>

                <button type="button" onClick={() => open("warehouse", w)} className={cx(BTN.ghost, "mt-4 w-full")}>
                  <Icon name="edit" className="h-4 w-4" /> Edit warehouse
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. RESERVATIONS PANEL
   ═══════════════════════════════════════════════════════════ */
function ReservationsPanel({ data, open }) {
  const now = Date.now();
  const list = [...data.reservations].sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
  const [filter, setFilter] = useState("all");
  const expired = list.filter((r) => r.expiresAt && new Date(r.expiresAt).getTime() < now);
  const shown = filter === "expired" ? expired : list;

  return (
    <div className="flex flex-col gap-4">
      <Hint>When a customer checks out, their items are held here so nobody else can buy them. If an order or cart is abandoned, release the stock so it can be sold again.</Hint>
      <Segmented label="Reservation filter" value={filter} onChange={setFilter} options={[["all", "All", list.length], ["expired", "Expired", expired.length]]} />

      {shown.length === 0 ? (
        <Empty title={filter === "expired" ? "No expired reservations" : "Nothing is reserved"} />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {shown.map((r) => {
            const end = r.expiresAt ? new Date(r.expiresAt).getTime() : null;
            const isExp = end != null && end < now;
            const soon = end != null && !isExp && end - now < 2 * H;
            return (
              <li key={r.id} className={cx(
                "overflow-hidden rounded-2xl border-2 bg-white transition-all hover:shadow-md",
                isExp ? "border-red-200" : "border-neutral-200"
              )}>
                {isExp && <div className="h-1 bg-gradient-to-r from-red-500 to-red-600" />}
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-md", isExp ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-violet-500 to-violet-600")}>
                    <Icon name="lock" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="truncate font-semibold text-neutral-900">{r.product}</p>
                    <p className="text-xs text-neutral-500">{r.sku && `${r.sku} · `}Held for {r.ref || "an order"} · {timeAgo(r.at)}</p>
                  </div>
                  <p className="text-lg font-bold tabular-nums text-neutral-900">{r.qty} <span className="text-sm font-normal text-neutral-400">units</span></p>
                  <p className={cx("min-w-[120px] text-xs font-bold", isExp ? "text-red-600" : soon ? "text-orange-600" : "text-neutral-500")}>
                    {end == null ? "No expiry" : isExp ? `Expired ${span(now - end)} ago` : `Expires in ${span(end - now)}`}
                  </p>
                  <button type="button" onClick={() => open("release", r)} className={isExp ? BTN.primary : BTN.ghost}>
                    <Icon name="lock" className="h-4 w-4" /> Release
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. MOVEMENTS PANEL
   ═══════════════════════════════════════════════════════════ */
const MOVE_LABEL = { in: "Stock in", out: "Stock out", transfer: "Transfer", adjust: "Adjustment", reserve: "Reserved", release: "Released" };
const MOVE_STYLE = {
  in: ["arrowIn", "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"],
  out: ["arrowOut", "bg-gradient-to-br from-neutral-700 to-neutral-900 text-white"],
  transfer: ["transfer", "bg-gradient-to-br from-blue-500 to-blue-600 text-white"],
  adjust: ["sliders", "bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white"],
  reserve: ["lock", "bg-gradient-to-br from-violet-500 to-violet-600 text-white"],
  release: ["lock", "bg-gradient-to-br from-teal-500 to-teal-600 text-white"],
};

function MovementsPanel({ data }) {
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");
  const rows = data.movements.filter((m) => (type === "all" || m.type === type) && (!q || `${m.product} ${m.sku} ${m.reason}`.toLowerCase().includes(q.trim().toLowerCase())));

  return (
    <div className="flex flex-col gap-4">
      <Hint>A permanent record of every change to your stock: who did it, when, and why. Use it to trace missing or extra units.</Hint>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full sm:w-72">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product or reason" className={cx(INPUT, "pl-10")} />
        </label>
        <Segmented label="Movement type" value={type} onChange={setType} options={[["all", "All"], ["in", "In"], ["out", "Out"], ["transfer", "Transfers"], ["adjust", "Adjustments"]]} />
      </div>

      {rows.length === 0 ? (
        <Empty title="No movements found" />
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {rows.map((m) => {
            const [icon, tone] = MOVE_STYLE[m.type] ?? MOVE_STYLE.adjust;
            const where = m.type === "transfer" ? `${m.from} → ${m.to}` : m.warehouse;
            return (
              <li key={m.id} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-neutral-50">
                <span className={cx("mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-md", tone)}>
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-800">
                    <b className="font-semibold text-neutral-900">{m.product}</b> <span className="text-neutral-500">{m.sku}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    <b>{MOVE_LABEL[m.type]}</b>{where && ` · ${where}`}{m.reason && ` · ${m.reason}`}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">{m.who} · {timeAgo(m.at)}</p>
                </div>
                <p className={cx("shrink-0 text-base font-bold tabular-nums", m.qty > 0 && (m.type === "in" || m.type === "release" || m.type === "adjust") ? "text-emerald-600" : "text-neutral-900")}>
                  {m.qty > 0 && m.type !== "transfer" && m.type !== "reserve" ? "+" : ""}{m.qty}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}