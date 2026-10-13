"use client";

import { useEffect, useState } from "react";

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  x: "M6 18L18 6M6 6l12 12",
  lock: "M5 11V8a4 4 0 0 1 8 0v3M5 11h14v9H5v-9z",
};

const REASONS = [
  "Suspicious activity",
  "Buyer dispute open",
  "Seller KYC pending",
  "High return rate",
  "Policy violation",
  "Manual review requested",
];

export default function HoldPayoutModal({ payout, onClose, onConfirm }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!payout) return null;

  const finalReason = reason === "custom" ? custom.trim() : reason;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[var(--color-brand-navy)]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] bg-gradient-to-br from-rose-500/5 to-transparent p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
              <Ico d={I.lock} className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Hold Payout
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
          <p className="text-sm text-[var(--color-ink)]/70">
            This will hold <span className="font-bold text-[var(--color-ink)]">৳{payout.netPayable.toLocaleString("en-IN")}</span> from{" "}
            <span className="font-semibold text-[var(--color-ink)]">{payout.seller}</span> until manually released.
          </p>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
              Reason
            </label>
            <div className="space-y-1.5">
              {REASONS.map((r) => (
                <label key={r} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-brand-cream)]/50">
                  <input
                    type="radio"
                    name="hold-reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-3.5 w-3.5 cursor-pointer text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-xs text-[var(--color-ink)]/75">{r}</span>
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-brand-cream)]/50">
                <input
                  type="radio"
                  name="hold-reason"
                  value="custom"
                  checked={reason === "custom"}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-3.5 w-3.5 cursor-pointer text-rose-500 focus:ring-rose-500"
                />
                <span className="text-xs font-semibold text-[var(--color-ink)]/75">Other reason...</span>
              </label>
            </div>

            {reason === "custom" && (
              <input
                autoFocus
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Type reason..."
                className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 hover:bg-[var(--color-brand-cream)]"
          >
            Cancel
          </button>
          <button
            disabled={reason === "custom" && !custom.trim()}
            onClick={() => onConfirm(finalReason)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
          >
            <Ico d={I.lock} className="h-3.5 w-3.5" />
            Hold payout
          </button>
        </div>
      </div>
    </div>
  );
}