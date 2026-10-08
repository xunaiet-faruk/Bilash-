"use client";

import { useEffect } from "react";

const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(
    Math.round(n || 0)
  );

const priceFor = (cost, marginPct) => Math.round(cost / (1 - marginPct / 100));

export default function ProductDetailsModal({ item, onClose }) {
  const initials = (item.name || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Escape close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const margins = item.marginOptions || [];
  const minMargin = margins.length ? Math.min(...margins) : 0;
  const maxMargin = margins.length ? Math.max(...margins) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-brand-navy)]/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-48 bg-[var(--color-brand-cream)]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--color-brand-navy-light)] text-4xl font-bold text-white">
              {initials}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[var(--color-ink)]/70 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Category pill */}
          {item.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/70 backdrop-blur">
              {item.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <h3 className="text-lg font-semibold text-[var(--color-ink)]">
            {item.name}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
            Product ID: {item.id}
          </p>

          {/* Description */}
          {item.description && (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]/70">
              {item.description}
            </p>
          )}

          {/* Info grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <InfoTile
              label="Wholesale Price"
              value={`৳${fmt(item.wholesalePrice)}`}
              hint="Your cost"
            />
            <InfoTile
              label="Available Stock"
              value={item.stock ?? "—"}
              hint="Units"
            />
            <InfoTile
              label="Profit Range"
              value={
                margins.length
                  ? minMargin === maxMargin
                    ? `${minMargin}%`
                    : `${minMargin}–${maxMargin}%`
                  : "—"
              }
              hint="Admin offers"
              accent="teal"
            />
            <InfoTile
              label="Your Earnings"
              value={
                margins.length
                  ? `৳${fmt(
                      priceFor(item.wholesalePrice, minMargin) -
                        item.wholesalePrice
                    )}–${fmt(
                      priceFor(item.wholesalePrice, maxMargin) -
                        item.wholesalePrice
                    )}`
                  : "—"
              }
              hint="Per piece"
              accent="orange"
            />
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--color-line)] py-3 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, hint, accent }) {
  const accentColor =
    accent === "teal"
      ? "text-[var(--color-brand-teal)]"
      : accent === "orange"
      ? "text-[var(--color-brand-orange-dark)]"
      : "text-[var(--color-ink)]";

  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink)]/50">
        {label}
      </p>
      <p className={`mt-1 text-base font-bold tabular-nums ${accentColor}`}>
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/40">{hint}</p>
      )}
    </div>
  );
}