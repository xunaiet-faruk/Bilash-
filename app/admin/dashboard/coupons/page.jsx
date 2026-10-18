"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Ticket, Plus, Search, Copy, Trash2, Users, Wallet,
  X, Shuffle, CalendarDays, ShoppingBag, CircleCheck, AlertTriangle,
} from "lucide-react";

/* ───────────── MOCK DATA (পরে API দিয়ে replace হবে) ─────────────
   GET  /api/v1/admin/coupons  → setCoupons(res.data)
   POST /api/v1/admin/coupons  → handleCreate
   Toggle / Delete এর endpoint backend এ এখনো নেই                   */
const initialCoupons = [
  { id: "CPN-01", code: "EID2026", type: "flat", value: 500, minOrder: 2000, usage: 124, maxUsage: 1000, enabled: true, expires: "2026-10-31" },
  { id: "CPN-02", code: "NEWUSER10", type: "percent", value: 10, minOrder: 0, usage: 542, maxUsage: 5000, enabled: true, expires: "2026-12-31" },
  { id: "CPN-03", code: "FREESHIP", type: "flat", value: 60, minOrder: 500, usage: 89, maxUsage: 500, enabled: true, expires: "2026-11-15" },
  { id: "CPN-04", code: "SUMMER50", type: "flat", value: 50, minOrder: 300, usage: 500, maxUsage: 500, enabled: true, expires: "2026-08-31" },
  { id: "CPN-05", code: "WINTER15", type: "percent", value: 15, minOrder: 1500, usage: 0, maxUsage: 300, enabled: false, expires: "2027-01-31" },
];

const emptyForm = { code: "", type: "flat", value: "", minOrder: "", maxUsage: "", expires: "" };
const today = () => new Date().toISOString().slice(0, 10);
const taka = (n) => `৳${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function getStatus(c) {
  if (c.expires < today()) return "expired";
  if (c.usage >= c.maxUsage) return "used up";
  return c.enabled ? "active" : "paused";
}

const statusStyle = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paused: "bg-amber-50 text-amber-700 ring-amber-600/20",
  expired: "bg-slate-100 text-slate-500 ring-slate-400/20",
  "used up": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

/* ───────────── SMALL PARTS ───────────── */
function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label}
      disabled={disabled} onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-40 ${checked ? "bg-orange-500" : "bg-slate-300"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold tabular-nums text-slate-900">{value}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

/function CouponTicket({ c, onToggle, onDelete }) {
  const status = getStatus(c);
  const dead = status === "expired" || status === "used up";
  const pct = Math.min(100, Math.round((c.usage / c.maxUsage) * 100));
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(c.code);
    setCopied(true);
    toast.success(`${c.code} copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className={`group relative flex flex-col rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 ${
      dead ? "border-slate-200 opacity-80 grayscale-[0.3]" : "border-orange-200/70"
    }`}>
      {/* Top: discount */}
      <div className={`relative rounded-t-2xl px-5 pb-5 pt-5 overflow-hidden ${dead ? "bg-slate-50" : "bg-gradient-to-br from-orange-500 to-orange-600"}`}>
        {/* Background pattern for alive coupons */}
        {!dead && (
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        )}
        
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className={`text-4xl font-extrabold tabular-nums tracking-tight ${dead ? "text-slate-400" : "text-white"}`}>
              {c.type === "flat" ? taka(c.value) : `${c.value}%`}
            </p>
            <p className={`mt-0.5 text-sm font-medium ${dead ? "text-slate-400" : "text-orange-100"}`}>
              {c.minOrder > 0 ? `off on orders over ${taka(c.minOrder)}` : "off on any order"}
            </p>
          </div>
          <span className={`relative rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
            dead ? "bg-white text-slate-500 ring-1 ring-slate-200" : "bg-white text-orange-600"
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* Perforation */}
      <div className="relative">
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-slate-200 bg-slate-50/50" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-slate-200 bg-slate-50/50" />
        <div className="mx-4 border-t-2 border-dashed border-slate-200" />
      </div>

      {/* Bottom: details */}
      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
        <div className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 border-2 border-dashed ${dead ? "bg-slate-50 border-slate-200" : "bg-orange-50/50 border-orange-200"}`}>
          <span className="font-mono text-base font-bold tracking-widest text-slate-900">{c.code}</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold transition-all ${
              copied ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500 shadow-sm hover:text-orange-600"
            }`}
          >
            {copied ? <CircleCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div>
          <div className="mb-1.5 flex justify-between text-xs text-slate-500">
            <span>Used</span>
            <span className="tabular-nums font-medium text-slate-700">{c.usage.toLocaleString()} / {c.maxUsage.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-orange-500"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {status === "expired" ? "Expired on" : "Valid until"} {fmtDate(c.expires)}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Switch checked={c.enabled && !dead} disabled={dead} onChange={() => onToggle(c.id)} label={`Enable ${c.code}`} />
            {c.enabled && !dead ? "Active" : "Inactive"}
          </label>
          <button
            onClick={() => onDelete(c)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            aria-label={`Delete ${c.code}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );

}

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";
const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
  </label>
);

/* ───────────── PAGE ───────────── */
export default function CouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [drawer, setDrawer] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && (setDrawer(false), setToDelete(null));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stats = useMemo(() => {
    const active = coupons.filter((c) => getStatus(c) === "active").length;
    const uses = coupons.reduce((s, c) => s + c.usage, 0);
    const given = coupons.reduce((s, c) => s + (c.type === "flat" ? c.value * c.usage : 0), 0);
    return { total: coupons.length, active, uses, given };
  }, [coupons]);

  const tabs = [
    { id: "all", label: "All", n: coupons.length },
    { id: "active", label: "Active", n: coupons.filter((c) => getStatus(c) === "active").length },
    { id: "paused", label: "Paused", n: coupons.filter((c) => getStatus(c) === "paused").length },
    { id: "ended", label: "Ended", n: coupons.filter((c) => ["expired", "used up"].includes(getStatus(c))).length },
  ];

  const filtered = coupons.filter((c) => {
    const s = getStatus(c);
    const okTab = tab === "all" || (tab === "ended" ? ["expired", "used up"].includes(s) : s === tab);
    return okTab && c.code.toLowerCase().includes(search.trim().toLowerCase());
  });

  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const genCode = () =>
    setForm({ ...form, code: Math.random().toString(36).slice(2, 8).toUpperCase() });

  const handleCreate = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const value = Number(form.value);
    if (!code || !value) return toast.error("Enter a code and a discount value");
    if (form.type === "percent" && value > 100) return toast.error("Percent can't be more than 100");
    if (coupons.some((c) => c.code === code)) return toast.error(`${code} already exists`);

    // TODO: POST /api/v1/admin/coupons
    setCoupons([
      { id: `CPN-${Date.now()}`, code, type: form.type, value, minOrder: Number(form.minOrder) || 0,
        usage: 0, maxUsage: Number(form.maxUsage) || 100, enabled: true, expires: form.expires || "2026-12-31" },
      ...coupons,
    ]);
    setDrawer(false);
    setForm(emptyForm);
    toast.success(`${code} created`);
  };

  const toggle = (id) => {
    // TODO: PUT toggle endpoint (backend এ যোগ করতে হবে)
    setCoupons((p) => p.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  };

  const confirmDelete = () => {
    // TODO: DELETE endpoint (backend এ যোগ করতে হবে)
    setCoupons((p) => p.filter((c) => c.id !== toDelete.id));
    toast.success(`${toDelete.code} deleted`);
    setToDelete(null);
  };

  const previewValue = form.value ? (form.type === "flat" ? taka(form.value) : `${form.value}%`) : "—";

  return (
    <div className="min-h-screen  p-4 sm:p-8">
      <Toaster position="bottom-center" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Coupons</h1>
            <p className="mt-1 text-sm text-slate-500">Create discount codes and see how customers use them.</p>
          </div>
          <button
            onClick={() => setDrawer(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <Plus className="h-4 w-4" /> New coupon
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Ticket} label="Total coupons" value={stats.total} />
          <Stat icon={CircleCheck} label="Active now" value={stats.active} hint="Can be used today" />
          <Stat icon={Users} label="Times used" value={stats.uses.toLocaleString()} />
          <Stat icon={Wallet} label="Flat discount given" value={taka(stats.given)} hint="Excludes % coupons" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
            {tabs.map((t) => (
              <button
                key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${tab === t.id ? "bg-orange-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${tab === t.id ? "bg-white/25" : "bg-slate-100 text-slate-500"}`}>{t.n}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <CouponTicket key={c.id} c={c} onToggle={toggle} onDelete={setToDelete} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-orange-50 text-orange-500"><Ticket className="h-6 w-6" /></span>
            <p className="font-semibold text-slate-900">No coupons found</p>
            <p className="mt-1 text-sm text-slate-500">Try another filter, or create a new coupon.</p>
            <button onClick={() => setDrawer(true)} className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">New coupon</button>
          </div>
        )}
      </div>

      {/* Create drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm" onClick={() => setDrawer(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">New coupon</h2>
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
              {/* Live preview */}
              <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white">
                <p className="text-3xl font-extrabold tabular-nums">{previewValue}<span className="ml-1.5 text-base font-semibold text-orange-100">off</span></p>
                <p className="mt-1 font-mono text-sm tracking-widest text-orange-50">{form.code || "YOURCODE"}</p>
                <p className="mt-3 text-xs text-orange-100">
                  {form.minOrder ? `Min order ${taka(form.minOrder)}` : "No minimum order"} · {form.maxUsage || 100} uses
                </p>
              </div>

              <Field label="Coupon code">
                <div className="flex gap-2">
                  <input value={form.code} onChange={setF("code")} placeholder="EID500" className={`${inputCls} font-mono uppercase`} />
                  <button type="button" onClick={genCode} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:border-orange-500 hover:text-orange-600">
                    <Shuffle className="h-4 w-4" /> Random
                  </button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Discount type">
                  <select value={form.type} onChange={setF("type")} className={inputCls}>
                    <option value="flat">Flat amount (৳)</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </Field>
                <Field label="Value">
                  <input type="number" min="1" value={form.value} onChange={setF("value")} placeholder={form.type === "flat" ? "500" : "10"} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Minimum order (৳)" hint="Leave empty for none">
                  <input type="number" min="0" value={form.minOrder} onChange={setF("minOrder")} placeholder="2000" className={inputCls} />
                </Field>
                <Field label="Total uses" hint="Default 100">
                  <input type="number" min="1" value={form.maxUsage} onChange={setF("maxUsage")} placeholder="1000" className={inputCls} />
                </Field>
              </div>

              <Field label="Expiry date">
                <input type="date" min={today()} value={form.expires} onChange={setF("expires")} className={inputCls} />
              </Field>

              <div className="mt-auto flex gap-3 pt-2">
                <button type="button" onClick={() => setDrawer(false)} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600">Create coupon</button>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* Delete confirm */}
      {toDelete && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={() => setToDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-rose-50 text-rose-600"><AlertTriangle className="h-5 w-5" /></span>
            <h3 className="font-bold text-slate-900">Delete {toDelete.code}?</h3>
            <p className="mt-1 text-sm text-slate-500">Customers won't be able to use this code any more. This can't be undone.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Keep coupon</button>
              <button onClick={confirmDelete} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}