"use client";

import { useEffect, useState } from "react";

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  x: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7",
  unlock: "M5 11V8a4 4 0 0 1 7-2.6M5 11h14v9H5v-9z",
};

const fmt = (n) => `৳${n.toLocaleString("en-IN")}`;

export default function ReleasePayoutModal({ payout, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!payout) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[var(--color-brand-navy)]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] bg-gradient-to-br from-emerald-500/5 to-transparent p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Ico d={I.unlock} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Release Payout
              </p>
              <h2 className="mt-0.5 text-base font-bold text-[var(--color-ink)]">
                {payout.id}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5"
          >
            <Ico d={I.x} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Amount box */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Amount to release
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-700">
              {fmt(payout.netPayable)}
            </p>
            <p className="mt-1 text-[11px] text-emerald-700/70">
              via {payout.method}
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-ink)]/55">Seller</span>
              <span className="font-semibold text-[var(--color-ink)]">{payout.seller}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink)]/55">Order</span>
              <span className="font-mono text-[var(--color-ink)]">{payout.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink)]/55">Gross</span>
              <span className="font-medium text-[var(--color-ink)]">{fmt(payout.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-ink)]/55">Commission</span>
              <span className="font-medium text-rose-600">-{fmt(payout.commission)}</span>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
              Internal note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason or reference..."
              className="w-full resize-none rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Confirm */}
          <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-[var(--color-brand-cream)]/50 p-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[var(--color-line)] text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-[11px] leading-relaxed text-[var(--color-ink)]/70">
              I confirm this payout has been verified and is ready to be released to the seller.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 hover:bg-[var(--color-brand-cream)]"
          >
            Cancel
          </button>
          <button
            disabled={!confirmed}
            onClick={() => onConfirm(note)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
          >
            <Ico d={I.check} className="h-3.5 w-3.5" />
            Release {fmt(payout.netPayable)}
          </button>
        </div>
      </div>
    </div>
  );
}