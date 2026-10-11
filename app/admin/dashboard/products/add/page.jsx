"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SingleProductForm from "./SingleProductForm";
import BulkImportSection from "./BulkImportSection";

export default function AddProductPage() {
  const router = useRouter();
  const [mode, setMode] = useState("single"); // single | bulk
  const [toast, setToast] = useState(null);

  const handleSuccess = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-[var(--color-brand-navy)] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-brand-teal)] text-xs">
            ✓
          </span>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-orange)]">
            ◆ Products
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
            Add Products
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
            Add a single product or import many at once
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/products")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
        >
          ← Back to Products
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <ModeCard
          active={mode === "single"}
          onClick={() => setMode("single")}
          icon="📦"
          title="Single Product"
          description="Add one product with full details"
        />
        <ModeCard
          active={mode === "bulk"}
          onClick={() => setMode("bulk")}
          icon="📊"
          title="Bulk Import"
          description="Upload CSV/Excel with many products"
        />
      </div>

      {/* Content */}
      <div className="rounded-3xl border border-[var(--color-line)] bg-white p-6 sm:p-8">
        {mode === "single" ? (
          <SingleProductForm onSuccess={handleSuccess} />
        ) : (
          <BulkImportSection onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MODE CARD
   ============================================================ */
function ModeCard({ active, onClick, icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border-2 p-5 text-left transition-all ${
        active
          ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5"
          : "border-[var(--color-line)] bg-white hover:border-[var(--color-ink)]/20"
      }`}
    >
      {/* Check indicator */}
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl ${
          active
            ? "bg-[var(--color-brand-orange)] text-white"
            : "bg-[var(--color-brand-cream)]"
        }`}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`text-base font-bold ${
              active ? "text-[var(--color-brand-orange-dark)]" : "text-[var(--color-ink)]"
            }`}
          >
            {title}
          </h3>
          {active && (
            <span className="rounded-full bg-[var(--color-brand-orange)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Selected
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[var(--color-ink)]/60">{description}</p>
      </div>

      {active && (
        <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-[var(--color-brand-orange)] text-xs font-bold text-white">
          ✓
        </span>
      )}
    </button>
  );
}