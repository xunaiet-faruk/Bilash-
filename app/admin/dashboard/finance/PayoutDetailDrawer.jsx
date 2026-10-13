"use client";

import { useEffect } from "react";

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  x: "M6 18L18 6M6 6l12 12",
  copy: "M8 8h10v12H8zM6 4h10v2H6zM4 6v14h12v-2",
  check: "M5 13l4 4L19 7",
};

const fmt = (n) => `৳${n.toLocaleString("en-IN")}`;

const STATUS_META = {
  pending:    { label: "Pending",     bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  releasing:  { label: "Releasing",   bg: "bg-cyan-50",    text: "text-cyan-700",    dot: "bg-cyan-500" },
  released:   { label: "Released",    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  on_hold:    { label: "On hold",     bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500" },
  refunded:   { label: "Refunded",    bg: "bg-slate-100",  text: "text-slate-600",   dot: "bg-slate-400" },
  disputed:   { label: "Disputed",    bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-500" },
};

export default function PayoutDetailDrawer({ payout, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!payout) return null;
  const meta = STATUS_META[payout.status] || STATUS_META.pending;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--color-brand-navy)]/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] bg-gradient-to-br from-[var(--color-brand-navy)] to-[#1e293b] p-5 text-white">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              Payout Details
            </p>
            <h2 className="mt-1 truncate text-lg font-bold">{payout.id}</h2>
            <p className="mt-0.5 text-[11px] text-white/60">{payout.createdAt}</p>
            <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full ${meta.bg} ${meta.text} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-white/60 hover:bg-white/10"
          >
            <Ico d={I.x} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Amount box */}
          <div className="rounded-2xl border border-[var(--color-line)] bg-gradient-to-br from-[var(--color-brand-cream)]/60 to-white p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/50">
              Net payable to seller
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-[var(--color-ink)]">
              {fmt(payout.netPayable)}
            </p>
            <div className="mt-2 flex justify-center gap-4 text-[11px]">
              <span className="text-[var(--color-ink)]/55">Gross: <b className="text-[var(--color-ink)]">{fmt(payout.amount)}</b></span>
              <span className="text-[var(--color-ink)]/55">Fee: <b className="text-rose-600">-{fmt(payout.commission)}</b></span>
            </div>
          </div>

          {/* Order info */}
          <DetailBlock title="Order info">
            <Row label="Order ID" value={payout.orderId} mono />
            <Row label="Buyer" value={payout.buyer} />
            <Row label="Order total" value={fmt(payout.orderTotal)} />
          </DetailBlock>

          {/* Seller info */}
          <DetailBlock title="Seller">
            <div className="flex items-center gap-3 rounded-xl bg-[var(--color-brand-cream)]/40 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-xs font-bold text-white">
                {payout.sellerAvatar}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--color-ink)]">{payout.seller}</p>
                <p className="text-[11px] text-[var(--color-ink)]/50">Payout via {payout.method}</p>
              </div>
            </div>
          </DetailBlock>

          {/* Timeline */}
          <DetailBlock title="Timeline">
            <Timeline
              items={[
                { label: "Order placed", time: payout.createdAt, done: true },
                { label: "Escrow hold", time: payout.createdAt, done: true },
                { label: "Release scheduled", time: payout.holdUntil || "—", done: payout.status !== "pending" },
                { label: "Released", time: payout.releasedAt || "Pending", done: payout.status === "released" },
              ]}
            />
          </DetailBlock>

          {/* Transaction */}
          {payout.transactionId && (
            <DetailBlock title="Transaction">
              <div className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                    Transaction ID
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs font-semibold text-[var(--color-ink)]">
                    {payout.transactionId}
                  </p>
                </div>
                <button className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/40 hover:bg-[var(--color-brand-cream)]">
                  <Ico d={I.copy} className="h-4 w-4" />
                </button>
              </div>
            </DetailBlock>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
          <div className="grid grid-cols-2 gap-2">
            <button className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--color-ink)]/70 hover:bg-[var(--color-brand-cream)]">
              Download receipt
            </button>
            <button className="cursor-pointer rounded-xl bg-[var(--color-brand-navy)] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e293b]">
              Open order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-2 py-1.5">
      <span className="text-xs text-[var(--color-ink)]/55">{label}</span>
      <span className={`text-xs font-semibold text-[var(--color-ink)] ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <ol className="relative space-y-3 pl-5">
      <span className="absolute left-1.5 top-1.5 h-[calc(100%-12px)] w-px bg-[var(--color-line)]" />
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span
            className={`absolute -left-5 top-0.5 grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold text-white ${
              it.done ? "bg-emerald-500" : "bg-[var(--color-line)]"
            }`}
          >
            {it.done && <Ico d={I.check} className="h-2.5 w-2.5" sw={3} />}
          </span>
          <p className={`text-xs font-semibold ${it.done ? "text-[var(--color-ink)]" : "text-[var(--color-ink)]/50"}`}>
            {it.label}
          </p>
          <p className="text-[10px] text-[var(--color-ink)]/45">{it.time}</p>
        </li>
      ))}
    </ol>
  );
}