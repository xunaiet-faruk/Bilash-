"use client";

import { useEffect, useState } from "react";

/* ============================================================
   ICONS
   ============================================================ */
const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  x: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7",
};

/* ============================================================
   FIELD
   ============================================================ */
function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

/* ============================================================
   EDIT PRODUCT MODAL
   ============================================================ */
export default function EditProductModal({ product, onClose, onSave }) {
  const [draft, setDraft] = useState(product);

  // Sync when product prop changes
  useEffect(() => {
    setDraft(product);
  }, [product]);

  // Lock body scroll + close on Esc
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!draft) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(draft);
  };

  const inputCls =
    "w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20";

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-[var(--color-brand-navy)]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* ============ HEADER ============ */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-line)] bg-gradient-to-br from-[var(--color-brand-orange)]/5 to-transparent p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand-cream)] to-white text-2xl ring-1 ring-[var(--color-line)]">
              {draft.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-orange)]">
                Edit Product
              </p>
              <h2 className="mt-0.5 truncate text-base font-bold text-[var(--color-ink)]">
                {draft.name || "Untitled"}
              </h2>
              <p className="mt-0.5 font-mono text-[11px] text-[var(--color-ink)]/45">
                {draft.sku} · {draft.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5"
            aria-label="Close"
          >
            <Ico d={I.x} />
          </button>
        </div>

        {/* ============ BODY ============ */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Basic info */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
              Basic Info
            </p>

            <Field label="Product name" required>
              <input
                autoFocus
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={inputCls}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SKU">
                <input
                  value={draft.sku}
                  onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
                  className={inputCls + " font-mono"}
                />
              </Field>
              <Field label="Brand">
                <input
                  value={draft.brand}
                  onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Subcategory">
                <input
                  value={draft.subcategory}
                  onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Seller">
              <input
                value={draft.seller}
                onChange={(e) => setDraft({ ...draft, seller: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          {/* Pricing */}
          <div className="space-y-4 border-t border-[var(--color-line)] pt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
              Pricing & Inventory
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Cost price (৳)">
                <input
                  type="number"
                  min="0"
                  value={draft.cost}
                  onChange={(e) => setDraft({ ...draft, cost: Number(e.target.value) })}
                  className={inputCls + " tabular-nums"}
                />
              </Field>
              <Field label="Sell price (৳)">
                <input
                  type="number"
                  min="0"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                  className={inputCls + " tabular-nums"}
                />
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  min="0"
                  value={draft.stock}
                  onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
                  className={inputCls + " tabular-nums"}
                />
              </Field>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4 border-t border-[var(--color-line)] pt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/45">
              Status
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "live", label: "Live", color: "emerald" },
                { id: "pending", label: "Pending", color: "amber" },
                { id: "out-of-stock", label: "Out of stock", color: "slate" },
                { id: "rejected", label: "Rejected", color: "rose" },
              ].map((s) => {
                const on = draft.status === s.id;
                const colors = {
                  emerald: "border-emerald-500 bg-emerald-50 text-emerald-700",
                  amber: "border-amber-500 bg-amber-50 text-amber-700",
                  slate: "border-slate-400 bg-slate-100 text-slate-700",
                  rose: "border-rose-500 bg-rose-50 text-rose-700",
                };
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, status: s.id })}
                    className={`cursor-pointer rounded-xl border-2 px-3 py-2 text-xs font-bold transition-all ${
                      on
                        ? colors[s.color]
                        : "border-[var(--color-line)] bg-white text-[var(--color-ink)]/55 hover:border-[var(--color-ink)]/20"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
          >
            <Ico d={I.check} className="h-3.5 w-3.5" />
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}