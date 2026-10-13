"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */
const USE_MOCK = true;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commarse-three.vercel.app";
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "";

async function api(path, { method = "GET", body, params } = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params || {}).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false)
    throw new Error(json?.message || `Request failed (${res.status})`);
  return json?.data ?? json;
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const cx = (...a) => a.filter(Boolean).join(" ");
const money = (n) => `৳${Number(n || 0).toLocaleString("en-IN")}`;
const initials = (s = "") =>
  s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* ═══════════════════════════════════════════════════════════
   BUTTON STYLES
   ═══════════════════════════════════════════════════════════ */
const BTN = {
  primary:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
  success:
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:opacity-50",
  dark:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-neutral-900/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/30 disabled:cursor-not-allowed disabled:opacity-50",
  teal:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/40 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
};

/* ═══════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════ */
const PATHS = {
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  x: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7",
  star: "m12 3 2.6 5.6 6 .7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.2 6-.7Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  warn: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5",
  crown: "m4 17 1.5-9L9 12l3-6 3 6 3.5-4L20 17H4Z",
  spark: "M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2",
  arrow: "M5 12h14M13 6l6 6-6 6",
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  ban: "M18.4 5.6 5.6 18.4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
};

const Icon = ({ name, className = "h-4 w-4", sw = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    className={className}
    aria-hidden="true"
  >
    <path d={PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════ */
const initialApplications = [
  {
    id: "app1",
    name: "Coastal Goods BD",
    owner: "Farhan Kabir",
    email: "farhan@coastalgoods.example",
    phone: "+880 1711-222001",
    location: "Cox's Bazar",
    address: "Shop 14, Marine Drive Market, Cox's Bazar",
    applied: "2 days ago",
    category: "Home & Kitchen",
    experience: "3 years selling on local Facebook marketplace groups, ~40 orders/month.",
    desc: "Family-run shop sourcing handmade coconut-shell kitchenware and jute home decor directly from local artisans in Cox's Bazar.",
    license: true,
    nid: true,
    bank: false,
    documents: [
      { name: "Trade license", ok: true },
      { name: "National ID", ok: true },
      { name: "Bank statement", ok: false },
      { name: "Product sample photos", ok: true },
    ],
  },
  {
    id: "app2",
    name: "Prime Gadgets",
    owner: "Shuvo Das",
    email: "shuvo@primegadgets.example",
    phone: "+880 1811-222002",
    location: "Dhaka",
    address: "Level 3, Elephant Road Electronics Market, Dhaka",
    applied: "3 days ago",
    category: "Electronics",
    experience: "Runs a physical electronics shop for 6 years, wants to expand online.",
    desc: "Imports and resells audio accessories, chargers and smart home gadgets. Already has supplier relationships for bulk pricing.",
    license: true,
    nid: true,
    bank: true,
    documents: [
      { name: "Trade license", ok: true },
      { name: "National ID", ok: true },
      { name: "Bank statement", ok: true },
      { name: "Product sample photos", ok: true },
    ],
  },
  {
    id: "app3",
    name: "Little Steps",
    owner: "Nabila Haque",
    email: "nabila@littlesteps.example",
    phone: "+880 1911-222003",
    location: "Rajshahi",
    address: "House 7, Shaheb Bazar, Rajshahi",
    applied: "5 days ago",
    category: "Toys & Baby",
    experience: "New seller, previously worked at a childcare products distributor.",
    desc: "Curated baby-safe toys and feeding accessories, sourced from certified BPA-free manufacturers.",
    license: false,
    nid: true,
    bank: false,
    documents: [
      { name: "Trade license", ok: false },
      { name: "National ID", ok: true },
      { name: "Bank statement", ok: false },
      { name: "Product sample photos", ok: false },
    ],
  },
];

const initialResellers = [
  {
    id: "r1",
    name: "Bilash Traders",
    owner: "Rafiul Islam",
    email: "bilash@example.com",
    phone: "+880 1711-000111",
    location: "Chattogram",
    joined: "Mar 2024",
    rating: 4.8,
    revenue: 48200,
    commissionOwed: 3856,
    liveProducts: 42,
    approvalRate: 96,
    status: "active",
    license: true,
    nid: true,
    bank: true,
    commissionRate: 8,
    trend: [30, 34, 33, 38, 41, 44, 48],
    payouts: [
      { date: "20 Sep 2026", amount: 4200, status: "Paid" },
      { date: "20 Aug 2026", amount: 3950, status: "Paid" },
      { date: "20 Jul 2026", amount: 3600, status: "Paid" },
    ],
  },
  {
    id: "r2",
    name: "Nur Enterprise",
    owner: "Nurul Amin",
    email: "nur@example.com",
    phone: "+880 1811-000222",
    location: "Dhaka",
    joined: "Nov 2024",
    rating: 4.5,
    revenue: 29800,
    commissionOwed: 2384,
    liveProducts: 27,
    approvalRate: 88,
    status: "active",
    license: true,
    nid: true,
    bank: true,
    commissionRate: 10,
    trend: [18, 20, 24, 22, 26, 28, 30],
    payouts: [
      { date: "20 Sep 2026", amount: 2650, status: "Paid" },
      { date: "20 Aug 2026", amount: 2210, status: "Paid" },
    ],
  },
  {
    id: "r3",
    name: "Green Valley Shop",
    owner: "Sumaiya Akter",
    email: "greenvalley@example.com",
    phone: "+880 1611-000555",
    location: "Sylhet",
    joined: "Aug 2025",
    rating: 4.6,
    revenue: 18400,
    commissionOwed: 1472,
    liveProducts: 19,
    approvalRate: 91,
    status: "active",
    license: true,
    nid: true,
    bank: true,
    commissionRate: 9,
    trend: [10, 11, 13, 15, 14, 17, 18],
    payouts: [{ date: "20 Sep 2026", amount: 1620, status: "Paid" }],
  },
  {
    id: "r4",
    name: "Al-Amin Store",
    owner: "Al-Amin Hossain",
    email: "alamin@example.com",
    phone: "+880 1911-000333",
    location: "Khulna",
    joined: "Feb 2025",
    rating: 4.2,
    revenue: 12850,
    commissionOwed: 1028,
    liveProducts: 15,
    approvalRate: 79,
    status: "warning",
    license: false,
    nid: true,
    bank: true,
    commissionRate: 10,
    trend: [14, 13, 12, 13, 11, 12, 12],
    payouts: [
      { date: "20 Sep 2026", amount: 940, status: "Pending" },
      { date: "20 Aug 2026", amount: 1100, status: "Paid" },
    ],
  },
  {
    id: "r5",
    name: "Zaman Retail",
    owner: "Tariq Zaman",
    email: "zaman@example.com",
    phone: "+880 1511-000444",
    location: "Rajshahi",
    joined: "Jun 2025",
    rating: 3.6,
    revenue: 4240,
    commissionOwed: 339,
    liveProducts: 8,
    approvalRate: 61,
    status: "suspended",
    license: false,
    nid: true,
    bank: false,
    commissionRate: 12,
    trend: [9, 8, 7, 6, 5, 4, 4],
    payouts: [{ date: "20 Aug 2026", amount: 410, status: "Paid" }],
  },
];

const medal = ["#FFCB6B", "#C9D3DC", "#D8985A"];

const statusMeta = {
  active: {
    label: "Active",
    dot: "bg-gradient-to-br from-teal-400 to-teal-600",
    text: "text-teal-600",
    chip: "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 ring-1 ring-teal-200",
  },
  warning: {
    label: "Warning",
    dot: "bg-gradient-to-br from-amber-400 to-orange-500",
    text: "text-orange-600",
    chip: "bg-gradient-to-r from-amber-50 to-orange-100 text-orange-700 ring-1 ring-orange-200",
  },
  suspended: {
    label: "Suspended",
    dot: "bg-gradient-to-br from-neutral-400 to-neutral-600",
    text: "text-neutral-600",
    chip: "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 ring-1 ring-neutral-300",
  },
};

/* ═══════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════ */
const Stars = ({ v = 0 }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon
        key={n}
        name="star"
        className={
          "h-3 w-3 " +
          (n <= Math.round(v)
            ? "fill-orange-500 text-orange-500"
            : "fill-neutral-200 text-neutral-200")
        }
      />
    ))}
  </span>
);

function Sparkline({ data, className = "" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data),
    min = Math.min(...data),
    range = max - min || 1;
  const w = 64,
    h = 22,
    step = w / (data.length - 1);
  const pts = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ═══════════════════════════════════════════════════════════ */
function ConfirmDialog({ title, description, confirmLabel = "Confirm", tone = "primary", summary = [], fields = [], onConfirm, onClose }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ""])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const missing = fields.some((f) => f.required && !values[f.name].trim());

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  const submit = async () => {
    if (missing || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm(values);
      onClose();
    } catch (e) {
      setError(e?.message || "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-neutral-900/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={() => !busy && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">{description}</p>
        )}

        {summary.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2 rounded-2xl bg-neutral-50 p-4">
            {summary.map(([l, v]) => (
              <li key={l} className="flex items-baseline gap-2 text-sm">
                <span className="text-neutral-500">{l}</span>
                <span className="min-w-4 flex-1 border-b border-dotted border-neutral-300" />
                <span className="font-semibold tabular-nums text-neutral-900">{v}</span>
              </li>
            ))}
          </ul>
        )}

        {fields.map((f, i) => (
          <label key={f.name} className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-neutral-900">
              {f.label}
              {f.required ? (
                <span className="text-red-500"> *</span>
              ) : (
                <span className="font-normal text-neutral-400"> (optional)</span>
              )}
            </span>
            <input
              value={values[f.name]}
              onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))}
              placeholder={f.placeholder}
              disabled={busy}
              autoFocus={i === 0}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5"
            />
          </label>
        ))}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className={cx(BTN.ghost, "flex-1")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={missing || busy}
            className={cx(tone === "danger" ? BTN.danger : BTN.primary, "flex-[1.4]")}
          >
            {busy && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ResellersPage() {
  const [apps, setApps] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [viewApp, setViewApp] = useState(null);
  const [rateDraft, setRateDraft] = useState(null);
  const [confirm, setConfirm] = useState(null);

  /* ---------- load ---------- */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 400));
          if (!cancelled) {
            setApps(initialApplications);
            setResellers(initialResellers);
          }
        } else {
          const [appsData, resellersData] = await Promise.all([
            api("/api/v1/admin/resellers/applications", { params: { status: "pending" } }),
            api("/api/v1/admin/resellers", { params: { limit: 100 } }),
          ]);
          if (!cancelled) {
            setApps(appsData?.items ?? appsData ?? []);
            setResellers(resellersData?.items ?? resellersData ?? []);
          }
        }
      } catch (e) {
        toast.error(e?.message || "Could not load resellers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  /* ---------- esc ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setViewApp(null);
        setConfirm(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- derived ---------- */
  const ranked = useMemo(
    () => [...resellers].sort((a, b) => b.revenue - a.revenue),
    [resellers]
  );
  const maxRevenue = Math.max(...ranked.map((r) => r.revenue), 1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (!q || `${r.name} ${r.owner} ${r.location}`.toLowerCase().includes(q))
    );
  }, [ranked, query, status]);

  const opened = resellers.find((r) => r.id === openId) || null;

  /* ---------- actions ---------- */
  const performApprove = async (app) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      setApps((cur) => cur.filter((a) => a.id !== app.id));
      const r = {
        id: `r${Date.now()}`,
        name: app.name,
        owner: app.owner,
        email: app.email,
        phone: app.phone,
        location: app.location,
        joined: "Just now",
        rating: 0,
        revenue: 0,
        commissionOwed: 0,
        liveProducts: 0,
        approvalRate: 100,
        status: "active",
        license: app.license,
        nid: app.nid,
        bank: app.bank,
        commissionRate: 10,
        trend: [0, 0, 0, 0, 0, 0, 0],
        payouts: [],
      };
      setResellers((cur) => [...cur, r]);
      toast.success(`${app.name} approved & onboarded`);
    } else {
      await api(`/api/v1/admin/resellers/applications/${app.id}/approve`, { method: "POST" });
      setApps((cur) => cur.filter((a) => a.id !== app.id));
      const fresh = await api("/api/v1/admin/resellers", { params: { limit: 100 } });
      setResellers(fresh?.items ?? fresh ?? []);
      toast.success(`${app.name} approved & onboarded`);
    }
    setViewApp(null);
    setConfirm(null);
  };

  const performReject = async (app, reason) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      setApps((cur) => cur.filter((a) => a.id !== app.id));
      toast.success(`${app.name} rejected`);
    } else {
      await api(`/api/v1/admin/resellers/applications/${app.id}/reject`, {
        method: "POST",
        body: { reason },
      });
      setApps((cur) => cur.filter((a) => a.id !== app.id));
      toast.success(`${app.name} rejected`);
    }
    setViewApp(null);
    setConfirm(null);
  };

  const setResellerStatus = async (r, s) => {
    try {
      if (USE_MOCK) {
        await new Promise((res) => setTimeout(res, 300));
        setResellers((cur) => cur.map((x) => (x.id === r.id ? { ...x, status: s } : x)));
      } else {
        await api(`/api/v1/admin/resellers/${r.id}/status`, {
          method: "PATCH",
          body: { status: s },
        });
        setResellers((cur) => cur.map((x) => (x.id === r.id ? { ...x, status: s } : x)));
      }
      toast.success(`${r.name} marked ${statusMeta[s].label.toLowerCase()}`);
    } catch (e) {
      toast.error(e?.message || "Could not update status");
    }
  };

  const saveRate = async () => {
    if (!opened || rateDraft === null) return;
    try {
      if (USE_MOCK) {
        await new Promise((res) => setTimeout(res, 300));
        setResellers((cur) =>
          cur.map((x) => (x.id === opened.id ? { ...x, commissionRate: rateDraft } : x))
        );
      } else {
        await api(`/api/v1/admin/resellers/${opened.id}/commission-rate`, {
          method: "PATCH",
          body: { commission_rate: rateDraft },
        });
        setResellers((cur) =>
          cur.map((x) => (x.id === opened.id ? { ...x, commissionRate: rateDraft } : x))
        );
      }
      toast.success("Commission rate updated");
      setRateDraft(null);
    } catch (e) {
      toast.error(e?.message || "Could not save rate");
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen w-full">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "!rounded-full !bg-neutral-900 !text-white !text-sm !font-medium !shadow-2xl !border-0",
          duration: 3000,
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-8">
        {/* ───── HEADER ───── */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="spark" className="h-3.5 w-3.5 text-orange-500" sw={2.5} />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-500">
                Partners
              </p>
              {USE_MOCK && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                  DEMO
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
              Resellers
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Review new applications and manage the partners selling on your marketplace.
            </p>
          </div>
        </header>

        {/* ───── APPLICATIONS STRIP ───── */}
        {apps.length > 0 && (
          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">New applications</h2>
                <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  {apps.length} waiting
                </span>
              </div>
            </div>

            <div className="-mx-1 flex snap-x items-stretch gap-3 overflow-x-auto px-1 pb-2">
              {apps.map((a) => {
                const docsOk = a.documents.filter((d) => d.ok).length;
                const docsPct = (docsOk / a.documents.length) * 100;
                return (
                  <div
                    key={a.id}
                    className="group flex h-[220px] w-[320px] shrink-0 snap-start flex-col rounded-2xl border-2 border-neutral-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/30">
                        {initials(a.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-neutral-900">{a.name}</p>
                        <p className="truncate text-xs text-neutral-500">
                          {a.owner} · {a.location}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                        {a.applied}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
                        {a.category}
                      </span>
                      {a.license && (
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 font-semibold text-teal-700 ring-1 ring-teal-200">
                          ✓ License
                        </span>
                      )}
                      {a.nid && (
                        <span className="rounded-full bg-teal-50 px-2 py-0.5 font-semibold text-teal-700 ring-1 ring-teal-200">
                          ✓ NID
                        </span>
                      )}
                      {!a.bank && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 font-semibold text-orange-700 ring-1 ring-orange-200">
                          ⚠ No bank
                        </span>
                      )}
                    </div>

                    {/* Docs progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-600">
                          Document completeness
                        </span>
                        <span className="tabular-nums text-neutral-500">
                          {docsOk}/{a.documents.length}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className={cx(
                            "h-full rounded-full transition-all",
                            docsPct === 100
                              ? "bg-gradient-to-r from-teal-500 to-teal-600"
                              : docsPct >= 50
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-red-500 to-red-600"
                          )}
                          style={{ width: `${docsPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions — mt-auto pushes to bottom */}
                    <div className="mt-auto flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setViewApp(a)}
                        className={cx(BTN.ghost, "flex-1 !px-3 !py-2 !text-xs")}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirm({ kind: "reject", app: a })}
                        title="Reject"
                        className={cx(BTN.danger, "!px-3 !py-2")}
                      >
                        <Icon name="x" className="h-3.5 w-3.5" sw={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirm({ kind: "approve", app: a })}
                        title="Approve"
                        className={cx(BTN.success, "!px-3 !py-2")}
                      >
                        <Icon name="check" className="h-3.5 w-3.5" sw={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ───── LEADERBOARD ───── */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Leaderboard</h2>
              <p className="text-xs text-neutral-500">Ranked by revenue</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
                {[
                  ["all", "All"],
                  ["active", "Active"],
                  ["warning", "Warning"],
                  ["suspended", "Suspended"],
                ].map(([k, l]) => {
                  const on = status === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setStatus(k)}
                      className={cx(
                        "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                        on
                          ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/25"
                          : "text-neutral-500 hover:text-neutral-900"
                      )}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
              <label className="relative hidden sm:block">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search partner..."
                  className="w-56 rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5"
                />
              </label>
            </div>
          </div>

          <ul className="divide-y divide-neutral-100">
            {filtered.map((r, idx) => {
              const meta = statusMeta[r.status];
              const top3 = idx < 3 && status === "all" && !query;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(r.id)}
                    className="flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 sm:px-5"
                  >
                    <span className="grid w-6 shrink-0 place-items-center">
                      {top3 ? (
                        <Icon
                          name="crown"
                          className="h-4 w-4"
                          sw={1.6}
                          style={{ color: medal[idx] }}
                        />
                      ) : (
                        <span className="text-sm font-bold tabular-nums text-neutral-400">
                          {idx + 1}
                        </span>
                      )}
                    </span>

                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-xs font-bold text-white shadow-md">
                      {initials(r.name)}
                      <span
                        className={cx(
                          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white",
                          meta.dot
                        )}
                      />
                    </span>

                    <span className="min-w-0 flex-[1.3]">
                      <span className="block truncate text-sm font-bold text-neutral-900">
                        {r.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Stars v={r.rating} /> {r.location}
                      </span>
                    </span>

                    <span className="hidden flex-1 sm:block">
                      <span className="flex items-baseline justify-between text-xs">
                        <span className="text-sm font-bold tabular-nums text-neutral-900">
                          {money(r.revenue)}
                        </span>
                        <span className="text-neutral-400">revenue</span>
                      </span>
                      <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] transition-all"
                          style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                        />
                      </span>
                    </span>

                    <span
                      className={cx(
                        "hidden shrink-0 md:block",
                        r.trend[6] >= r.trend[0] ? "text-teal-500" : "text-orange-500"
                      )}
                    >
                      <Sparkline data={r.trend} className="h-5 w-16" />
                    </span>

                    <span className="hidden w-20 shrink-0 text-center lg:block">
                      <span
                        className={cx(
                          "block text-sm font-bold tabular-nums",
                          r.approvalRate < 80 ? "text-orange-600" : "text-neutral-900"
                        )}
                      >
                        {r.approvalRate}%
                      </span>
                      <span className="block text-[11px] text-neutral-500">approved</span>
                    </span>

                    <span
                      className={cx(
                        "hidden w-24 shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-bold sm:block",
                        meta.chip
                      )}
                    >
                      {meta.label}
                    </span>

                    <Icon name="arrow" className="hidden h-4 w-4 shrink-0 text-neutral-300 sm:block" />
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-5 py-14 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-3 text-sm font-semibold text-neutral-700">No partners found</p>
                <p className="mt-1 text-xs text-neutral-500">Try a different filter or search</p>
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* ═══ APPLICATION DETAIL MODAL ═══ */}
      {viewApp && (
        <ApplicationModal
          app={viewApp}
          onClose={() => setViewApp(null)}
          onApprove={() => setConfirm({ kind: "approve", app: viewApp })}
          onReject={() => setConfirm({ kind: "reject", app: viewApp })}
        />
      )}

      {/* ═══ CONFIRM DIALOGS ═══ */}
      {confirm?.kind === "approve" && (
        <ConfirmDialog
          title="Approve this application?"
          description={`${confirm.app.name} will be onboarded as a new reseller and can start listing products.`}
          summary={[
            ["Business", confirm.app.name],
            ["Owner", confirm.app.owner],
            ["Category", confirm.app.category],
            ["Location", confirm.app.location],
          ]}
          confirmLabel="Approve & onboard"
          onConfirm={() => performApprove(confirm.app)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === "reject" && (
        <ConfirmDialog
          title="Reject this application?"
          description={`${confirm.app.name} will be notified. The reason will be shown to them.`}
          tone="danger"
          summary={[
            ["Business", confirm.app.name],
            ["Owner", confirm.app.owner],
          ]}
          fields={[
            {
              name: "reason",
              label: "Reason",
              placeholder: "e.g. Documents incomplete",
              required: true,
            },
          ]}
          confirmLabel="Reject application"
          onConfirm={({ reason }) => performReject(confirm.app, reason.trim())}
          onClose={() => setConfirm(null)}
        />
      )}

      {/* ═══ RESELLER DETAIL DRAWER ═══ */}
      {opened && (
        <ResellerDrawer
          reseller={opened}
          onClose={() => {
            setOpenId(null);
            setRateDraft(null);
          }}
          onChangeStatus={setResellerStatus}
          rateDraft={rateDraft}
          setRateDraft={setRateDraft}
          onSaveRate={saveRate}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APPLICATION DETAIL MODAL
   ═══════════════════════════════════════════════════════════ */
function ApplicationModal({ app, onClose, onApprove, onReject }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-neutral-900/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="border-b border-neutral-100 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-md shadow-orange-500/30">
              {initials(app.name)}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-neutral-900">{app.name}</h2>
              <p className="text-sm text-neutral-500">
                {app.owner} · applied {app.applied}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100"
            >
              <Icon name="x" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          <p className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-700">
            {app.desc}
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-neutral-200 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Category
              </p>
              <p className="mt-0.5 font-semibold text-neutral-800">{app.category}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Location
              </p>
              <p className="mt-0.5 font-semibold text-neutral-800">{app.location}</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-sm">
            {[
              ["mail", app.email],
              ["phone", app.phone],
              ["pin", app.address],
            ].map(([ic, t]) => (
              <li key={t} className="flex items-start gap-2.5 text-neutral-600">
                <Icon name={ic} className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Experience
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{app.experience}</p>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Submitted documents
            </h3>
            <ul className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {app.documents.map((d) => (
                <li key={d.name} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <Icon name="doc" className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span className="flex-1 font-medium text-neutral-700">{d.name}</span>
                  <span
                    className={cx(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                      d.ok
                        ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                    )}
                  >
                    <Icon name={d.ok ? "check" : "warn"} className="h-3 w-3" sw={2.5} />
                    {d.ok ? "Received" : "Missing"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-neutral-100 bg-neutral-50/50 p-5">
          <button type="button" onClick={onReject} className={cx(BTN.ghost, "flex-1")}>
            Reject
          </button>
          <button type="button" onClick={onApprove} className={cx(BTN.primary, "flex-1")}>
            <Icon name="check" className="h-4 w-4" sw={2.5} />
            Approve & onboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESELLER DETAIL DRAWER
   ═══════════════════════════════════════════════════════════ */
function ResellerDrawer({ reseller: r, onClose, onChangeStatus, rateDraft, setRateDraft, onSaveRate }) {
  const meta = statusMeta[r.status];
  const rateChanged = rateDraft !== null && rateDraft !== r.commissionRate;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm"
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-white shadow-2xl sm:w-[460px]">
        {/* Header */}
        <div className="border-b border-neutral-100 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-900 text-base font-bold text-white shadow-md">
                {initials(r.name)}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-neutral-900">{r.name}</h2>
                <p className="text-sm text-neutral-500">
                  {r.owner} · since {r.joined}
                </p>
                <span
                  className={cx(
                    "mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                    meta.chip
                  )}
                >
                  <span className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} />
                  {meta.label}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-100"
            >
              <Icon name="x" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 p-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Revenue", money(r.revenue), "text-neutral-900"],
              ["Products", r.liveProducts, "text-neutral-900"],
              ["Approved", `${r.approvalRate}%`, r.approvalRate < 80 ? "text-orange-600" : "text-teal-600"],
            ].map(([k, v, color]) => (
              <div
                key={k}
                className="rounded-2xl border border-neutral-200 bg-white p-3 text-center"
              >
                <p className={cx("text-base font-bold tabular-nums", color)}>{v}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  {k}
                </p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <ul className="space-y-2.5 text-sm">
            {[
              ["mail", r.email],
              ["phone", r.phone],
              ["pin", r.location],
            ].map(([ic, t]) => (
              <li key={t} className="flex items-center gap-2.5 text-neutral-600">
                <Icon name={ic} className="h-4 w-4 shrink-0 text-neutral-400" />
                <span className="truncate">{t}</span>
              </li>
            ))}
          </ul>

          {/* Verification */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Verification</h3>
            <ul className="mt-2 space-y-2">
              {[
                ["Trade license", r.license],
                ["National ID", r.nid],
                ["Bank account", r.bank],
              ].map(([k, ok]) => (
                <li key={k} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={cx(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full text-white",
                      ok
                        ? "bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm shadow-teal-500/30"
                        : "bg-neutral-300"
                    )}
                  >
                    <Icon name={ok ? "check" : "x"} className="h-3 w-3" sw={3} />
                  </span>
                  <span className="text-neutral-700">{k}</span>
                  <span
                    className={cx(
                      "ml-auto text-xs font-semibold",
                      ok ? "text-teal-600" : "text-neutral-400"
                    )}
                  >
                    {ok ? "Verified" : "Missing"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Commission rate */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Commission rate</h3>
              <span className="text-lg font-bold tabular-nums text-neutral-900">
                {rateDraft ?? r.commissionRate}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={rateDraft ?? r.commissionRate}
              onChange={(e) => setRateDraft(Number(e.target.value))}
              className="mt-3 w-full cursor-pointer accent-[var(--color-brand-orange)]"
            />
            {rateChanged && (
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRateDraft(null)}
                  className={cx(BTN.ghost, "!px-3 !py-1.5 !text-xs")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSaveRate}
                  className={cx(BTN.primary, "!px-3 !py-1.5 !text-xs")}
                >
                  Save rate
                </button>
              </div>
            )}
          </div>

          {/* Payout history */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Payout history</h3>
              <span className="text-xs text-neutral-500">
                {money(r.commissionOwed)} owed now
              </span>
            </div>
            <ul className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {r.payouts.length === 0 && (
                <li className="px-4 py-3 text-sm text-neutral-400">No payouts yet.</li>
              )}
              {r.payouts.map((p) => (
                <li key={p.date} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-neutral-600">{p.date}</span>
                  <span className="font-bold tabular-nums text-neutral-900">
                    {money(p.amount)}
                  </span>
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      p.status === "Paid"
                        ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                    )}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 border-t border-neutral-100 bg-neutral-50/50 p-4">
          {r.status !== "suspended" ? (
            <>
              {r.status === "active" ? (
                <button
                  type="button"
                  onClick={() => onChangeStatus(r, "warning")}
                  className={cx(BTN.ghost, "flex-1")}
                >
                  <Icon name="alert" className="h-4 w-4" />
                  Warn
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onChangeStatus(r, "active")}
                  className={cx(BTN.success, "flex-1")}
                >
                  <Icon name="check" className="h-4 w-4" />
                  Clear warning
                </button>
              )}
              <button
                type="button"
                onClick={() => onChangeStatus(r, "suspended")}
                className={cx(BTN.danger, "flex-1")}
              >
                <Icon name="ban" className="h-4 w-4" />
                Suspend
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onChangeStatus(r, "active")}
              className={cx(BTN.teal, "flex-1")}
            >
              <Icon name="check" className="h-4 w-4" />
              Reinstate
            </button>
          )}
        </div>
      </aside>
    </>
  );
}