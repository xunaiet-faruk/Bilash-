"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SingleProductForm from "./SingleProductForm";
import BulkImportSection from "./BulkImportSection";

const TABS = [
  {
    id: "single",
    label: "Single product",
    hint: "Fill in one product with images",
    icon: "M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5",
  },
  {
    id: "bulk",
    label: "Bulk import",
    hint: "Upload a CSV or Excel file",
    icon: "M3 5h18v14H3zM3 10h18M9 5v14",
  },
];

export default function AddProductPage() {
  const router = useRouter();
  const [mode, setMode] = useState("single");
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const handleSuccess = useCallback((message) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Toast */}
      <div aria-live="polite" className="pointer-events-none fixed right-6 top-6 z-50">
        {toast && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-brand-navy px-4 py-3 text-sm font-medium text-white shadow-xl">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {toast}
          </div>
        )}
      </div>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="text-xs text-ink/50">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard/products")}
              className="cursor-pointer hover:text-brand-orange"
            >
              Products
            </button>
            <span className="mx-1.5">/</span>
            <span className="text-ink/80">Add</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
            Add products
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Add one product by hand, or import a whole catalogue from a spreadsheet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/products")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink/75 transition-colors hover:bg-brand-cream"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to products
        </button>
      </header>

      {/* Tabs */}
      <div role="tablist" aria-label="Add mode" className="flex gap-1 border-b border-line">
        {TABS.map((t) => {
          const active = mode === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setMode(t.id)}
              className={`-mb-px flex cursor-pointer items-center gap-3 border-b-2 px-4 py-3 text-left transition-colors ${
                active
                  ? "border-brand-orange text-brand-navy"
                  : "border-transparent text-ink/55 hover:text-ink"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className={`h-5 w-5 shrink-0 ${active ? "text-brand-orange" : ""}`}
              >
                <path d={t.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="hidden text-xs font-normal text-ink/50 sm:block">{t.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Panels: dui ta-i mounted thake, tai tab change korle data haray na */}
      <div role="tabpanel" id="panel-single" aria-labelledby="tab-single" hidden={mode !== "single"}>
        <SingleProductForm onSuccess={handleSuccess} />
      </div>
      <div role="tabpanel" id="panel-bulk" aria-labelledby="tab-bulk" hidden={mode !== "bulk"}>
        <BulkImportSection onSuccess={handleSuccess} />
      </div>
    </div>
  );
}