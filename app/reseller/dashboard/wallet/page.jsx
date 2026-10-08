"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ==================== FAKE DATA ====================
// আসল project এ এগুলো API থেকে আসবে (props দিয়ে পাঠালেই হবে)।
// নিচের তারিখগুলো আজকের দিন ধরে বানানো, তাই "Today" / "Yesterday" ঠিকমতো দেখায়।
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
  bank: { name: "Dutch-Bangla Bank", account: "****4567", verified: true },
};

const DEMO_TRANSACTIONS = [
  { id: "t1", type: "credit", source: "order", title: "Order #RS-1024", subtitle: "Wireless Earbuds Pro × 2", amount: 700, date: ago(0, 14, 20), status: "completed" },
  { id: "t2", type: "credit", source: "order", title: "Order #RS-1023", subtitle: "Smart Watch Series 3 × 1", amount: 300, date: ago(0, 11, 5), status: "completed" },
  { id: "t3", type: "credit", source: "order", title: "Order #RS-1022", subtitle: "Power Bank 10000mAh × 3", amount: 390, date: ago(1, 18, 40), status: "pending" },
  { id: "t11", type: "credit", source: "order", title: "Order #RS-1025", subtitle: "Leather Laptop Bag × 4", amount: 2800, date: ago(1, 10, 15), status: "pending" },
  { id: "t12", type: "credit", source: "order", title: "Order #RS-1026", subtitle: "LED Desk Lamp × 8", amount: 2500, date: ago(2, 16, 0), status: "pending" },
  { id: "t4", type: "debit", source: "withdraw", title: "Withdrawal to bank", subtitle: "Dutch-Bangla Bank ****4567", amount: 10000, date: ago(3, 15, 30), status: "completed" },
  { id: "t5", type: "credit", source: "bonus", title: "Referral bonus", subtitle: "New reseller joined via you", amount: 250, date: ago(4, 9, 45), status: "completed" },
  { id: "t6", type: "credit", source: "order", title: "Order #RS-1021", subtitle: "Leather Laptop Bag × 2", amount: 500, date: ago(4, 13, 10), status: "completed" },
  { id: "t7", type: "debit", source: "refund", title: "Customer refund", subtitle: "Order #RS-1015 returned", amount: 450, date: ago(5, 17, 25), status: "completed" },
  { id: "t8", type: "credit", source: "order", title: "Order #RS-1020", subtitle: "LED Desk Lamp × 5", amount: 800, date: ago(6, 12, 0), status: "completed" },
  { id: "t9", type: "credit", source: "order", title: "Order #RS-1019", subtitle: "Wireless Earbuds Pro × 4", amount: 1400, date: ago(7, 10, 30), status: "completed" },
  { id: "t13", type: "credit", source: "order", title: "Order #RS-1018", subtitle: "Power Bank 10000mAh × 5", amount: 650, date: ago(9, 14, 0), status: "completed" },
  { id: "t14", type: "credit", source: "order", title: "Order #RS-1017", subtitle: "Smart Watch Series 3 × 2", amount: 600, date: ago(10, 11, 40), status: "completed" },
  { id: "t15", type: "credit", source: "order", title: "Order #RS-1016", subtitle: "LED Desk Lamp × 3", amount: 480, date: ago(11, 16, 15), status: "completed" },
  { id: "t10", type: "debit", source: "withdraw", title: "Withdrawal to bank", subtitle: "Dutch-Bangla Bank ****4567", amount: 15000, date: ago(12, 15, 0), status: "completed" },
  { id: "t16", type: "credit", source: "order", title: "Order #RS-1014", subtitle: "Wireless Earbuds Pro × 3", amount: 1050, date: ago(13, 12, 20), status: "completed" },
];

/*
  Withdraw করলে onWithdraw(amount) ডাকা হবে। এখানে আপনার API call বসাবেন।
  Promise ফেরত দিন। fail করলে throw করুন, তাহলে error দেখাবে।
*/

// ==================== HELPERS ====================
const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(
    Math.round(n || 0)
  );

const compact = (n) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(n || 0));

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

// Bangladesh এ শুক্র ও শনিবার ব্যাংক বন্ধ, তাই এই দুই দিন বাদ
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

const signed = (t) => (t.type === "credit" ? t.amount : -t.amount);

const groupByDate = (items) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups = [];
  const index = {};
  items.forEach((t) => {
    const d = new Date(t.date).toDateString();
    const label =
      d === today ? "Today" : d === yesterday ? "Yesterday" : formatDate(t.date);
    if (index[label] === undefined) {
      index[label] = groups.length;
      groups.push({ label, items: [] });
    }
    groups[index[label]].items.push(t);
  });
  return groups;
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

const EMPTY_TEXT = {
  all: "No transactions yet. Your first order earning will show up here.",
  in: "No money in yet.",
  out: "You have not withdrawn any money yet.",
  pending: "Nothing is pending. All your order earnings are already in your balance.",
};

// ==================== MAIN ====================
export default function WalletPage({
  wallet: walletProp = DEMO_WALLET,
  transactions: txProp = DEMO_TRANSACTIONS,
  onWithdraw,
} = {}) {
  const [wallet, setWallet] = useState(walletProp);
  const [txs, setTxs] = useState(txProp);
  const [filter, setFilter] = useState("all");
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

  const filtered = sorted.filter((t) => {
    if (filter === "in") return t.type === "credit";
    if (filter === "out") return t.type === "debit";
    if (filter === "pending") return t.status === "pending";
    return true;
  });
  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const goToList = (f) => {
    setFilter(f);
    requestAnimationFrame(() =>
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const canWithdraw = wallet.bank.verified && wallet.available >= wallet.minWithdraw;

  const handleWithdraw = async (amount) => {
    if (onWithdraw) await onWithdraw(amount);
    else await new Promise((r) => setTimeout(r, 900)); // demo
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
      },
      ...list,
    ]);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <style>{`
        @keyframes mc-flow { to { background-position: 14px 0; } }
        .mc-flow {
          height: 2px;
          background-image: linear-gradient(90deg, rgba(255,255,255,.7) 50%, transparent 50%);
          background-size: 14px 2px;
          animation: mc-flow 1.1s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) { .mc-flow { animation: none; } }
      `}</style>

      {/* ============ HEADER ============ */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)]">Wallet</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          See where your money is, and take it out when you are ready.
        </p>
      </div>

      {/* ============ HERO: BALANCE + MONEY PIPELINE ============ */}
      <section className="overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]/65">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-teal)]" />
              Ready to withdraw
            </p>
            <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-[var(--color-brand-navy)] sm:text-6xl">
              ৳{fmt(wallet.available)}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-ink)]/60">
              {pendingSum > 0
                ? `৳${fmt(pendingSum)} more is on the way. It joins your balance after the customer receives the order.`
                : "No money is waiting. Every order is already in your balance."}
            </p>
          </div>

          <div className="sm:text-right">
            <button
              type="button"
              disabled={!canWithdraw}
              onClick={() => setShowWithdraw(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-orange)] px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)]/40 disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 sm:w-auto"
            >
              <IconDown className="h-5 w-5" />
              Withdraw money
            </button>
            <p className="mt-2 text-xs text-[var(--color-ink)]/50">
              {!wallet.bank.verified
                ? "Verify your bank account to withdraw."
                : wallet.available < wallet.minWithdraw
                ? `You need at least ৳${fmt(wallet.minWithdraw)} to withdraw.`
                : `Minimum ৳${fmt(wallet.minWithdraw)}. Arrives in 2-3 business days.`}
            </p>
          </div>
        </div>

        {/* pipeline */}
        <div className="bg-[var(--color-brand-navy)] px-5 pb-5 pt-4 text-white sm:px-7">
          <p className="text-xs text-white/55">
            How your money moves. Tap a step to see its transactions.
          </p>
          <div className="mt-4 grid grid-cols-3">
            <Station
              ring
              flowing
              label="Pending"
              amount={pendingSum}
              note={`${pendingTxs.length} ${pendingTxs.length === 1 ? "order" : "orders"} on the way`}
              onClick={() => goToList("pending")}
            />
            <Station
              teal
              flowing={false}
              label="Available"
              amount={wallet.available}
              note="Yours to withdraw"
              onClick={() => goToList("in")}
            />
            <Station
              last
              label="Withdrawn"
              amount={wallet.withdrawn}
              note="Sent to your bank"
              onClick={() => goToList("out")}
            />
          </div>
        </div>
      </section>

      {/* ============ EARNINGS + PAYOUT ============ */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.4fr_1fr]">
        <EarningsCard txs={txs} />

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-[var(--color-line)] bg-white p-5">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Your payout account
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-navy)]/10 text-[var(--color-brand-navy)]">
                <IconBank />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                  {wallet.bank.name}
                </p>
                <p className="text-sm tabular-nums text-[var(--color-ink)]/55">
                  {wallet.bank.account}
                </p>
              </div>
            </div>
            <p
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                wallet.bank.verified
                  ? "bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)]"
                  : "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-dark)]"
              }`}
            >
              {wallet.bank.verified ? (
                <>
                  <IconCheck className="h-3.5 w-3.5" /> Verified
                </>
              ) : (
                "Not verified yet"
              )}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink)]/50">
              Money is only ever sent to this account.
            </p>
          </div>

          <div className="rounded-3xl bg-[var(--color-brand-cream)] p-5">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Good to know
            </p>
            <ul className="mt-2 flex flex-col gap-2 text-sm text-[var(--color-ink)]/65">
              <li>Pending money becomes available after delivery.</li>
              <li>You can withdraw from ৳{fmt(wallet.minWithdraw)}.</li>
              <li>Friday and Saturday are not counted as business days.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============ TRANSACTIONS ============ */}
      <section
        ref={listRef}
        className="scroll-mt-4 rounded-3xl border border-[var(--color-line)] bg-white"
      >
        <div className="border-b border-[var(--color-line)] p-4 sm:p-5">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">
            Transactions
          </h2>
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] ${
                    on
                      ? "bg-[var(--color-brand-navy)] text-white"
                      : "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/70 hover:bg-[var(--color-line)]"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-xs tabular-nums ${
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
          <p className="p-10 text-center text-sm text-[var(--color-ink)]/55">
            {EMPTY_TEXT[filter]}
          </p>
        ) : (
          <div className="p-2 sm:p-3">
            {groups.map((g) => {
              const net = g.items
                .filter((t) => t.status !== "pending")
                .reduce((s, t) => s + signed(t), 0);
              return (
                <div key={g.label} className="mb-2">
                  <div className="flex items-baseline justify-between px-3 pb-1 pt-3">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {g.label}
                    </p>
                    <p className="text-xs tabular-nums text-[var(--color-ink)]/50">
                      {net === 0
                        ? ""
                        : `${net > 0 ? "+" : "−"}৳${fmt(Math.abs(net))} today`.replace(
                            "today",
                            g.label === "Today" ? "so far" : "net"
                          )}
                    </p>
                  </div>
                  <ul>
                    {g.items.map((t) => (
                      <TransactionRow key={t.id} t={t} onOpen={() => setDetail(t)} />
                    ))}
                  </ul>
                </div>
              );
            })}
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

// ==================== PIPELINE STATION ====================
function Station({ label, amount, note, onClick, ring, teal, flowing, last }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 pr-1 text-left focus-visible:outline-none"
    >
      <div className="flex items-center">
        <span
          className={`h-4 w-4 shrink-0 rounded-full transition-transform group-hover:scale-125 group-focus-visible:ring-4 group-focus-visible:ring-[var(--color-brand-orange)]/50 ${
            ring
              ? "border-2 border-[var(--color-brand-orange)] bg-transparent"
              : teal
              ? "bg-[var(--color-brand-teal)]"
              : "bg-white/70"
          }`}
        />
        {!last && (
          <span
            className={`mx-2 min-w-3 flex-1 ${
              flowing ? "mc-flow" : "border-t-2 border-dashed border-white/25"
            }`}
          />
        )}
      </div>
      <p className="mt-3 text-sm text-white/65">{label}</p>
      <p className="text-lg font-bold tabular-nums sm:text-2xl">৳{fmt(amount)}</p>
      <p className="mt-0.5 text-xs leading-snug text-white/45 group-hover:text-white/70">
        {note}
      </p>
    </button>
  );
}

// ==================== EARNINGS CARD ====================
function EarningsCard({ txs }) {
  const days = useMemo(() => {
    const out = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({ key: d.toDateString(), date: d, total: 0 });
    }
    txs.forEach((t) => {
      if (t.type === "credit" && t.status === "completed") {
        const day = out.find((x) => x.key === new Date(t.date).toDateString());
        if (day) day.total += t.amount;
      }
    });
    return out;
  }, [txs]);

  const [sel, setSel] = useState(13);
  const total = days.reduce((s, d) => s + d.total, 0);
  const max = Math.max(...days.map((d) => d.total), 1);
  const picked = days[sel];

  return (
    <div className="rounded-3xl border border-[var(--color-line)] bg-white p-5">
      <p className="text-sm font-semibold text-[var(--color-ink)]">
        What you earned in the last 14 days
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-[var(--color-brand-teal)]">
        ৳{fmt(total)}
      </p>

      <div className="mt-4 flex h-28 items-end gap-1.5">
        {days.map((d, i) => {
          const on = sel === i;
          const h = d.total > 0 ? Math.max((d.total / max) * 100, 10) : 3;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSel(i)}
              aria-label={`${formatShort(d.date)}: ৳${fmt(d.total)}`}
              aria-pressed={on}
              className="group flex h-full flex-1 flex-col justify-end focus-visible:outline-none"
            >
              <span
                className="block w-full rounded-t-md transition-[height] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-brand-orange)] motion-reduce:transition-none"
                style={{
                  height: `${h}%`,
                  background: on
                    ? "var(--color-brand-orange)"
                    : d.total > 0
                    ? "var(--color-brand-navy)"
                    : "var(--color-line)",
                  opacity: on || d.total === 0 ? 1 : 0.8,
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {days.map((d, i) => (
          <span
            key={d.key}
            className={`flex-1 text-center text-[10px] tabular-nums ${
              sel === i
                ? "font-semibold text-[var(--color-brand-orange-dark)]"
                : "text-[var(--color-ink)]/40"
            }`}
          >
            {d.date.getDate()}
          </span>
        ))}
      </div>

      <p className="mt-3 rounded-xl bg-[var(--color-brand-cream)] px-3 py-2 text-sm text-[var(--color-ink)]/70">
        {sel === 13 ? "Today" : formatShort(picked.date)}:{" "}
        {picked.total > 0 ? (
          <b className="tabular-nums text-[var(--color-ink)]">৳{fmt(picked.total)}</b>
        ) : (
          "no earnings"
        )}
      </p>
    </div>
  );
}

// ==================== TRANSACTION ROW ====================
function TransactionRow({ t, onOpen }) {
  const isCredit = t.type === "credit";
  const pending = t.status === "pending";
  const processing = t.status === "processing";
  const meta = SOURCE[t.source] || SOURCE.order;
  const Icon = meta.Icon;

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-[var(--color-brand-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
      >
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.tile}`}>
          <Icon />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
            {t.title}
          </p>
          <p className="truncate text-xs text-[var(--color-ink)]/55">{t.subtitle}</p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`text-sm font-bold tabular-nums ${
              pending
                ? "text-[var(--color-ink)]/45"
                : isCredit
                ? "text-[var(--color-brand-teal)]"
                : "text-[var(--color-ink)]"
            }`}
          >
            {isCredit ? "+" : "−"}৳{fmt(t.amount)}
          </p>
          {pending ? (
            <span className="mt-0.5 inline-block rounded-full bg-[var(--color-brand-orange)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-brand-orange-dark)]">
              Pending
            </span>
          ) : processing ? (
            <span className="mt-0.5 inline-block rounded-full bg-[var(--color-brand-navy)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-brand-navy)]">
              Processing
            </span>
          ) : (
            <p className="text-[11px] text-[var(--color-ink)]/40">{formatTime(t.date)}</p>
          )}
        </div>
      </button>
    </li>
  );
}

// ==================== SHEET WRAPPER ====================
function Sheet({ labelId, onClose, locked, children }) {
  useEscape(onClose, !locked);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-brand-navy)]/60 sm:items-center sm:p-4"
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
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[var(--color-ink)]/50 transition-colors hover:bg-[var(--color-ink)]/5 disabled:opacity-40"
      >
        <IconClose className="h-4 w-4" />
      </button>
    </div>
  );
}

// ==================== WITHDRAW SHEET ====================
function WithdrawSheet({ available, min, bank, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState("form"); // form | sending | done | error
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

          <ol className="mt-5 w-full rounded-2xl bg-[var(--color-brand-cream)] p-4 text-left text-sm">
            <Step done>We got your request</Step>
            <Step current>Bank is processing it</Step>
            <Step last>Money arrives in your account</Step>
          </ol>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-2xl bg-[var(--color-brand-navy)] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-navy-light)]"
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
        sub={`You have ৳${fmt(available)} available`}
        onClose={onClose}
        disabled={phase === "sending"}
      />

      <div className="p-5">
        <label htmlFor="wd-amount" className="text-sm font-medium text-[var(--color-ink)]">
          How much do you want to withdraw?
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-[var(--color-line)] px-4 py-3 focus-within:border-[var(--color-brand-orange)]">
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
              className={`rounded-xl border py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
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
          className="mt-5 w-full rounded-2xl bg-[var(--color-brand-orange)] py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)]/40 disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30"
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
    message = "A bonus from admin. It was added to your available balance.";
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
            <p className="truncate text-base font-semibold text-[var(--color-ink)]">{t.title}</p>
            <p className="truncate text-sm text-[var(--color-ink)]/55">{t.subtitle}</p>
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

        {processing && (
          <ol className="mt-3 rounded-2xl bg-[var(--color-brand-cream)] p-4 text-sm">
            <Step done>We got your request</Step>
            <Step current>Bank is processing it</Step>
            <Step last>Money arrives in your account</Step>
          </ol>
        )}

        <dl className="mt-4 divide-y divide-dashed divide-[var(--color-line)] text-sm">
          <DetailRow label="Type" value={meta.label} />
          <DetailRow
            label="Status"
            value={pending ? "Pending" : processing ? "Processing" : "Completed"}
          />
          <DetailRow label="Date" value={`${formatDate(t.date)}, ${formatTime(t.date)}`} />
          <DetailRow label="Reference" value={t.id.toUpperCase()} />
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl border border-[var(--color-line)] py-3.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
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

function Step({ done, current, last, children }) {
  return (
    <li className="relative flex items-center gap-3 pb-3 last:pb-0">
      {!last && (
        <span
          className={`absolute left-[9px] top-5 h-[calc(100%-8px)] w-0.5 ${
            done ? "bg-[var(--color-brand-teal)]" : "bg-[var(--color-line)]"
          }`}
        />
      )}
      <span
        className={`relative grid h-5 w-5 shrink-0 place-items-center rounded-full ${
          done
            ? "bg-[var(--color-brand-teal)] text-white"
            : current
            ? "border-2 border-[var(--color-brand-orange)] bg-white"
            : "border-2 border-[var(--color-line)] bg-white"
        }`}
      >
        {done && <IconCheck className="h-3 w-3" />}
      </span>
      <span
        className={
          current
            ? "font-semibold text-[var(--color-ink)]"
            : done
            ? "text-[var(--color-ink)]/75"
            : "text-[var(--color-ink)]/50"
        }
      >
        {children}
      </span>
    </li>
  );
}