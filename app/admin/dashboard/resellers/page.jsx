"use client";

import { useEffect, useMemo, useState } from "react";

const applications = [
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

const money = (n) => `$${n.toLocaleString()}`;
const initials = (s) =>
  s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const medal = ["#FFCB6B", "#C9D3DC", "#D8985A"];

const statusMeta = {
  active: {
    label: "Active",
    dot: "bg-[var(--color-brand-teal)]",
    text: "text-[var(--color-brand-teal)]",
  },
  warning: {
    label: "Warning",
    dot: "bg-[var(--color-brand-orange)]",
    text: "text-[var(--color-brand-orange-dark)]",
  },
  suspended: {
    label: "Suspended",
    dot: "bg-[var(--color-ink)]/35",
    text: "text-[var(--color-ink)]/60",
  },
};

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    className={className}
  >
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
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
};

const Stars = ({ v }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Ico
        key={n}
        d={I.star}
        className={
          "h-3 w-3 " +
          (n <= Math.round(v)
            ? "fill-[var(--color-brand-orange)] text-[var(--color-brand-orange)]"
            : "fill-[var(--color-ink)]/10 text-[var(--color-ink)]/10")
        }
      />
    ))}
  </span>
);

function Sparkline({ data, className = "" }) {
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
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="none"
    >
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

const Page = () => {
  const [apps, setApps] = useState(applications);
  const [resellers, setResellers] = useState(initialResellers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [viewApp, setViewApp] = useState(null);
  const [rateDraft, setRateDraft] = useState(null);
  const [toast, setToast] = useState(null);

  const flash = (m) => setToast(m);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setViewApp(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ranked = useMemo(
    () => [...resellers].sort((a, b) => b.revenue - a.revenue),
    [resellers]
  );
  const maxRevenue = Math.max(...ranked.map((r) => r.revenue), 1);

  const totals = useMemo(
    () => ({
      active: resellers.filter((r) => r.status === "active").length,
      warning: resellers.filter((r) => r.status === "warning").length,
      suspended: resellers.filter((r) => r.status === "suspended").length,
      revenue: resellers.reduce((s, r) => s + r.revenue, 0),
    }),
    [resellers]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (!q || `${r.name} ${r.owner} ${r.location}`.toLowerCase().includes(q))
    );
  }, [ranked, query, status]);

  const opened = resellers.find((r) => r.id === openId) || null;

  const decideApp = (app, ok) => {
    setApps((cur) => cur.filter((a) => a.id !== app.id));
    setViewApp(null);
    if (ok) {
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
      flash(`${app.name} approved and onboarded`);
    } else {
      flash(`${app.name} application rejected`);
    }
  };

  const setResellerStatus = (r, s) => {
    setResellers((cur) =>
      cur.map((x) => (x.id === r.id ? { ...x, status: s } : x))
    );
    flash(`${r.name} marked ${statusMeta[s].label.toLowerCase()}`);
  };

  const saveRate = () => {
    setResellers((cur) =>
      cur.map((x) =>
        x.id === opened.id ? { ...x, commissionRate: rateDraft } : x
      )
    );
    flash("Commission rate updated");
    setRateDraft(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-[var(--color-ink)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Resellers
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Review new applications and manage the partners already selling on the marketplace.
          </p>
        </div>
        <p className="text-sm text-[var(--color-ink)]/60">
          <span className="font-semibold text-[var(--color-ink)]">
            {totals.active}
          </span>{" "}
          active ·{" "}
          <span className="font-semibold text-[var(--color-brand-orange-dark)]">
            {totals.warning}
          </span>{" "}
          warning ·{" "}
          <span className="font-semibold text-[var(--color-ink)]/60">
            {totals.suspended}
          </span>{" "}
          suspended ·{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            {money(totals.revenue)}
          </span>{" "}
          total revenue
        </p>
      </div>

      {apps.length > 0 && (
        <section>
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold">New applications</h2>
            <span className="text-xs text-[var(--color-ink)]/45">
              {apps.length} waiting for review
            </span>
          </div>
          <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
            {apps.map((a) => {
              const docsOk = a.documents.filter((d) => d.ok).length;
              return (
                <div
                  key={a.id}
                  className="group flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-[var(--color-line)] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-orange)] text-sm font-bold text-white">
                      {initials(a.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {a.name}
                      </p>
                      <p className="truncate text-xs text-[var(--color-ink)]/50">
                        {a.owner} · {a.location}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--color-brand-cream)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-ink)]/55">
                      {a.applied}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[var(--color-ink)]/55">
                    Category:{" "}
                    <span className="font-medium text-[var(--color-ink)]">
                      {a.category}
                    </span>
                  </p>

                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-ink)]/[0.07]">
                      <div
                        className={
                          "h-full rounded-full " +
                          (docsOk === a.documents.length
                            ? "bg-[var(--color-brand-teal)]"
                            : "bg-[var(--color-brand-orange)]")
                        }
                        style={{
                          width: `${(docsOk / a.documents.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] tabular-nums text-[var(--color-ink)]/45">
                      {docsOk}/{a.documents.length} docs
                    </span>
                  </div>

                  <div className="mt-4 flex gap-1.5">
                    <button
                      onClick={() => setViewApp(a)}
                      className="flex-1 cursor-pointer rounded-lg border border-[var(--color-line)] py-2 text-xs font-semibold transition-colors hover:border-[var(--color-brand-navy)] hover:text-[var(--color-brand-navy)]"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => decideApp(a, false)}
                      title="Reject"
                      className="grid w-9 cursor-pointer place-items-center rounded-lg border border-[var(--color-line)] transition-colors hover:border-[var(--color-ink)]"
                    >
                      <Ico d={I.x} className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => decideApp(a, true)}
                      title="Approve"
                      className="grid w-9 cursor-pointer place-items-center rounded-lg bg-[var(--color-brand-orange)] text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]"
                    >
                      <Ico d={I.check} className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
        <div className="flex flex-col gap-3 border-b border-[var(--color-line)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold">
            Leaderboard{" "}
            <span className="font-normal text-[var(--color-ink)]/40">
              · ranked by revenue
            </span>
          </h2>
          <div className="flex gap-2">
            <div className="flex gap-1 rounded-xl bg-[var(--color-ink)]/[0.05] p-1">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["warning", "Warning"],
                ["suspended", "Suspended"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setStatus(k)}
                  className={
                    "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors " +
                    (status === k
                      ? "bg-white shadow-sm"
                      : "text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]")
                  }
                >
                  {l}
                </button>
              ))}
            </div>
            <label className="relative hidden sm:block">
              <Ico
                d={I.search}
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/35"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-48 rounded-xl border border-[var(--color-line)] py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-navy)]"
              />
            </label>
          </div>
        </div>

        <ul className="divide-y divide-[var(--color-line)]">
          {filtered.map((r, idx) => {
            const meta = statusMeta[r.status];
            const top3 = idx < 3 && status === "all" && !query;
            return (
              <li key={r.id}>
                <button
                  onClick={() => setOpenId(r.id)}
                  className="flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-brand-cream)]/60 sm:px-5"
                >
                  <span className="grid w-6 shrink-0 place-items-center">
                    {top3 ? (
                      <Ico
                        d={I.crown}
                        className="h-4 w-4"
                        sw={1.6}
                        style={{ color: medal[idx] }}
                      />
                    ) : (
                      <span className="text-sm font-semibold tabular-nums text-[var(--color-ink)]/35">
                        {idx + 1}
                      </span>
                    )}
                  </span>
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-xs font-bold text-white">
                    {initials(r.name)}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${meta.dot}`}
                    />
                  </span>

                  <span className="min-w-0 flex-[1.3]">
                    <span className="block truncate text-sm font-semibold">
                      {r.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]/45">
                      <Stars v={r.rating} /> {r.location}
                    </span>
                  </span>

                  <span className="hidden flex-1 sm:block">
                    <span className="flex items-baseline justify-between text-xs">
                      <span className="text-sm font-semibold tabular-nums text-[var(--color-ink)]">
                        {money(r.revenue)}
                      </span>
                      <span className="text-[var(--color-ink)]/40">
                        revenue
                      </span>
                    </span>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[var(--color-ink)]/[0.07]">
                      <span
                        className="block h-full rounded-full bg-[var(--color-brand-navy)]"
                        style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                      />
                    </span>
                  </span>

                  <span
                    className={
                      "hidden shrink-0 md:block " +
                      (r.trend[6] >= r.trend[0]
                        ? "text-[var(--color-brand-teal)]"
                        : "text-[var(--color-brand-orange-dark)]")
                    }
                  >
                    <Sparkline data={r.trend} className="h-5 w-16" />
                  </span>

                  <span className="hidden w-20 shrink-0 text-center lg:block">
                    <span
                      className={
                        "block text-sm font-semibold tabular-nums " +
                        (r.approvalRate < 80
                          ? "text-[var(--color-brand-orange-dark)]"
                          : "")
                      }
                    >
                      {r.approvalRate}%
                    </span>
                    <span className="block text-[11px] text-[var(--color-ink)]/45">
                      approved
                    </span>
                  </span>

                  <span
                    className={
                      "w-20 shrink-0 text-right text-xs font-medium " +
                      meta.text
                    }
                  >
                    {meta.label}
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-5 py-14 text-center text-sm text-[var(--color-ink)]/40">
              No resellers match.
            </li>
          )}
        </ul>
      </section>

      {viewApp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div
            onClick={() => setViewApp(null)}
            className="absolute inset-0 bg-[var(--color-brand-navy)]/50 backdrop-blur-[2px]"
          />
          <div className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start gap-3 border-b border-[var(--color-line)] p-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--color-brand-orange)] text-lg font-bold text-white">
                {initials(viewApp.name)}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold">
                  {viewApp.name}
                </h2>
                <p className="text-sm text-[var(--color-ink)]/55">
                  {viewApp.owner} · applied {viewApp.applied}
                </p>
              </div>
              <button
                onClick={() => setViewApp(null)}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/55 transition-colors hover:bg-[var(--color-ink)]/5"
              >
                <Ico d={I.x} className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <p className="rounded-xl bg-[var(--color-brand-cream)] px-4 py-3 text-sm text-[var(--color-ink)]/75">
                {viewApp.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[var(--color-ink)]/45">
                    Category
                  </p>
                  <p className="font-medium">{viewApp.category}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-ink)]/45">
                    Location
                  </p>
                  <p className="font-medium">{viewApp.location}</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm">
                {[
                  [I.mail, viewApp.email],
                  [I.phone, viewApp.phone],
                  [I.pin, viewApp.address],
                ].map(([ic, t]) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-[var(--color-ink)]/75"
                  >
                    <Ico
                      d={ic}
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink)]/40"
                    />
                    {t}
                  </li>
                ))}
              </ul>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Experience
                </h3>
                <p className="mt-1.5 text-sm text-[var(--color-ink)]/70">
                  {viewApp.experience}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                  Submitted documents
                </h3>
                <ul className="mt-2 divide-y divide-[var(--color-line)] rounded-xl border border-[var(--color-line)]">
                  {viewApp.documents.map((d) => (
                    <li
                      key={d.name}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm"
                    >
                      <Ico
                        d={I.doc}
                        className="h-4 w-4 shrink-0 text-[var(--color-ink)]/35"
                      />
                      <span className="flex-1">{d.name}</span>
                      <span
                        className={
                          "flex items-center gap-1 text-xs font-medium " +
                          (d.ok
                            ? "text-[var(--color-brand-teal)]"
                            : "text-[var(--color-brand-orange-dark)]")
                        }
                      >
                        <Ico
                          d={d.ok ? I.check : I.warn}
                          className="h-3.5 w-3.5"
                        />{" "}
                        {d.ok ? "Received" : "Missing"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 border-t border-[var(--color-line)] p-5">
              <button
                onClick={() => decideApp(viewApp, false)}
                className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-ink)]"
              >
                Reject
              </button>
              <button
                onClick={() => decideApp(viewApp, true)}
                className="flex-1 cursor-pointer rounded-xl bg-[var(--color-brand-orange)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]"
              >
                Approve &amp; onboard
              </button>
            </div>
          </div>
        </div>
      )}

      {opened && (
        <>
          <div
            onClick={() => {
              setOpenId(null);
              setRateDraft(null);
            }}
            className="fixed inset-0 z-40 bg-[var(--color-brand-navy)]/40 backdrop-blur-[2px]"
          />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-white shadow-2xl sm:w-[440px]">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-navy)] text-sm font-bold text-white">
                  {initials(opened.name)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">
                    {opened.name}
                  </h2>
                  <p className="text-sm text-[var(--color-ink)]/55">
                    {opened.owner} · since {opened.joined}
                  </p>
                  <span
                    className={
                      "mt-1 inline-flex items-center gap-1.5 text-xs font-medium " +
                      statusMeta[opened.status].text
                    }
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusMeta[opened.status].dot}`}
                    />{" "}
                    {statusMeta[opened.status].label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpenId(null);
                  setRateDraft(null);
                }}
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/55 hover:bg-[var(--color-ink)]/5"
              >
                <Ico d={I.x} />
              </button>
            </div>

            <div className="flex-1 space-y-6 p-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Revenue", money(opened.revenue)],
                  ["Products", opened.liveProducts],
                  ["Approved", `${opened.approvalRate}%`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl bg-[var(--color-brand-cream)] py-3"
                  >
                    <p className="text-base font-semibold tabular-nums">{v}</p>
                    <p className="text-[11px] text-[var(--color-ink)]/50">
                      {k}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 text-sm">
                {[
                  [I.mail, opened.email],
                  [I.phone, opened.phone],
                  [I.pin, opened.location],
                ].map(([ic, t]) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-[var(--color-ink)]/75"
                  >
                    <Ico
                      d={ic}
                      className="h-4 w-4 shrink-0 text-[var(--color-ink)]/40"
                    />
                    <span className="truncate">{t}</span>
                  </li>
                ))}
              </ul>

              <div>
                <h3 className="text-sm font-semibold">Verification</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {[
                    ["Trade license", opened.license],
                    ["National ID", opened.nid],
                    ["Bank account", opened.bank],
                  ].map(([k, ok]) => (
                    <li key={k} className="flex items-center gap-2.5">
                      <span
                        className={
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full text-white " +
                          (ok
                            ? "bg-[var(--color-brand-teal)]"
                            : "bg-[var(--color-ink)]/25")
                        }
                      >
                        <Ico d={ok ? I.check : I.x} className="h-3 w-3" />
                      </span>
                      <span>{k}</span>
                      <span className="ml-auto text-xs text-[var(--color-ink)]/50">
                        {ok ? "Verified" : "Missing"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold">Commission rate</h3>
                  <span className="text-lg font-semibold tabular-nums">
                    {rateDraft ?? opened.commissionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={rateDraft ?? opened.commissionRate}
                  onChange={(e) => setRateDraft(Number(e.target.value))}
                  className="mt-2 w-full cursor-pointer accent-[var(--color-brand-orange)]"
                />
                {rateDraft !== null && rateDraft !== opened.commissionRate && (
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setRateDraft(null)}
                      className="cursor-pointer rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium hover:border-[var(--color-ink)]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveRate}
                      className="cursor-pointer rounded-lg bg-[var(--color-brand-navy)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    >
                      Save rate
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Payout history{" "}
                  <span className="font-normal text-[var(--color-ink)]/40">
                    · {money(opened.commissionOwed)} owed now
                  </span>
                </h3>
                <ul className="mt-2 divide-y divide-[var(--color-line)] rounded-xl border border-[var(--color-line)]">
                  {opened.payouts.length === 0 && (
                    <li className="px-3.5 py-3 text-sm text-[var(--color-ink)]/40">
                      No payouts yet.
                    </li>
                  )}
                  {opened.payouts.map((p) => (
                    <li
                      key={p.date}
                      className="flex items-center justify-between px-3.5 py-2.5 text-sm"
                    >
                      <span className="text-[var(--color-ink)]/70">
                        {p.date}
                      </span>
                      <span className="font-medium tabular-nums">
                        {money(p.amount)}
                      </span>
                      <span
                        className={
                          "text-xs font-medium " +
                          (p.status === "Paid"
                            ? "text-[var(--color-brand-teal)]"
                            : "text-[var(--color-brand-orange-dark)]")
                        }
                      >
                        {p.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2 border-t border-[var(--color-line)] p-5">
              {opened.status !== "suspended" ? (
                <>
                  {opened.status === "active" ? (
                    <button
                      onClick={() => setResellerStatus(opened, "warning")}
                      className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-ink)]"
                    >
                      Issue warning
                    </button>
                  ) : (
                    <button
                      onClick={() => setResellerStatus(opened, "active")}
                      className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-semibold transition-colors hover:border-[var(--color-ink)]"
                    >
                      Clear warning
                    </button>
                  )}
                  <button
                    onClick={() => setResellerStatus(opened, "suspended")}
                    className="flex-1 cursor-pointer rounded-xl bg-[var(--color-ink)] py-2.5 text-sm font-semibold text-white hover:opacity-85"
                  >
                    Suspend
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setResellerStatus(opened, "active")}
                  className="flex-1 cursor-pointer rounded-xl bg-[var(--color-brand-teal)] py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Reinstate
                </button>
              )}
            </div>
          </aside>
        </>
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