"use client";

import { useState, useRef } from "react";

const CATEGORIES = ["Electronics", "Accessories", "Home", "Fashion", "Gadgets"];
const SUPPLIERS = ["Tech Hub BD", "Gadget Store", "Camera World", "Home Decor BD", "Audio Zone"];

const calcMargin = (cost, sell) => {
  if (!cost || !sell || sell <= cost) return 0;
  return Math.round(((sell - cost) / sell) * 100);
};

export default function AddProductModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    category: "",
    supplier: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    sku: "",
    image: "",
  });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const cost = Number(form.costPrice) || 0;
  const sell = Number(form.sellingPrice) || 0;
  const profit = sell - cost;
  const margin = calcMargin(cost, sell);

  const canNext1 = form.name.trim() && form.category && form.supplier;
  const canNext2 = cost > 0 && sell > 0;
  const canSubmit = canNext1 && canNext2 && form.stock !== "";

  // Handle image file selection
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => set("image", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({
      id: `p-${Date.now()}`,
      name: form.name,
      category: form.category,
      supplier: form.supplier,
      costPrice: cost,
      sellingPrice: sell,
      stock: Number(form.stock),
      sold: 0,
      status: Number(form.stock) === 0 ? "out-of-stock" : "active",
      image: form.image || null,
    });
  };

  const steps = ["Basic Info", "Pricing", "Stock & Image"];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#0b0f17]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== HEADER ===== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-brand-navy)] to-[#1e293b] px-6 py-5 text-white">
          {/* subtle dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-orange)]">
                New Product
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                Add to your catalog
              </h2>
              <p className="mt-0.5 text-xs text-white/50">
                Step {step} of {steps.length} · {steps[step - 1]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Step progress bar */}
          <div className="relative mt-5 flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  step > i ? "bg-[var(--color-brand-orange)]" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
          {/* ========== STEP 1 ========== */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <Field label="Product Name" required>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="input"
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="input"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Supplier" required>
                  <select
                    value={form.supplier}
                    onChange={(e) => set("supplier", e.target.value)}
                    className="input"
                  >
                    <option value="">Select supplier...</option>
                    {SUPPLIERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Description (optional)">
                <textarea
                  rows={3}
                  placeholder="Write a short description about this product..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="input resize-none"
                />
              </Field>
            </div>
          )}

          {/* ========== STEP 2 ========== */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Cost Price (৳)" required>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-ink)]/40">
                      ৳
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.costPrice}
                      onChange={(e) => set("costPrice", e.target.value)}
                      className="input pl-8"
                      autoFocus
                    />
                  </div>
                </Field>

                <Field label="Selling Price (৳)" required>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-ink)]/40">
                      ৳
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.sellingPrice}
                      onChange={(e) => set("sellingPrice", e.target.value)}
                      className="input pl-8"
                    />
                  </div>
                </Field>
              </div>

              {/* Live preview */}
              <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Live Preview
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      margin >= 30
                        ? "bg-green-100 text-green-700"
                        : margin >= 15
                        ? "bg-yellow-100 text-yellow-700"
                        : margin > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {margin > 0 ? `${margin}% margin` : "No margin"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <Stat label="Profit" value={profit > 0 ? `৳${profit}` : "—"} />
                  <Stat label="Margin" value={margin > 0 ? `${margin}%` : "—"} />
                  <Stat
                    label="Markup"
                    value={
                      cost > 0 && profit > 0
                        ? `${Math.round((profit / cost) * 100)}%`
                        : "—"
                    }
                  />
                </div>

                {margin > 0 && margin < 15 && (
                  <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-[11px] leading-snug text-orange-700">
                    ⚠ Margin is below 15%. Consider raising the selling price.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========== STEP 3 ========== */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              {/* Image uploader */}
              <Field label="Product Image">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all ${
                    dragOver
                      ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5"
                      : "border-[var(--color-line)] bg-[var(--color-brand-cream)]/30 hover:border-[var(--color-brand-orange)]/50"
                  }`}
                >
                  {form.image ? (
                    <>
                      <img
                        src={form.image}
                        alt="Preview"
                        className="h-[180px] w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]">
                          Change image
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          set("image", "");
                        }}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-red-500 shadow-sm transition-colors hover:bg-white hover:text-red-600"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-brand-navy)]/5 text-[var(--color-brand-navy)]/60 transition-colors group-hover:bg-[var(--color-brand-orange)]/10 group-hover:text-[var(--color-brand-orange)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ink)]">
                          Drop image here or{" "}
                          <span className="text-[var(--color-brand-orange)]">
                            browse
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Stock Quantity" required>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="SKU (optional)">
                  <input
                    type="text"
                    placeholder="e.g. WM-001"
                    value={form.sku}
                    onChange={(e) => set("sku", e.target.value)}
                    className="input"
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 px-6 py-4">
          <button
            onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
            className="rounded-lg border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-gray-50"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 3 ? (
            <button
              disabled={step === 1 ? !canNext1 : !canNext2}
              onClick={() => setStep(step + 1)}
              className="rounded-lg bg-[var(--color-brand-navy)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-navy)]/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue →
            </button>
          ) : (
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="rounded-lg bg-[var(--color-brand-orange)] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ✓ Add Product
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-line);
          background: white;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
          transition: all 0.15s ease;
        }
        .input:focus {
          border-color: var(--color-brand-orange);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
        }
        .input::placeholder {
          color: rgba(17, 24, 39, 0.35);
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--color-ink)]/60">
        {label} {required && <span className="text-[var(--color-brand-orange)]">*</span>}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink)]/50">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}