"use client";

import { useRef, useState } from "react";

const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Books", "Toys", "Grocery"];
const SUPPLIERS = ["Tech Hub BD", "Gadget Store", "Camera World", "Home Decor BD", "Audio Zone"];

export default function SingleProductForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    description: "",
    costPrice: "",
    wholesalePrice: "",
    sellingPrice: "",
    stock: "",
    weight: "0.5",
    tags: "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const addImages = (files) => {
    const list = Array.from(files);
    const valid = list.filter((f) => f.type.startsWith("image/"));
    if (!valid.length) return;

    setUploading(true);
    setTimeout(() => {
      const urls = valid.map((f) => URL.createObjectURL(f));
      set("images", [...form.images, ...urls]);
      setUploading(false);
    }, 400);
  };

  const removeImage = (i) => {
    set("images", form.images.filter((_, idx) => idx !== i));
  };

  // Live margin calculation
  const cost = Number(form.costPrice) || 0;
  const selling = Number(form.sellingPrice) || 0;
  const profit = selling - cost;
  const margin = selling > 0 ? Math.round((profit / selling) * 100) : 0;
  const markup = cost > 0 ? Math.round((profit / cost) * 100) : 0;

  const canSubmit =
    form.name.trim() && form.category && form.supplier && cost > 0 && selling > 0 && form.stock !== "";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    // 🔸 API: POST /api/v1/admin/products
    await new Promise((r) => setTimeout(r, 1200));

    setSubmitting(false);
    onSuccess?.(`Product "${form.name}" added successfully`);

    // Reset form
    setForm({
      name: "", sku: "", category: "", supplier: "", description: "",
      costPrice: "", wholesalePrice: "", sellingPrice: "", stock: "",
      weight: "0.5", tags: "", images: [],
    });
  };

  const fieldClass =
    "w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/60 mb-1.5";

  return (
    <div className="flex flex-col gap-8">
      {/* ============ SECTION 1: BASIC INFO ============ */}
      <Section number="01" title="Basic Information" subtitle="Name, category, and description">
        <label className="block">
          <span className={labelClass}>
            Product Name <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Wireless Earbuds Pro X"
            className={fieldClass}
            autoFocus
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Category <span className="text-red-500">*</span></span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={fieldClass}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Supplier <span className="text-red-500">*</span></span>
            <select
              value={form.supplier}
              onChange={(e) => set("supplier", e.target.value)}
              className={fieldClass}
            >
              <option value="">Select supplier...</option>
              {SUPPLIERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>SKU (optional)</span>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              placeholder="e.g. WE-001"
              className={`${fieldClass} font-mono`}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Tags (comma separated)</span>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="wireless, audio, premium"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the product features, materials, warranty..."
            className={`${fieldClass} resize-none`}
          />
        </label>
      </Section>

      {/* ============ SECTION 2: IMAGES ============ */}
      <Section number="02" title="Product Images" subtitle="Upload up to 5 images">
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            addImages(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addImages(e.dataTransfer.files);
          }}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-8 text-center transition-colors hover:border-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)]/5"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-brand-orange)]/10 text-2xl">
            📸
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Drop images here or{" "}
              <span className="text-[var(--color-brand-orange)]">click to browse</span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-ink)]/50">
              PNG, JPG up to 5MB each · Max 5 images
            </p>
          </div>
          {uploading && (
            <p className="text-xs font-medium text-[var(--color-brand-orange)]">
              Uploading...
            </p>
          )}
        </div>

        {/* Preview */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {form.images.map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl border border-[var(--color-line)]">
                <img src={img} alt={`Preview ${i + 1}`} className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-white/95 text-xs text-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-[var(--color-brand-orange)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ============ SECTION 3: PRICING ============ */}
      <Section number="03" title="Pricing" subtitle="Set cost, wholesale, and selling price">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className={labelClass}>Cost Price <span className="text-red-500">*</span></span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-ink)]/40">
                ৳
              </span>
              <input
                type="number"
                value={form.costPrice}
                onChange={(e) => set("costPrice", e.target.value)}
                placeholder="0"
                className={`${fieldClass} pl-8`}
              />
            </div>
          </label>

          <label className="block">
            <span className={labelClass}>Wholesale Price</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-ink)]/40">
                ৳
              </span>
              <input
                type="number"
                value={form.wholesalePrice}
                onChange={(e) => set("wholesalePrice", e.target.value)}
                placeholder="For resellers"
                className={`${fieldClass} pl-8`}
              />
            </div>
          </label>

          <label className="block">
            <span className={labelClass}>Selling Price <span className="text-red-500">*</span></span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-ink)]/40">
                ৳
              </span>
              <input
                type="number"
                value={form.sellingPrice}
                onChange={(e) => set("sellingPrice", e.target.value)}
                placeholder="Customer price"
                className={`${fieldClass} pl-8`}
              />
            </div>
          </label>
        </div>

        {/* Live margin preview */}
        {(cost > 0 || selling > 0) && (
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
              Live Preview
            </p>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <Stat label="Profit" value={profit > 0 ? `৳${profit}` : "—"} />
              <Stat
                label="Margin"
                value={margin > 0 ? `${margin}%` : "—"}
                color={
                  margin >= 30
                    ? "text-[var(--color-brand-teal)]"
                    : margin >= 15
                    ? "text-[var(--color-brand-orange)]"
                    : margin > 0
                    ? "text-red-500"
                    : ""
                }
              />
              <Stat label="Markup" value={markup > 0 ? `${markup}%` : "—"} />
            </div>
            {margin > 0 && margin < 15 && (
              <p className="mt-3 text-[11px] text-[var(--color-brand-orange-dark)]">
                ⚠ Margin below 15% — consider a higher selling price
              </p>
            )}
          </div>
        )}
      </Section>

      {/* ============ SECTION 4: INVENTORY ============ */}
      <Section number="04" title="Inventory" subtitle="Stock quantity and shipping weight">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Stock Quantity <span className="text-red-500">*</span></span>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="0"
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Weight (kg)</span>
            <input
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
      </Section>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠ {error}
        </div>
      )}

      {/* ============ ACTIONS ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-6">
        <p className="text-xs text-[var(--color-ink)]/50">
          <span className="text-red-500">*</span> Required fields
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setForm({
              name: "", sku: "", category: "", supplier: "", description: "",
              costPrice: "", wholesalePrice: "", sellingPrice: "", stock: "",
              weight: "0.5", tags: "", images: [],
            })}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding...
              </>
            ) : (
              <>✓ Add Product</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION WRAPPER
   ============================================================ */
function Section({ number, title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline gap-3 border-b border-[var(--color-line)] pb-3">
        <span className="text-2xl font-black leading-none tabular-nums text-[var(--color-brand-orange)]">
          {number}
        </span>
        <div>
          <h3 className="text-base font-bold tracking-tight text-[var(--color-ink)]">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--color-ink)]/50">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${color || "text-[var(--color-ink)]"}`}>
        {value}
      </p>
    </div>
  );
}