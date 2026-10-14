"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   CONFIG 🔧  API ready hole USE_MOCK = false koro
   ============================================================ */
const USE_MOCK = true;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commarse-three.vercel.app";
// 🔸 Tomar auth setup onujayi bodlao (access token 15 min)
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

/* ============================================================
   HELPERS
   ============================================================ */
const cx = (...a) => a.filter(Boolean).join(" ");
const D = 24 * 3600e3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const bdt = (n = 0) => `${n < 0 ? "−" : ""}৳${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
const bdtShort = (n = 0) => {
  const v = Math.abs(n);
  if (v >= 1e7) return `৳${(v / 1e7).toFixed(2)}Cr`;
  if (v >= 1e5) return `৳${(v / 1e5).toFixed(2)}L`;
  return `৳${Math.round(v).toLocaleString("en-IN")}`;
};
const cny = (n = 0) => `¥${Math.round(n).toLocaleString("en-US")}`;
const n0 = (n) => Math.round(n).toLocaleString("en-IN");
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—");
const daysTo = (iso) => Math.round((new Date(iso).getTime() - Date.now()) / D);

const PATHS = {
  ship: "M3 17l1.5 3h15L21 17M5 17V9l7-3 7 3v8M12 6V3M9 12h6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 13l4 4L19 7",
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  download: "M12 3v12M7 10l5 5 5-5M4 20h16",
  alert: "M12 9v4m0 4h.01M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  plane: "M2 14l8-2-3-8 2-1 6 8 6-1c1 0 2 1 1 2s-3 2-4 2l-5 1-4 7-2-1 2-7-9 0z",
  boat: "M3 17l2 3h14l2-3M5 17l1-6h12l1 6M12 11V4l4 3",
  doc: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 13h6M9 17h4",
  calc: "M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01",
  box: "M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5",
  arrow: "M5 12h14M13 6l6 6-6 6",
};
const Icon = ({ name, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className} aria-hidden="true">
    <path d={PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const btnPrimary = "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/35";
const btnGhost = "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink/75 transition-colors hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50";
const inputCls = "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";

/* ============================================================
   DOMAIN
   Batch = ek ta shipment (China theke ek sathe ana mal)
   draft -> ordered -> shipped -> customs -> cleared -> received
   ============================================================ */
const STAGES = [["draft", "Draft"], ["ordered", "Ordered"], ["shipped", "Shipped"], ["customs", "At customs"], ["cleared", "Cleared"], ["received", "Received"]];
const NEXT_LABEL = { draft: "Mark as ordered", ordered: "Mark as shipped", shipped: "Arrived at customs", customs: "Customs cleared", cleared: "Mark as received" };
const STAGE_DATE = { ordered: "orderedAt", shipped: "shippedAt", customs: "customsAt", cleared: "clearedAt", received: "receivedAt" };
const DOCS = [["invoice", "Commercial invoice"], ["packing", "Packing list"], ["bl", "Bill of lading / AWB"], ["origin", "Certificate of origin"], ["permit", "Import permit"]];
const CUSTOMS_STATUS = [["pending", "Not filed"], ["submitted", "Submitted"], ["assessed", "Assessed"], ["cleared", "Cleared"], ["held", "Held by customs"]];
const MODES = [["sea", "Sea"], ["air", "Air"], ["express", "Express"]];

/** Landed cost = China theke ana mal er asol khoroch (BDT). */
function computeCost(b) {
  const c = b.costs;
  const rate = b.rate || 0;
  const items = b.items;
  const goods = sum(items, (i) => i.qty * i.unitCny) * rate;
  const cif = goods + c.freight + c.insurance;
  const duty = (cif * c.dutyPct) / 100;
  const vat = ((cif + duty) * c.vatPct) / 100;
  const ait = (cif * c.aitPct) / 100;
  const shared = c.freight + c.insurance + c.clearing + c.local + c.other;
  const taxes = duty + (c.vatAsCost ? vat : 0) + ait;
  const total = goods + shared + taxes;
  const units = sum(items, (i) => i.qty);
  const totalW = sum(items, (i) => i.qty * i.weightKg);
  const lines = items.map((i) => {
    const value = i.qty * i.unitCny * rate;
    const vShare = goods ? value / goods : 0;
    const wShare = totalW ? (i.qty * i.weightKg) / totalW : vShare;
    const landed = value + shared * (c.allocBy === "weight" ? wShare : vShare) + taxes * vShare;
    return { ...i, value, landed, unit: i.qty ? landed / i.qty : 0 };
  });
  return { goods, duty, vat, ait, total, units, perUnit: units ? total / units : 0, multiplier: goods ? total / goods : 0, lines, shared, taxes };
}

/* ============================================================
   NORMALIZERS
   ⚠ Docs e response body dekha jay nai, field gulo assume kora.
     Docs er Send button diye real response dekhe milaio.
   ============================================================ */
const first = (...v) => v.find((x) => x != null && x !== "");
const num = (...v) => Number(first(...v) ?? 0) || 0;
const str = (...v) => String(first(...v) ?? "");
const arr = (d, ...keys) => (Array.isArray(d) ? d : keys.map((k) => d?.[k]).find(Array.isArray) ?? []);

const BATCH_STATUS = { DRAFT: "draft", ORDERED: "ordered", PLACED: "ordered", SHIPPED: "shipped", IN_TRANSIT: "shipped", CUSTOMS: "customs", AT_CUSTOMS: "customs", CLEARED: "cleared", RECEIVED: "received", DELIVERED: "received", COMPLETED: "received", CANCELLED: "cancelled" };
const CUSTOMS_MAP = { PENDING: "pending", NOT_FILED: "pending", SUBMITTED: "submitted", ASSESSED: "assessed", CLEARED: "cleared", APPROVED: "cleared", HELD: "held", ON_HOLD: "held" };

const normItem = (r) => ({
  id: str(r.id), name: str(r.name, r.product_name, "Item"), sku: str(r.sku),
  qty: num(r.quantity, r.qty), unitCny: num(r.unit_price_cny, r.unit_price, r.price), weightKg: num(r.weight_kg, r.weight), cbm: num(r.cbm),
});

const normDocs = (d = {}) => {
  const src = Array.isArray(d) ? Object.fromEntries(d.map((k) => [k, true])) : d;
  return Object.fromEntries(DOCS.map(([k]) => [k, Object.entries(src).some(([key, v]) => !!v && key.toLowerCase().includes(k === "bl" ? "bl" : k.slice(0, 5)))]));
};

const normBatch = (r) => {
  const c = r.costs ?? r.landed_cost ?? r;
  const cu = r.customs ?? {};
  return {
    id: str(r.id, r.batch_id),
    code: str(r.code, r.batch_number, r.reference, r.id),
    supplier: str(r.supplier?.name, r.supplier_name, r.supplier, "Supplier"),
    origin: str(r.origin, r.origin_city, "China"),
    mode: str(r.mode, r.shipping_mode, "sea").toLowerCase(),
    status: BATCH_STATUS[str(r.status).toUpperCase()] ?? "draft",
    rate: num(r.exchange_rate, c.exchange_rate) || 16.8,
    eta: str(r.eta, r.expected_arrival),
    tracking: str(r.tracking, r.tracking_number, r.container_no),
    notes: str(r.notes),
    createdAt: str(r.created_at), orderedAt: str(r.ordered_at), shippedAt: str(r.shipped_at),
    customsAt: str(r.customs_at), clearedAt: str(r.cleared_at), receivedAt: str(r.received_at),
    items: arr(r.items).map(normItem),
    costs: {
      freight: num(c.freight, c.freight_cost), insurance: num(c.insurance, c.insurance_cost),
      dutyPct: num(c.duty_percent, c.customs_duty_percent), vatPct: num(c.vat_percent) || 0, aitPct: num(c.ait_percent),
      clearing: num(c.clearing_fee, c.port_fees), local: num(c.local_transport), other: num(c.other_costs),
      vatAsCost: true, allocBy: "weight",
    },
    customs: { hs: str(cu.hs_code), ref: str(cu.reference, cu.declaration_no), status: CUSTOMS_MAP[str(cu.status).toUpperCase()] ?? "pending", docs: normDocs(cu.documents ?? cu.docs) },
  };
};

/* ============================================================
   MOCK STORE
   ============================================================ */
const ago = (d) => new Date(Date.now() - d * D).toISOString();
const ahead = (d) => new Date(Date.now() + d * D).toISOString();
const mk = (rows) => rows.map(([name, sku, quantity, price, kg, cbm], i) => ({ id: `i${i}${sku}`, name, sku, quantity, unit_price_cny: price, weight_kg: kg, cbm }));

const db = {
  batches: [
    { id: "B14", code: "CN-2025-014", supplier: "Guangzhou Tech Co.", origin: "Guangzhou", mode: "SEA", status: "SHIPPED", exchange_rate: 16.8, eta: ahead(12), created_at: ago(30), ordered_at: ago(26), shipped_at: ago(9), tracking: "MSKU7741920",
      items: mk([["Wireless Earbuds Pro", "WE-001", 500, 38, 0.12, 0.0004], ["USB-C Hub 7-in-1", "UH-004", 300, 22, 0.2, 0.0006], ["Smart Watch Series 3", "SW-003", 200, 64, 0.15, 0.0005]]),
      costs: { freight: 185000, insurance: 6500, duty_percent: 25, vat_percent: 15, ait_percent: 5, clearing_fee: 42000, local_transport: 12000, other_costs: 5000 },
      customs: { hs_code: "8518.30", status: "PENDING", documents: { invoice: true, packing: true, bl: true } } },
    { id: "B13", code: "CN-2025-013", supplier: "Yiwu Gadget Trading", origin: "Yiwu", mode: "AIR", status: "CUSTOMS", exchange_rate: 16.9, eta: ahead(1), created_at: ago(22), ordered_at: ago(18), shipped_at: ago(6), customs_at: ago(2), tracking: "AWB 176-55120934",
      items: mk([["Mechanical Keyboard RGB", "MK-005", 120, 118, 0.9, 0.004], ["Webcam HD 1080p", "WC-009", 150, 62, 0.18, 0.0008]]),
      costs: { freight: 96000, insurance: 3000, duty_percent: 25, vat_percent: 15, ait_percent: 5, clearing_fee: 18000, local_transport: 6000, other_costs: 0 },
      customs: { hs_code: "8471.60", reference: "C-2025-88213", status: "HELD", documents: { invoice: true, packing: true, bl: true, origin: false } } },
    { id: "B11", code: "CN-2025-011", supplier: "Shenzhen Audio Ltd.", origin: "Shenzhen", mode: "SEA", status: "SHIPPED", exchange_rate: 16.7, eta: ago(4), created_at: ago(52), ordered_at: ago(47), shipped_at: ago(30), tracking: "OOLU2209948",
      items: mk([["Bluetooth Speaker Mini", "BS-007", 400, 54, 0.45, 0.0021]]),
      costs: { freight: 74000, insurance: 2500, duty_percent: 25, vat_percent: 15, ait_percent: 5, clearing_fee: 21000, local_transport: 7000, other_costs: 0 },
      customs: { hs_code: "8518.22", status: "PENDING", documents: { invoice: true, packing: true, bl: true, origin: true } } },
    { id: "B15", code: "CN-2025-015", supplier: "Guangzhou Tech Co.", origin: "Guangzhou", mode: "SEA", status: "ORDERED", exchange_rate: 16.8, eta: ahead(35), created_at: ago(6), ordered_at: ago(3),
      items: mk([["Phone Case Clear", "PC-011", 2000, 4.2, 0.03, 0.0001], ["Laptop Stand Aluminum", "LS-006", 250, 31, 0.7, 0.003]]),
      costs: { freight: 0, insurance: 0, duty_percent: 25, vat_percent: 15, ait_percent: 5, clearing_fee: 0, local_transport: 0, other_costs: 0 }, customs: { status: "PENDING", documents: { invoice: true } } },
    { id: "B16", code: "CN-2025-016", supplier: "Yiwu Gadget Trading", origin: "Yiwu", mode: "EXPRESS", status: "DRAFT", exchange_rate: 16.8, eta: ahead(50), created_at: ago(1), items: [],
      costs: { duty_percent: 25, vat_percent: 15, ait_percent: 5 }, customs: { status: "PENDING" } },
    { id: "B12", code: "CN-2025-012", supplier: "Shenzhen Audio Ltd.", origin: "Shenzhen", mode: "AIR", status: "RECEIVED", exchange_rate: 16.6, eta: ago(20), created_at: ago(60), ordered_at: ago(55), shipped_at: ago(35), customs_at: ago(27), cleared_at: ago(24), received_at: ago(20), tracking: "AWB 176-44099112",
      items: mk([["Wireless Mouse Silent", "WM-008", 600, 19, 0.1, 0.0004], ["Desk Lamp LED", "DL-010", 200, 33, 0.6, 0.002]]),
      costs: { freight: 58000, insurance: 2000, duty_percent: 25, vat_percent: 15, ait_percent: 5, clearing_fee: 14000, local_transport: 5000, other_costs: 0 },
      customs: { hs_code: "8471.60", reference: "C-2025-80127", status: "CLEARED", documents: { invoice: true, packing: true, bl: true, origin: true, permit: true } } },
  ],
};
const find = (id) => db.batches.find((b) => b.id === id);

/* ============================================================
   API  (docs: e-commarse-three.vercel.app/docs  ->  China Sourcing)
   ============================================================ */
const API = {
  /** GET /china-sourcing/batches  +  GET /china-sourcing/customs-declarations */
  async all() {
    if (USE_MOCK) { await sleep(450); return { batches: db.batches.map(normBatch) }; }
    const b = await request("/api/v1/china-sourcing/batches", { params: { limit: 100 } });
    return { batches: arr(b, "items", "batches").map(normBatch) };
  },
  /** GET /china-sourcing/batches/:id  (items + costs shoho full detail) */
  async detail(id) {
    if (USE_MOCK) { await sleep(150); return normBatch(find(id)); }
    return normBatch(await request(`/api/v1/china-sourcing/batches/${id}`));
  },
  /** POST /china-sourcing/batches   body(assumed): { supplier_name, origin, mode, exchange_rate, eta, notes } */
  async create(b) {
    if (USE_MOCK) {
      await sleep(500);
      const id = `B${Date.now()}`;
      db.batches.unshift({ id, code: `CN-2025-${String(17 + db.batches.length - 6).padStart(3, "0")}`, supplier: b.supplier_name, origin: b.origin, mode: b.mode.toUpperCase(), status: "DRAFT", exchange_rate: b.exchange_rate, eta: b.eta, notes: b.notes, created_at: new Date().toISOString(), items: [], costs: { duty_percent: 25, vat_percent: 15, ait_percent: 5 }, customs: { status: "PENDING" } });
      return { id };
    }
    const r = await request("/api/v1/china-sourcing/batches", { method: "POST", body: b });
    return { id: str(r.id, r.batch?.id) };
  },
  /** POST /china-sourcing/batches/:id/items   body(assumed): { name, sku, quantity, unit_price_cny, weight_kg, cbm } */
  async addItem(id, it) {
    if (USE_MOCK) { await sleep(350); find(id).items.push({ id: `i${Date.now()}`, name: it.name, sku: it.sku, quantity: it.quantity, unit_price_cny: it.unit_price_cny, weight_kg: it.weight_kg, cbm: it.cbm }); return; }
    return request(`/api/v1/china-sourcing/batches/${id}/items`, { method: "POST", body: it });
  },
  /** PUT /china-sourcing/batches/:id/status   body(assumed): { status } */
  async setStatus(id, status) {
    if (USE_MOCK) {
      await sleep(450);
      const b = find(id);
      b.status = status.toUpperCase();
      const key = { ordered: "ordered_at", shipped: "shipped_at", customs: "customs_at", cleared: "cleared_at", received: "received_at" }[status];
      if (key) b[key] = new Date().toISOString();
      return;
    }
    return request(`/api/v1/china-sourcing/batches/${id}/status`, { method: "PUT", body: { status: status.toUpperCase() } });
  },
  /** PUT /china-sourcing/batches/:id/landed-cost   body(assumed): { exchange_rate, freight, insurance, duty_percent, vat_percent, ait_percent, clearing_fee, local_transport, other_costs } */
  async saveCost(id, body) {
    if (USE_MOCK) { await sleep(450); const b = find(id); b.exchange_rate = body.exchange_rate; b.costs = { ...b.costs, ...body }; return; }
    return request(`/api/v1/china-sourcing/batches/${id}/landed-cost`, { method: "PUT", body });
  },
  /** PUT /china-sourcing/batches/:id/customs   body(assumed): { hs_code, reference, status, documents } */
  async saveCustoms(id, body) {
    if (USE_MOCK) { await sleep(450); find(id).customs = { hs_code: body.hs_code, reference: body.reference, status: body.status.toUpperCase(), documents: body.documents }; return; }
    return request(`/api/v1/china-sourcing/batches/${id}/customs`, { method: "PUT", body: { ...body, status: body.status.toUpperCase() } });
  },
};

/* ============================================================
   SHARED UI
   ============================================================ */
const STATUS_STYLE = {
  draft: "bg-ink/5 text-ink/60", ordered: "bg-brand-navy/10 text-brand-navy", shipped: "bg-brand-navy/10 text-brand-navy",
  customs: "bg-brand-orange/10 text-brand-orange-dark", cleared: "bg-brand-teal/10 text-brand-teal", received: "bg-brand-teal/10 text-brand-teal", cancelled: "bg-ink/10 text-ink/50",
};
const stageLabel = (s) => (s === "cancelled" ? "Cancelled" : STAGES.find(([k]) => k === s)?.[1] ?? s);
const StatusPill = ({ status }) => <span className={cx("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLE[status])}>{stageLabel(status)}</span>;

function Segmented({ value, onChange, options, label }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex gap-1 rounded-lg bg-ink/5 p-1">
      {options.map(([id, text, count]) => (
        <button key={id} type="button" role="tab" aria-selected={value === id} onClick={() => onChange(id)}
          className={cx("inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-all", value === id ? "bg-white text-brand-navy shadow-sm" : "text-ink/55 hover:text-ink")}>
          {text}{count != null && <span className={cx("text-xs tabular-nums", value === id ? "text-brand-orange-dark" : "text-ink/40")}>{count}</span>}
        </button>
      ))}
    </div>
  );
}
const Hint = ({ children }) => <p className="rounded-xl bg-brand-cream px-4 py-3 text-sm leading-relaxed text-ink/70">{children}</p>;
const Empty = ({ title, hint, action }) => (
  <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
    <p className="text-sm font-semibold text-brand-navy">{title}</p>
    {hint && <p className="mt-1 text-sm text-ink/50">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
const Field = ({ label, hint, children, className }) => (
  <label className={cx("block", className)}>
    <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-brand-navy">{label}{hint && <span className="text-xs font-normal text-ink/45">{hint}</span>}</span>
    {children}
  </label>
);
const Line = ({ label, value, strong, muted }) => (
  <li className="flex items-baseline gap-2 text-sm">
    <span className={muted ? "text-ink/45" : "text-ink/65"}>{label}</span>
    <span className="min-w-4 flex-1 border-b border-dotted border-ink/20" />
    <span className={cx("tabular-nums text-ink", strong ? "text-base font-bold" : "font-semibold")}>{value}</span>
  </li>
);
function Tile({ active, onClick, label, value, sub, alert }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick}
      className={cx("relative cursor-pointer rounded-2xl border bg-white p-4 text-left transition-all", active ? "border-brand-navy shadow-sm" : "border-line hover:border-ink/30")}>
      {alert && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-brand-orange" aria-label="Needs attention" />}
      <p className="text-xs font-medium text-ink/55">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-brand-navy">{value}</p>
      <p className={cx("mt-0.5 text-xs leading-snug", alert ? "font-semibold text-brand-orange-dark" : "text-ink/50")}>{sub}</p>
      {active && <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-t bg-brand-orange" />}
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
    <div className={cx("fixed inset-0 z-[70] flex bg-brand-navy/60 backdrop-blur-[2px]", side ? "justify-end" : "items-end justify-center sm:items-center sm:p-6")} onClick={() => !busy && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}
        className={cx("w-full overflow-y-auto bg-white shadow-2xl", width, side ? "h-full" : "max-h-[94vh] rounded-t-2xl sm:rounded-2xl")}>
        {children}
      </div>
    </div>
  );
}

const ModeIcon = ({ mode, className = "h-3.5 w-3.5" }) => <Icon name={mode === "sea" ? "boat" : "plane"} className={className} />;

/** Stage progress. compact = list er jonno, full = drawer er jonno (date soho) */
function StageBar({ b, compact }) {
  const idx = STAGES.findIndex(([k]) => k === b.status);
  if (b.status === "cancelled") return <p className="text-sm text-ink/50">Cancelled</p>;
  if (compact) {
    return (
      <div>
        <div className="flex gap-1" aria-hidden="true">
          {STAGES.map(([k], i) => <span key={k} className={cx("h-1.5 flex-1 rounded-full", i < idx ? "bg-brand-navy" : i === idx ? "bg-brand-orange" : "bg-ink/10")} />)}
        </div>
        <p className="mt-1.5 text-xs text-ink/55"><span className="font-semibold text-ink">{stageLabel(b.status)}</span> · step {idx + 1} of {STAGES.length}</p>
      </div>
    );
  }
  return (
    <ol className="grid grid-cols-6 gap-1">
      {STAGES.map(([k, label], i) => {
        const date = b[STAGE_DATE[k]] || (k === "draft" ? b.createdAt : "");
        return (
          <li key={k} className="relative flex flex-col items-center text-center">
            {i > 0 && <span className={cx("absolute right-1/2 top-3 h-0.5 w-full", i <= idx ? "bg-brand-navy" : "bg-ink/10")} />}
            <span className={cx("relative z-10 grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold",
              i < idx ? "bg-brand-navy text-white" : i === idx ? "bg-brand-orange text-white ring-4 ring-brand-orange/20" : "bg-ink/10 text-ink/45")}>
              {i < idx ? <Icon name="check" className="h-3 w-3" sw={3.5} /> : i + 1}
            </span>
            <span className={cx("mt-2 text-[11px] font-semibold leading-tight", i === idx ? "text-ink" : "text-ink/55")}>{label}</span>
            <span className="text-[10px] text-ink/40">{i <= idx && date ? fmtDate(date) : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}

function etaText(b) {
  if (b.status === "received") return { text: `Received ${fmtDate(b.receivedAt)}`, late: false };
  if (b.status === "cancelled") return { text: "Cancelled", late: false };
  if (!b.eta) return { text: "No ETA", late: false };
  const d = daysTo(b.eta);
  if (d < 0) return { text: `Delayed ${-d}d (was ${fmtDate(b.eta)})`, late: true };
  return { text: d === 0 ? "Arrives today" : `Arrives in ${d}d · ${fmtDate(b.eta)}`, late: false };
}

/* ============================================================
   PAGE
   ============================================================ */
export default function ChinaSourcingPage() {
  const [tab, setTab] = useState("batches");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const load = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try { setData(await API.all()); setError(null); }
    catch (e) { setError(e?.message || "Could not load batches"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const reload = useCallback(() => load(true), [load]);
  const notify = useCallback((m) => { clearTimeout(timer.current); setToast(m); timer.current = setTimeout(() => setToast(null), 3200); }, []);

  const t = useMemo(() => {
    if (!data) return null;
    const live = data.batches.filter((b) => !["received", "cancelled"].includes(b.status));
    const atCustoms = data.batches.filter((b) => b.status === "customs");
    const late = live.filter((b) => b.eta && daysTo(b.eta) < 0 && b.status !== "draft");
    const docsMissing = data.batches.filter((b) => !["draft", "received", "cancelled"].includes(b.status) && Object.values(b.customs.docs).some((v) => !v)).length;
    const held = data.batches.filter((b) => b.customs.status === "held").length;
    return { live, atCustoms, late, docsMissing, held, openValue: sum(live, (b) => computeCost(b).total) };
  }, [data]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-brand-orange">China sourcing</p>
            {USE_MOCK && <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold text-brand-orange-dark">Demo data</span>}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">Import batches</h1>
          <p className="mt-1 text-sm text-ink/60">Track goods coming from China, from factory order to your warehouse, with the real cost of each unit.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={reload} disabled={refreshing || loading} className={btnGhost}><Icon name="refresh" className={cx("h-4 w-4", refreshing && "animate-spin")} /> Refresh</button>
          <button type="button" onClick={() => setCreating(true)} className={btnPrimary}><Icon name="plus" /> New batch</button>
        </div>
      </header>

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <span className="flex items-center gap-2"><Icon name="alert" /> {error}</span>
          <button type="button" onClick={() => load()} className="cursor-pointer font-semibold underline">Try again</button>
        </div>
      )}

      {loading && !data ? (
        <div className="flex animate-pulse flex-col gap-6" aria-busy="true">
          <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-ink/5" />)}</div>
          <div className="h-80 rounded-2xl bg-ink/5" />
        </div>
      ) : data && (
        <>
          <div role="tablist" aria-label="Sections" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Tile active={tab === "batches"} onClick={() => setTab("batches")} label="Batches" value={`${t.live.length} on the way`}
              sub={t.late.length ? `${t.late.length} delayed · ${bdtShort(t.openValue)} in progress` : `${bdtShort(t.openValue)} in progress`} alert={t.late.length > 0} />
            <Tile active={tab === "customs"} onClick={() => setTab("customs")} label="Customs" value={`${t.atCustoms.length} at customs`}
              sub={t.held ? `${t.held} held by customs` : t.docsMissing ? `${t.docsMissing} missing documents` : "No problems"} alert={t.held > 0} />
            <Tile active={tab === "calculator"} onClick={() => setTab("calculator")} label="Cost calculator" value="Plan a purchase" sub="Know your real cost per unit before you order" />
          </div>

          <div role="tabpanel" className={cx("transition-opacity", refreshing && "opacity-70")}>
            {tab === "batches" && <BatchesPanel data={data} onOpen={setOpenId} onNew={() => setCreating(true)} />}
            {tab === "customs" && <CustomsPanel data={data} onOpen={setOpenId} />}
            {tab === "calculator" && <CalculatorPanel />}
          </div>
        </>
      )}

      {openId && data && (
        <BatchDrawer key={openId} id={openId} listBatch={data.batches.find((b) => b.id === openId)} reload={reload} notify={notify} onClose={() => setOpenId(null)} />
      )}
      {creating && <NewBatchDialog onClose={() => setCreating(false)} onCreated={async (id) => { await reload(); notify("Batch created. Add items next."); setOpenId(id); }} />}

      <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[80] -translate-x-1/2">
        {toast && <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-brand-navy px-5 py-2.5 text-sm text-white shadow-2xl"><Icon name="check" className="h-4 w-4 text-brand-teal" sw={3} /> {toast}</div>}
      </div>
    </div>
  );
}

/* ============================================================
   1. BATCHES
   ============================================================ */
function BatchesPanel({ data, onOpen, onNew }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("active");
  const isActive = (b) => !["received", "cancelled"].includes(b.status);
  const counts = { active: data.batches.filter(isActive).length, customs: data.batches.filter((b) => b.status === "customs").length, received: data.batches.filter((b) => b.status === "received").length, all: data.batches.length };

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.batches
      .filter((b) => (f === "all" ? true : f === "active" ? isActive(b) : f === "customs" ? b.status === "customs" : b.status === "received"))
      .filter((b) => !s || `${b.code} ${b.supplier} ${b.tracking} ${b.origin}`.toLowerCase().includes(s))
      .sort((a, b) => (a.eta && b.eta ? new Date(a.eta) - new Date(b.eta) : 0));
  }, [data.batches, q, f]);

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = ["code,supplier,mode,status,eta,units,total_landed_bdt", ...rows.map((b) => { const c = computeCost(b); return [b.code, b.supplier, b.mode, b.status, b.eta?.slice(0, 10), c.units, Math.round(c.total)].map(esc).join(","); })];
    const url = URL.createObjectURL(new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "china-batches.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full sm:w-72">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search batch, supplier or tracking" className={cx(inputCls, "pl-9")} />
        </label>
        <Segmented label="Batch filter" value={f} onChange={setF} options={[["active", "On the way", counts.active], ["customs", "At customs", counts.customs], ["received", "Received", counts.received], ["all", "All", counts.all]]} />
        <button type="button" onClick={exportCsv} className={cx(btnGhost, "ml-auto")}><Icon name="download" /> Export</button>
      </div>

      {rows.length === 0 ? (
        <Empty title="No batches here" hint="A batch is one shipment of goods you order from a China supplier." action={<button type="button" onClick={onNew} className={btnPrimary}><Icon name="plus" /> Create first batch</button>} />
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((b) => {
            const c = computeCost(b);
            const eta = etaText(b);
            return (
              <li key={b.id}>
                <button type="button" onClick={() => onOpen(b.id)} className="grid w-full cursor-pointer gap-x-6 gap-y-4 rounded-2xl border border-line bg-white p-4 text-left transition-shadow hover:shadow-md sm:p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-brand-navy">{b.code}</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-ink/5 px-1.5 py-0.5 text-xs font-medium text-ink/60"><ModeIcon mode={b.mode} /> {b.mode}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-ink">{b.supplier}</p>
                    <p className="text-xs text-ink/50">{b.origin} → Dhaka{b.tracking && ` · ${b.tracking}`}</p>
                  </div>

                  <div>
                    <StageBar b={b} compact />
                    <p className={cx("mt-2 inline-flex items-center gap-1 text-xs", eta.late ? "font-semibold text-brand-orange-dark" : "text-ink/55")}>
                      {eta.late && <Icon name="clock" className="h-3 w-3" />}{eta.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:justify-end">
                    <div className="lg:text-right">
                      <p className="text-xs text-ink/50">{n0(c.units)} units · {b.items.length} items</p>
                      <p className="text-lg font-bold tabular-nums text-ink">{c.units ? bdt(c.total) : "—"}</p>
                      {c.units > 0 && <p className="text-xs text-ink/50">{bdt(c.perUnit)} per unit landed</p>}
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
   NEW BATCH
   ============================================================ */
function NewBatchDialog({ onClose, onCreated }) {
  const [supplier, setSupplier] = useState("");
  const [origin, setOrigin] = useState("Guangzhou");
  const [mode, setMode] = useState("sea");
  const [rate, setRate] = useState("16.8");
  const [eta, setEta] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const valid = supplier.trim() && Number(rate) > 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError(null);
    try {
      const { id } = await API.create({ supplier_name: supplier.trim(), origin, mode, exchange_rate: Number(rate), eta: eta ? new Date(eta).toISOString() : null, notes: notes.trim() });
      onClose(); await onCreated(id);
    } catch (err) { setError(err?.message || "Could not create batch"); setBusy(false); }
  };

  return (
    <Modal onClose={onClose} busy={busy} label="New batch">
      <form onSubmit={submit} className="p-6">
        <h2 className="text-lg font-bold text-brand-navy">New import batch</h2>
        <p className="mt-1 text-sm text-ink/60">One batch = one shipment. You'll add the items after creating it.</p>
        <div className="mt-5 flex flex-col gap-4">
          <Field label="Supplier"><input value={supplier} onChange={(e) => setSupplier(e.target.value)} disabled={busy} autoFocus placeholder="e.g. Guangzhou Tech Co." className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Shipping from"><select value={origin} onChange={(e) => setOrigin(e.target.value)} disabled={busy} className={cx(inputCls, "cursor-pointer")}>{["Guangzhou", "Shenzhen", "Yiwu", "Shanghai", "Other"].map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Expected arrival"><input type="date" value={eta} onChange={(e) => setEta(e.target.value)} disabled={busy} className={inputCls} /></Field>
          </div>
          <div><span className="mb-1.5 block text-sm font-semibold text-brand-navy">Shipping mode</span><Segmented label="Mode" value={mode} onChange={setMode} options={MODES} /></div>
          <Field label="Exchange rate" hint="1 CNY = ? BDT"><input type="number" step="0.01" min="0" value={rate} onChange={(e) => setRate(e.target.value)} disabled={busy} className={cx(inputCls, "tabular-nums")} /></Field>
          <Field label="Notes" hint="optional"><input value={notes} onChange={(e) => setNotes(e.target.value)} disabled={busy} placeholder="e.g. Eid stock, rush order" className={inputCls} /></Field>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} disabled={busy} className={cx(btnGhost, "flex-1")}>Cancel</button>
          <button type="submit" disabled={!valid || busy} className={cx(btnPrimary, "flex-[1.4]")}>{busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}{busy ? "Creating…" : "Create batch"}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================================================
   BATCH DRAWER  (Overview / Items / Costs / Customs)
   ============================================================ */
function BatchDrawer({ id, listBatch, reload, notify, onClose }) {
  const [full, setFull] = useState(null);
  const [tab, setTab] = useState("overview");
  const b = full ?? listBatch;

  const refresh = useCallback(async () => {
    try { setFull(await API.detail(id)); } catch {}
    await reload();
  }, [id, reload]);
  useEffect(() => { API.detail(id).then(setFull).catch(() => {}); }, [id]);

  if (!b) return null;
  const c = computeCost(b);
  const TABS = [["overview", "Overview"], ["items", `Items (${b.items.length})`], ["costs", "Costs"], ["customs", "Customs"]];

  return (
    <Modal onClose={onClose} side width="max-w-2xl" label={`Batch ${b.code}`}>
      <div className="sticky top-0 z-10 border-b border-line bg-white px-6 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h2 className="font-mono text-lg font-bold text-brand-navy">{b.code}</h2><StatusPill status={b.status} /></div>
            <p className="mt-0.5 truncate text-sm text-ink/55">{b.supplier} · {b.origin} → Dhaka · <span className="capitalize">{b.mode}</span></p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-ink/55 hover:bg-ink/5"><Icon name="x" /></button>
        </div>
        <div role="tablist" className="mt-3 flex gap-1">
          {TABS.map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={cx("-mb-px cursor-pointer border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors", tab === k ? "border-brand-orange text-brand-navy" : "border-transparent text-ink/55 hover:text-ink")}>{label}</button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {tab === "overview" && <OverviewTab b={b} c={c} refresh={refresh} notify={notify} />}
        {tab === "items" && <ItemsTab b={b} c={c} refresh={refresh} notify={notify} />}
        {tab === "costs" && <CostsTab b={b} refresh={refresh} notify={notify} />}
        {tab === "customs" && <CustomsTab b={b} refresh={refresh} notify={notify} />}
      </div>
    </Modal>
  );
}

function useSave(refresh, notify) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const run = async (fn, msg) => {
    setBusy(true); setError(null);
    try { await fn(); await refresh(); notify(msg); }
    catch (e) { setError(e?.message || "Something went wrong"); }
    finally { setBusy(false); }
  };
  return { busy, error, run };
}
const ErrorLine = ({ children }) => children ? <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{children}</p> : null;

function OverviewTab({ b, c, refresh, notify }) {
  const { busy, error, run } = useSave(refresh, notify);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const idx = STAGES.findIndex(([k]) => k === b.status);
  const next = STAGES[idx + 1]?.[0];
  const eta = etaText(b);

  return (
    <div className="flex flex-col gap-6">
      <StageBar b={b} />

      {next && b.status !== "cancelled" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-cream px-4 py-3">
          <p className="text-sm text-ink/70">Next step: <span className="font-semibold text-ink">{stageLabel(next)}</span>{b.status === "draft" && b.items.length === 0 && <span className="text-brand-orange-dark"> · add items first</span>}</p>
          <button type="button" disabled={busy || (b.status === "draft" && b.items.length === 0)} onClick={() => run(() => API.setStatus(b.id, next), `${b.code}: ${stageLabel(next)}`)} className={btnPrimary}>
            {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}{NEXT_LABEL[b.status]} <Icon name="arrow" />
          </button>
        </div>
      )}

      {b.status === "received" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-cream px-4 py-3">
          <p className="text-sm text-ink/70">Goods have arrived. Add these units to your warehouse stock so you can sell them.</p>
          <a href="/admin/dashboard/inventory" className={btnGhost}><Icon name="box" /> Open inventory</a>
        </div>
      )}
      <ErrorLine>{error}</ErrorLine>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["Units", n0(c.units)], ["Goods value", bdtShort(c.goods)], ["Total landed", c.units ? bdtShort(c.total) : "—"], ["Per unit", c.units ? bdt(c.perUnit) : "—"]].map(([l, v]) => (
          <div key={l} className="rounded-xl bg-brand-cream/70 p-3.5"><p className="text-xs text-ink/55">{l}</p><p className="mt-0.5 text-lg font-bold tabular-nums text-ink">{v}</p></div>
        ))}
      </div>

      <ul className="flex flex-col gap-2.5 rounded-xl border border-line p-4">
        <Line label="Expected arrival" value={<span className={eta.late ? "text-brand-orange-dark" : ""}>{eta.text}</span>} />
        <Line label="Tracking / container" value={b.tracking || "Not added"} />
        <Line label="Exchange rate" value={`1 CNY = ৳${b.rate}`} />
        {b.notes && <Line label="Notes" value={b.notes} />}
      </ul>

      {b.status !== "received" && b.status !== "cancelled" && (
        <div className="border-t border-line pt-4">
          {confirmCancel ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-ink/70">Cancel this batch? This can't be undone.</p>
              <button type="button" onClick={() => setConfirmCancel(false)} className={btnGhost}>Keep</button>
              <button type="button" disabled={busy} onClick={() => run(() => API.setStatus(b.id, "cancelled"), `${b.code} cancelled`)} className="inline-flex cursor-pointer items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">Cancel batch</button>
            </div>
          ) : <button type="button" onClick={() => setConfirmCancel(true)} className="cursor-pointer text-sm font-semibold text-ink/50 underline hover:text-red-600">Cancel this batch</button>}
        </div>
      )}
    </div>
  );
}

function ItemsTab({ b, c, refresh, notify }) {
  const { busy, error, run } = useSave(refresh, notify);
  const empty = { name: "", sku: "", qty: "", price: "", kg: "", cbm: "" };
  const [f, setF] = useState(empty);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const locked = ["received", "cancelled"].includes(b.status);
  const valid = f.name.trim() && Number(f.qty) > 0 && Number(f.price) > 0;

  const add = (e) => {
    e.preventDefault();
    if (!valid) return;
    run(async () => { await API.addItem(b.id, { name: f.name.trim(), sku: f.sku.trim(), quantity: Number(f.qty), unit_price_cny: Number(f.price), weight_kg: Number(f.kg) || 0, cbm: Number(f.cbm) || 0 }); setF(empty); }, "Item added");
  };

  return (
    <div className="flex flex-col gap-5">
      {b.items.length === 0 ? <Empty title="No items yet" hint="Add what you are ordering from the supplier." /> : (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead><tr className="border-b border-line bg-brand-cream/60 text-xs font-semibold text-ink/55"><th className="px-4 py-2.5">Item</th><th className="px-3 py-2.5 text-right">Qty</th><th className="px-3 py-2.5 text-right">Price</th><th className="px-3 py-2.5 text-right">Weight</th><th className="px-4 py-2.5 text-right">Line total</th></tr></thead>
            <tbody className="divide-y divide-line">
              {b.items.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2.5"><p className="font-medium text-ink">{i.name}</p><p className="text-xs text-ink/45">{i.sku}</p></td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{n0(i.qty)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{cny(i.unitCny)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-ink/55">{i.weightKg}kg</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums">{cny(i.qty * i.unitCny)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t border-line bg-brand-cream/40 text-sm font-bold"><td className="px-4 py-2.5">Total</td><td className="px-3 py-2.5 text-right tabular-nums">{n0(c.units)}</td><td /><td /><td className="px-4 py-2.5 text-right tabular-nums">{cny(sum(b.items, (i) => i.qty * i.unitCny))}</td></tr></tfoot>
          </table>
        </div>
      )}

      {!locked && (
        <form onSubmit={add} className="rounded-xl border border-line p-4">
          <p className="text-sm font-bold text-brand-navy">Add item</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-6">
            <input value={f.name} onChange={set("name")} placeholder="Item name" aria-label="Item name" className={cx(inputCls, "col-span-2 sm:col-span-3")} />
            <input value={f.sku} onChange={set("sku")} placeholder="SKU" aria-label="SKU" className={cx(inputCls, "sm:col-span-3")} />
            <input type="number" min="1" value={f.qty} onChange={set("qty")} placeholder="Qty" aria-label="Quantity" className={cx(inputCls, "tabular-nums sm:col-span-2")} />
            <input type="number" min="0" step="0.01" value={f.price} onChange={set("price")} placeholder="¥ price" aria-label="Unit price in CNY" className={cx(inputCls, "tabular-nums sm:col-span-2")} />
            <input type="number" min="0" step="0.01" value={f.kg} onChange={set("kg")} placeholder="kg each" aria-label="Weight per unit in kg" className={cx(inputCls, "tabular-nums sm:col-span-1")} />
            <input type="number" min="0" step="0.0001" value={f.cbm} onChange={set("cbm")} placeholder="CBM" aria-label="CBM per unit" className={cx(inputCls, "tabular-nums sm:col-span-1")} />
          </div>
          <ErrorLine>{error}</ErrorLine>
          <button type="submit" disabled={!valid || busy} className={cx(btnPrimary, "mt-3")}><Icon name="plus" /> Add item</button>
        </form>
      )}
    </div>
  );
}

function CostsTab({ b, refresh, notify }) {
  const { busy, error, run } = useSave(refresh, notify);
  const init = () => ({ rate: String(b.rate), freight: String(b.costs.freight), insurance: String(b.costs.insurance), dutyPct: String(b.costs.dutyPct), vatPct: String(b.costs.vatPct), aitPct: String(b.costs.aitPct), clearing: String(b.costs.clearing), local: String(b.costs.local), other: String(b.costs.other) });
  const [f, setF] = useState(init);
  const [vatAsCost, setVatAsCost] = useState(true);
  const [allocBy, setAllocBy] = useState("weight");
  const [margin, setMargin] = useState("30");
  const dirtyBase = JSON.stringify(init());
  const [baseline, setBaseline] = useState(dirtyBase);
  useEffect(() => { setF(init()); setBaseline(JSON.stringify(init())); }, [b.rate, b.costs.freight, b.costs.insurance, b.costs.dutyPct, b.costs.vatPct, b.costs.aitPct, b.costs.clearing, b.costs.local, b.costs.other]); // eslint-disable-line
  const dirty = JSON.stringify(f) !== baseline;
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const nv = (k) => Number(f[k]) || 0;

  const live = { ...b, rate: nv("rate"), costs: { freight: nv("freight"), insurance: nv("insurance"), dutyPct: nv("dutyPct"), vatPct: nv("vatPct"), aitPct: nv("aitPct"), clearing: nv("clearing"), local: nv("local"), other: nv("other"), vatAsCost, allocBy } };
  const c = computeCost(live);
  const m = Math.min(Math.max(Number(margin) || 0, 0), 90);

  const save = () => run(() => API.saveCost(b.id, { exchange_rate: nv("rate"), freight: nv("freight"), insurance: nv("insurance"), duty_percent: nv("dutyPct"), vat_percent: nv("vatPct"), ait_percent: nv("aitPct"), clearing_fee: nv("clearing"), local_transport: nv("local"), other_costs: nv("other") }), "Costs saved");

  const money = (k, label, hint) => (
    <Field label={label} hint={hint}><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">৳</span><input type="number" min="0" value={f[k]} onChange={set(k)} className={cx(inputCls, "pl-7 tabular-nums")} /></div></Field>
  );
  const pct = (k, label) => (
    <Field label={label}><div className="relative"><input type="number" min="0" step="0.5" value={f[k]} onChange={set(k)} className={cx(inputCls, "pr-7 tabular-nums")} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">%</span></div></Field>
  );

  return (
    <div className="flex flex-col gap-6">
      <Hint>Landed cost is what a unit really costs you once it is in your warehouse: factory price + freight + customs duty + taxes + clearing fees. Price your products from this number, not the factory price. Duty and tax rates differ by product (HS code), so confirm them with your customs agent.</Hint>

      <section>
        <h3 className="text-sm font-bold text-brand-navy">Cost inputs</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Exchange rate" hint="CNY → BDT"><input type="number" step="0.01" min="0" value={f.rate} onChange={set("rate")} className={cx(inputCls, "tabular-nums")} /></Field>
          {money("freight", "International freight")}
          {money("insurance", "Insurance")}
          {pct("dutyPct", "Customs duty")}
          {pct("vatPct", "VAT")}
          {pct("aitPct", "AIT")}
          {money("clearing", "Clearing & port fees")}
          {money("local", "Local transport")}
          {money("other", "Other costs")}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70"><input type="checkbox" checked={vatAsCost} onChange={(e) => setVatAsCost(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand-orange)]" /> Count VAT as a cost <span className="text-xs text-ink/45">(untick if you claim it back)</span></label>
          <span className="flex items-center gap-2 text-sm text-ink/70">Split shared costs by <Segmented label="Allocation basis" value={allocBy} onChange={setAllocBy} options={[["weight", "Weight"], ["value", "Value"]]} /></span>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-brand-navy">What it adds up to</h3>
        <ul className="mt-3 flex flex-col gap-2.5 rounded-xl border border-line p-4">
          <Line label="Goods (factory price)" value={bdt(c.goods)} />
          <Line label="Freight + insurance" value={bdt(live.costs.freight + live.costs.insurance)} />
          <Line label={`Customs duty (${live.costs.dutyPct}%)`} value={bdt(c.duty)} />
          <Line label={`VAT (${live.costs.vatPct}%)${vatAsCost ? "" : " · not counted"}`} value={bdt(c.vat)} muted={!vatAsCost} />
          <Line label={`AIT (${live.costs.aitPct}%)`} value={bdt(c.ait)} />
          <Line label="Clearing, transport, other" value={bdt(live.costs.clearing + live.costs.local + live.costs.other)} />
          <li className="mt-1 border-t border-dashed border-line pt-3"><ul><Line strong label="Total landed cost" value={bdt(c.total)} /></ul></li>
        </ul>
        {c.units > 0 && (
          <p className="mt-3 text-sm text-ink/70">Each unit costs you about <span className="font-bold text-ink">{bdt(c.perUnit)}</span>. That is <span className="font-bold text-ink">{c.multiplier.toFixed(2)}×</span> the factory price.</p>
        )}
      </section>

      {c.lines.length > 0 && (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-sm font-bold text-brand-navy">Cost and selling price per item</h3>
            <label className="flex items-center gap-2 text-sm text-ink/70">Target margin <span className="relative w-20"><input type="number" min="0" max="90" value={margin} onChange={(e) => setMargin(e.target.value)} className={cx(inputCls, "py-1.5 pr-6 text-right tabular-nums")} /><span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ink/40">%</span></span></label>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead><tr className="border-b border-line bg-brand-cream/60 text-xs font-semibold text-ink/55"><th className="px-4 py-2.5">Item</th><th className="px-3 py-2.5 text-right">Factory</th><th className="px-3 py-2.5 text-right">Landed / unit</th><th className="px-4 py-2.5 text-right">Sell at {m}%</th></tr></thead>
              <tbody className="divide-y divide-line">
                {c.lines.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-2.5 font-medium text-ink">{i.name}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink/55">{bdt(i.unitCny * live.rate)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{bdt(i.unit)}</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-brand-navy">{bdt(i.unit / (1 - m / 100))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink/50">Margin means profit as a share of the selling price. Prices are before any discount or payment fee.</p>
        </section>
      )}

      <ErrorLine>{error}</ErrorLine>
      {dirty && (
        <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between gap-3 border-t border-line bg-white px-6 py-4">
          <p className="text-sm text-ink/60">You have unsaved changes.</p>
          <div className="flex gap-2"><button type="button" onClick={() => setF(JSON.parse(baseline))} className={btnGhost}>Reset</button><button type="button" onClick={save} disabled={busy} className={btnPrimary}>{busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}Save costs</button></div>
        </div>
      )}
    </div>
  );
}

function CustomsTab({ b, refresh, notify }) {
  const { busy, error, run } = useSave(refresh, notify);
  const [hs, setHs] = useState(b.customs.hs);
  const [ref, setRef] = useState(b.customs.ref);
  const [status, setStatus] = useState(b.customs.status);
  const [docs, setDocs] = useState(b.customs.docs);
  const done = Object.values(docs).filter(Boolean).length;
  const dirty = hs !== b.customs.hs || ref !== b.customs.ref || status !== b.customs.status || JSON.stringify(docs) !== JSON.stringify(b.customs.docs);

  return (
    <div className="flex flex-col gap-6">
      <Hint>Customs needs the right papers and the correct HS code (the product category code) before it releases the goods. Missing documents are the most common reason for delays.</Hint>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="HS code"><input value={hs} onChange={(e) => setHs(e.target.value)} placeholder="e.g. 8518.30" className={cx(inputCls, "font-mono")} /></Field>
        <Field label="Declaration no."><input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. C-2025-88213" className={cx(inputCls, "font-mono")} /></Field>
        <Field label="Customs status"><select value={status} onChange={(e) => setStatus(e.target.value)} className={cx(inputCls, "cursor-pointer")}>{CUSTOMS_STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
      </div>

      <section>
        <div className="flex items-baseline justify-between"><h3 className="text-sm font-bold text-brand-navy">Documents</h3><span className="text-xs text-ink/50">{done} of {DOCS.length} ready</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-brand-navy transition-all" style={{ width: `${(done / DOCS.length) * 100}%` }} /></div>
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
          {DOCS.map(([k, label]) => (
            <li key={k}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm">
                <input type="checkbox" checked={!!docs[k]} onChange={(e) => setDocs((d) => ({ ...d, [k]: e.target.checked }))} className="h-4 w-4 accent-[var(--color-brand-orange)]" />
                <span className="flex-1 text-ink">{label}</span>
                <span className={cx("text-xs font-semibold", docs[k] ? "text-brand-teal" : "text-ink/40")}>{docs[k] ? "Ready" : "Missing"}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
      <ErrorLine>{error}</ErrorLine>
      <div><button type="button" disabled={!dirty || busy} onClick={() => run(() => API.saveCustoms(b.id, { hs_code: hs.trim(), reference: ref.trim(), status, documents: docs }), "Customs details saved")} className={btnPrimary}>{busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}Save customs details</button></div>
    </div>
  );
}

/* ============================================================
   2. CUSTOMS LIST
   ============================================================ */
function CustomsPanel({ data, onOpen }) {
  const [f, setF] = useState("open");
  const rows = data.batches.filter((b) => !["draft", "cancelled"].includes(b.status))
    .filter((b) => (f === "all" ? true : f === "held" ? b.customs.status === "held" : b.customs.status !== "cleared"))
    .sort((a, b) => (b.customs.status === "held") - (a.customs.status === "held"));
  const csLabel = (s) => CUSTOMS_STATUS.find(([k]) => k === s)?.[1] ?? s;

  return (
    <div className="flex flex-col gap-4">
      <Hint>Every shipped batch needs a customs declaration. Open a batch to update its HS code, documents and status.</Hint>
      <Segmented label="Customs filter" value={f} onChange={setF} options={[["open", "Not cleared yet"], ["held", "Held"], ["all", "All"]]} />
      {rows.length === 0 ? <Empty title="Nothing here" hint="Batches that are shipped will appear with their customs status." /> : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead><tr className="border-b border-line bg-brand-cream/60 text-xs font-semibold text-ink/55"><th className="px-5 py-3">Batch</th><th className="px-3 py-3">HS code</th><th className="px-3 py-3">Declaration</th><th className="px-3 py-3">Documents</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Duty + taxes</th></tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((b) => {
                  const d = Object.values(b.customs.docs).filter(Boolean).length;
                  const c = computeCost(b);
                  return (
                    <tr key={b.id} onClick={() => onOpen(b.id)} className="cursor-pointer transition-colors hover:bg-brand-cream/50">
                      <td className="px-5 py-3"><p className="font-mono font-bold text-brand-navy">{b.code}</p><p className="text-xs text-ink/50">{b.supplier}</p></td>
                      <td className="px-3 py-3 font-mono text-ink/70">{b.customs.hs || "—"}</td>
                      <td className="px-3 py-3 font-mono text-ink/70">{b.customs.ref || "—"}</td>
                      <td className="px-3 py-3"><span className={cx("text-xs font-semibold", d < DOCS.length ? "text-brand-orange-dark" : "text-ink/60")}>{d} of {DOCS.length}</span></td>
                      <td className="px-3 py-3"><span className={cx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", b.customs.status === "held" ? "bg-brand-orange/10 text-brand-orange-dark" : b.customs.status === "cleared" ? "bg-brand-teal/10 text-brand-teal" : "bg-ink/5 text-ink/60")}>{csLabel(b.customs.status)}</span></td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{c.units ? bdt(c.taxes) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   3. LANDED COST CALCULATOR  (order dewar age hishab)
   ============================================================ */
function CalculatorPanel() {
  const [f, setF] = useState({ price: "40", qty: "500", kg: "0.2", rate: "16.8", perKg: "180", duty: "25", vat: "15", ait: "5", fixed: "50000", margin: "30" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const v = (k) => Number(f[k]) || 0;

  const goods = v("price") * v("qty") * v("rate");
  const freight = v("kg") * v("qty") * v("perKg");
  const cif = goods + freight;
  const duty = (cif * v("duty")) / 100;
  const vat = ((cif + duty) * v("vat")) / 100;
  const ait = (cif * v("ait")) / 100;
  const fixed = v("fixed");
  const total = goods + freight + duty + vat + ait + fixed;
  const unit = v("qty") ? total / v("qty") : 0;
  const m = Math.min(v("margin"), 90);
  const sell = unit / (1 - m / 100);
  const parts = [["Goods", goods, "bg-brand-navy"], ["Freight", freight, "bg-brand-navy/60"], ["Duty & taxes", duty + vat + ait, "bg-brand-orange"], ["Other fees", fixed, "bg-ink/25"]];

  const num = (k, label, o = {}) => (
    <Field label={label} hint={o.hint}><div className="relative">{o.pre && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">{o.pre}</span>}<input type="number" min="0" step={o.step || "any"} value={f[k]} onChange={set(k)} className={cx(inputCls, "tabular-nums", o.pre && "pl-7", o.suf && "pr-8")} />{o.suf && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">{o.suf}</span>}</div></Field>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="text-base font-bold text-brand-navy">Before you order</h2>
        <p className="text-xs text-ink/50">Change the numbers and see your real cost per unit instantly.</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {num("price", "Factory price", { pre: "¥", hint: "per unit" })}
          {num("qty", "Quantity", { hint: "units" })}
          {num("kg", "Weight", { suf: "kg", hint: "per unit" })}
          {num("rate", "Exchange rate", { hint: "1 CNY = ৳?" })}
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between"><span className="text-sm font-semibold text-brand-navy">Freight rate</span>
            <span className="flex gap-1.5">{[["Air", 800], ["Sea", 180]].map(([l, r]) => <button key={l} type="button" onClick={() => setF((p) => ({ ...p, perKg: String(r) }))} className="cursor-pointer rounded-md border border-line px-2 py-0.5 text-xs font-semibold text-ink/65 hover:bg-brand-cream">{l} ৳{r}</button>)}</span></div>
          <div className="mt-1.5">{num("perKg", "", { pre: "৳", suf: "/kg" })}</div>
          <p className="mt-1 text-xs text-ink/45">Example rates only. Use your freight forwarder's quote.</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4">
          {num("duty", "Duty", { suf: "%" })}
          {num("vat", "VAT", { suf: "%" })}
          {num("ait", "AIT", { suf: "%" })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {num("fixed", "Clearing, transport, other", { pre: "৳", hint: "total" })}
          {num("margin", "Target margin", { suf: "%" })}
        </div>
      </section>

      <section className="rounded-2xl bg-brand-navy p-6 text-white" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 30px)" }}>
        <p className="text-sm text-white/60">Your real cost per unit</p>
        <p className="mt-1 text-5xl font-bold tabular-nums tracking-tight">{bdt(unit)}</p>
        <p className="mt-1 text-sm text-white/60">
          {goods > 0 && <>That is <span className="font-semibold text-white">{(total / goods).toFixed(2)}×</span> the factory price · </>}total {bdt(total)}
        </p>

        <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/10">
          {parts.map(([l, val, c]) => <span key={l} className={cx(c, "h-full")} style={{ width: `${total ? (val / total) * 100 : 0}%` }} title={`${l}: ${bdt(val)}`} />)}
        </div>
        <ul className="mt-4 grid gap-2">
          {parts.map(([l, val, c]) => (
            <li key={l} className="flex items-baseline gap-2 text-sm"><span className={cx("h-2 w-2 shrink-0 self-center rounded-full", c)} /><span className="text-white/70">{l}</span><span className="min-w-3 flex-1 border-b border-dotted border-white/25" /><span className="font-semibold tabular-nums">{bdt(val)}</span><span className="w-10 text-right text-xs tabular-nums text-white/50">{total ? Math.round((val / total) * 100) : 0}%</span></li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl bg-white/10 p-4">
          <p className="text-xs text-white/60">To make {m}% profit, sell at</p>
          <p className="text-2xl font-bold tabular-nums">{bdt(sell)}</p>
          <p className="text-xs text-white/60">Profit {bdt(sell - unit)} per unit · {bdt((sell - unit) * v("qty"))} on the whole order</p>
        </div>
      </section>
    </div>
  );
}