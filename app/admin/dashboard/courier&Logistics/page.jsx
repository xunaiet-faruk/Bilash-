"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */
const USE_MOCK = true;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commarse-three.vercel.app";
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");

async function api(path, { method = "GET", body, params } = {}) {
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
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */
const COURIERS = [
  { id: "steadfast", name: "Steadfast", logo: "📦", phone: "09610-999888", rate: 80, successRate: 98 },
  { id: "pathao", name: "Pathao", logo: "🚴", phone: "09678-100200", rate: 85, successRate: 96 },
  { id: "redx", name: "RedX", logo: "📮", phone: "09678-111999", rate: 75, successRate: 94 },
  { id: "sundarban", name: "Sundarban", logo: "🚚", phone: "09612-333444", rate: 70, successRate: 92 },
  { id: "sa-paribahan", name: "SA Paribahan", logo: "🚛", phone: "02-9568899", rate: 65, successRate: 90 },
];

const DISTRICTS = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh", "Cox's Bazar"];

const STATUS_META = {
  pending:          { label: "Pending",          dot: "bg-neutral-400",  chip: "bg-neutral-100 text-neutral-600",  accent: "border-neutral-200" },
  picked:           { label: "Picked up",        dot: "bg-blue-500",     chip: "bg-blue-50 text-blue-700",         accent: "border-blue-200" },
  in_transit:       { label: "In transit",       dot: "bg-orange-500",   chip: "bg-orange-50 text-orange-700",     accent: "border-orange-200" },
  out_for_delivery: { label: "Out for delivery", dot: "bg-violet-500",   chip: "bg-violet-50 text-violet-700",     accent: "border-violet-200" },
  delivered:        { label: "Delivered",        dot: "bg-emerald-500",  chip: "bg-emerald-50 text-emerald-700",   accent: "border-emerald-200" },
  returned:         { label: "Returned",         dot: "bg-red-500",      chip: "bg-red-50 text-red-700",           accent: "border-red-200" },
  failed:           { label: "Failed",           dot: "bg-red-600",      chip: "bg-red-100 text-red-700",          accent: "border-red-200" },
};

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════ */
const H = 3600000;
const ago = (h) => new Date(Date.now() - h * H).toISOString();

const MOCK_CONSIGNMENTS = [
  { id: "CON-001", orderId: "ORD-98124", buyer: "Karim Hossain", buyerPhone: "+880 1711-000111", district: "Chattogram", address: "GEC Circle, Chattogram", courier: "steadfast", tracking: "STD-772341", status: "in_transit", cod: 2450, weight: 0.5, sentAt: ago(30), eta: "Tomorrow" },
  { id: "CON-002", orderId: "ORD-98125", buyer: "Nusrat Jahan", buyerPhone: "+880 1811-000222", district: "Dhaka", address: "Banani, Dhaka", courier: "pathao", tracking: "PAT-883422", status: "delivered", cod: 5890, weight: 0.3, sentAt: ago(60), eta: "Delivered 2h ago" },
  { id: "CON-003", orderId: "ORD-98126", buyer: "Tanvir Ahmed", buyerPhone: "+880 1911-000333", district: "Sylhet", address: "Uposhohor, Sylhet", courier: "redx", tracking: "RED-991203", status: "out_for_delivery", cod: 3200, weight: 0.8, sentAt: ago(48), eta: "Today" },
  { id: "CON-004", orderId: "ORD-98127", buyer: "Farzana Akter", buyerPhone: "+880 1611-000444", district: "Rajshahi", address: "Shahjalal Road, Rajshahi", courier: "steadfast", tracking: null, status: "pending", cod: 780, weight: 0.4, sentAt: null, eta: null },
  { id: "CON-005", orderId: "ORD-98128", buyer: "Sadman Rahman", buyerPhone: "+880 1511-000555", district: "Dhaka", address: "Green Road, Dhaka", courier: "sundarban", tracking: "SDN-112298", status: "picked", cod: 980, weight: 0.6, sentAt: ago(10), eta: "Tomorrow" },
  { id: "CON-006", orderId: "ORD-98129", buyer: "Imran Kabir", buyerPhone: "+880 1311-000666", district: "Chattogram", address: "Agrabad, Chattogram", courier: "steadfast", tracking: "STD-772342", status: "returned", cod: 125, weight: 0.2, sentAt: ago(120), eta: "Returned" },
  { id: "CON-007", orderId: "ORD-98130", buyer: "Rumana Islam", buyerPhone: "+880 1211-000777", district: "Khulna", address: "Sonadanga, Khulna", courier: "redx", tracking: "RED-991204", status: "in_transit", cod: 540, weight: 0.35, sentAt: ago(20), eta: "Tomorrow" },
  { id: "CON-008", orderId: "ORD-98131", buyer: "Arif Hossain", buyerPhone: "+880 1877-001000", district: "Dhaka", address: "Bashundhara, Dhaka", courier: "pathao", tracking: null, status: "pending", cod: 720, weight: 0.25, sentAt: null, eta: null },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const cx = (...a) => a.filter(Boolean).join(" ");
const taka = (n) => `৳${Number(n || 0).toLocaleString("en-IN")}`;
const timeAgo = (iso) => {
  if (!iso) return "—";
  const h = (Date.now() - new Date(iso).getTime()) / H;
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */
const PATHS = {
  truck: "M3 17V7a2 2 0 0 1 2-2h9v12H3zm11-6h4l4 4v2h-8v-6zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  package: "M16.5 9.4 7.5 4.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 13l4 4L19 7",
  plus: "M12 5v14M5 12h14",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  copy: "M9 9h10v12H9zM5 15h2V3h10v2",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  rotateCw: "M21 12a9 9 0 1 1-3-6.7M21 3v6h-6",
  spark: "M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2",
  calculator: "M4 4h16v16H4zM8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h4M16 16h.01",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  trending: "M3 17l6-6 4 4 8-8M21 7v6h-6",
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
};

const Icon = ({ name, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className} aria-hidden="true">
    <path d={PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BTN = {
  primary: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
  ghost: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
};

const INPUT = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5 disabled:opacity-60";

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LogisticsPage() {
  const [tab, setTab] = useState("consignments");
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courierFilter, setCourierFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [detailId, setDetailId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setConsignments(MOCK_CONSIGNMENTS.map((c) => ({ ...c })));
      } else {
        const data = await api("/api/v1/shipping/consignments", { params: { limit: 100 } });
        setConsignments(data?.items ?? data ?? []);
      }
    } catch (e) {
      toast.error(e?.message || "Could not load shipments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDetailId(null);
        setCreateOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return consignments.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (courierFilter !== "all" && c.courier !== courierFilter) return false;
      if (!q) return true;
      return `${c.orderId} ${c.buyer} ${c.tracking || ""} ${c.district}`.toLowerCase().includes(q);
    });
  }, [consignments, query, statusFilter, courierFilter]);

  const stats = useMemo(() => {
    const total = consignments.length;
    const inTransit = consignments.filter((c) => ["picked", "in_transit", "out_for_delivery"].includes(c.status)).length;
    const delivered = consignments.filter((c) => c.status === "delivered").length;
    const pending = consignments.filter((c) => c.status === "pending").length;
    const failed = consignments.filter((c) => ["returned", "failed"].includes(c.status)).length;
    const codHeld = consignments.filter((c) => c.status !== "delivered" && c.status !== "returned").reduce((s, c) => s + (c.cod || 0), 0);
    return { total, inTransit, delivered, pending, failed, codHeld };
  }, [consignments]);

  const counts = useMemo(() => {
    const c = { all: consignments.length };
    Object.keys(STATUS_META).forEach((k) => { c[k] = consignments.filter((x) => x.status === k).length; });
    return c;
  }, [consignments]);

  const detail = consignments.find((c) => c.id === detailId);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const toggleSelectAll = () => {
    if (selected.size === filtered.length && filtered.length > 0) clearSelection();
    else setSelected(new Set(filtered.map((c) => c.id)));
  };

  const bulkAssign = async (courierId) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        const ids = [...selected];
        setConsignments((cur) =>
          cur.map((c) =>
            ids.includes(c.id) && c.status === "pending"
              ? {
                  ...c,
                  courier: courierId,
                  tracking: `${courierId.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`,
                  status: "picked",
                  sentAt: new Date().toISOString(),
                  eta: "Tomorrow",
                }
              : c
          )
        );
      } else {
        await api("/api/v1/admin/orders/batch-assign-courier", {
          method: "POST",
          body: { order_ids: [...selected], courier: courierId },
        });
        await load(true);
      }
      toast.success(`${selected.size} shipment${selected.size > 1 ? "s" : ""} assigned`);
      clearSelection();
    } catch (e) {
      toast.error(e?.message || "Could not assign courier");
    }
  };

  const createConsignment = async (payload) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        const courier = COURIERS.find((c) => c.id === payload.courier);
        const id = `CON-${String(consignments.length + 1).padStart(3, "0")}`;
        setConsignments((cur) => [
          {
            id,
            orderId: payload.orderId,
            buyer: payload.buyer,
            buyerPhone: payload.buyerPhone,
            district: payload.district,
            address: payload.address,
            courier: payload.courier,
            tracking: `${courier.id.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`,
            status: "picked",
            cod: Number(payload.cod) || 0,
            weight: Number(payload.weight) || 0.5,
            sentAt: new Date().toISOString(),
            eta: "Tomorrow",
          },
          ...cur,
        ]);
      } else {
        await api("/api/v1/shipping/create-consignment", { method: "POST", body: payload });
        await load(true);
      }
      toast.success("Consignment created");
      setCreateOpen(false);
    } catch (e) {
      toast.error(e?.message || "Could not create consignment");
    }
  };

  const retryShipment = async (c) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        setConsignments((cur) =>
          cur.map((x) =>
            x.id === c.id
              ? { ...x, status: "picked", tracking: x.tracking ? `${x.tracking}-R` : `NEW-${Math.floor(Math.random() * 900000 + 100000)}`, sentAt: new Date().toISOString() }
              : x
          )
        );
      } else {
        await api(`/api/v1/shipping/consignments/${c.id}/retry`, { method: "POST" });
        await load(true);
      }
      toast.success(`Retry sent for ${c.orderId}`);
    } catch (e) {
      toast.error(e?.message || "Could not retry");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "!rounded-full !bg-neutral-900 !text-white !text-sm !font-medium !shadow-2xl !border-0",
          duration: 3000,
        }}
      />

      <div className="mx-auto flex w-full container flex-col gap-5 p-2 sm:p-8">

        {/* ═══════════════════════════════════════════════════
            HERO COMMAND BAR — unique design
            ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white">
     
          <div className="relative grid gap-6 p-1 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10 lg:p-4">
            {/* LEFT: Title + actions */}
            <div>
              <div className="flex items-center gap-2">
                <Icon name="spark" className="h-3.5 w-3.5 text-orange-500" sw={2.5} />
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-500">
                  Shipping Operations
                </p>
                {USE_MOCK && (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                    DEMO
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Courier &amp; Logistics
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-500">
                Track every parcel in flight. Compare courier rates, spot delays, and resolve failed deliveries — all in one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => load(true)}
                  disabled={refreshing}
                  className={BTN.ghost}
                >
                  <Icon name="refresh" className={cx("h-4 w-4", refreshing && "animate-spin")} /> Refresh
                </button>
                <button type="button" onClick={() => setCreateOpen(true)} className={BTN.primary}>
                  <Icon name="plus" className="h-4 w-4" /> New consignment
                </button>
              </div>
            </div>

            {/* RIGHT: Big live stats — no small cards, one flowing block */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Live overview
                </p>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={() => { setTab("consignments"); setStatusFilter("pending"); }}
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-600">
                      <Icon name="clock" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pending</p>
                      <p className="text-[10px] text-neutral-400">waiting for courier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold tabular-nums text-neutral-900">{stats.pending}</p>
                    {stats.pending > 0 && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">action needed</p>
                    )}
                  </div>
                </button>

                {/* Row 2 */}
                <button
                  type="button"
                  onClick={() => { setTab("consignments"); setStatusFilter("in_transit"); }}
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon name="truck" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">In transit</p>
                      <p className="text-[10px] text-neutral-400">moving right now</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold tabular-nums text-neutral-900">{stats.inTransit}</p>
                </button>

                {/* Row 3 */}
                <button
                  type="button"
                  onClick={() => { setTab("consignments"); setStatusFilter("delivered"); }}
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Delivered</p>
                      <p className="text-[10px] text-neutral-400">successful</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold tabular-nums text-neutral-900">{stats.delivered}</p>
                </button>

                {/* Row 4 — bold footer with money */}
                <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900 p-3 text-white">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                      <Icon name="package" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/60">COD held</p>
                      <p className="text-[10px] text-white/40">not yet settled</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold tabular-nums">{taka(stats.codHeld)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            TABS — floating bar
            ═══════════════════════════════════════════════════ */}
        <div className="flex gap-1 self-start overflow-x-auto rounded-full bg-neutral-100 p-1">
          {[
            { id: "consignments", label: "Consignments", icon: "truck", count: stats.total },
            { id: "rates", label: "Rate calculator", icon: "calculator" },
            { id: "couriers", label: "Couriers", icon: "grid", count: COURIERS.length },
          ].map((it) => {
            const active = tab === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setTab(it.id)}
                className={cx(
                  "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/25"
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                <Icon name={it.icon} className="h-3.5 w-3.5" />
                {it.label}
                {it.count != null && (
                  <span className={cx(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
                  )}>
                    {it.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════
            CONTENT
            ═══════════════════════════════════════════════════ */}
        <div className={cx("transition-opacity", refreshing && "opacity-70")}>
          {tab === "consignments" && (
            <ConsignmentsTab
              consignments={consignments}
              filtered={filtered}
              loading={loading}
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              courierFilter={courierFilter}
              setCourierFilter={setCourierFilter}
              counts={counts}
              selected={selected}
              toggleSelect={toggleSelect}
              toggleSelectAll={toggleSelectAll}
              clearSelection={clearSelection}
              bulkAssign={bulkAssign}
              onOpen={(c) => setDetailId(c.id)}
              onRetry={retryShipment}
            />
          )}
          {tab === "rates" && <RateCalculator />}
          {tab === "couriers" && <CouriersList />}
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {detail && (
        <DetailDrawer
          c={detail}
          onClose={() => setDetailId(null)}
          onRetry={() => { retryShipment(detail); setDetailId(null); }}
        />
      )}

      {/* CREATE MODAL */}
      {createOpen && (
        <CreateConsignmentModal
          onClose={() => setCreateOpen(false)}
          onCreate={createConsignment}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONSIGNMENTS TAB — table অপরিবর্তিত, শুধু toolbar + pills
   ═══════════════════════════════════════════════════════════ */
function ConsignmentsTab({ consignments, filtered, loading, query, setQuery, statusFilter, setStatusFilter, courierFilter, setCourierFilter, counts, selected, toggleSelect, toggleSelectAll, clearSelection, bulkAssign, onOpen, onRetry }) {
  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar + status pills — única bar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative block w-full sm:w-72">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order, buyer, tracking..."
              className={cx(INPUT, "pl-10")}
            />
          </label>
          <select
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            className={cx(INPUT, "w-auto cursor-pointer")}
          >
            <option value="all">All couriers</option>
            {COURIERS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="ml-auto text-xs font-medium text-neutral-500">
            {filtered.length} of {consignments.length}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-dashed border-neutral-200 pt-3">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "picked", label: "Picked up" },
            { id: "in_transit", label: "In transit" },
            { id: "out_for_delivery", label: "Out for delivery" },
            { id: "delivered", label: "Delivered" },
            { id: "returned", label: "Returned" },
            { id: "failed", label: "Failed" },
          ].map((t) => {
            const on = statusFilter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setStatusFilter(t.id)}
                className={cx(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                  on
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {t.label}
                <span className={cx(
                  "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                  on ? "bg-white/20 text-white" : "bg-white text-neutral-500"
                )}>
                  {counts[t.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-neutral-900 p-3 pl-5 text-white shadow-lg">
          <p className="text-sm">
            <b>{selected.size}</b> selected
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearSelection}
              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
            >
              Clear
            </button>
            {COURIERS.slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => bulkAssign(c.id)}
                className="cursor-pointer rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-3 py-1.5 text-xs font-bold shadow-md shadow-orange-500/25"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ⬇️ TABLE — অপরিবর্তিত (তোমার পুরনো table) */}
      {loading ? (
        <Skeleton />
      ) : filtered.length === 0 ? (
        <Empty title="No shipments found" hint="Try a different search or filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 cursor-pointer accent-neutral-900"
                    />
                  </th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Courier</th>
                  <th className="px-4 py-3">Tracking</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">COD</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((c) => {
                  const meta = STATUS_META[c.status];
                  const courier = COURIERS.find((x) => x.id === c.courier);
                  return (
                    <tr key={c.id} className={cx("transition-colors hover:bg-neutral-50", selected.has(c.id) && "bg-orange-50/40")}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          className="h-4 w-4 cursor-pointer accent-neutral-900"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onOpen(c)}
                          className="cursor-pointer font-mono text-xs font-bold text-neutral-900 hover:text-orange-600"
                        >
                          {c.orderId}
                        </button>
                        <p className="text-[10px] text-neutral-400">Sent {timeAgo(c.sentAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="truncate font-semibold text-neutral-900">{c.buyer}</p>
                        <p className="truncate text-xs text-neutral-500">{c.district}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                          <span className="text-base">{courier?.logo}</span>
                          {courier?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.tracking ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-700">
                            {c.tracking}
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(c.tracking);
                                toast.success("Tracking copied");
                              }}
                              className="cursor-pointer text-neutral-400 hover:text-neutral-900"
                              title="Copy"
                            >
                              <Icon name="copy" className="h-3 w-3" />
                            </button>
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", meta.chip)}>
                          <span className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} />
                          {meta.label}
                        </span>
                        <p className="mt-0.5 text-[10px] text-neutral-400">{c.eta || ""}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-neutral-900">
                        {taka(c.cod)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {["returned", "failed"].includes(c.status) && (
                            <button
                              type="button"
                              onClick={() => onRetry(c)}
                              title="Retry"
                              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                            >
                              <Icon name="rotateCw" className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onOpen(c)}
                            className="cursor-pointer rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900"
                          >
                            View
                          </button>
                        </div>
                      </td>
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

/* ═══════════════════════════════════════════════════════════
   RATE CALCULATOR — অপরিবর্তিত
   ═══════════════════════════════════════════════════════════ */
function RateCalculator() {
  const [from, setFrom] = useState("Dhaka");
  const [to, setTo] = useState("Chattogram");
  const [weight, setWeight] = useState("0.5");
  const [cod, setCod] = useState("2000");
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);

  const calculate = async () => {
    setBusy(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        const w = Number(weight) || 0.5;
        const codAmount = Number(cod) || 0;
        const codFee = codAmount > 0 ? Math.min(50, codAmount * 0.01) : 0;
        setResults(
          COURIERS.map((c) => ({
            ...c,
            charge: Math.round(c.rate + w * 30 + codFee),
            delivery: c.successRate > 95 ? "24h" : "48h",
          })).sort((a, b) => a.charge - b.charge)
        );
      } else {
        const data = await api("/api/v1/shipping/calculate-rate", {
          method: "POST",
          body: { from_district: from, to_district: to, weight: Number(weight), cod_amount: Number(cod) },
        });
        setResults(Object.entries(data || {}).map(([k, v]) => ({
          id: k,
          name: COURIERS.find((c) => c.id === k)?.name || k,
          logo: COURIERS.find((c) => c.id === k)?.logo || "📦",
          charge: v,
        })).sort((a, b) => a.charge - b.charge));
      }
      toast.success("Rate calculated");
    } catch (e) {
      toast.error(e?.message || "Could not calculate rate");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md">
            <Icon name="calculator" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-neutral-900">Rate calculator</h2>
            <p className="text-xs text-neutral-500">Compare charges across couriers</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">From</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className={cx(INPUT, "cursor-pointer")}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">To</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className={cx(INPUT, "cursor-pointer")}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Weight (kg)</span>
            <input type="number" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className={cx(INPUT, "tabular-nums")} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">COD amount</span>
            <input type="number" min="0" value={cod} onChange={(e) => setCod(e.target.value)} className={cx(INPUT, "tabular-nums")} />
          </label>
        </div>

        <button type="button" onClick={calculate} disabled={busy} className={cx(BTN.primary, "mt-5 w-full")}>
          {busy ? "Calculating…" : "Calculate rates"}
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-bold text-neutral-900">Results</h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          {from} → {to} · {weight}kg · COD {taka(cod)}
        </p>

        {!results ? (
          <div className="mt-6 rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-neutral-100 text-2xl">📊</div>
            <p className="mt-3 text-sm font-semibold text-neutral-900">No calculation yet</p>
            <p className="mt-1 text-xs text-neutral-500">Enter details and click Calculate</p>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {results.map((r, i) => (
              <li
                key={r.id}
                className={cx(
                  "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                  i === 0 ? "border-emerald-200 bg-emerald-50/50" : "border-neutral-200"
                )}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-neutral-100 text-xl">{r.logo}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-neutral-900">{r.name}</p>
                  <p className="text-xs text-neutral-500">{r.delivery || r.successRate + "% success"}</p>
                </div>
                {i === 0 && (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Best
                  </span>
                )}
                <p className="text-lg font-bold tabular-nums text-neutral-900">{taka(r.charge)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COURIERS LIST — অপরিবর্তিত
   ═══════════════════════════════════════════════════════════ */
function CouriersList() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <h3 className="text-sm font-bold text-neutral-900">Active couriers</h3>
      <p className="mt-0.5 text-xs text-neutral-500">
        These couriers are available when creating shipments. Contact support to add or remove.
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COURIERS.map((c) => (
          <li key={c.id} className="rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-neutral-100 text-2xl">
                {c.logo}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-neutral-900">{c.name}</p>
                <p className="truncate text-xs text-neutral-500">{c.phone}</p>
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Base rate</p>
                <p className="mt-0.5 font-bold tabular-nums text-neutral-900">{taka(c.rate)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Success</p>
                <p className="mt-0.5 font-bold tabular-nums text-emerald-600">{c.successRate}%</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETAIL DRAWER — অপরিবর্তিত
   ═══════════════════════════════════════════════════════════ */
function DetailDrawer({ c, onClose, onRetry }) {
  const meta = STATUS_META[c.status];
  const courier = COURIERS.find((x) => x.id === c.courier);

  const timeline = useMemo(() => {
    const steps = [
      { key: "pending", label: "Order confirmed" },
      { key: "picked", label: "Picked up by courier" },
      { key: "in_transit", label: "In transit" },
      { key: "out_for_delivery", label: "Out for delivery" },
      { key: "delivered", label: "Delivered" },
    ];
    const order = steps.findIndex((s) => s.key === c.status);
    if (["returned", "failed"].includes(c.status)) return [...steps.slice(0, 3), { key: c.status, label: c.status === "returned" ? "Returned to sender" : "Delivery failed" }];
    return steps.map((s, i) => ({ ...s, done: order >= i, active: order === i }));
  }, [c.status]);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 p-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Consignment details
            </p>
            <h2 className="mt-1 font-mono text-lg font-bold text-neutral-900">{c.orderId}</h2>
            <span className={cx("mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", meta.chip)}>
              <span className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100"
          >
            <Icon name="x" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Courier</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100 text-2xl">{courier?.logo}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-neutral-900">{courier?.name}</p>
                <p className="text-xs text-neutral-500">{courier?.phone}</p>
              </div>
            </div>
            {c.tracking && (
              <div className="mt-3 rounded-xl bg-neutral-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tracking</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-neutral-900">{c.tracking}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(c.tracking);
                      toast.success("Tracking copied");
                    }}
                    className="grid h-6 w-6 cursor-pointer place-items-center rounded-md text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900"
                  >
                    <Icon name="copy" className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Delivery timeline</p>
            <ol className="relative mt-3 space-y-3 pl-6">
              <span className="absolute left-2 top-2 h-[calc(100%-16px)] w-px bg-neutral-200" />
              {timeline.map((s, i) => (
                <li key={i} className="relative">
                  <span className={cx(
                    "absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold",
                    s.done ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-400"
                  )}>
                    {s.done && <Icon name="check" className="h-2.5 w-2.5" sw={3} />}
                  </span>
                  <p className={cx("text-sm font-semibold", s.done ? "text-neutral-900" : "text-neutral-400")}>
                    {s.label}
                  </p>
                  {s.active && <p className="text-xs text-neutral-500">Current status</p>}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shipment info</p>
            <ul className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm">
              <li className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-neutral-500">Buyer</span>
                <span className="font-semibold text-neutral-900">{c.buyer}</span>
              </li>
              <li className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-neutral-500">Phone</span>
                <a href={`tel:${c.buyerPhone}`} className="font-semibold text-neutral-900 hover:text-orange-600">{c.buyerPhone}</a>
              </li>
              <li className="flex items-start justify-between gap-3 px-4 py-3">
                <span className="text-neutral-500">Address</span>
                <span className="text-right font-semibold text-neutral-900">{c.address}</span>
              </li>
              <li className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-neutral-500">Weight</span>
                <span className="font-semibold tabular-nums text-neutral-900">{c.weight} kg</span>
              </li>
              <li className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-neutral-500">COD amount</span>
                <span className="font-bold tabular-nums text-neutral-900">{taka(c.cod)}</span>
              </li>
              <li className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-neutral-500">Sent</span>
                <span className="font-semibold text-neutral-900">{timeAgo(c.sentAt)}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2 border-t border-neutral-100 bg-neutral-50 p-4">
          {["returned", "failed"].includes(c.status) && (
            <button type="button" onClick={onRetry} className={cx(BTN.primary, "flex-1")}>
              <Icon name="rotateCw" className="h-4 w-4" />
              Retry shipment
            </button>
          )}
          <a href={`tel:${c.buyerPhone}`} className={cx(BTN.ghost, "flex-1")}>
            <Icon name="phone" className="h-4 w-4" />
            Call buyer
          </a>
        </div>
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CREATE CONSIGNMENT MODAL — অপরিবর্তিত
   ═══════════════════════════════════════════════════════════ */
function CreateConsignmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    orderId: "",
    buyer: "",
    buyerPhone: "",
    district: DISTRICTS[0],
    address: "",
    courier: COURIERS[0].id,
    cod: "",
    weight: "0.5",
  });
  const [busy, setBusy] = useState(false);

  const valid = form.orderId.trim() && form.buyer.trim() && form.buyerPhone.trim() && form.address.trim() && form.courier;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    try {
      await onCreate(form);
    } finally {
      setBusy(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-neutral-900/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => !busy && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-100 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md">
              <Icon name="package" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">New</p>
              <h2 className="mt-0.5 text-base font-bold text-neutral-900">Create consignment</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-neutral-400 hover:bg-neutral-100"
          >
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Order ID *</span>
              <input value={form.orderId} onChange={(e) => set("orderId", e.target.value)} placeholder="ORD-98124" autoFocus className={cx(INPUT, "font-mono")} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Buyer name *</span>
              <input value={form.buyer} onChange={(e) => set("buyer", e.target.value)} placeholder="Karim Hossain" className={INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Phone *</span>
              <input value={form.buyerPhone} onChange={(e) => set("buyerPhone", e.target.value)} placeholder="+880 1711-000111" className={INPUT} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">District</span>
              <select value={form.district} onChange={(e) => set("district", e.target.value)} className={cx(INPUT, "cursor-pointer")}>
                {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Weight (kg)</span>
              <input type="number" min="0.1" step="0.1" value={form.weight} onChange={(e) => set("weight", e.target.value)} className={cx(INPUT, "tabular-nums")} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Full address *</span>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House 12, Road 4, GEC Circle" className={INPUT} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500">COD amount (৳)</span>
              <input type="number" min="0" value={form.cod} onChange={(e) => set("cod", e.target.value)} placeholder="0" className={cx(INPUT, "tabular-nums")} />
            </label>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Courier *</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {COURIERS.map((c) => {
                const on = form.courier === c.id;
                return (
                  <label
                    key={c.id}
                    className={cx(
                      "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors",
                      on ? "border-orange-300 bg-orange-50" : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="courier"
                      value={c.id}
                      checked={on}
                      onChange={(e) => set("courier", e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-xl">{c.logo}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900">{c.name}</p>
                      <p className="text-[10px] text-neutral-500">{taka(c.rate)} base</p>
                    </div>
                    {on && <Icon name="check" className="h-4 w-4 text-orange-600" sw={2.5} />}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onClose} disabled={busy} className={cx(BTN.ghost, "flex-1")}>
              Cancel
            </button>
            <button type="submit" disabled={!valid || busy} className={cx(BTN.primary, "flex-[1.4]")}>
              {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {busy ? "Creating…" : "Create consignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKELETON / EMPTY
   ═══════════════════════════════════════════════════════════ */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border border-neutral-200 bg-white p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-12 rounded-xl bg-neutral-100" />
      ))}
    </div>
  );
}

function Empty({ title, hint }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100 text-2xl">🚚</div>
      <p className="mt-3 font-semibold text-neutral-900">{title}</p>
      {hint && <p className="mt-1 text-sm text-neutral-500">{hint}</p>}
    </div>
  );
}