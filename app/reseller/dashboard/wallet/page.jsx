"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ==================== FAKE DATA ====================
const ago = (days, h = 12, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const DEMO_WALLET = {
  available: 48320,
  withdrawn: 125000,
  minWithdraw: 500,
  bank: {
    name: "Dutch-Bangla Bank",
    account: "****4567",
    verified: true,
    holder: "SADIA ISLAM",
    cardNumber: "4831 5567 8901 4567",
    expiry: "09/27",
    network: "VISA",
  },
};

const DEMO_TRANSACTIONS = [
  { id: "t1", type: "credit", source: "order", title: "Order #RS-1024", subtitle: "Wireless Earbuds Pro × 2", amount: 700, date: ago(0, 14, 20), status: "completed", method: "Wallet" },
  { id: "t2", type: "credit", source: "order", title: "Order #RS-1023", subtitle: "Smart Watch Series 3 × 1", amount: 300, date: ago(0, 11, 5), status: "completed", method: "Wallet" },
  { id: "t3", type: "credit", source: "order", title: "Order #RS-1022", subtitle: "Power Bank 10000mAh × 3", amount: 390, date: ago(1, 18, 40), status: "pending", method: "Wallet" },
  { id: "t11", type: "credit", source: "order", title: "Order #RS-1025", subtitle: "Leather Laptop Bag × 4", amount: 2800, date: ago(1, 10, 15), status: "pending", method: "Wallet" },
  { id: "t12", type: "credit", source: "order", title: "Order #RS-1026", subtitle: "LED Desk Lamp × 8", amount: 2500, date: ago(2, 16, 0), status: "pending", method: "Wallet" },
  { id: "t4", type: "debit", source: "withdraw", title: "Withdrawal to bank", subtitle: "Dutch-Bangla Bank ****4567", amount: 10000, date: ago(3, 15, 30), status: "completed", method: "DBBL" },
  { id: "t5", type: "credit", source: "bonus", title: "Referral bonus", subtitle: "New reseller joined via you", amount: 250, date: ago(4, 9, 45), status: "completed", method: "Bonus" },
  { id: "t6", type: "credit", source: "order", title: "Order #RS-1021", subtitle: "Leather Laptop Bag × 2", amount: 500, date: ago(4, 13, 10), status: "completed", method: "Wallet" },
  { id: "t7", type: "debit", source: "refund", title: "Customer refund", subtitle: "Order #RS-1015 returned", amount: 450, date: ago(5, 17, 25), status: "completed", method: "Refund" },
  { id: "t8", type: "credit", source: "order", title: "Order #RS-1020", subtitle: "LED Desk Lamp × 5", amount: 800, date: ago(6, 12, 0), status: "completed", method: "Wallet" },
  { id: "t9", type: "credit", source: "order", title: "Order #RS-1019", subtitle: "Wireless Earbuds Pro × 4", amount: 1400, date: ago(7, 10, 30), status: "completed", method: "Wallet" },
  { id: "t13", type: "credit", source: "order", title: "Order #RS-1018", subtitle: "Power Bank 10000mAh × 5", amount: 650, date: ago(9, 14, 0), status: "completed", method: "Wallet" },
  { id: "t14", type: "credit", source: "order", title: "Order #RS-1017", subtitle: "Smart Watch Series 3 × 2", amount: 600, date: ago(10, 11, 40), status: "completed", method: "Wallet" },
  { id: "t15", type: "credit", source: "order", title: "Order #RS-1016", subtitle: "LED Desk Lamp × 3", amount: 480, date: ago(11, 16, 15), status: "completed", method: "Wallet" },
  { id: "t10", type: "debit", source: "withdraw", title: "Withdrawal to bank", subtitle: "Dutch-Bangla Bank ****4567", amount: 15000, date: ago(12, 15, 0), status: "completed", method: "DBBL" },
  { id: "t16", type: "credit", source: "order", title: "Order #RS-1014", subtitle: "Wireless Earbuds Pro × 3", amount: 1050, date: ago(13, 12, 20), status: "completed", method: "Wallet" },
];

// ==================== HELPERS ====================
const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(
    Math.round(n || 0)
  );

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatShort = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const addBusinessDays = (from, n) => {
  const d = new Date(from);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 5 && day !== 6) left--;
  }
  return d;
};

const useEscape = (handler, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => e.key === "Escape" && handler();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
};

// ==================== ICONS ====================
const Svg = ({ children, className = "h-5 w-5", ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

const IconBox = (p) => (
  <Svg {...p}>
    <path d="M21 8 12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </Svg>
);
const IconBank = (p) => (
  <Svg {...p}>
    <path d="m3 10 9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />
  </Svg>
);
const IconGift = (p) => (
  <Svg {...p}>
    <path d="M4 12v8h16v-8M3 8h18v4H3zM12 8v12" />
    <path d="M12 8C9.5 8 8 7 8 5.5S9.5 3 12 8Zm0 0c2.5 0 4-1 4-2.5S14.5 3 12 8Z" />
  </Svg>
);
const IconReturn = (p) => (
  <Svg {...p}>
    <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />
  </Svg>
);
const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
const IconClose = (p) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);
const IconDown = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </Svg>
);
const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);

const SOURCE = {
  order: {
    Icon: IconBox,
    tile: "bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)]",
    label: "Order earning",
  },
  withdraw: {
    Icon: IconBank,
    tile: "bg-[var(--color-brand-navy)]/10 text-[var(--color-brand-navy)]",
    label: "Withdrawal",
  },
  bonus: {
    Icon: IconGift,
    tile: "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-dark)]",
    label: "Bonus",
  },
  refund: {
    Icon: IconReturn,
    tile: "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/70",
    label: "Refund",
  },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "in", label: "Money in" },
  { id: "out", label: "Money out" },
  { id: "pending", label: "Pending" },
];

// ==================== MAIN ====================
export default function WalletPage({
  wallet: walletProp = DEMO_WALLET,
  transactions: txProp = DEMO_TRANSACTIONS,
  onWithdraw,
} = {}) {
  const [wallet, setWallet] = useState(walletProp);
  const [txs, setTxs] = useState(txProp);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [detail, setDetail] = useState(null);
  const listRef = useRef(null);

  const sorted = useMemo(
    () => [...txs].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [txs]
  );

  const pendingTxs = txs.filter((t) => t.status === "pending");
  const pendingSum = pendingTxs.reduce((s, t) => s + t.amount, 0);

  const counts = {
    all: txs.length,
    in: txs.filter((t) => t.type === "credit").length,
    out: txs.filter((t) => t.type === "debit").length,
    pending: pendingTxs.length,
  };

  const filtered = useMemo(() => {
    return sorted.filter((t) => {
      if (filter === "in" && t.type !== "credit") return false;
      if (filter === "out" && t.type !== "debit") return false;
      if (filter === "pending" && t.status !== "pending") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${t.title} ${t.subtitle} ${t.method || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sorted, filter, search]);

  const goToList = (f) => {
    setFilter(f);
    requestAnimationFrame(() =>
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const canWithdraw =
    wallet.bank.verified && wallet.available >= wallet.minWithdraw;

  const handleWithdraw = async (amount) => {
    if (onWithdraw) await onWithdraw(amount);
    else await new Promise((r) => setTimeout(r, 900));
    setWallet((w) => ({
      ...w,
      available: w.available - amount,
      withdrawn: w.withdrawn + amount,
    }));
    setTxs((list) => [
      {
        id: `w${Date.now()}`,
        type: "debit",
        source: "withdraw",
        title: "Withdrawal to bank",
        subtitle: `${wallet.bank.name} ${wallet.bank.account}`,
        amount,
        date: new Date().toISOString(),
        status: "processing",
        method: "DBBL",
      },
      ...list,
    ]);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* ============ HEADER ============ */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
          Wallet
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Manage your earnings, withdrawals, and transaction history.
        </p>
      </div>

      {/* ============ BANK CARD + STATS ============ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        {/* ===== Real Bank Card ===== */}
        <div className="mx-auto w-full max-w-[420px]">
          <div
            className="relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl p-6 text-white shadow-2xl shadow-black/30"
            style={{
              background:
                "linear-gradient(135deg, #0a0f1c 0%, #131c33 45%, #0b1220 100%)",
            }}
          >
            {/* ============ TOP-LEFT ORANGE GLOW ============ */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56">
              <div
                className="h-full w-full rounded-full blur-[60px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251,146,60,0.95) 0%, rgba(249,115,22,0.6) 40%, transparent 75%)",
                }}
              />
            </div>
            {/* Concentric arcs — orange corner */}
            <svg
              className="pointer-events-none absolute -left-8 -top-8 h-48 w-48"
              viewBox="0 0 200 200"
              fill="none"
            >
              <circle cx="0" cy="0" r="60" stroke="#fb923c" strokeWidth="1.2" strokeOpacity="0.6" />
              <circle cx="0" cy="0" r="90" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="0" cy="0" r="120" stroke="#fb923c" strokeWidth="0.8" strokeOpacity="0.25" />
              <circle cx="0" cy="0" r="150" stroke="#fb923c" strokeWidth="0.6" strokeOpacity="0.15" />
            </svg>

            {/* ============ BOTTOM-RIGHT RED GLOW ============ */}
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56">
              <div
                className="h-full w-full rounded-full blur-[60px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.95) 0%, rgba(220,38,38,0.6) 40%, transparent 75%)",
                }}
              />
            </div>
            {/* Concentric arcs — red corner */}
            <svg
              className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48"
              viewBox="0 0 200 200"
              fill="none"
            >
              <circle cx="200" cy="200" r="60" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.6" />
              <circle cx="200" cy="200" r="90" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="200" cy="200" r="120" stroke="#ef4444" strokeWidth="0.8" strokeOpacity="0.25" />
              <circle cx="200" cy="200" r="150" stroke="#ef4444" strokeWidth="0.6" strokeOpacity="0.15" />
            </svg>

            {/* ============ DOT TEXTURE ============ */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "18px 18px",
              }}
            />

            {/* ============ DIAGONAL SHINE ============ */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, white 50%, transparent 60%)",
              }}
            />

            {/* ============ CONTENT ============ */}
            <div className="relative flex h-full flex-col justify-between">
              {/* Top: chip + network */}
              <div className="flex items-start justify-between">
                {/* EMV Chip */}
                <div className="relative h-9 w-12 overflow-hidden rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-md shadow-amber-900/30">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px p-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-sm bg-amber-800/25" />
                    ))}
                  </div>
                  <div className="absolute inset-x-2 top-1/2 h-px bg-amber-800/30" />
                  <div className="absolute inset-y-2 left-1/2 w-px bg-amber-800/30" />
                </div>

                {/* Network */}
                <div className="text-right">
                  <p className="text-[11px] font-black italic tracking-[0.15em] text-white/90 drop-shadow-sm">
                    {wallet.bank.network || "VISA"}
                  </p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-white/40">
                    Debit
                  </p>
                </div>
              </div>

              {/* Middle: Balance */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45">
                  Available Balance
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
                  ৳ {fmt(wallet.available)}
                </p>
              </div>

              {/* Bottom: Card number + holder + expiry */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Card Number
                </p>
                <p className="mt-1 font-mono text-[15px] tracking-[0.15em] text-white/95 drop-shadow-sm">
                  {wallet.bank.cardNumber || "4831 5567 8901 4567"}
                </p>

                <div className="mt-3 flex items-end justify-between">
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      Card Holder
                    </p>
                    <p className="mt-0.5 truncate text-xs font-semibold tracking-wider">
                      {wallet.bank.holder || "YOUR NAME"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
                      Valid Thru
                    </p>
                    <p className="mt-0.5 font-mono text-xs font-semibold tracking-wider">
                      {wallet.bank.expiry || "09/27"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdraw CTA */}
          <button
            type="button"
            disabled={!canWithdraw}
            onClick={() => setShowWithdraw(true)}
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
          >
            <IconDown className="h-4 w-4" />
            Withdraw money
          </button>

          <p className="mt-2 text-center text-xs text-[var(--color-ink)]/50">
            {!wallet.bank.verified
              ? "Verify your bank to withdraw"
              : wallet.available < wallet.minWithdraw
              ? `Minimum ৳${fmt(wallet.minWithdraw)} to withdraw`
              : `Min ৳${fmt(wallet.minWithdraw)} · Arrives in 2-3 business days`}
          </p>
        </div>

        {/* ===== Right Side: Wallet Stats ===== */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-brand-teal)]" />
                  Available to withdraw
                </p>
                <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-[var(--color-brand-navy)]">
                  ৳{fmt(wallet.available)}
                </p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)]">
                <IconCheck className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-ink)]/60">
              {pendingSum > 0
                ? `৳${fmt(pendingSum)} more is coming from ${pendingTxs.length} pending order${pendingTxs.length > 1 ? "s" : ""}.`
                : "Every order is already settled in your balance."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                Pending
              </p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-[var(--color-brand-orange)]">
                ৳{fmt(pendingSum)}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
                {pendingTxs.length} order{pendingTxs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-line)] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                Total withdrawn
              </p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
                ৳{fmt(wallet.withdrawn)}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
                All time
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
              Payout method
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-navy)]/10 text-[var(--color-brand-navy)]">
                <IconBank />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                  {wallet.bank.name}
                </p>
                <p className="text-xs tabular-nums text-[var(--color-ink)]/55">
                  {wallet.bank.account}
                </p>
              </div>
              {wallet.bank.verified && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-brand-teal)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-brand-teal)]">
                  <IconCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ TRANSACTIONS TABLE ============ */}
      <section
        ref={listRef}
        className="scroll-mt-4 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white"
      >
        <div className="flex flex-col gap-4 border-b border-[var(--color-line)] p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Transaction history
              </h2>
              <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </p>
            </div>

            <div className="relative w-full max-w-xs">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-lg border border-[var(--color-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-brand-orange)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] ${
                    on
                      ? "bg-[var(--color-brand-navy)] text-white"
                      : "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/60 hover:bg-[var(--color-line)]"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                      on ? "bg-white/20" : "bg-white"
                    }`}
                  >
                    {counts[f.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-brand-cream)] text-2xl">
              🪙
            </div>
            <p className="text-sm font-medium text-[var(--color-ink)]">
              No transactions found
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink)]/50">
              {search ? "Try a different search." : "Nothing matches this filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[var(--color-brand-cream)]/60">
                <tr>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Transaction
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {filtered.map((t) => {
                  const isCredit = t.type === "credit";
                  const pending = t.status === "pending";
                  const processing = t.status === "processing";
                  const meta = SOURCE[t.source] || SOURCE.order;
                  const Icon = meta.Icon;

                  return (
                    <tr
                      key={t.id}
                      className="transition-colors hover:bg-[var(--color-brand-cream)]/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.tile}`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                              {t.title}
                            </p>
                            <p className="truncate text-xs text-[var(--color-ink)]/50">
                              {t.subtitle}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-[var(--color-ink)]/70">
                          {meta.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[var(--color-ink)]">
                          {formatDate(t.date)}
                        </p>
                        <p className="text-[11px] tabular-nums text-[var(--color-ink)]/50">
                          {formatTime(t.date)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {pending ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-orange)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand-orange-dark)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-orange)]" />
                            Pending
                          </span>
                        ) : processing ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-navy)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand-navy)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-navy)]" />
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-teal)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand-teal)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)]" />
                            Completed
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <p
                          className={`text-sm font-bold tabular-nums ${
                            pending
                              ? "text-[var(--color-ink)]/40"
                              : isCredit
                              ? "text-[var(--color-brand-teal)]"
                              : "text-[var(--color-ink)]"
                          }`}
                        >
                          {isCredit ? "+" : "−"}৳{fmt(t.amount)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setDetail(t)}
                          className="cursor-pointer rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)]/60 transition-colors hover:border-[var(--color-brand-navy)] hover:bg-[var(--color-brand-navy)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ============ SHEETS ============ */}
      {showWithdraw && (
        <WithdrawSheet
          available={wallet.available}
          min={wallet.minWithdraw}
          bank={wallet.bank}
          onClose={() => setShowWithdraw(false)}
          onConfirm={handleWithdraw}
        />
      )}
      {detail && (
        <DetailSheet t={detail} bank={wallet.bank} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

// ==================== SHEET WRAPPER ====================
function Sheet({ labelId, onClose, locked, children }) {
  useEscape(onClose, !locked);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-brand-navy)]/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={locked ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ id, title, sub, onClose, disabled }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] px-5 py-4">
      <div>
        <h3 id={id} className="text-base font-semibold text-[var(--color-ink)]">
          {title}
        </h3>
        {sub && <p className="mt-0.5 text-sm text-[var(--color-ink)]/55">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        aria-label="Close"
        className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl text-[var(--color-ink)]/50 transition-colors hover:bg-[var(--color-ink)]/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconClose className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==================== WITHDRAW SHEET ====================
function WithdrawSheet({ available, min, bank, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState("form");
  const n = Number(amount) || 0;
  const tooLow = n > 0 && n < min;
  const tooHigh = n > available;
  const canSubmit = n >= min && n <= available && phase !== "sending";
  const arrive = useMemo(() => addBusinessDays(new Date(), 3), []);

  const chips = [25, 50, 75, 100].map((p) => ({
    p,
    value: p === 100 ? available : Math.floor((available * p) / 100),
  }));

  const submit = async () => {
    if (!canSubmit) return;
    setPhase("sending");
    try {
      await onConfirm(n);
      setPhase("done");
    } catch {
      setPhase("error");
    }
  };

  if (phase === "done") {
    return (
      <Sheet labelId="wd-title" onClose={onClose}>
        <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white">
            <IconCheck className="h-8 w-8" />
          </span>
          <h3 id="wd-title" className="mt-4 text-xl font-semibold text-[var(--color-ink)]">
            Withdrawal requested
          </h3>
          <p className="mt-1 text-3xl font-bold tabular-nums text-[var(--color-brand-navy)]">
            ৳{fmt(n)}
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            Expected in {bank.name} by <b>{formatShort(arrive)}</b>.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/40"
          >
            Done
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet labelId="wd-title" onClose={onClose} locked={phase === "sending"}>
      <SheetHeader
        id="wd-title"
        title="Withdraw money"
        sub={`Available ৳${fmt(available)}`}
        onClose={onClose}
        disabled={phase === "sending"}
      />

      <div className="p-5">
        <label htmlFor="wd-amount" className="text-sm font-medium text-[var(--color-ink)]">
          How much do you want to withdraw?
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-[var(--color-line)] px-4 py-3 transition-colors focus-within:border-[var(--color-brand-orange)]">
          <span className="text-3xl font-semibold text-[var(--color-ink)]/30">৳</span>
          <input
            id="wd-amount"
            type="number"
            inputMode="numeric"
            min="0"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-3xl font-bold tabular-nums text-[var(--color-ink)] outline-none placeholder:font-normal placeholder:text-[var(--color-ink)]/20"
          />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {chips.map(({ p, value }) => (
            <button
              key={p}
              type="button"
              disabled={value < min}
              onClick={() => setAmount(String(value))}
              className={`cursor-pointer rounded-xl border py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] disabled:cursor-not-allowed disabled:opacity-40 ${
                n === value
                  ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)] text-white"
                  : "border-[var(--color-line)] text-[var(--color-ink)]/70 hover:border-[var(--color-brand-orange)]/50"
              }`}
            >
              {p === 100 ? "All" : `${p}%`}
            </button>
          ))}
        </div>

        {(tooLow || tooHigh || phase === "error") && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-[var(--color-brand-orange)]/10 p-3 text-sm text-[var(--color-brand-orange-dark)]"
          >
            {phase === "error"
              ? "Could not send your request. Check your internet and try again."
              : tooLow
              ? `The smallest amount you can withdraw is ৳${fmt(min)}.`
              : "That is more than your available balance."}
          </p>
        )}

        <dl className="mt-4 divide-y divide-dashed divide-[var(--color-line)] rounded-2xl bg-[var(--color-brand-cream)] px-4 text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-[var(--color-ink)]/60">Money goes to</dt>
            <dd className="text-right font-semibold text-[var(--color-ink)]">
              {bank.name} {bank.account}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-[var(--color-ink)]/60">Expected by</dt>
            <dd className="font-semibold text-[var(--color-ink)]">{formatShort(arrive)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-[var(--color-ink)]/60">Left in your wallet</dt>
            <dd className="font-semibold tabular-nums text-[var(--color-ink)]">
              ৳{fmt(Math.max(available - n, 0))}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="mt-5 w-full cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {phase === "sending"
            ? "Sending request..."
            : n >= min && n <= available
            ? `Withdraw ৳${fmt(n)}`
            : "Enter an amount"}
        </button>
      </div>
    </Sheet>
  );
}

// ==================== DETAIL SHEET ====================
function DetailSheet({ t, bank, onClose }) {
  const isCredit = t.type === "credit";
  const meta = SOURCE[t.source] || SOURCE.order;
  const Icon = meta.Icon;
  const pending = t.status === "pending";
  const processing = t.status === "processing";

  let message = null;
  if (t.source === "order" && pending)
    message =
      "The customer has not received this order yet. This money moves to your available balance after delivery, usually within 1-2 days.";
  else if (t.source === "order")
    message = "This earning was added to your available balance.";
  else if (t.source === "bonus")
    message = "A bonus from admin. Added to your available balance.";
  else if (t.source === "refund")
    message = "The customer returned this order, so your earning from it was taken back.";
  else if (t.source === "withdraw" && !processing)
    message = `This money was sent to ${bank.name} ${bank.account}.`;

  return (
    <Sheet labelId="tx-title" onClose={onClose}>
      <SheetHeader id="tx-title" title="Transaction details" onClose={onClose} />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${meta.tile}`}>
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[var(--color-ink)]">
              {t.title}
            </p>
            <p className="truncate text-sm text-[var(--color-ink)]/55">
              {t.subtitle}
            </p>
          </div>
        </div>

        <p
          className={`mt-5 text-4xl font-bold tabular-nums ${
            pending
              ? "text-[var(--color-ink)]/45"
              : isCredit
              ? "text-[var(--color-brand-teal)]"
              : "text-[var(--color-ink)]"
          }`}
        >
          {isCredit ? "+" : "−"}৳{fmt(t.amount)}
        </p>

        {message && (
          <p className="mt-3 rounded-2xl bg-[var(--color-brand-cream)] p-4 text-sm leading-relaxed text-[var(--color-ink)]/70">
            {message}
          </p>
        )}

        <dl className="mt-4 divide-y divide-dashed divide-[var(--color-line)] text-sm">
          <DetailRow label="Type" value={meta.label} />
          <DetailRow
            label="Status"
            value={pending ? "Pending" : processing ? "Processing" : "Completed"}
          />
          <DetailRow label="Method" value={t.method || "Wallet"} />
          <DetailRow
            label="Date"
            value={`${formatDate(t.date)}, ${formatTime(t.date)}`}
          />
          <DetailRow label="Reference" value={t.id.toUpperCase()} />
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full cursor-pointer rounded-2xl border border-[var(--color-line)] py-3.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
        >
          Close
        </button>
      </div>
    </Sheet>
  );
}

// ==================== SMALL PIECES ====================
function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-[var(--color-ink)]/60">{label}</dt>
      <dd className="text-right font-semibold text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}