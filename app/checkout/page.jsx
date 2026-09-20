"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/component/shared/Cartcontext";

const money = (n, decimals = 0) =>
  `৳${n.toLocaleString("en-BD", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

const DELIVERY_OPTIONS = [
  { id: "inside", label: "Inside Dhaka & Chittagong City", note: "Delivery in 72 hours", charge: 70, icon: "🏙️" },
  { id: "outside", label: "Outside Dhaka", note: "Delivery in 4 working days", charge: 130, icon: "🚚" },
  { id: "express", label: "Express Delivery (Dhaka city only)", note: "Faster delivery within Dhaka city", charge: 100, icon: "⚡" },
];

const PAYMENT_OPTIONS = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay in cash when your order arrives at your doorstep.", chip: "COD", color: "#16a34a", icon: "💵" },
  { id: "bkash", label: "bKash", desc: "Pay online with bKash after placing your order.", chip: "bK", color: "#E2136E", icon: "📱" },
  { id: "nagad", label: "Nagad", desc: "Pay online with Nagad after placing your order.", chip: "N", color: "#F15A22", icon: "📲" },
  { id: "card", label: "Visa / MasterCard", desc: "Pay securely with your debit or credit card.", chip: "Card", color: "#1f2937", icon: "💳" },
];

const FIELD_ORDER = ["name", "phone", "email", "address"];

const validate = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = "Please enter your full name";
  const phone = f.phone.replace(/[\s-]/g, "").replace(/^\+?88/, "");
  if (!phone) e.phone = "Please enter your phone number";
  else if (!/^01[3-9]\d{8}$/.test(phone)) e.phone = "Enter a valid 11-digit mobile number (e.g. 01712345678)";
  if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email address";
  if (!f.address.trim()) e.address = "Please enter your full delivery address";
  else if (f.address.trim().length < 10) e.address = "Address looks too short. Add house, road and area";
  return e;
};

const inputCls = (error) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
      : "border-gray-200 focus:border-orange-500 focus:ring-orange-500/10"
  }`;

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={`field-${id}`} className="mb-1.5 block text-sm font-medium text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`err-${id}`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

function SectionTitle({ n, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/30">
        {n}
      </span>
      <div>
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function Stepper({ current }) {
  const steps = [
    { id: 1, label: "Cart", done: true },
    { id: 2, label: "Delivery", done: current > 2, active: current === 2 },
    { id: 3, label: "Payment", done: current > 3, active: current === 3 },
    { id: 4, label: "Done", done: current > 4, active: current === 4 },
  ];
  return (
    <ol className="flex items-center gap-1.5 sm:gap-3" aria-label="Checkout progress">
      {steps.map((s, i) => (
        <li key={s.id} className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition ${
                s.done
                  ? "bg-green-500 text-white"
                  : s.active
                  ? "bg-orange-500 text-white ring-4 ring-orange-500/20"
                  : "bg-white/20 text-white/60"
              }`}
            >
              {s.done ? "✓" : s.id}
            </span>
            <span
              className={`text-[11px] font-medium sm:text-xs ${
                s.active || s.done ? "text-white" : "text-white/50"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className={`h-px w-4 sm:w-8 ${s.done ? "bg-green-400" : "bg-white/20"}`} />
          )}
        </li>
      ))}
    </ol>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, changeQty, removeItem, clearCart } = useCart();

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [errors, setErrors] = useState({});
  const [deliveryId, setDeliveryId] = useState("inside");
  const [paymentId, setPaymentId] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && items.length === 0 && !order) router.replace("/");
  }, [ready, items.length, order, router]);

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId);
  const payment = PAYMENT_OPTIONS.find((p) => p.id === paymentId);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const total = subtotal + delivery.charge;

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const found = validate(form);
    setErrors(found);

    const firstKey = FIELD_ORDER.find((k) => found[k]);
    if (firstKey) {
      const el = document.getElementById(`field-${firstKey}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    setSubmitting(true);
    // TODO (backend): POST /api/orders — server nijer database theke dam calculate korbe
    await new Promise((r) => setTimeout(r, 900));

    setOrder({
      orderNo: `GB${Date.now().toString().slice(-8)}`,
      customer: { ...form },
      delivery,
      payment,
      items: [...items],
      subtotal,
      total,
    });
    clearCart();
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== SUCCESS SCREEN =====
  if (order) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-green-50 via-white to-orange-50/40 px-4 py-10 sm:py-16">
        {/* Confetti dots */}
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                backgroundColor: ["#f97316", "#16a34a", "#3b82f6", "#eab308"][i % 4],
                animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
            50% { transform: translateY(-20px) scale(1.3); opacity: 0.9; }
          }
          @keyframes popIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <div className="relative mx-auto max-w-xl">
          <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-2xl shadow-green-500/10">
            {/* Top green strip */}
            <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500" />

            <div className="p-6 text-center sm:p-10">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-xl shadow-green-500/40"
                style={{ animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </div>

              <h1 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">Order Placed! 🎉</h1>
              <p className="mt-2 text-sm text-gray-600">
                Thank you, <span className="font-semibold text-gray-900">{order.customer.name.trim().split(" ")[0]}</span>. We'll call you shortly to confirm.
              </p>

              <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-dashed border-orange-300 bg-orange-50 px-6 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">Order Number</p>
                <p className="mt-0.5 font-mono text-xl font-bold tracking-wide text-orange-700">{order.orderNo}</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: "📞", label: "Call soon" },
                  { icon: "📦", label: "Packed" },
                  { icon: "🚚", label: "On the way" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-gray-50 p-3 text-center">
                    <div className="text-2xl">{s.icon}</div>
                    <p className="mt-1 text-[10px] font-medium text-gray-600">{s.label}</p>
                  </div>
                ))}
              </div>

              <dl className="mt-6 space-y-2.5 rounded-2xl bg-gray-50 p-5 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Deliver to</dt>
                  <dd className="max-w-[60%] text-right font-medium text-gray-900">{order.customer.address}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-medium text-gray-900">{order.customer.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Delivery</dt>
                  <dd className="text-right font-medium text-gray-900">{order.delivery.label}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Payment</dt>
                  <dd className="font-medium text-gray-900">{order.payment.label}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-gray-200 pt-3">
                  <dt className="font-semibold text-gray-900">Total Paid</dt>
                  <dd className="text-lg font-bold text-orange-600">{money(order.total, 2)}</dd>
                </div>
              </dl>

              <Link
                href="/"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!ready || items.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50" aria-busy="true">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-orange-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-500">Loading checkout…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-16">
      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy to-[#1a2d52]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/90">Checkout</span>
          </nav>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Secure Checkout</h1>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">Complete your order in a few simple steps</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-xs font-medium text-white">100% Secure Payment</span>
            </div>
          </div>

          <div className="mt-5">
            <Stepper current={2} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ===== MOBILE: Order summary toggle ===== */}
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((s) => !s)}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {summaryOpen ? "Hide" : "Show"} order summary
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                {itemCount}
              </span>
            </span>
            <span className="text-orange-600">{money(total, 2)}</span>
          </button>
        </div>

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start"
        >
          {/* ===== LEFT: FORM ===== */}
          <div className="space-y-5">
            {/* 1. Delivery details */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-transparent px-5 py-4 sm:px-6">
                <SectionTitle n={1} title="Delivery details" subtitle="Where should we deliver your order?" />
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <Field id="name" label="Full name" required error={errors.name}>
                  <input
                    id="field-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={setField("name")}
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className={inputCls(errors.name)}
                  />
                </Field>

                <Field id="phone" label="Phone number" required error={errors.phone}>
                  <input
                    id="field-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder="01XXXXXXXXX"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    className={inputCls(errors.phone)}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field id="email" label="Email (optional)" error={errors.email}>
                    <input
                      id="field-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={setField("email")}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className={inputCls(errors.email)}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field id="address" label="Full address" required error={errors.address} hint="House, road, area, city">
                    <textarea
                      id="field-address"
                      rows={3}
                      autoComplete="street-address"
                      value={form.address}
                      onChange={setField("address")}
                      placeholder="e.g. House 12, Road 5, Rampura, Dhaka"
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "err-address" : undefined}
                      className={`${inputCls(errors.address)} resize-none`}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field id="note" label="Order note (optional)">
                    <textarea
                      id="field-note"
                      rows={2}
                      value={form.note}
                      onChange={setField("note")}
                      placeholder="Any special instruction for delivery"
                      className={`${inputCls(false)} resize-none`}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* 2. Delivery method */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-transparent px-5 py-4 sm:px-6">
                <SectionTitle n={2} title="Delivery method" subtitle="Choose how fast you want it" />
              </div>
              <div className="space-y-3 p-5 sm:p-6" role="radiogroup" aria-label="Delivery method">
                {DELIVERY_OPTIONS.map((d) => {
                  const selected = d.id === deliveryId;
                  return (
                    <label
                      key={d.id}
                      className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                        selected
                          ? "border-orange-500 bg-orange-50/60 shadow-md shadow-orange-500/10"
                          : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={d.id}
                        checked={selected}
                        onChange={() => setDeliveryId(d.id)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition ${
                          selected ? "bg-orange-500 text-white shadow-md shadow-orange-500/30" : "bg-gray-100"
                        }`}
                        aria-hidden="true"
                      >
                        {d.icon}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-gray-900">{d.label}</span>
                        <span className="mt-0.5 block text-xs text-gray-500">{d.note}</span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className={`text-sm font-bold ${selected ? "text-orange-600" : "text-gray-900"}`}>
                          {money(d.charge)}
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                            selected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="m5 12 5 5L20 7" />
                            </svg>
                          )}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* 3. Payment */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-transparent px-5 py-4 sm:px-6">
                <SectionTitle n={3} title="Payment method" subtitle="All transactions are secure & encrypted" />
              </div>
              <div className="space-y-3 p-5 sm:p-6" role="radiogroup" aria-label="Payment method">
                {PAYMENT_OPTIONS.map((p) => {
                  const selected = p.id === paymentId;
                  return (
                    <label
                      key={p.id}
                      className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                        selected
                          ? "border-orange-500 bg-orange-50/60 shadow-md shadow-orange-500/10"
                          : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={selected}
                        onChange={() => setPaymentId(p.id)}
                        className="sr-only"
                      />
                      <span
                        className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: p.color }}
                        aria-hidden="true"
                      >
                        {p.chip}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-gray-900">{p.label}</span>
                        <span className="mt-0.5 block text-xs text-gray-500">{p.desc}</span>
                      </span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                          selected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m5 12 5 5L20 7" />
                          </svg>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ===== RIGHT: ORDER SUMMARY ===== */}
          <aside className={`lg:sticky lg:top-6 lg:block ${summaryOpen ? "block" : "hidden"}`}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/60 to-transparent px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              <ul className="max-h-[300px] divide-y divide-gray-100 overflow-y-auto px-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-3.5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-orange-50 text-2xl">
                      {item.image ? (
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        item.emoji
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={() => changeQty(item.id, -1)}
                            disabled={item.qty <= 1}
                            aria-label="Decrease quantity"
                            className="h-7 w-7 text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(item.id, 1)}
                            aria-label="Increase quantity"
                            className="h-7 w-7 text-gray-700 transition hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{money(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2.5 border-t border-gray-100 bg-gray-50/50 px-5 py-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">{money(subtotal, 2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Delivery charge</dt>
                  <dd className="font-medium text-gray-900">{money(delivery.charge, 2)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-xl font-bold text-orange-600">{money(total, 2)}</dd>
                </div>
              </dl>

              <div className="p-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Placing order…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      Place Order · {money(total, 2)}
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                  {[
                    { icon: "🔒", label: "SSL Secured" },
                    { icon: "↩️", label: "Easy Return" },
                    { icon: "💬", label: "24/7 Support" },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                      <span className="text-lg">{b.icon}</span>
                      <span className="text-[10px] font-medium text-gray-500">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help box */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-900">Need help?</p>
                <p className="mt-0.5 text-[11px] text-gray-600">
                  Call us at <span className="font-semibold text-blue-600">+880 1700-000000</span>
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}