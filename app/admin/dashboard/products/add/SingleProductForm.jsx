"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, SUPPLIERS, getProductOptions, createProduct } from "./productApi";

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const EMPTY = {
  name: "", sku: "", category: "", supplier: "", description: "", tags: "",
  costPrice: "", wholesalePrice: "", sellingPrice: "", stock: "", weight: "0.5",
};

const inputCls = (hasError) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 ${
    hasError ? "border-red-400" : "border-line"
  }`;

const taka = (n) => `৳${Math.round(n).toLocaleString("en-IN")}`;

export default function SingleProductForm({ onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]); // [{ id, file, url }]
  const [options, setOptions] = useState({ categories: CATEGORIES, suppliers: SUPPLIERS });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  // Category / supplier list API theke
  useEffect(() => {
    getProductOptions().then(setOptions).catch(() => {});
  }, []);

  // Unmount hole preview URL gulo free kora
  useEffect(() => () => imagesRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const touch = (k) => setTouched((p) => ({ ...p, [k]: true }));

  /* ---------- derived numbers ---------- */
  const cost = Number(form.costPrice) || 0;
  const selling = Number(form.sellingPrice) || 0;
  const wholesale = Number(form.wholesalePrice) || 0;
  const profit = selling - cost;
  const margin = selling > 0 ? Math.round((profit / selling) * 100) : 0;
  const markup = cost > 0 ? Math.round((profit / cost) * 100) : 0;
  const hasPrices = cost > 0 && selling > 0;

  /* ---------- validation ---------- */
  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter a product name";
    if (!form.category) e.category = "Choose a category";
    if (!form.supplier) e.supplier = "Choose a supplier";
    if (!(cost > 0)) e.costPrice = "Enter a cost above 0";
    if (!(selling > 0)) e.sellingPrice = "Enter a selling price above 0";
    else if (selling <= cost) e.sellingPrice = "Must be higher than the cost price";
    if (form.wholesalePrice !== "" && !(wholesale > 0)) e.wholesalePrice = "Enter a valid price";
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Enter a whole number, 0 or more";
    if (form.weight !== "" && !(Number(form.weight) > 0)) e.weight = "Must be above 0";
    return e;
  }, [form, cost, selling, wholesale]);

  const shown = (k) => (touched[k] ? errors[k] : undefined);

  const checklist = [
    { label: "Name", done: !errors.name },
    { label: "Category", done: !errors.category },
    { label: "Supplier", done: !errors.supplier },
    { label: "Cost price", done: !errors.costPrice },
    { label: "Selling price", done: !errors.sellingPrice },
    { label: "Stock", done: !errors.stock },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  /* ---------- images ---------- */
  const addImages = (fileList) => {
    setImageError(null);
    const incoming = Array.from(fileList || []);
    const imgs = incoming.filter((f) => f.type.startsWith("image/"));
    const tooBig = imgs.filter((f) => f.size > MAX_IMAGE_BYTES);
    const ok = imgs.filter((f) => f.size <= MAX_IMAGE_BYTES);
    const room = MAX_IMAGES - images.length;

    const msgs = [];
    if (incoming.length > imgs.length) msgs.push("Only image files are allowed.");
    if (tooBig.length) msgs.push(`${tooBig.length} file(s) over 5MB were skipped.`);
    if (ok.length > room) msgs.push(`Only ${MAX_IMAGES} images are allowed.`);
    if (msgs.length) setImageError(msgs.join(" "));

    const next = ok.slice(0, Math.max(room, 0)).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    if (next.length) setImages((p) => [...p, ...next]);
  };

  const removeImage = (id) =>
    setImages((p) => {
      const target = p.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return p.filter((i) => i.id !== id);
    });

  const makeMain = (id) =>
    setImages((p) => {
      const t = p.find((i) => i.id === id);
      return t ? [t, ...p.filter((i) => i.id !== id)] : p;
    });

  /* ---------- actions ---------- */
  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setForm(EMPTY);
    setTouched({});
    setError(null);
    setImageError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    if (Object.keys(errors).length) {
      setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        supplier: form.supplier,
        description: form.description.trim(),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        costPrice: cost,
        wholesalePrice: wholesale || null,
        sellingPrice: selling,
        stock: Number(form.stock),
        weight: form.weight === "" ? null : Number(form.weight),
      };
      await createProduct(payload, images.map((i) => i.file));
      onSuccess?.(`“${payload.name}” was added`);
      reset();
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const marginTone =
    margin >= 30 ? "bg-brand-teal text-brand-teal" : margin >= 15 ? "bg-brand-orange text-brand-orange" : "bg-red-500 text-red-600";
  const [barColor, textColor] = marginTone.split(" ");

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* ================= LEFT: FORM ================= */}
      <div className="flex flex-col gap-6">
        <Card title="Basic information" subtitle="What customers will see first">
          <Field label="Product name" required error={shown("name")}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => touch("name")}
              placeholder="e.g. Wireless Earbuds Pro X"
              className={inputCls(shown("name"))}
              autoFocus
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required error={shown("category")}>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                onBlur={() => touch("category")}
                className={inputCls(shown("category"))}
              >
                <option value="">Select a category</option>
                {options.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Supplier" required error={shown("supplier")}>
              <select
                value={form.supplier}
                onChange={(e) => set("supplier", e.target.value)}
                onBlur={() => touch("supplier")}
                className={inputCls(shown("supplier"))}
              >
                <option value="">Select a supplier</option>
                {options.suppliers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU" hint="Leave empty to auto-generate">
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="WE-001"
                className={`${inputCls(false)} font-mono`}
              />
            </Field>
            <Field label="Tags" hint="Separate with commas">
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="wireless, audio, premium"
                className={inputCls(false)}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Features, materials, warranty…"
              className={`${inputCls(false)} resize-none`}
            />
          </Field>
        </Card>

        <Card title="Images" subtitle={`${images.length} of ${MAX_IMAGES} added · the first image is the main one`}>
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

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
  {images.map((img, i) => (
    <div
      key={img.id}
      className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-brand-cream"
    >
      <img src={img.url} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
      {i === 0 ? (
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-brand-navy px-1.5 py-0.5 text-[10px] font-semibold text-white">
          Main
        </span>
      ) : (
        <button
          type="button"
          onClick={() => makeMain(img.id)}
          className="absolute bottom-1.5 left-1.5 cursor-pointer rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-ink opacity-0 shadow-sm transition-opacity focus:opacity-100 group-hover:opacity-100"
        >
          Make main
        </button>
      )}
      <button
        type="button"
        onClick={() => removeImage(img.id)}
        aria-label={`Remove image ${i + 1}`}
        className="absolute right-1.5 top-1.5 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-white/95 text-red-500 shadow-sm opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  ))}

  {images.length < MAX_IMAGES && (
    <button
      type="button"
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        addImages(e.dataTransfer.files);
      }}
      className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-1 text-center transition-colors ${
        dragging
          ? "border-brand-orange bg-brand-orange/5"
          : "border-line bg-brand-cream/40 hover:border-brand-orange hover:bg-brand-orange/5"
      }`}
      title="Add images"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-brand-orange">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
      <span className="text-[10px] font-semibold text-ink">Add image</span>
    </button>
  )}
</div>
          {imageError && <p className="text-xs text-red-600">{imageError}</p>}
        </Card>

        <Card title="Pricing" subtitle="Margin updates as you type">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Cost price" required error={shown("costPrice")}>
              <Money
                value={form.costPrice}
                onChange={(v) => set("costPrice", v)}
                onBlur={() => touch("costPrice")}
                error={shown("costPrice")}
                placeholder="0"
              />
            </Field>
            <Field label="Wholesale price" error={shown("wholesalePrice")} hint="For resellers">
              <Money
                value={form.wholesalePrice}
                onChange={(v) => set("wholesalePrice", v)}
                onBlur={() => touch("wholesalePrice")}
                error={shown("wholesalePrice")}
                placeholder="Optional"
              />
            </Field>
            <Field label="Selling price" required error={shown("sellingPrice")}>
              <Money
                value={form.sellingPrice}
                onChange={(v) => set("sellingPrice", v)}
                onBlur={() => touch("sellingPrice")}
                error={shown("sellingPrice")}
                placeholder="0"
              />
            </Field>
          </div>
          {wholesale > 0 && hasPrices && (wholesale < cost || wholesale > selling) && (
            <p className="text-xs text-brand-orange-dark">
              Wholesale price is usually between the cost and selling price.
            </p>
          )}
        </Card>

        <Card title="Inventory" subtitle="Stock on hand and shipping weight">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stock quantity" required error={shown("stock")}>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                onBlur={() => touch("stock")}
                placeholder="0"
                className={inputCls(shown("stock"))}
              />
            </Field>
            <Field label="Weight (kg)" error={shown("weight")}>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                onBlur={() => touch("weight")}
                className={inputCls(shown("weight"))}
              />
            </Field>
          </div>
        </Card>
      </div>

      {/* ================= RIGHT: SUMMARY ================= */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="aspect-[4/3] bg-brand-cream">
            {images[0] ? (
              <img src={images[0].url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-ink/25">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-14 w-14">
                  <path d="M21 8l-9-5-9 5m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="truncate text-sm font-semibold text-brand-navy">
              {form.name.trim() || "Untitled product"}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/50">
              {[form.category, form.supplier].filter(Boolean).join(" · ") || "No category or supplier yet"}
            </p>
            <p className="mt-3 text-2xl font-bold tabular-nums text-ink">
              {selling > 0 ? taka(selling) : "৳—"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm font-semibold text-brand-navy">Profit</p>
          {hasPrices && profit > 0 ? (
            <>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(margin, 100)}%` }} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-ink/50">Per unit</dt>
                  <dd className="font-bold tabular-nums text-ink">{taka(profit)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink/50">Margin</dt>
                  <dd className={`font-bold tabular-nums ${textColor}`}>{margin}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink/50">Markup</dt>
                  <dd className="font-bold tabular-nums text-ink">{markup}%</dd>
                </div>
              </dl>
              {margin < 15 && (
                <p className="mt-3 text-xs text-brand-orange-dark">Margin is under 15%. Consider a higher price.</p>
              )}
            </>
          ) : (
            <p className="mt-2 text-xs text-ink/50">Enter cost and selling price to see your margin.</p>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-navy">Required fields</p>
            <p className="text-xs tabular-nums text-ink/50">{doneCount} / {checklist.length}</p>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
            {checklist.map((c) => (
              <li key={c.label} className={`flex items-center gap-2 text-xs ${c.done ? "text-ink" : "text-ink/50"}`}>
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                    c.done ? "bg-brand-teal text-white" : "border border-line"
                  }`}
                >
                  {c.done && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="h-2.5 w-2.5">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {c.label}
              </li>
            ))}
          </ul>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {submitting ? "Adding product…" : "Add product"}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={submitting}
            className="mt-2 w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-ink/60 transition-colors hover:bg-brand-cream disabled:opacity-50"
          >
            Clear form
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   Small building blocks
   ============================================================ */
function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold tracking-tight text-brand-navy">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-ink/55">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-ink">
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
        {hint && !error && <span className="text-xs font-normal text-ink/45">{hint}</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Money({ value, onChange, onBlur, error, placeholder }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/40">
        ৳
      </span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${inputCls(error)} pl-8 tabular-nums`}
      />
    </div>
  );
}