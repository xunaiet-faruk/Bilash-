"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
   SHARED BUTTON STYLES
   ═══════════════════════════════════════════════════════════ */
const BTN = {
  // 🟠 Primary — orange gradient
  primary:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
  primaryLg:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
  // 🟢 Success — emerald gradient
  success:
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
  // 🔴 Danger — red gradient
  danger:
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
  // ⚫ Dark — neutral gradient
  dark:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-neutral-900/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
  // ⚪ Ghost — white with border
  ghost:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
  // 🟣 Violet — commission accent
  violet:
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none",
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */
const cx = (...a) => a.filter(Boolean).join(" ");
const H = 3600e3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);

const taka = (n = 0) => `৳${Math.abs(Math.round(Number(n))).toLocaleString("en-IN")}`;
const takaShort = (n = 0) => {
  const v = Math.abs(n);
  if (v >= 1e7) return `৳${(v / 1e7).toFixed(2)}Cr`;
  if (v >= 1e5) return `৳${(v / 1e5).toFixed(2)}L`;
  if (v >= 1e3) return `৳${(v / 1e3).toFixed(1)}K`;
  return `৳${v}`;
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
  return h < 24 ? `${Math.max(1, Math.round(h))}h` : `${Math.round(h / 24)}d`;
};
const initials = (s = "") => s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const mask = (a = "") => (a.length > 6 ? `${a.slice(0, 3)}••••${a.slice(-3)}` : a);

const PATHS = {
  check: "M5 13l4 4L19 7",
  x: "M6 6l12 12M18 6L6 18",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  unlock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-2",
  percent: "M19 5 5 19M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  wallet: "M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2z",
  spark: "M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2",
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

const PAYOUT_STATUS = { PENDING: "pending", REQUESTED: "pending", APPROVED: "approved", PROCESSING: "approved", COMPLETED: "paid", PAID: "paid", SUCCESS: "paid", REJECTED: "rejected", FAILED: "rejected", CANCELLED: "rejected" };
const ESCROW_STATUS = { HELD: "held", PENDING: "held", FUNDED: "held", DISPUTED: "disputed", ON_HOLD: "disputed", RELEASED: "released", COMPLETED: "released" };

const normPayout = (r) => {
  const amount = num(r.amount), fee = num(r.fee, r.platform_fee, r.charge);
  return {
    id: str(r.id, r.payout_id),
    name: str(r.user?.name, r.vendor_name, r.requester_name, r.name, "Unknown"),
    role: str(r.user?.role, r.role, "seller").toLowerCase(),
    amount, fee, net: num(r.net_amount, amount - fee),
    method: str(r.method, r.payment_method, "bKash"),
    account: str(r.account_number, r.account, r.wallet_number),
    status: PAYOUT_STATUS[str(r.status).toUpperCase()] ?? "pending",
    createdAt: str(r.created_at, r.requested_at),
    paidAt: str(r.paid_at, r.processed_at),
    reference: str(r.transaction_ref, r.reference),
    reason: str(r.reject_reason, r.reason, r.note),
  };
};

const normEscrow = (r) => ({
  id: str(r.id, r.escrow_id),
  orderId: str(r.order_id, r.order?.number, r.order?.id),
  seller: str(r.seller?.name, r.seller_name, r.vendor_name, "Seller"),
  buyer: str(r.buyer?.name, r.buyer_name, r.customer_name, "Customer"),
  amount: num(r.amount),
  status: ESCROW_STATUS[str(r.status).toUpperCase()] ?? "held",
  heldAt: str(r.held_at, r.created_at),
  releaseAt: str(r.release_at, r.auto_release_at, r.release_date),
  disputeReason: str(r.dispute_reason, r.dispute?.reason),
});

const normCommissions = (r = {}) => ({
  thisMonth: num(r.this_month),
  lastMonth: num(r.last_month),
  defaultRate: num(r.rates?.default, r.default_rate, 10),
  categories: arr(r.rates?.categories ?? r.categories).map((c) => ({
    id: str(c.id, c.category_id),
    name: str(c.name, c.category_name),
    rate: num(c.rate, c.commission_rate),
  })),
});

const auditKind = (s) => (/approv/i.test(s) ? "approve" : /paid|process|complet/i.test(s) ? "pay" : /reject/i.test(s) ? "reject" : /release/i.test(s) ? "release" : /commission|rate/i.test(s) ? "rate" : "other");

const normAudit = (r) => {
  const action = str(r.action, r.event);
  const text = str(r.description, r.details, `${action} ${str(r.target, r.entity, r.resource)}`).replace(/[._]/g, " ");
  return {
    id: str(r.id),
    who: str(r.admin?.name, r.admin_name, r.actor?.name, r.actor_name, r.user?.name, "Admin"),
    text, kind: auditKind(`${action} ${text}`),
    amount: num(r.amount, r.metadata?.amount),
    reason: str(r.reason, r.metadata?.reason),
    at: str(r.created_at, r.at, r.timestamp),
  };
};

/* ═══════════════════════════════════════════════════════════
   MOCK STORE
   ═══════════════════════════════════════════════════════════ */
const ago = (h) => new Date(Date.now() - h * H).toISOString();
const ahead = (h) => new Date(Date.now() + h * H).toISOString();

const db = {
  payouts: [
    { id: "PO-1051", status: "PENDING", amount: 48500, fee: 485, method: "bKash", account_number: "01711000111", created_at: ago(76), user: { name: "Bilash Traders", role: "VENDOR" } },
    { id: "PO-1050", status: "PENDING", amount: 12800, fee: 128, method: "Nagad", account_number: "01811000222", created_at: ago(51), user: { name: "Nur Enterprise", role: "RESELLER" } },
    { id: "PO-1049", status: "PENDING", amount: 3150, fee: 32, method: "bKash", account_number: "01911000333", created_at: ago(20), user: { name: "Tanvir Ahmed", role: "AFFILIATE" } },
    { id: "PO-1048", status: "PENDING", amount: 96000, fee: 960, method: "Bank", account_number: "1103400221987", created_at: ago(7), user: { name: "Zaman Retail", role: "VENDOR" } },
    { id: "PO-1047", status: "APPROVED", amount: 27400, fee: 274, method: "bKash", account_number: "01611000444", created_at: ago(30), user: { name: "Green Valley Shop", role: "RESELLER" } },
    { id: "PO-1046", status: "APPROVED", amount: 18900, fee: 189, method: "Nagad", account_number: "01511000555", created_at: ago(34), user: { name: "Al-Amin Store", role: "VENDOR" } },
    { id: "PO-1045", status: "COMPLETED", amount: 61200, fee: 612, method: "Bank", account_number: "2205500118842", created_at: ago(90), paid_at: ago(60), transaction_ref: "BK-77120934", user: { name: "Bilash Traders", role: "VENDOR" } },
    { id: "PO-1044", status: "COMPLETED", amount: 8400, fee: 84, method: "bKash", account_number: "01311000666", created_at: ago(120), paid_at: ago(100), transaction_ref: "8K2L9X3M", user: { name: "Rumana Islam", role: "AFFILIATE" } },
    { id: "PO-1043", status: "REJECTED", amount: 5000, fee: 50, method: "bKash", account_number: "01211000777", created_at: ago(140), reject_reason: "KYC not verified", user: { name: "Kamal Hossain", role: "RESELLER" } },
  ],
  escrow: [
    { id: "ES-3301", order_id: "A-2289", status: "HELD", amount: 63900, held_at: ago(96), release_at: ahead(6), seller: { name: "Bilash Traders" }, buyer: { name: "Tanvir Ahmed" } },
    { id: "ES-3302", order_id: "A-2288", status: "HELD", amount: 15200, held_at: ago(40), release_at: ahead(80), seller: { name: "Zaman Retail" }, buyer: { name: "Farzana Akter" } },
    { id: "ES-3303", order_id: "A-2292", status: "DISPUTED", amount: 42000, held_at: ago(110), release_at: ahead(10), seller: { name: "Nur Enterprise" }, buyer: { name: "Sadia Rahman" }, dispute_reason: "Item not as described" },
    { id: "ES-3304", order_id: "A-2293", status: "HELD", amount: 8900, held_at: ago(12), release_at: ahead(132), seller: { name: "Green Valley Shop" }, buyer: { name: "Imran Kabir" } },
    { id: "ES-3305", order_id: "A-2294", status: "HELD", amount: 128000, held_at: ago(70), release_at: ahead(40), seller: { name: "Al-Amin Store" }, buyer: { name: "Mahin Chowdhury" } },
  ],
  rates: {
    default: 10,
    categories: [
      { id: "electronics", name: "Electronics", rate: 8 },
      { id: "fashion", name: "Fashion", rate: 14 },
      { id: "home", name: "Home & Living", rate: 12 },
      { id: "beauty", name: "Beauty", rate: 15 },
      { id: "grocery", name: "Grocery", rate: 6 },
    ],
  },
  audit: [
    { id: "a3", admin: { name: "Rahim" }, action: "payout.paid", description: "Paid PO-1045 to Bilash Traders", amount: 61200, reason: "BK-77120934", created_at: ago(60) },
    { id: "a2", admin: { name: "Rahim" }, action: "payout.rejected", description: "Rejected PO-1043 from Kamal Hossain", amount: 5000, reason: "KYC not verified", created_at: ago(70) },
    { id: "a1", admin: { name: "Sumaiya" }, action: "commission.updated", description: "Changed Fashion commission from 12% to 14%", created_at: ago(120) },
  ],
};

const log = (action, description, amount, reason) =>
  db.audit.unshift({ id: `a${Date.now()}`, admin: { name: "You" }, action, description, amount, reason, created_at: new Date().toISOString() });

/* ═══════════════════════════════════════════════════════════
   API
   ═══════════════════════════════════════════════════════════ */
async function fetchFinance() {
  if (USE_MOCK) {
    await sleep(400);
    return {
      payouts: db.payouts.map(normPayout),
      escrow: db.escrow.map(normEscrow).filter((e) => e.status !== "released"),
      commissions: normCommissions({ this_month: 84300, last_month: 71200, rates: db.rates }),
      audit: db.audit.map(normAudit),
    };
  }
  const [p, e, c, a] = await Promise.all([
    request("/api/v1/admin/finance/payouts", { params: { limit: 100 } }),
    request("/api/v1/admin/finance/escrow", { params: { limit: 100 } }),
    request("/api/v1/admin/finance/commissions"),
    request("/api/v1/admin/settings/audit-logs", { params: { limit: 100 } }),
  ]);
  return {
    payouts: arr(p, "items", "payouts", "requests").map(normPayout),
    escrow: arr(e, "items", "escrow", "holdings").map(normEscrow).filter((x) => x.status !== "released"),
    commissions: normCommissions(c),
    audit: arr(a, "items", "logs").map(normAudit).filter((x) => /payout|escrow|commission|wallet|finance/i.test(x.text)),
  };
}

const API = {
  async approve(ids) {
    if (USE_MOCK) {
      await sleep(400);
      db.payouts.filter((p) => ids.includes(p.id)).forEach((p) => {
        p.status = "APPROVED";
        log("payout.approved", `Approved ${p.id} for ${p.user.name}`, p.amount);
      });
      return;
    }
    return request("/api/v1/admin/finance/payouts/approve", { method: "POST", body: { payout_ids: ids } });
  },
  async pay(id, reference) {
    if (USE_MOCK) {
      await sleep(500);
      const p = db.payouts.find((x) => x.id === id);
      Object.assign(p, { status: "COMPLETED", transaction_ref: reference, paid_at: new Date().toISOString() });
      log("payout.paid", `Paid ${id} to ${p.user.name}`, p.amount, reference);
      return;
    }
    return request("/api/v1/admin/finance/payouts/process", { method: "POST", body: { payout_id: id, transaction_ref: reference } });
  },
  async reject(id, reason) {
    if (USE_MOCK) {
      await sleep(400);
      const p = db.payouts.find((x) => x.id === id);
      Object.assign(p, { status: "REJECTED", reject_reason: reason });
      log("payout.rejected", `Rejected ${id} from ${p.user.name}`, p.amount, reason);
      return;
    }
    return request(`/api/v1/admin/finance/payouts/${id}`, { method: "PUT", body: { status: "REJECTED", reason } });
  },
  async release(id, reason) {
    if (USE_MOCK) {
      await sleep(500);
      const e = db.escrow.find((x) => x.id === id);
      e.status = "RELEASED";
      log("escrow.released", `Released order #${e.order_id} to ${e.seller.name}`, e.amount, reason);
      return;
    }
    return request("/api/v1/admin/finance/escrow/release", { method: "POST", body: { escrow_id: id, reason } });
  },
  async saveRates({ defaultRate, categories }) {
    if (USE_MOCK) {
      await sleep(500);
      const old = db.rates;
      categories.forEach((c) => {
        const o = old.categories.find((x) => x.id === c.id);
        if (o && o.rate !== c.rate) log("commission.updated", `Changed ${c.name} commission from ${o.rate}% to ${c.rate}%`);
      });
      if (old.default !== defaultRate) log("commission.updated", `Changed default commission from ${old.default}% to ${defaultRate}%`);
      db.rates = { default: defaultRate, categories: categories.map((c) => ({ ...c })) };
      return;
    }
    return request("/api/v1/admin/finance/commission-rates", {
      method: "PUT",
      body: { default_rate: defaultRate, categories: categories.map((c) => ({ category_id: c.id, rate: c.rate })) },
    });
  },
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function FinancePage() {
  const [tab, setTab] = useState("payouts");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      setData(await fetchFinance());
      setError(null);
    } catch (e) {
      setError(e?.message || "Could not load finance data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const reload = useCallback(() => load(true), [load]);
  const notify = useCallback((m) => { toast.success(m); }, []);

  const t = useMemo(() => {
    if (!data) return null;
    const pending = data.payouts.filter((p) => p.status === "pending");
    const ready = data.payouts.filter((p) => p.status === "approved");
    return {
      pending,
      ready,
      overdue: pending.filter((p) => hoursFrom(p.createdAt) > 48).length,
      queued: sum([...pending, ...ready], (p) => p.amount),
      held: sum(data.escrow, (e) => e.amount),
      disputes: data.escrow.filter((e) => e.status === "disputed").length,
    };
  }, [data]);

  return (
    <div className="min-h-screen w-full">
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "!rounded-full !bg-neutral-900 !text-white !text-sm !font-medium !shadow-2xl !border-0",
          duration: 3000,
        }}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-8">
        {/* ───── HEADER ───── */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="spark" className="h-3.5 w-3.5 text-orange-500" sw={2.5} />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-500">
                Finance
              </p>
              {USE_MOCK && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                  DEMO
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
              Payout &amp; Escrow
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage seller payouts, escrow releases, and commission rates.
            </p>
          </div>

          {/* 🟠 Refresh button — orange gradient */}
          <button
            type="button"
            onClick={reload}
            disabled={refreshing || loading}
            className={BTN.primary}
          >
            <Icon name="refresh" className={cx("h-4 w-4 transition-transform", refreshing && "animate-spin")} />
            Refresh
          </button>
        </header>

        {/* ───── ERROR ───── */}
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <span className="flex items-center gap-2">
              <Icon name="alert" /> {error}
            </span>
            <button type="button" onClick={() => load()} className="cursor-pointer font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {/* ───── LOADING ───── */}
        {loading && !data ? (
          <BentoSkeleton />
        ) : data && (
          <>
            {/* ═══ BENTO GRID ═══ */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
              {/* Big — Pending */}
              <button
                type="button"
                onClick={() => setTab("payouts")}
                className={cx(
                  "group col-span-2 lg:col-span-3 relative overflow-hidden rounded-2xl border-2 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg lg:p-6 cursor-pointer",
                  tab === "payouts" ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Payouts
                    </p>
                    <p className="mt-2 text-4xl font-bold tabular-nums text-neutral-900">
                      {t.pending.length}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {t.pending.length > 0 ? "waiting for approval" : "all caught up"}
                    </p>
                  </div>
                  {/* 🟠 Icon with gradient */}
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/30 transition-transform group-hover:scale-110">
                    <Icon name="send" className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-semibold text-neutral-700">
                    {takaShort(t.queued)} queued
                  </span>
                  {t.overdue > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-2.5 py-1 font-bold text-white shadow-sm">
                      <Icon name="clock" className="h-3 w-3" sw={2.5} />
                      {t.overdue} overdue
                    </span>
                  )}
                </div>

                <span className="absolute inset-x-5 bottom-0 h-0.5 rounded-t bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              {/* Big — Escrow */}
              <button
                type="button"
                onClick={() => setTab("escrow")}
                className={cx(
                  "group col-span-2 lg:col-span-3 relative overflow-hidden rounded-2xl border-2 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg lg:p-6 cursor-pointer",
                  tab === "escrow" ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Escrow held
                    </p>
                    <p className="mt-2 text-4xl font-bold tabular-nums text-neutral-900">
                      {takaShort(t.held)}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      across {data.escrow.length} order{data.escrow.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {/* 🔵 Icon with gradient */}
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/30 transition-transform group-hover:scale-110">
                    <Icon name="lock" className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-semibold text-neutral-700">
                    Auto-release cycle
                  </span>
                  {t.disputes > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2.5 py-1 font-bold text-white shadow-sm">
                      <Icon name="alert" className="h-3 w-3" sw={2.5} />
                      {t.disputes} dispute{t.disputes > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <span className="absolute inset-x-5 bottom-0 h-0.5 rounded-t bg-gradient-to-r from-teal-500 to-teal-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              {/* Ready to pay */}
              <button
                type="button"
                onClick={() => setTab("payouts")}
                className="group col-span-1 lg:col-span-2 cursor-pointer rounded-2xl border border-neutral-200 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 transition-transform group-hover:scale-110">
                  <Icon name="wallet" className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Ready to pay
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                  {t.ready.length}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {takaShort(sum(t.ready, (p) => p.amount))} waiting
                </p>
              </button>

              {/* Commission */}
              <button
                type="button"
                onClick={() => setTab("commission")}
                className="group col-span-1 lg:col-span-2 cursor-pointer rounded-2xl border border-neutral-200 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-md shadow-violet-500/30 transition-transform group-hover:scale-110">
                  <Icon name="percent" className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Commission
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                  {data.commissions.defaultRate}%
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {takaShort(data.commissions.thisMonth)} this month
                </p>
              </button>

              {/* Activity */}
              <button
                type="button"
                onClick={() => setTab("activity")}
                className="group col-span-2 lg:col-span-2 cursor-pointer rounded-2xl border border-neutral-200 bg-white p-4 text-left transition-all hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-900 text-white shadow-md shadow-neutral-900/20 transition-transform group-hover:scale-110">
                  <Icon name="list" className="h-4 w-4" />
                </span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Activity
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                  {data.audit.length}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {data.audit[0] ? `last ${timeAgo(data.audit[0].at)}` : "no records"}
                </p>
              </button>
            </div>

            {/* ═══ TABS ═══ */}
            <div className="flex gap-1 overflow-x-auto rounded-full bg-neutral-100 p-1">
              {[
                { id: "payouts", label: "Payouts", icon: "send", badge: t.pending.length },
                { id: "escrow", label: "Escrow", icon: "lock", badge: t.disputes, danger: true },
                { id: "commission", label: "Commission", icon: "percent" },
                { id: "activity", label: "Activity", icon: "list" },
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
                    <Icon name={it.icon} className="h-4 w-4" />
                    {it.label}
                    {it.badge > 0 && (
                      <span
                        className={cx(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                          active ? "bg-white/25 text-white" : it.danger ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                        )}
                      >
                        {it.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ═══ CONTENT ═══ */}
            <div className={cx("transition-opacity", refreshing && "opacity-70")}>
              {tab === "payouts" && <PayoutsPanel data={data} reload={reload} notify={notify} />}
              {tab === "escrow" && <EscrowPanel data={data} reload={reload} notify={notify} />}
              {tab === "commission" && <CommissionPanel data={data} reload={reload} notify={notify} />}
              {tab === "activity" && <ActivityPanel data={data} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════════════════════════ */
function BentoSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <div className="col-span-2 h-40 rounded-2xl bg-neutral-100 lg:col-span-3" />
        <div className="col-span-2 h-40 rounded-2xl bg-neutral-100 lg:col-span-3" />
        <div className="h-32 rounded-2xl bg-neutral-100 lg:col-span-2" />
        <div className="h-32 rounded-2xl bg-neutral-100 lg:col-span-2" />
        <div className="col-span-2 h-32 rounded-2xl bg-neutral-100 lg:col-span-2" />
      </div>
      <div className="h-12 rounded-full bg-neutral-100" />
      <div className="h-64 rounded-2xl bg-neutral-100" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAYOUTS PANEL
   ═══════════════════════════════════════════════════════════ */
function PayoutsPanel({ data, reload, notify }) {
  const [query, setQuery] = useState("");
  const [lane, setLane] = useState("pending");
  const [dialog, setDialog] = useState(null);

  const pending = data.payouts.filter((p) => p.status === "pending").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const ready = data.payouts.filter((p) => p.status === "approved").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const history = data.payouts.filter((p) => p.status === "paid" || p.status === "rejected").sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt));

  const list = useMemo(() => {
    const base = lane === "pending" ? pending : lane === "ready" ? ready : history;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => `${p.id} ${p.name} ${p.account} ${p.method}`.toLowerCase().includes(q));
  }, [lane, pending, ready, history, query]);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search seller, ID, or account..."
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5"
          />
        </div>

        <div className="inline-flex gap-1 rounded-full bg-neutral-100 p-1">
          {[
            ["pending", "To approve", pending.length],
            ["ready", "Ready", ready.length],
            ["history", "History", history.length],
          ].map(([id, text, count]) => {
            const on = lane === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setLane(id)}
                className={cx(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  on
                    ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/25"
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {text}
                <span className={cx("rounded-full px-1.5 text-[10px] font-bold tabular-nums", on ? "bg-white/25 text-white" : "bg-white text-neutral-500")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {lane === "pending" && pending.length > 1 && (
          <button
            type="button"
            onClick={() => setDialog({ kind: "approve", items: pending })}
            className={BTN.success}
          >
            <Icon name="check" className="h-4 w-4" />
            Approve all {pending.length}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <Empty
          title={lane === "pending" ? "All caught up" : lane === "ready" ? "Nothing to pay" : "No history yet"}
          hint={query ? "No matches for your search." : lane === "pending" ? "No payout requests are waiting for approval." : undefined}
          action={lane === "pending" && ready.length > 0 ? (
            <button type="button" onClick={() => setLane("ready")} className={BTN.primary}>
              See {ready.length} ready to pay
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </button>
          ) : null}
        />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {list.map((p) => (
            <PayoutRow key={p.id} p={p} onAction={(kind) => setDialog({ kind, items: [p], p })} />
          ))}
        </ul>
      )}

      {dialog?.kind === "approve" && (
        <ConfirmDialog
          title={dialog.items.length > 1 ? `Approve ${dialog.items.length} payouts?` : "Approve this payout?"}
          description="They'll move to Ready to pay. No money is sent yet."
          summary={[["Requests", dialog.items.length], ["Total amount", taka(sum(dialog.items, (p) => p.amount))]]}
          confirmLabel="Approve"
          onConfirm={async () => {
            await API.approve(dialog.items.map((p) => p.id));
            await reload();
            notify(`${dialog.items.length} payout${dialog.items.length > 1 ? "s" : ""} approved`);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "pay" && (
        <ConfirmDialog
          title="Mark as paid"
          description={`Transfer the money to ${dialog.p.name} first. Then paste the reference.`}
          summary={[
            ["Send to", `${dialog.p.method} · ${dialog.p.account}`],
            ["Amount", taka(dialog.p.amount)],
            ["Fee", `− ${taka(dialog.p.fee)}`],
            ["Send exactly", taka(dialog.p.net)],
          ]}
          fields={[{ name: "reference", label: "Transfer reference", placeholder: "e.g. bKash TrxID", required: true }]}
          confirmLabel="Confirm payment"
          onConfirm={async ({ reference }) => {
            await API.pay(dialog.p.id, reference.trim());
            await reload();
            notify(`${dialog.p.name} marked as paid`);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "reject" && (
        <ConfirmDialog
          title="Reject this payout?"
          tone="danger"
          description={`${dialog.p.name} will see your reason.`}
          summary={[["Request", dialog.p.id], ["Amount", taka(dialog.p.amount)]]}
          fields={[{ name: "reason", label: "Reason", placeholder: "e.g. KYC not verified", required: true }]}
          confirmLabel="Reject"
          onConfirm={async ({ reason }) => {
            await API.reject(dialog.p.id, reason.trim());
            await reload();
            notify("Payout rejected");
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

function PayoutRow({ p, onAction }) {
  const overdue = p.status === "pending" && hoursFrom(p.createdAt) > 48;
  return (
    <li
      className={cx(
        "group flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border bg-white p-4 transition-all hover:shadow-md",
        overdue ? "border-orange-200 ring-1 ring-orange-100" : "border-neutral-200"
      )}
    >
      <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--color-brand-navy)] to-neutral-700 text-xs font-bold text-white shadow-md">
          {initials(p.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-neutral-900">{p.name}</p>
          <p className="truncate text-xs text-neutral-500">
            <span className="capitalize">{p.role}</span> · {p.method} {mask(p.account)}
          </p>
          <p className={cx("mt-0.5 inline-flex items-center gap-1 text-xs", overdue ? "font-semibold text-orange-600" : "text-neutral-400")}>
            {overdue && <Icon name="clock" className="h-3 w-3" sw={2.5} />}
            {p.status === "paid"
              ? `Paid ${timeAgo(p.paidAt)}`
              : p.status === "rejected"
              ? "Rejected"
              : `Requested ${timeAgo(p.createdAt)}`}
          </p>
        </div>
      </div>

      <div className="sm:text-right">
        <p className="text-lg font-bold tabular-nums text-neutral-900">{taka(p.amount)}</p>
        <p className="text-xs text-neutral-500">send {taka(p.net)}</p>
      </div>

      <div className="flex min-w-[170px] justify-end gap-2">
        {p.status === "pending" && (
          <>
            {/* 🔴 Reject — red gradient */}
            <button
              type="button"
              onClick={() => onAction("reject")}
              className={BTN.danger}
            >
              Reject
            </button>
            {/* 🟢 Approve — emerald gradient */}
            <button
              type="button"
              onClick={() => onAction("approve")}
              className={BTN.success}
            >
              <Icon name="check" className="h-3.5 w-3.5" sw={2.5} /> Approve
            </button>
          </>
        )}
        {p.status === "approved" && (
          /* ⚫ Mark as paid — neutral gradient */
          <button
            type="button"
            onClick={() => onAction("pay")}
            className={BTN.dark}
          >
            <Icon name="send" className="h-3.5 w-3.5" /> Mark as paid
          </button>
        )}
        {p.status === "paid" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <Icon name="check" className="h-3.5 w-3.5" sw={3} />
            <span className="font-mono">{p.reference || "Paid"}</span>
          </span>
        )}
        {p.status === "rejected" && (
          <span className="max-w-[200px] text-right text-xs text-neutral-500">
            {p.reason || "Rejected"}
          </span>
        )}
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════
   ESCROW PANEL
   ═══════════════════════════════════════════════════════════ */
function EscrowPanel({ data, reload, notify }) {
  const [filter, setFilter] = useState(() => (data.escrow.some((e) => e.status === "disputed") ? "disputed" : "all"));
  const [dialog, setDialog] = useState(null);
  const now = Date.now();

  const disputed = data.escrow.filter((e) => e.status === "disputed");
  const held = data.escrow.filter((e) => e.status === "held");
  const rows = (filter === "disputed" ? disputed : filter === "held" ? held : data.escrow)
    .slice()
    .sort((a, b) => (a.status === "disputed" ? -1 : 0) - (b.status === "disputed" ? -1 : 0) || new Date(a.releaseAt) - new Date(b.releaseAt));

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex gap-1 self-start rounded-full bg-neutral-100 p-1">
        {[
          ["all", "All", data.escrow.length],
          ["disputed", "Disputed", disputed.length, true],
          ["held", "Normal", held.length],
        ].map(([id, text, count, danger]) => {
          const on = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cx(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                on
                  ? danger
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/25"
                    : "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/25"
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              {text}
              <span className={cx("rounded-full px-1.5 text-[10px] font-bold tabular-nums", on ? "bg-white/25 text-white" : "bg-white text-neutral-500")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <Empty title="Nothing here" hint="No escrow holdings match this filter." />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {rows.map((e) => {
            const isDisputed = e.status === "disputed";
            const start = new Date(e.heldAt).getTime(), end = new Date(e.releaseAt).getTime();
            const pct = Math.min(100, Math.max(0, ((now - start) / Math.max(1, end - start)) * 100));
            return (
              <li
                key={e.id}
                className={cx(
                  "overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-md",
                  isDisputed ? "border-red-200 ring-1 ring-red-100" : "border-neutral-200"
                )}
              >
                <div className="flex flex-wrap items-center gap-4 p-4">
                  <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-md", isDisputed ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30" : "bg-gradient-to-br from-teal-500 to-teal-600 shadow-teal-500/30")}>
                    <Icon name={isDisputed ? "alert" : "lock"} className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1 basis-56">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs font-bold text-neutral-900">#{e.orderId}</p>
                      {isDisputed && (
                        <span className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                          Disputed
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-neutral-700">
                      <b>{e.seller}</b> <span className="text-neutral-400">←</span> {e.buyer}
                    </p>
                    {isDisputed && e.disputeReason && (
                      <p className="mt-1 text-xs italic text-red-600">"{e.disputeReason}"</p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums text-neutral-900">{taka(e.amount)}</p>
                    {!isDisputed && (
                      <p className="text-xs text-neutral-500">
                        {end < now ? `Overdue ${span(now - end)}` : `Auto in ${span(end - now)}`}
                      </p>
                    )}
                  </div>

                  {/* 🔴 or 🟠 Release button */}
                  <button
                    type="button"
                    onClick={() => setDialog(e)}
                    className={isDisputed ? BTN.danger : BTN.primary}
                  >
                    <Icon name="unlock" className="h-3.5 w-3.5" />
                    {isDisputed ? "Release anyway" : "Release"}
                  </button>
                </div>

                {!isDisputed && (
                  <div className="px-4 pb-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={cx("h-full rounded-full transition-all", pct > 85 ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" : "bg-gradient-to-r from-teal-400 to-teal-500")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {dialog && (
        <ConfirmDialog
          title={dialog.status === "disputed" ? "Release despite dispute?" : "Release this money now?"}
          tone={dialog.status === "disputed" ? "danger" : "primary"}
          description={
            dialog.status === "disputed"
              ? `Dispute: "${dialog.disputeReason || "no reason"}". This will send the money to ${dialog.seller} anyway.`
              : `The money goes to ${dialog.seller}'s wallet now.`
          }
          summary={[
            ["Order", `#${dialog.orderId}`],
            ["Seller", dialog.seller],
            ["Amount", taka(dialog.amount)],
          ]}
          fields={[{ name: "reason", label: "Reason", placeholder: "Saved in activity log", required: dialog.status === "disputed" }]}
          confirmLabel="Release money"
          onConfirm={async ({ reason }) => {
            await API.release(dialog.id, reason.trim());
            await reload();
            notify(`${taka(dialog.amount)} released to ${dialog.seller}`);
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMMISSION PANEL
   ═══════════════════════════════════════════════════════════ */
const EXAMPLE = 10000;

function CommissionPanel({ data, reload, notify }) {
  const c = data.commissions;
  const initial = useMemo(() => ({ defaultRate: c.defaultRate, categories: c.categories.map((x) => ({ ...x })) }), [c.defaultRate, c.categories]);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => setDraft(initial), [initial]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const invalid = [draft.defaultRate, ...draft.categories.map((x) => x.rate)].some((r) => !(r >= 0 && r <= 50));
  const growth = c.lastMonth > 0 ? Math.round(((c.thisMonth - c.lastMonth) / c.lastMonth) * 100) : 0;

  const rows = [
    { id: "__default", name: "Default rate", note: "Fallback for categories without a rate", rate: draft.defaultRate, isDefault: true },
    ...draft.categories,
  ];
  const setRate = (id, v) =>
    setDraft((d) =>
      id === "__default"
        ? { ...d, defaultRate: v }
        : { ...d, categories: d.categories.map((x) => (x.id === id ? { ...x, rate: v } : x)) }
    );

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await API.saveRates(draft);
      await reload();
      notify("Commission rates saved");
    } catch (e) {
      setError(e?.message || "Could not save rates");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-md shadow-violet-500/30">
          <Icon name="percent" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            This month's commission
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-neutral-900">
            {taka(c.thisMonth)}
          </p>
        </div>
        {c.lastMonth > 0 && (
          <span className={cx("rounded-full px-3 py-1 text-xs font-bold ring-1", growth >= 0 ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200")}>
            {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}% vs last month
          </span>
        )}
      </div>

      <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {rows.map((r) => {
          const keep = (EXAMPLE * r.rate) / 100;
          return (
            <li key={r.id} className={cx("flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-neutral-50/50", r.isDefault && "bg-neutral-50/30")}>
              <div className="min-w-0 flex-1 basis-56">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-neutral-900">{r.name}</p>
                  {r.isDefault && (
                    <span className="rounded-md bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600">
                      DEFAULT
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {r.note || `On a ৳${EXAMPLE.toLocaleString()} sale: you ৳${keep.toLocaleString()} · seller ৳${(EXAMPLE - keep).toLocaleString()}`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={Math.min(r.rate, 30)}
                  onChange={(ev) => setRate(r.id, Number(ev.target.value))}
                  className="hidden w-32 cursor-pointer accent-violet-500 sm:block"
                />
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={r.rate}
                    onChange={(ev) => setRate(r.id, ev.target.value === "" ? 0 : Number(ev.target.value))}
                    className={cx(
                      "w-24 rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-8 text-right text-sm font-bold tabular-nums outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10",
                      !(r.rate >= 0 && r.rate <= 50) && "border-red-400"
                    )}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    %
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {dirty && (
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 p-3 pl-5 text-white shadow-2xl">
          <p className="text-sm">
            {invalid ? "⚠️ Rates must be between 0% and 50%." : "You have unsaved changes."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft(initial)}
              disabled={saving}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
            {/* 🟣 Save rates — violet gradient */}
            <button
              type="button"
              onClick={save}
              disabled={invalid || saving}
              className={BTN.violet}
            >
              {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              Save rates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACTIVITY
   ═══════════════════════════════════════════════════════════ */
const KIND = {
  approve: ["check", "bg-gradient-to-br from-neutral-700 to-neutral-900 text-white shadow-md shadow-neutral-900/20"],
  pay: ["send", "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25"],
  reject: ["x", "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md shadow-red-500/25"],
  release: ["unlock", "bg-gradient-to-br from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/25"],
  rate: ["percent", "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-md shadow-violet-500/25"],
  other: ["list", "bg-gradient-to-br from-neutral-500 to-neutral-700 text-white shadow-md shadow-neutral-500/25"],
};

function ActivityPanel({ data }) {
  if (data.audit.length === 0) {
    return <Empty title="No activity yet" hint="Actions you take will appear here." />;
  }
  return (
    <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {data.audit.map((a) => {
        const [icon, tone] = KIND[a.kind] || KIND.other;
        return (
          <li key={a.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-neutral-50/50">
            <span className={cx("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full", tone)}>
              <Icon name={icon} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-neutral-800">
                <b className="font-semibold">{a.who}</b> · {a.text}
              </p>
              {a.reason && <p className="mt-0.5 text-xs text-neutral-500">Note: {a.reason}</p>}
              <p className="mt-0.5 text-xs text-neutral-400">{timeAgo(a.at)}</p>
            </div>
            {a.amount > 0 && (
              <p className="shrink-0 text-sm font-bold tabular-nums text-neutral-900">{taka(a.amount)}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY
   ═══════════════════════════════════════════════════════════ */
function Empty({ title, hint, action }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 text-2xl">
        ✨
      </div>
      <p className="mt-3 font-semibold text-neutral-900">{title}</p>
      {hint && <p className="mt-1 text-sm text-neutral-500">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ═══════════════════════════════════════════════════════════ */
function ConfirmDialog({ title, description, confirmLabel, tone = "primary", fields = [], summary = [], onConfirm, onClose }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ""])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const missing = fields.some((f) => f.required && !values[f.name].trim());

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
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
      className="fixed inset-0 z-[70] flex items-end justify-center bg-neutral-900/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-neutral-500">{description}</p>}

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
              {f.required ? <span className="text-red-500"> *</span> : <span className="font-normal text-neutral-400"> (optional)</span>}
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
          <p role="alert" className="mt-4 flex gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 cursor-pointer rounded-full border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={missing || busy}
            className={cx(
              "flex-[1.4]",
              tone === "danger" ? BTN.danger : BTN.primaryLg
            )}
          >
            {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}