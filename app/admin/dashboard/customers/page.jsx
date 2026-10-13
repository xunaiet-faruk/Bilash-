"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   DATA
   ============================================================ */
const seed = () => [
  { id: "CUS-1001", kind: "featured", name: "Mahin Chowdhury", email: "mahin@example.com", phone: "+880 1711-000111", district: "Chattogram", address: "House 12, Road 4, Chattogram", joined: "Jan 2024", status: "active", tier: "gold", verified: true, risk: "low", orders: 24, spent: 1240.5, returns: 1, cancelRate: "2%", lastOrder: "2h ago", tags: ["Repeat buyer"], image: "https://i.pravatar.cc/240?img=12" },
  { id: "CUS-1002", kind: "featured", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "+880 1811-000222", district: "Dhaka", address: "Flat 3B, Banani, Dhaka", joined: "Mar 2024", status: "active", tier: "silver", verified: true, risk: "low", orders: 12, spent: 620.0, returns: 0, cancelRate: "0%", lastOrder: "5h ago", tags: ["Repeat buyer"], image: "https://i.pravatar.cc/240?img=47" },
  { id: "CUS-1003", kind: "featured", name: "Tanvir Ahmed", email: "tanvir@example.com", phone: "+880 1911-000333", district: "Sylhet", address: "Uposhohor, Sylhet", joined: "Nov 2023", status: "active", tier: "platinum", verified: true, risk: "low", orders: 42, spent: 2410.0, returns: 2, cancelRate: "1.5%", lastOrder: "1d ago", tags: ["Top buyer"], image: "https://i.pravatar.cc/240?img=33" },
  { id: "CUS-1008", kind: "featured", name: "Kamal Hossain", email: "kamal@example.com", phone: "+880 1911-000888", district: "Dhaka", address: "Mirpur, Dhaka", joined: "Dec 2023", status: "active", tier: "gold", verified: true, risk: "low", orders: 28, spent: 1680.0, returns: 2, cancelRate: "1%", lastOrder: "1w ago", tags: ["Repeat buyer"], image: null },
  { id: "CUS-1004", kind: "local", name: "Farzana Akter", email: "farzana@example.com", phone: "+880 1611-000444", district: "Rajshahi", address: "Shahjalal Road, Rajshahi", joined: "Jun 2024", status: "active", tier: "bronze", verified: false, risk: "medium", orders: 5, spent: 310.0, returns: 1, cancelRate: "8%", lastOrder: "2d ago", tags: [], image: null },
  { id: "CUS-1005", kind: "local", name: "Sadman Rahman", email: "sadman@example.com", phone: "+880 1511-000555", district: "Dhaka", address: "Green Road, Dhaka", joined: "Feb 2024", status: "active", tier: "silver", verified: true, risk: "low", orders: 11, spent: 980.0, returns: 0, cancelRate: "0%", lastOrder: "3d ago", tags: ["Repeat buyer"], image: "https://i.pravatar.cc/240?img=15" },
  { id: "CUS-1006", kind: "local", name: "Imran Kabir", email: "imran@example.com", phone: "+880 1311-000666", district: "Chattogram", address: "GEC Circle, Chattogram", joined: "Sep 2024", status: "blocked", tier: "bronze", verified: false, risk: "high", orders: 3, spent: 125.0, returns: 3, cancelRate: "45%", lastOrder: "5d ago", tags: ["Fraud watch"], image: null, blockReason: "Repeated refunds" },
  { id: "CUS-1007", kind: "local", name: "Rumana Islam", email: "rumana@example.com", phone: "01211000777", district: "Chattogram", address: "Agrabad, Chattogram", joined: "Aug 2024", status: "active", tier: "silver", verified: true, risk: "medium", orders: 8, spent: 540.0, returns: 1, cancelRate: "6%", lastOrder: "4d ago", tags: [], image: null },
  { id: "CUS-1009", kind: "local", name: "Sadia Rahman", email: "sadia@example.com", phone: "+880 1777-000999", district: "Khulna", address: "Sonadanga, Khulna", joined: "May 2024", status: "active", tier: "bronze", verified: false, risk: "low", orders: 4, spent: 220.0, returns: 0, cancelRate: "0%", lastOrder: "1w ago", tags: ["New"], image: "https://i.pravatar.cc/240?img=44" },
  { id: "CUS-1010", kind: "local", name: "Arif Hossain", email: "arif@example.com", phone: "+880 1877-001000", district: "Dhaka", address: "Bashundhara, Dhaka", joined: "Jul 2024", status: "active", tier: "silver", verified: true, risk: "low", orders: 9, spent: 720.0, returns: 1, cancelRate: "3%", lastOrder: "1w ago", tags: [], image: null },
];

/* ============================================================
   HELPERS
   ============================================================ */
const cx = (...a) => a.filter(Boolean).join(" ");
const money = (n) => `৳${Math.round(n).toLocaleString("en-IN")}`;
const initials = (s) => s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const hash = (s) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const firstName = (s) => s.split(" ")[0];

const waNumber = (phone) => {
  let d = String(phone).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "88" + d;
  return d;
};
const waLink = (phone, text = "") =>
  `https://wa.me/${waNumber(phone)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

const TEMPLATES = [
  ["Order update", (n) => `Hi ${n}, here's an update on your order. `],
  ["Say thanks", (n) => `Hi ${n}, thank you for shopping with us! `],
  ["Confirm address", (n) => `Hi ${n}, could you please confirm your delivery address? `],
];

const TIERS = ["bronze", "silver", "gold", "platinum"];
const TIER_MIN = { bronze: 0, silver: 300, gold: 1000, platinum: 2000 };
const TIER_TONE = {
  platinum: "bg-neutral-900 text-white",
  gold: "bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200",
  silver: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-200",
  bronze: "bg-neutral-100 text-neutral-500",
};
const tierLabel = (t) => t[0].toUpperCase() + t.slice(1);
const nextTier = (c) => {
  const next = TIERS[TIERS.indexOf(c.tier) + 1];
  if (!next) return null;
  return { name: next, left: Math.max(0, TIER_MIN[next] - c.spent), pct: Math.min(100, (c.spent / TIER_MIN[next]) * 100) };
};

const RISK_TONE = {
  low: "bg-neutral-100 text-neutral-600",
  medium: "bg-neutral-100 text-neutral-700",
  high: "bg-neutral-900 text-white",
};

const AVATAR_TONES = ["bg-neutral-900", "bg-neutral-700", "bg-neutral-600", "bg-neutral-800"];

/* Navy background pattern (for modal sidebar) */
const LEDGER_BG = { backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 30px)" };

/* ============================================================
   ICONS
   ============================================================ */
const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className} aria-hidden="true">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const I = {
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  x: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7",
  download: "M12 3v12M7 10l5 5 5-5M4 20h16",
  plus: "M12 5v14M5 12h14",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M4 6h16v12H4zM4 6l8 6 8-6",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  shield: "M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z",
  ban: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM5.6 5.6l12.8 12.8",
  star: "m12 3 2.6 5.6 6 .7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.2 6-.7z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
};

const WhatsAppIcon = ({ className = "h-4 w-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function Avatar({ c, className = "h-12 w-12 rounded-full text-sm" }) {
  const [broken, setBroken] = useState(false);
  const tone = AVATAR_TONES[hash(c.id) % AVATAR_TONES.length];
  return (
    <span className={cx("grid shrink-0 place-items-center overflow-hidden font-bold text-white", tone, className)}>
      {c.image && !broken ? (
        <img src={c.image} alt="" loading="lazy" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      ) : (
        initials(c.name)
      )}
    </span>
  );
}

function VerifiedDot({ className = "h-5 w-5" }) {
  return (
    <span className={cx("grid place-items-center rounded-full bg-neutral-900 text-white ring-2 ring-white", className)} title="Verified">
      <Ico d={I.check} className="h-2/3 w-2/3" sw={3.5} />
    </span>
  );
}

function Chip({ children, className }) {
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", className)}>{children}</span>;
}

const iconBtn = "grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors";

function ContactIcons({ c }) {
  return (
    <>
      <a
        href={waLink(c.phone, `Hi ${firstName(c.name)}, `)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${c.name}`}
        title="WhatsApp"
        className={cx(iconBtn, "border-[#25D366]/30 bg-[#25D366]/5 text-[#25D366] hover:bg-[#25D366] hover:text-white")}
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={`tel:${c.phone}`}
        aria-label={`Call ${c.name}`}
        title="Call"
        className={cx(iconBtn, "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-900 hover:text-neutral-900")}
      >
        <Ico d={I.phone} className="h-3.5 w-3.5" />
      </a>
    </>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
const TABS = [
  ["local", "Local"],
  ["all", "All"],
  ["featured", "Featured"],
  ["risk", "High risk"],
  ["blocked", "Blocked"],
];
const belongsTab = (c, tab) =>
  tab === "all" ? true : tab === "local" ? c.kind === "local" : tab === "featured" ? c.kind === "featured" : tab === "risk" ? c.risk === "high" : tab === "blocked" ? c.status === "blocked" : true;

export default function CustomersPage() {
  const [customers, setCustomers] = useState(seed);
  const [tab, setTab] = useState("local");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const flash = (m) => {
    clearTimeout(toastTimer.current);
    setToast(m);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const count = (t) => customers.filter((c) => belongsTab(c, t)).length;
  const featured = customers.filter((c) => c.kind === "featured" && c.status !== "blocked");
  const opened = customers.find((c) => c.id === openId) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => belongsTab(c, tab) && (!q || `${c.name} ${c.email} ${c.phone} ${c.id}`.toLowerCase().includes(q)));
  }, [customers, tab, query]);

  const patch = (id, fn) => setCustomers((cur) => cur.map((x) => (x.id === id ? fn(x) : x)));

  const toggleFeatured = (c) => {
    patch(c.id, (x) => ({ ...x, kind: x.kind === "featured" ? "local" : "featured" }));
    flash(c.kind === "featured" ? `${c.name} is now a local customer` : `${c.name} is now featured`);
  };

  const toggleBlock = (c, why) => {
    const blocking = c.status === "active";
    patch(c.id, (x) => ({
      ...x,
      status: blocking ? "blocked" : "active",
      kind: blocking ? "local" : x.kind,
      blockReason: blocking ? why : undefined,
    }));
    flash(blocking ? `${c.name} blocked` : `${c.name} unblocked`);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-neutral-900">
      {/* header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Customers</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {customers.length} customers · {count("featured")} featured · {count("risk")} high risk
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => flash("Exported customers as CSV")}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900"
          >
            <Ico d={I.download} className="h-3.5 w-3.5" /> Export
          </button>
          <button
            type="button"
            onClick={() => flash("Add customer coming soon")}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Ico d={I.plus} className="h-3.5 w-3.5" /> Add customer
          </button>
        </div>
      </header>

      {/* Featured slider */}
      <FeaturedSlider items={featured} paused={!!opened} onView={setOpenId} />

      {/* Customers list */}
      <section aria-label="Customer list" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Customer type" className="flex gap-1 self-start overflow-x-auto rounded-full bg-neutral-100 p-1">
            {TABS.map(([key, label]) => {
              const on = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(key)}
                  className={cx(
                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    on ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {label}
                  <span className={cx("text-[10px] tabular-nums", on ? "text-white/70" : "text-neutral-400")}>{count(key)}</span>
                </button>
              );
            })}
          </div>
          <label className="relative block lg:w-72">
            <Ico d={I.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, email or ID"
              className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-900"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-neutral-900">No customers found</p>
            <p className="mt-1 text-sm text-neutral-500">Try another tab or a different search.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-100 bg-neutral-50 text-[10px] uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="hidden px-4 py-3 font-bold md:table-cell">District</th>
                    <th className="px-4 py-3 text-right font-bold">Orders</th>
                    <th className="px-4 py-3 text-right font-bold">Lifetime</th>
                    <th className="hidden px-4 py-3 font-bold lg:table-cell">Last order</th>
                    <th className="hidden px-4 py-3 font-bold lg:table-cell">Tier</th>
                    <th className="hidden px-4 py-3 font-bold md:table-cell">Status</th>
                    <th className="px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar c={c} className="h-9 w-9 rounded-full text-xs" />
                            {c.verified && (
                              <span className="absolute -bottom-0.5 -right-0.5">
                                <VerifiedDot className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setOpenId(c.id)}
                              className="block max-w-full cursor-pointer truncate text-left font-semibold text-neutral-900 hover:text-orange-600"
                            >
                              {c.name}
                            </button>
                            <p className="truncate text-xs text-neutral-400">{c.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="hidden px-4 py-3 text-xs text-neutral-600 md:table-cell">{c.district}</td>

                      <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-neutral-900">{c.orders}</td>

                      <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-neutral-900">{money(c.spent)}</td>

                      <td className="hidden px-4 py-3 text-xs text-neutral-500 lg:table-cell">{c.lastOrder}</td>

                      <td className="hidden px-4 py-3 lg:table-cell">
                        <Chip className={TIER_TONE[c.tier]}>{tierLabel(c.tier)}</Chip>
                      </td>

                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {c.status === "active" ? (
                            <Chip className="bg-neutral-100 text-neutral-600">Active</Chip>
                          ) : (
                            <Chip className="bg-neutral-900 text-white">Blocked</Chip>
                          )}
                          {c.risk === "high" && (
                            <Chip className="bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-300">⚠ High</Chip>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <ContactIcons c={c} />
                          <button
                            type="button"
                            onClick={() => setOpenId(c.id)}
                            className="cursor-pointer rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-900"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs text-neutral-500">Showing {filtered.length} of {customers.length} customers</p>
      </section>

      {opened && (
        <ProfileModal
          key={opened.id}
          c={opened}
          onClose={() => setOpenId(null)}
          onToggleFeatured={() => toggleFeatured(opened)}
          onToggleBlock={(why) => toggleBlock(opened, why)}
        />
      )}

      <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-1/2 z-[80] -translate-x-1/2">
        {toast && (
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-neutral-900 px-5 py-2.5 text-sm text-white shadow-2xl">
            <Ico d={I.check} className="h-4 w-4 text-emerald-400" sw={3} /> {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   FEATURED SLIDER — white, auto-slide 5s
   ============================================================ */
function FeaturedSlider({ items, paused, onView }) {
  const n = items.length;
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const touchX = useRef(null);

  useEffect(() => { if (i >= n) setI(0); }, [n, i]);

  /* AUTO SLIDE — every 5s (pause on hover/focus/modal) */
  useEffect(() => {
    if (n < 2 || hold || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n, hold, paused]);

  const go = (d) => setI((x) => (x + d + n) % n);

  if (n === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-neutral-200 px-6 py-14 text-center">
        <p className="text-sm font-semibold text-neutral-900">No featured customers yet</p>
        <p className="mt-1 text-sm text-neutral-500">Open any customer and tap "Feature" to show them here.</p>
      </section>
    );
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured customers"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="overflow-hidden rounded-3xl border border-neutral-200 bg-white outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
    >
      {/* Progress bar (auto-slide indicator) */}
      {n > 1 && !hold && !paused && (
        <div className="h-0.5 w-full bg-neutral-100">
          <div
            key={i}
            className="h-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]"
            style={{ animation: "slideProgress 5s linear forwards" }}
          />
        </div>
      )}

      <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${i * 100}%)` }}>
        {items.map((c, idx) => <Slide key={c.id} c={c} active={idx === i} onView={() => onView(c.id)} />)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 border-t border-neutral-100 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose featured customer">
          {items.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={c.name}
              onClick={() => setI(idx)}
              className={cx(
                "cursor-pointer rounded-full p-0.5 transition-all",
                idx === i ? "bg-neutral-900" : "opacity-50 hover:opacity-100"
              )}
            >
              <Avatar c={c} className="h-8 w-8 rounded-full text-[10px] ring-2 ring-white" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-neutral-500">{i + 1} / {n}</span>
          {n > 1 && (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous customer"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                <Ico d={I.left} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next customer"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                <Ico d={I.right} className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* progress keyframe */}
      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

function Slide({ c, active, onView }) {
  const nt = nextTier(c);
  const tab = active ? 0 : -1;
  return (
    <div role="group" aria-roledescription="slide" aria-label={c.name} aria-hidden={!active} className="w-full shrink-0 p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        {/* Portrait */}
        <div className="relative mx-auto lg:mx-0">
          <Avatar c={c} className="h-32 w-32 rounded-3xl text-4xl ring-4 ring-neutral-100 sm:h-36 sm:w-36" />
          {c.verified && <span className="absolute -bottom-2 -right-2"><VerifiedDot className="h-8 w-8" /></span>}
          <span className="absolute -left-2 -top-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            <Ico d={I.star} className="h-3 w-3" sw={2.5} /> Featured
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0 text-center lg:text-left">
          <p className="text-sm font-semibold text-neutral-500">{tierLabel(c.tier)} member</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{c.name}</h2>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-sm text-neutral-500 lg:justify-start">
            <span>{c.id}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Ico d={I.pin} className="h-3.5 w-3.5" /> {c.district}
            </span>
            <span aria-hidden>·</span>
            <span>Joined {c.joined}</span>
          </p>

          <ul className="mx-auto mt-5 grid max-w-lg gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:mx-0">
            {[["Orders", c.orders], ["Lifetime spend", money(c.spent)], ["Last order", c.lastOrder], ["Returns", `${c.returns} of ${c.orders}`]].map(([l, v]) => (
              <li key={l} className="flex items-baseline gap-2 text-sm">
                <span className="text-neutral-500">{l}</span>
                <span className="min-w-3 flex-1 border-b border-dotted border-neutral-300" />
                <span className="font-semibold tabular-nums text-neutral-900">{v}</span>
              </li>
            ))}
          </ul>

          {nt && (
            <div className="mx-auto mt-5 max-w-lg lg:mx-0">
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] transition-all duration-700" style={{ width: `${nt.pct}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">{money(nt.left)} more to reach {tierLabel(nt.name)}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            type="button"
            tabIndex={tab}
            onClick={onView}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 lg:flex-none"
          >
            View profile <Ico d={I.arrow} className="h-4 w-4" />
          </button>
          <a
            tabIndex={tab}
            href={waLink(c.phone, `Hi ${firstName(c.name)}, `)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b] lg:flex-none"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a
            tabIndex={tab}
            href={`tel:${c.phone}`}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 lg:flex-none"
          >
            <Ico d={I.phone} className="h-4 w-4" /> Call
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE MODAL — navy sidebar + scrollable body
   ============================================================ */
const BLOCK_REASONS = ["Suspicious activity", "Repeated refunds", "COD abuse", "Fake orders", "Other"];

function ProfileModal({ c, onClose, onToggleFeatured, onToggleBlock }) {
  const [blocking, setBlocking] = useState(false);
  const [reason, setReason] = useState(BLOCK_REASONS[0]);
  const active = c.status === "active";
  const isFeatured = c.kind === "featured";
  const nt = nextTier(c);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const meters = [
    { label: "Order frequency", value: c.orders >= 20 ? "Frequent" : c.orders >= 10 ? "Regular" : "Occasional", pct: Math.min(c.orders * 3, 100), invert: false },
    { label: "Cancel rate", value: c.cancelRate, pct: parseFloat(c.cancelRate) * 4, invert: true },
    { label: "Return rate", value: `${c.returns} of ${c.orders}`, pct: (c.returns / Math.max(c.orders, 1)) * 100, invert: true },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${c.name} profile`}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row md:rounded-3xl"
      >
        {/* ═══ LEFT — NAVY SIDEBAR ═══ */}
        <aside
          className="flex shrink-0 flex-col gap-5 overflow-y-auto bg-[var(--color-brand-navy)] p-6 text-white md:w-[280px]"
          style={LEDGER_BG}
        >
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="relative shrink-0">
              <Avatar c={c} className="h-20 w-20 rounded-2xl text-2xl ring-4 ring-white/10 md:h-24 md:w-24 md:text-3xl" />
              {c.verified && (
                <span className="absolute -bottom-1.5 -right-1.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white ring-2 ring-[var(--color-brand-navy)]" title="Verified">
                    <Ico d={I.check} className="h-3 w-3" sw={3.5} />
                  </span>
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight text-white">{c.name}</h2>
              <p className="mt-0.5 text-sm text-white/60">{c.id} · Joined {c.joined}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
              {tierLabel(c.tier)}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-orange)] px-2.5 py-1 text-xs font-semibold text-white">
                <Ico d={I.star} className="h-3 w-3" sw={2.5} /> Featured
              </span>
            )}
            <span className={cx(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              active ? "bg-[var(--color-brand-teal)]/25 text-white" : "bg-white/15 text-white"
            )}>
              {active ? "Active" : "Blocked"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
              <Ico d={I.shield} className="h-3 w-3" /> {tierLabel(c.risk)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={waLink(c.phone, `Hi ${firstName(c.name)}, `)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-teal)] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-4 w-4" /> Message on WhatsApp
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${c.phone}`}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <Ico d={I.phone} className="h-4 w-4" /> Call
              </a>
              <a
                href={`mailto:${c.email}`}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <Ico d={I.mail} className="h-4 w-4" /> Email
              </a>
            </div>
          </div>
        </aside>

        {/* ═══ RIGHT — DETAILS ═══ */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Sticky header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
            <h3 className="text-base font-bold text-neutral-900">Customer overview</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Ico d={I.x} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Orders", c.orders],
                  ["Lifetime spend", money(c.spent)],
                  ["Returns", c.returns],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-neutral-50 p-3.5">
                    <p className="text-xs text-neutral-500">{l}</p>
                    <p className="mt-0.5 text-xl font-bold tabular-nums text-neutral-900">{v}</p>
                  </div>
                ))}
              </div>

              {nt && (
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Progress to {tierLabel(nt.name)}</span>
                    <span className="font-semibold text-neutral-700">{money(nt.left)} to go</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" style={{ width: `${nt.pct}%` }} />
                  </div>
                </div>
              )}

              {/* Quick WhatsApp */}
              <section>
                <h4 className="text-sm font-bold text-neutral-900">Quick WhatsApp message</h4>
                <p className="text-xs text-neutral-500">Opens WhatsApp with the text ready.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TEMPLATES.map(([label, make]) => (
                    <a
                      key={label}
                      href={waLink(c.phone, make(firstName(c.name)))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/5 px-3 py-1.5 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" /> {label}
                    </a>
                  ))}
                </div>
              </section>

              {/* Contact */}
              <section>
                <h4 className="text-sm font-bold text-neutral-900">Contact</h4>
                <ul className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 text-sm">
                  <li className="flex items-center gap-3 px-4 py-3">
                    <Ico d={I.phone} className="h-4 w-4 shrink-0 text-neutral-400" />
                    <a href={`tel:${c.phone}`} className="hover:text-orange-600">{c.phone}</a>
                  </li>
                  <li className="flex items-center gap-3 px-4 py-3">
                    <Ico d={I.mail} className="h-4 w-4 shrink-0 text-neutral-400" />
                    <a href={`mailto:${c.email}`} className="truncate hover:text-orange-600">{c.email}</a>
                  </li>
                  <li className="flex items-start gap-3 px-4 py-3">
                    <Ico d={I.pin} className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="text-neutral-700">{c.address}</span>
                  </li>
                </ul>
              </section>

              {/* Behaviour */}
              <section>
                <h4 className="text-sm font-bold text-neutral-900">Behaviour</h4>
                <div className="mt-2 flex flex-col gap-3 rounded-xl border border-neutral-200 p-4">
                  {meters.map((m) => {
                    const good = m.invert ? m.pct < 20 : m.pct >= 60;
                    const mid = m.invert ? m.pct < 50 : m.pct >= 30;
                    const barColor = good ? "bg-neutral-900" : mid ? "bg-neutral-500" : "bg-neutral-300";
                    const textColor = good ? "text-neutral-900" : mid ? "text-neutral-600" : "text-neutral-400";
                    return (
                      <div key={m.label}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-neutral-500">{m.label}</span>
                          <span className={cx("font-semibold", textColor)}>{m.value}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                          <div className={cx("h-full rounded-full", barColor)} style={{ width: `${Math.max(Math.min(m.pct, 100), 5)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {c.blockReason && (
                <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  <span className="font-semibold text-neutral-900">Blocked: </span>{c.blockReason}
                </p>
              )}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 border-t border-neutral-100 bg-neutral-50 px-6 py-4">
            {blocking ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex-1 cursor-pointer rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                >
                  {BLOCK_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBlocking(false)}
                    className="flex-1 cursor-pointer rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 sm:flex-none"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => { onToggleBlock(reason); setBlocking(false); }}
                    className="flex-1 cursor-pointer rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 sm:flex-none"
                  >
                    Confirm block
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onToggleFeatured}
                  disabled={!active}
                  title={!active ? "Unblock first" : undefined}
                  className={cx(
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    isFeatured
                      ? "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  <Ico d={I.star} sw={isFeatured ? 2.5 : 2} /> {isFeatured ? "Featured" : "Feature customer"}
                </button>
                <button
                  type="button"
                  onClick={() => (active ? setBlocking(true) : onToggleBlock())}
                  className={cx(
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors",
                    active ? "bg-neutral-900 hover:bg-neutral-800" : "bg-emerald-600 hover:bg-emerald-700"
                  )}
                >
                  <Ico d={I.ban} /> {active ? "Block" : "Unblock"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}