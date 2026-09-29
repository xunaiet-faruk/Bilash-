"use client";

import { useEffect, useMemo, useState } from "react";

const seed = () => [
  {
    id: "CUS-1001",
    name: "Mahin Chowdhury",
    email: "mahin@example.com",
    phone: "+880 1711-000111",
    district: "Chattogram",
    address: "House 12, Road 4, Chattogram",
    joined: "Jan 2024",
    status: "active",
    tier: "gold",
    verified: true,
    risk: "low",
    orders: 24,
    spent: 1240.5,
    returns: 1,
    cancelRate: "2%",
    lastOrder: "2h ago",
    tags: ["VIP", "Repeat"],
  },
  {
    id: "CUS-1002",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+880 1811-000222",
    district: "Dhaka",
    address: "Flat 3B, Banani, Dhaka",
    joined: "Mar 2024",
    status: "active",
    tier: "silver",
    verified: true,
    risk: "low",
    orders: 12,
    spent: 620.0,
    returns: 0,
    cancelRate: "0%",
    lastOrder: "5h ago",
    tags: ["Repeat"],
  },
  {
    id: "CUS-1003",
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    phone: "+880 1911-000333",
    district: "Sylhet",
    address: "Uposhohor, Sylhet",
    joined: "Nov 2023",
    status: "active",
    tier: "platinum",
    verified: true,
    risk: "low",
    orders: 42,
    spent: 2410.0,
    returns: 2,
    cancelRate: "1.5%",
    lastOrder: "1d ago",
    tags: ["VIP", "Top Buyer"],
  },
  {
    id: "CUS-1004",
    name: "Farzana Akter",
    email: "farzana@example.com",
    phone: "+880 1611-000444",
    district: "Rajshahi",
    address: "Shahjalal Road, Rajshahi",
    joined: "Jun 2024",
    status: "active",
    tier: "bronze",
    verified: false,
    risk: "medium",
    orders: 5,
    spent: 310.0,
    returns: 1,
    cancelRate: "8%",
    lastOrder: "2d ago",
    tags: [],
  },
  {
    id: "CUS-1005",
    name: "Sadman Rahman",
    email: "sadman@example.com",
    phone: "+880 1511-000555",
    district: "Dhaka",
    address: "Green Road, Dhaka",
    joined: "Feb 2024",
    status: "active",
    tier: "silver",
    verified: true,
    risk: "low",
    orders: 11,
    spent: 980.0,
    returns: 0,
    cancelRate: "0%",
    lastOrder: "3d ago",
    tags: ["Repeat"],
  },
  {
    id: "CUS-1006",
    name: "Imran Kabir",
    email: "imran@example.com",
    phone: "+880 1311-000666",
    district: "Chattogram",
    address: "GEC Circle, Chattogram",
    joined: "Sep 2024",
    status: "blocked",
    tier: "bronze",
    verified: false,
    risk: "high",
    orders: 3,
    spent: 125.0,
    returns: 3,
    cancelRate: "45%",
    lastOrder: "5d ago",
    tags: ["Fraud Watch"],
  },
  {
    id: "CUS-1007",
    name: "Rumana Islam",
    email: "rumana@example.com",
    phone: "+880 1211-000777",
    district: "Chattogram",
    address: "Agrabad, Chattogram",
    joined: "Aug 2024",
    status: "active",
    tier: "silver",
    verified: true,
    risk: "medium",
    orders: 8,
    spent: 540.0,
    returns: 1,
    cancelRate: "6%",
    lastOrder: "4d ago",
    tags: [],
  },
  {
    id: "CUS-1008",
    name: "Kamal Hossain",
    email: "kamal@example.com",
    phone: "+880 1911-000888",
    district: "Dhaka",
    address: "Mirpur, Dhaka",
    joined: "Dec 2023",
    status: "active",
    tier: "gold",
    verified: true,
    risk: "low",
    orders: 28,
    spent: 1680.0,
    returns: 2,
    cancelRate: "1%",
    lastOrder: "1w ago",
    tags: ["VIP", "Repeat"],
  },
  {
    id: "CUS-1009",
    name: "Sadia Rahman",
    email: "sadia@example.com",
    phone: "+880 1777-000999",
    district: "Khulna",
    address: "Sonadanga, Khulna",
    joined: "May 2024",
    status: "active",
    tier: "bronze",
    verified: false,
    risk: "low",
    orders: 4,
    spent: 220.0,
    returns: 0,
    cancelRate: "0%",
    lastOrder: "1w ago",
    tags: ["New"],
  },
  {
    id: "CUS-1010",
    name: "Arif Hossain",
    email: "arif@example.com",
    phone: "+880 1877-001000",
    district: "Dhaka",
    address: "Bashundhara, Dhaka",
    joined: "Jul 2024",
    status: "active",
    tier: "silver",
    verified: true,
    risk: "low",
    orders: 9,
    spent: 720.0,
    returns: 1,
    cancelRate: "3%",
    lastOrder: "1w ago",
    tags: [],
  },
];

const TIER_TONE = {
  platinum: { bg: "bg-[var(--color-brand-navy)]", text: "text-white", label: "Platinum" },
  gold: { bg: "bg-[var(--color-brand-orange)]/15", text: "text-[var(--color-brand-orange-dark)]", label: "Gold" },
  silver: { bg: "bg-[var(--color-brand-cream)]", text: "text-[var(--color-ink)]/75", label: "Silver" },
  bronze: { bg: "bg-[var(--color-ink)]/[0.06]", text: "text-[var(--color-ink)]/60", label: "Bronze" },
};

const STATUS_TONE = {
  active: { bg: "bg-[var(--color-brand-teal)]/10", text: "text-[var(--color-brand-teal)]", ring: "ring-[var(--color-brand-teal)]/30", dot: "bg-[var(--color-brand-teal)]" },
  blocked: { bg: "bg-[var(--color-ink)]/[0.06]", text: "text-[var(--color-ink)]/70", ring: "ring-[var(--color-ink)]/20", dot: "bg-[var(--color-ink)]/50" },
};

const RISK_TONE = {
  low: { bg: "bg-[var(--color-brand-teal)]/10", text: "text-[var(--color-brand-teal)]", ring: "ring-[var(--color-brand-teal)]/30" },
  medium: { bg: "bg-[var(--color-brand-orange)]/10", text: "text-[var(--color-brand-orange-dark)]", ring: "ring-[var(--color-brand-orange)]/30" },
  high: { bg: "bg-[var(--color-brand-navy)]", text: "text-white", ring: "ring-[var(--color-brand-navy)]/40" },
};

const money = (n) => `$${n.toFixed(2)}`;
const initials = (s) =>
  s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
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
  box: "M3.3 7 12 12l8.7-5M12 12v9M3.3 7 12 3l8.7 4v10L12 21l-8.7-4Z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  ban: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM5.6 5.6l12.8 12.8",
  wallet: "M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
  refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4",
  message: "M21 12a8 8 0 1 1-3.6-6.7L21 4l-.9 3.2A8 8 0 0 1 21 12z",
  crown: "M3 6l4 4 5-7 5 7 4-4v12H3V6z",
  star: "m12 3 2.6 5.6 6 .7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.2 6-.7z",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  filter: "M3 5h18l-7 8v6l-4-2v-4L3 5Z",
};

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "vip", label: "VIP" },
  { key: "risk", label: "High Risk" },
  { key: "blocked", label: "Blocked" },
  { key: "new", label: "New" },
];

const belongsTab = (c, tab) => {
  if (tab === "all") return true;
  if (tab === "active") return c.status === "active";
  if (tab === "vip") return c.tags.includes("VIP");
  if (tab === "risk") return c.risk === "high";
  if (tab === "blocked") return c.status === "blocked";
  if (tab === "new") return c.tags.includes("New");
  return true;
};

const Page = () => {
  const [customers, setCustomers] = useState(seed());
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [featuredId, setFeaturedId] = useState("CUS-1003");
  const [openId, setOpenId] = useState(null);
  const [blocking, setBlocking] = useState(false);
  const [blockReason, setBlockReason] = useState("Suspicious activity");
  const [toast, setToast] = useState(null);

  const flash = (m) => setToast(m);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) =>
        belongsTab(c, tab) &&
        (!q ||
          `${c.name} ${c.email} ${c.phone} ${c.id}`.toLowerCase().includes(q))
    );
  }, [customers, tab, query]);

  const featured =
    customers.find((c) => c.id === featuredId) ||
    filtered[0] ||
    customers[0];
  const listWithoutFeatured = filtered.filter((c) => c.id !== featured?.id);

  const count = (t) => customers.filter((c) => belongsTab(c, t)).length;
  const opened = customers.find((c) => c.id === openId) || null;

  const toggleBlock = (c, why) => {
    setCustomers((cur) =>
      cur.map((x) =>
        x.id === c.id
          ? {
              ...x,
              status: x.status === "active" ? "blocked" : "active",
              tags:
                x.status === "active"
                  ? [...new Set([...x.tags, "Blocked"])]
                  : x.tags.filter((t) => t !== "Blocked"),
              blockReason: x.status === "active" ? why : undefined,
            }
          : x
      )
    );
    setBlocking(false);
    flash(`Customer ${c.status === "active" ? "blocked" : "unblocked"}`);
  };

  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 text-[var(--color-ink)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-brand-orange)] shadow-[0_0_10px_rgba(255,90,31,1)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]/45 sm:text-[11px]">
              Customer Directory
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Customers
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            {customers.length} customers · {count("vip")} VIP · {count("risk")} flagged
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => flash("Exported customers as CSV")}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--color-ink)]"
          >
            <Ico d={I.download} className="h-3.5 w-3.5" /> Export
          </button>
          <button
            onClick={() => flash("Add customer coming soon")}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[var(--color-brand-orange)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]"
          >
            <Ico d={I.plus} className="h-3.5 w-3.5" /> Add customer
          </button>
        </div>
      </div>

      {featured && (
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)] bg-gradient-to-br from-white via-white to-[var(--color-brand-cream)]/60">
          <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[var(--color-brand-orange)]/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-[var(--color-brand-teal)]/[0.06] blur-3xl" />

          <div className="relative grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8">
            <div className="relative mx-auto lg:mx-0">
              <div className="relative grid h-28 w-28 place-items-center rounded-full bg-[var(--color-brand-navy)] text-3xl font-black text-white shadow-lg shadow-[var(--color-brand-navy)]/20 sm:h-32 sm:w-32 sm:text-4xl">
                {initials(featured.name)}
                {featured.verified && (
                  <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white ring-4 ring-white">
                    <Ico d={I.check} className="h-4 w-4" sw={3} />
                  </span>
                )}
              </div>
              <div className="absolute -top-2 -right-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md ${TIER_TONE[featured.tier].bg} ${TIER_TONE[featured.tier].text}`}
                >
                  <Ico d={I.crown} className="h-3 w-3" />
                  {TIER_TONE[featured.tier].label}
                </span>
              </div>
            </div>

            <div className="min-w-0 text-center lg:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/45">
                Featured Customer
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                {featured.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-ink)]/60">
                {featured.id} · Joined {featured.joined}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-cream)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]/75">
                  <Ico d={I.pin} className="h-3 w-3" />
                  {featured.district}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${RISK_TONE[featured.risk].bg} ${RISK_TONE[featured.risk].text} ${RISK_TONE[featured.risk].ring}`}
                >
                  <Ico d={I.shield} className="h-3 w-3" />
                  {featured.risk} risk
                </span>
                {featured.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex rounded-full bg-[var(--color-brand-navy)]/5 px-3 py-1 text-xs font-medium text-[var(--color-ink)]/70"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--color-line)] bg-white/70 p-4 backdrop-blur">
                <div className="text-center lg:text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Orders
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums">
                    {featured.orders}
                  </p>
                </div>
                <div className="border-l border-[var(--color-line)] text-center lg:text-left lg:pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Lifetime
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-[var(--color-brand-teal)]">
                    {money(featured.spent)}
                  </p>
                </div>
                <div className="border-l border-[var(--color-line)] text-center lg:text-left lg:pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Last order
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {featured.lastOrder}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center gap-2 lg:flex-col lg:justify-start">
              <button
                onClick={() => setOpenId(featured.id)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[var(--color-brand-navy)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-brand-navy)]/20 transition-opacity hover:opacity-90 lg:flex-none"
              >
                View profile
                <Ico d={I.arrowRight} className="h-4 w-4" />
              </button>
              <a
                href={`tel:${featured.phone}`}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]/75 transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              >
                <Ico d={I.phone} className="h-4 w-4" />
                Call
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
        <div className="flex flex-col gap-3 border-b border-[var(--color-line)] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={
                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all " +
                    (isActive
                      ? "bg-[var(--color-brand-navy)] text-white shadow-sm"
                      : "text-[var(--color-ink)]/55 hover:bg-[var(--color-brand-cream)] hover:text-[var(--color-ink)]")
                  }
                >
                  {t.label}
                  <span
                    className={
                      "text-xs tabular-nums " +
                      (isActive ? "text-white/70" : "text-[var(--color-ink)]/40")
                    }
                  >
                    {count(t.key)}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="relative block lg:w-64">
            <Ico
              d={I.search}
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/35"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full rounded-xl border border-[var(--color-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-navy)]"
            />
          </label>
        </div>

        <div className="divide-y divide-[var(--color-line)]">
          {listWithoutFeatured.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-[var(--color-ink)]/50">
                No other customers match.
              </p>
            </div>
          )}

          {listWithoutFeatured.map((c) => {
            const st = STATUS_TONE[c.status];
            const tier = TIER_TONE[c.tier];
            const risk = RISK_TONE[c.risk];
            return (
              <div
                key={c.id}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-[var(--color-brand-cream)]/50"
              >
                <button
                  onClick={() => setFeaturedId(c.id)}
                  className="relative grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full bg-[var(--color-brand-navy)] text-sm font-bold text-white transition-transform group-hover:scale-105"
                  title="Set as featured"
                >
                  {initials(c.name)}
                  {c.verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white ring-2 ring-white">
                      <Ico d={I.check} className="h-2.5 w-2.5" sw={3} />
                    </span>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <button
                      onClick={() => setOpenId(c.id)}
                      className="cursor-pointer truncate text-sm font-semibold transition-colors hover:text-[var(--color-brand-orange-dark)]"
                    >
                      {c.name}
                    </button>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tier.bg} ${tier.text}`}
                    >
                      {tier.label}
                    </span>
                    {c.risk === "high" && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset ${risk.bg} ${risk.text} ${risk.ring}`}
                      >
                        ⚠ High
                      </span>
                    )}
                    {c.status === "blocked" && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset ${st.bg} ${st.text} ${st.ring}`}
                      >
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[var(--color-ink)]/55">
                    {c.email} · {c.district}
                  </p>
                </div>

                <div className="hidden items-center gap-6 sm:flex">
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                      Orders
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums">
                      {c.orders}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                      Lifetime
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-brand-teal)]">
                      {money(c.spent)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <a
                    href={`tel:${c.phone}`}
                    className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink)]/55 transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] sm:flex"
                    title="Call"
                  >
                    <Ico d={I.phone} className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => setOpenId(c.id)}
                    className="cursor-pointer rounded-lg border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/75 transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-line)] px-4 py-3 text-xs text-[var(--color-ink)]/45">
          <span>
            Showing {filtered.length} of {customers.length} customers
          </span>
          <span className="hidden sm:inline">
            Click any avatar to feature that customer
          </span>
        </div>
      </div>

      {opened && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6">
          <div
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-[var(--color-brand-navy)]/50 backdrop-blur-[2px]"
          />
          <div className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-sm font-bold text-white">
                  {initials(opened.name)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold">
                      {opened.name}
                    </h2>
                    {opened.verified && (
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white">
                        <Ico d={I.check} className="h-2.5 w-2.5" sw={3} />
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-[var(--color-ink)]/45">
                    {opened.id} · Joined {opened.joined}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpenId(null)}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/60 hover:bg-[var(--color-ink)]/5"
                aria-label="Close"
              >
                <Ico d={I.x} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TIER_TONE[opened.tier].bg} ${TIER_TONE[opened.tier].text}`}>
                  {TIER_TONE[opened.tier].label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold ring-1 ring-inset ${RISK_TONE[opened.risk].bg} ${RISK_TONE[opened.risk].text} ${RISK_TONE[opened.risk].ring}`}
                >
                  <Ico d={I.shield} className="h-3 w-3" />
                  {opened.risk} risk
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold ring-1 ring-inset ${STATUS_TONE[opened.status].bg} ${STATUS_TONE[opened.status].text} ${STATUS_TONE[opened.status].ring}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_TONE[opened.status].dot}`} />
                  {opened.status === "active" ? "Active" : "Blocked"}
                </span>
                {opened.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex rounded-full bg-[var(--color-brand-cream)] px-3 py-1 text-[10px] font-semibold text-[var(--color-ink)]/70"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Orders", value: opened.orders, icon: I.box, highlight: "navy" },
                  { label: "Lifetime", value: money(opened.spent), icon: I.wallet, highlight: "teal" },
                  { label: "Returns", value: opened.returns, icon: I.refresh, highlight: "orange" },
                ].map((s) => {
                  const highlights = {
                    navy: { bg: "bg-[var(--color-brand-navy)]/5", text: "text-[var(--color-brand-navy)]" },
                    teal: { bg: "bg-[var(--color-brand-teal)]/10", text: "text-[var(--color-brand-teal)]" },
                    orange: { bg: "bg-[var(--color-brand-orange)]/10", text: "text-[var(--color-brand-orange-dark)]" },
                  };
                  const h = highlights[s.highlight];
                  return (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[var(--color-line)] bg-white p-3"
                    >
                      <div className={`grid h-7 w-7 place-items-center rounded-lg ${h.bg} ${h.text}`}>
                        <Ico d={s.icon} className="h-3.5 w-3.5" />
                      </div>
                      <p className="mt-2 text-lg font-bold tabular-nums">
                        {s.value}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Contact
                </p>
                <ul className="mt-2 space-y-2.5 rounded-xl border border-[var(--color-line)] bg-white p-4">
                  <li className="flex items-center gap-2.5 text-sm">
                    <Ico d={I.phone} className="h-4 w-4 shrink-0 text-[var(--color-ink)]/40" />
                    <a
                      href={`tel:${opened.phone}`}
                      className="text-[var(--color-ink)]/75 hover:text-[var(--color-ink)]"
                    >
                      {opened.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <Ico d={I.mail} className="h-4 w-4 shrink-0 text-[var(--color-ink)]/40" />
                    <a
                      href={`mailto:${opened.email}`}
                      className="truncate text-[var(--color-ink)]/75 hover:text-[var(--color-ink)]"
                    >
                      {opened.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <Ico d={I.pin} className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink)]/40" />
                    <span className="text-[var(--color-ink)]/75">
                      {opened.address}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Performance
                </p>
                <div className="mt-2 space-y-3 rounded-xl border border-[var(--color-line)] bg-white p-4">
                  {[
                    { label: "Order Frequency", value: opened.orders >= 20 ? "Frequent" : opened.orders >= 10 ? "Regular" : "Occasional", pct: Math.min(opened.orders * 3, 100), invert: false },
                    { label: "Cancel Rate", value: opened.cancelRate, pct: parseFloat(opened.cancelRate) * 4, invert: true },
                    { label: "Return Rate", value: `${opened.returns}/${opened.orders}`, pct: (opened.returns / opened.orders) * 100, invert: true },
                  ].map((m) => {
                    const good = m.invert ? m.pct < 20 : m.pct >= 60;
                    const medium = m.invert ? m.pct < 50 : m.pct >= 30;
                    const color = good
                      ? "bg-[var(--color-brand-teal)]"
                      : medium
                      ? "bg-[var(--color-brand-orange)]"
                      : "bg-[var(--color-ink)]";
                    return (
                      <div key={m.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-[var(--color-ink)]/55">
                            {m.label}
                          </span>
                          <span
                            className={
                              "font-semibold " +
                              (good
                                ? "text-[var(--color-brand-teal)]"
                                : medium
                                ? "text-[var(--color-brand-orange-dark)]"
                                : "text-[var(--color-ink)]")
                            }
                          >
                            {m.value}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-ink)]/[0.06]">
                          <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${Math.max(Math.min(m.pct, 100), 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {opened.blockReason && (
                <div className="mt-5 rounded-xl bg-[var(--color-ink)]/[0.06] p-3.5">
                  <p className="text-xs font-semibold text-[var(--color-ink)]">
                    Blocked reason:
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-ink)]/70">
                    {opened.blockReason}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
              {blocking ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                  >
                    {[
                      "Suspicious activity",
                      "Repeated refunds",
                      "COD abuse",
                      "Fake orders",
                      "Other",
                    ].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBlocking(false)}
                      className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--color-ink)] sm:flex-none"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => toggleBlock(opened, blockReason)}
                      className="flex-1 cursor-pointer rounded-xl bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85 sm:flex-none"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <a
                      href={`tel:${opened.phone}`}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/75 transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                    >
                      <Ico d={I.phone} className="h-4 w-4" /> Call
                    </a>
                    <button
                      onClick={() => flash(`Messaging ${opened.name}…`)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/75 transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                    >
                      <Ico d={I.message} className="h-4 w-4" /> Message
                    </button>
                  </div>
                  <button
                    onClick={() => setBlocking(true)}
                    className={
                      "flex cursor-pointer items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85 " +
                      (opened.status === "active"
                        ? "bg-[var(--color-ink)]"
                        : "bg-[var(--color-brand-teal)]")
                    }
                  >
                    <Ico d={I.ban} className="h-4 w-4" />
                    {opened.status === "active" ? "Block" : "Unblock"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[var(--color-brand-navy)] px-5 py-2.5 text-sm text-white shadow-2xl">
          <Ico d={I.check} className="h-4 w-4 text-[var(--color-brand-teal)]" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default Page;