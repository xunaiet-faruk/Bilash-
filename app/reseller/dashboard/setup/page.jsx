"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ==================== CONSTANTS ====================
const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty & Health",
  "Sports",
  "Books",
  "Toys & Kids",
  "Gadgets & Accessories",
];

const BUSINESS_TYPES = ["Individual", "Sole Proprietorship", "Partnership", "Private Ltd."];

const STEPS = [
  { id: 1, label: "Store", icon: "🏪" },
  { id: 2, label: "Owner", icon: "👤" },
  { id: 3, label: "Bank", icon: "🏦" },
  { id: 4, label: "Pickup", icon: "🚚" },
  { id: 5, label: "Agreement", icon: "✅" },
];

// Generate slug from name
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);

// ==================== MAIN ====================
export default function StoreSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    // Store
    storeName: "",
    slug: "",
    slugEdited: false,
    tagline: "",
    description: "",
    category: "",
    // Owner
    ownerName: "",
    phone: "",
    email: "",
    nidNumber: "",
    businessType: "Individual",
    // Bank
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchName: "",
    routingNumber: "",
    mobileBanking: "",
    // Pickup
    pickupAddress: "",
    city: "",
    postalCode: "",
    // Agreement
    agreeTerms: false,
    agreeCommission: false,
  });

  const set = (k, v) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      // Auto-generate slug
      if (k === "storeName" && !prev.slugEdited) {
        next.slug = slugify(v);
      }
      if (k === "slug") {
        next.slugEdited = true;
        next.slug = slugify(v);
      }
      return next;
    });
  };

  // Validation per step
  const stepValid = useMemo(() => {
    switch (step) {
      case 1:
        return form.storeName.trim() && form.slug.trim() && form.category;
      case 2:
        return (
          form.ownerName.trim() &&
          form.phone.trim() &&
          form.email.trim() &&
          form.nidNumber.trim()
        );
      case 3:
        return (
          form.bankName.trim() &&
          form.accountName.trim() &&
          form.accountNumber.trim() &&
          form.branchName.trim()
        );
      case 4:
        return true; // all optional
      case 5:
        return form.agreeTerms && form.agreeCommission;
      default:
        return false;
    }
  }, [step, form]);

  const handleNext = () => {
    if (!stepValid) return;
    if (step < 5) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // TODO: POST /api/v1/reseller/setup
    // await fetch("/api/v1/reseller/setup", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form)
    // });
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setDone(true);
  };

  // ====== SUCCESS SCREEN ======
  if (done) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-brand-teal)]/10 text-4xl">
          🎉
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
            Your store is ready!
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ink)]/60">
            Welcome, {form.storeName}. Let's start adding products.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/reseller/dashboard")}
            className="rounded-lg bg-[var(--color-brand-orange)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/reseller/catalog")}
            className="rounded-lg border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-gray-50"
          >
            Add Products
          </button>
        </div>
      </div>
    );
  }

  // ====== MAIN FORM ======
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-orange)]">
            Onboarding
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">
            Setup Your Store
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Fill in the details below to launch your reseller storefront
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-ink)]/40">Step</p>
          <p className="text-lg font-semibold tabular-nums text-[var(--color-ink)]">
            {step}
            <span className="text-[var(--color-ink)]/30"> / {STEPS.length}</span>
          </p>
        </div>
      </div>

      {/* ============ STEP PROGRESS ============ */}
      <div className="rounded-xl border border-[var(--color-line)] bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => s.id < step && setStep(s.id)}
                  disabled={s.id > step}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 transition-colors ${
                    isCurrent
                      ? "text-[var(--color-ink)]"
                      : isDone
                      ? "text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal)]/5"
                      : "text-[var(--color-ink)]/30"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      isDone
                        ? "bg-[var(--color-brand-teal)] text-white"
                        : isCurrent
                        ? "bg-[var(--color-brand-orange)] text-white"
                        : "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/40"
                    }`}
                  >
                    {isDone ? "✓" : s.id}
                  </span>
                  <span className="hidden text-xs font-medium sm:block">
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 ${
                      isDone ? "bg-[var(--color-brand-teal)]" : "bg-[var(--color-line)]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ MAIN LAYOUT ============ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* ==================== LEFT: FORM ==================== */}
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
          {/* STEP 1: STORE */}
          {step === 1 && (
            <StepSection
              icon="🏪"
              title="Store Identity"
              subtitle="How customers will see your store"
            >
              <Field label="Store Name" required>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => set("storeName", e.target.value)}
                  placeholder="e.g. Sadia's Fashion Hub"
                  className="input"
                  autoFocus
                />
              </Field>

              <Field label="Store URL" required hint="This will be your public link">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-lg bg-[var(--color-brand-cream)] px-3 py-2.5 text-xs font-medium text-[var(--color-ink)]/50">
                    /store/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder="sadias-fashion-hub"
                    className="input flex-1"
                  />
                </div>
                {form.slug && (
                  <p className="mt-1.5 text-[11px] text-[var(--color-ink)]/40">
                    Public URL:{" "}
                    <span className="font-medium text-[var(--color-brand-teal)]">
                      /store/{form.slug}
                    </span>
                  </p>
                )}
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
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Tagline" hint="Optional">
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                    placeholder="Best deals in town"
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Description" hint="Optional">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Tell customers what your store is about..."
                  className="input resize-none"
                />
              </Field>
            </StepSection>
          )}

          {/* STEP 2: OWNER */}
          {step === 2 && (
            <StepSection
              icon="👤"
              title="Owner Information"
              subtitle="For verification and customer contact"
            >
              <Field label="Owner Full Name" required>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => set("ownerName", e.target.value)}
                  placeholder="e.g. Sadia Islam"
                  className="input"
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Phone" required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className="input"
                  />
                </Field>

                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    className="input"
                  />
                </Field>
              </div>

              <Field label="NID Number" required hint="For admin verification">
                <input
                  type="text"
                  value={form.nidNumber}
                  onChange={(e) => set("nidNumber", e.target.value)}
                  placeholder="1234567890"
                  className="input"
                />
              </Field>

              <Field label="Business Type">
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("businessType", t)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        form.businessType === t
                          ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)] text-white"
                          : "border-[var(--color-line)] bg-white text-[var(--color-ink)]/60 hover:border-[var(--color-brand-orange)]/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </StepSection>
          )}

          {/* STEP 3: BANK */}
          {step === 3 && (
            <StepSection
              icon="🏦"
              title="Bank Details"
              subtitle="Where you'll receive your earnings"
            >
              <Field label="Bank Name" required>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => set("bankName", e.target.value)}
                  placeholder="e.g. Dutch-Bangla Bank"
                  className="input"
                  autoFocus
                />
              </Field>

              <Field label="Account Holder Name" required>
                <input
                  type="text"
                  value={form.accountName}
                  onChange={(e) => set("accountName", e.target.value)}
                  placeholder="Name as in bank account"
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Account Number" required>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) => set("accountNumber", e.target.value)}
                    placeholder="1234567890123"
                    className="input"
                  />
                </Field>

                <Field label="Branch Name" required>
                  <input
                    type="text"
                    value={form.branchName}
                    onChange={(e) => set("branchName", e.target.value)}
                    placeholder="Dhanmondi Branch"
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Routing Number" hint="Optional">
                  <input
                    type="text"
                    value={form.routingNumber}
                    onChange={(e) => set("routingNumber", e.target.value)}
                    placeholder="090261234"
                    className="input"
                  />
                </Field>

                <Field label="Mobile Banking" hint="bKash / Nagad">
                  <input
                    type="text"
                    value={form.mobileBanking}
                    onChange={(e) => set("mobileBanking", e.target.value)}
                    placeholder="01712-345678"
                    className="input"
                  />
                </Field>
              </div>

              <div className="rounded-lg bg-[var(--color-brand-teal)]/5 p-3">
                <p className="text-[11px] leading-relaxed text-[var(--color-ink)]/60">
                  🔒 Your bank info is encrypted and only used for payout
                  purposes. Admin will verify before first withdrawal.
                </p>
              </div>
            </StepSection>
          )}

          {/* STEP 4: PICKUP */}
          {step === 4 && (
            <StepSection
              icon="🚚"
              title="Pickup Address"
              subtitle="Optional — where courier picks up orders"
            >
              <Field label="Pickup Address" hint="Optional">
                <textarea
                  rows={3}
                  value={form.pickupAddress}
                  onChange={(e) => set("pickupAddress", e.target.value)}
                  placeholder="House, Road, Area..."
                  className="input resize-none"
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="City" hint="Optional">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Dhaka"
                    className="input"
                  />
                </Field>

                <Field label="Postal Code" hint="Optional">
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                    placeholder="1205"
                    className="input"
                  />
                </Field>
              </div>

              <div className="rounded-lg bg-[var(--color-brand-cream)]/60 p-3">
                <p className="text-[11px] leading-relaxed text-[var(--color-ink)]/60">
                  💡 If you skip this, admin warehouse will be used as default
                  pickup point.
                </p>
              </div>
            </StepSection>
          )}

          {/* STEP 5: AGREEMENT */}
          {step === 5 && (
            <StepSection
              icon="✅"
              title="Terms & Agreement"
              subtitle="Almost there — just confirm a few things"
            >
              <AgreementBox
                checked={form.agreeTerms}
                onChange={(v) => set("agreeTerms", v)}
                title="I agree to the Terms of Service"
                description="You agree to follow the platform rules, list authentic products, and handle customer orders responsibly."
              />

              <AgreementBox
                checked={form.agreeCommission}
                onChange={(v) => set("agreeCommission", v)}
                title="I agree to the platform commission structure"
                description="Platform takes a small commission on every completed order. Commission rate may vary by product category."
              />

              {/* Summary */}
              <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink)]/40">
                  Review
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <SummaryRow label="Store" value={form.storeName} />
                  <SummaryRow label="Category" value={form.category} />
                  <SummaryRow label="Owner" value={form.ownerName} />
                  <SummaryRow label="Phone" value={form.phone} />
                  <SummaryRow label="Bank" value={form.bankName} />
                  <SummaryRow
                    label="Account"
                    value={
                      form.accountNumber
                        ? `****${form.accountNumber.slice(-4)}`
                        : ""
                    }
                  />
                </div>
              </div>
            </StepSection>
          )}

          {/* ============ NAVIGATION ============ */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--color-line)] pt-5">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="rounded-lg border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              disabled={!stepValid || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand-orange)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating store...
                </>
              ) : step === 5 ? (
                "Create Store"
              ) : (
                "Continue →"
              )}
            </button>
          </div>
        </div>

        {/* ==================== RIGHT: PREVIEW ==================== */}
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ink)]/40">
              Live Preview
            </p>

            {/* Store preview card */}
            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
              {/* Banner */}
              <div
                className="relative h-24"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-brand-navy) 0%, var(--color-brand-teal) 100%)",
                }}
              >
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
              </div>

              {/* Avatar + info */}
              <div className="relative px-4 pb-4">
                <div className="-mt-8 flex items-end gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-xl border-4 border-white bg-[var(--color-brand-orange)] text-lg font-bold text-white shadow-sm">
                    {(form.storeName || "??")
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                      {form.storeName || "Your Store Name"}
                    </p>
                    <p className="truncate text-[11px] text-[var(--color-ink)]/50">
                      @{form.slug || "your-store"}
                    </p>
                  </div>
                </div>

                {/* Tagline */}
                <p className="mt-3 text-xs text-[var(--color-ink)]/60">
                  {form.tagline || "Your store tagline will appear here."}
                </p>

                {/* Category pill */}
                {form.category && (
                  <span className="mt-3 inline-block rounded-full bg-[var(--color-brand-cream)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-ink)]/60">
                    {form.category}
                  </span>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-4 flex flex-col gap-2">
              <CheckItem label="Store identity" done={form.storeName && form.slug && form.category} />
              <CheckItem
                label="Owner verification"
                done={form.ownerName && form.phone && form.email && form.nidNumber}
              />
              <CheckItem
                label="Bank details"
                done={
                  form.bankName &&
                  form.accountName &&
                  form.accountNumber &&
                  form.branchName
                }
              />
              <CheckItem
                label="Terms accepted"
                done={form.agreeTerms && form.agreeCommission}
              />
            </div>

            {/* Help */}
            <div className="mt-5 rounded-lg border border-dashed border-[var(--color-line)] p-3">
              <p className="text-[11px] leading-relaxed text-[var(--color-ink)]/50">
                💡 All fields marked with <span className="font-semibold text-[var(--color-brand-orange)]">*</span> are required.
                You can update most info later from your profile.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Utility styles */}
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
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .input::placeholder {
          color: rgba(17, 24, 39, 0.3);
        }
      `}</style>
    </div>
  );
}

// ==================== SUB COMPONENTS ====================
function StepSection({ icon, title, subtitle, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-brand-cream)] text-lg">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--color-ink)]">{title}</h2>
          <p className="text-xs text-[var(--color-ink)]/50">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-[var(--color-ink)]/70">
          {label} {required && <span className="text-[var(--color-brand-orange)]">*</span>}
        </span>
        {hint && (
          <span className="text-[10px] text-[var(--color-ink)]/40">{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function AgreementBox({ checked, onChange, title, description }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
        checked
          ? "border-[var(--color-brand-teal)]/40 bg-[var(--color-brand-teal)]/5"
          : "border-[var(--color-line)] bg-white hover:bg-gray-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--color-brand-teal)]"
      />
      <div>
        <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink)]/60">
          {description}
        </p>
      </div>
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[var(--color-ink)]/50">{label}</span>
      <span className="truncate text-xs font-medium text-[var(--color-ink)]">
        {value || "—"}
      </span>
    </div>
  );
}

function CheckItem({ label, done }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
          done
            ? "bg-[var(--color-brand-teal)] text-white"
            : "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/30"
        }`}
      >
        {done ? "✓" : "—"}
      </span>
      <span
        className={`text-xs ${
          done
            ? "font-medium text-[var(--color-ink)]"
            : "text-[var(--color-ink)]/40"
        }`}
      >
        {label}
      </span>
    </div>
  );
}