"use client";

import { useEffect, useState } from "react";

/* ============================================================
   COURIERS — API থেকে আসবে: GET /api/v1/shipping/couriers
   ============================================================ */
const COURIERS = [
  { id: "steadfast", name: "Steadfast", logo: "📦", eta: "2-3 days", etaDays: 3, basePrice: 60, outside: 110 },
  { id: "pathao",    name: "Pathao",    logo: "🛵", eta: "1-2 days", etaDays: 2, basePrice: 70, outside: 120 },
  { id: "redx",      name: "RedX",      logo: "🔴", eta: "2-3 days", etaDays: 3, basePrice: 65, outside: 110 },
  { id: "paperfly",  name: "Paperfly",  logo: "✈️", eta: "3-4 days", etaDays: 4, basePrice: 50, outside: 100 },
  { id: "sundarban", name: "Sundarban", logo: "🦌", eta: "3-5 days", etaDays: 5, basePrice: 55, outside: 105 },
  { id: "manual",    name: "Manual Entry", logo: "✍️", eta: "—", etaDays: 0, basePrice: 0, outside: 0 },
];

const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);

/* HELPERS */
const detectZone = (address = "") => {
  const a = address.toLowerCase();
  return a.includes("dhaka") && !a.includes("outside") ? "dhaka" : "outside";
};

const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function SendToCourierModal({
  order,
  role = "reseller",
  onClose,
  onSuccess,
}) {
  const isAdmin = role === "admin";

  const [selected, setSelected] = useState("steadfast");
  const [manualTracking, setManualTracking] = useState("");
  const [note, setNote] = useState("");
  const [weight, setWeight] = useState("0.5");
  const [zone, setZone] = useState(() =>
    detectZone(order.customer.address ?? order.customer.phone ?? "")
  );
  const [phase, setPhase] = useState("form");
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && phase !== "sending" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, phase]);

  const courier = COURIERS.find((c) => c.id === selected);
  const isManual = selected === "manual";

  const weightNum = Number(weight) || 0;
  const weightValid = weightNum >= 0.1 && weightNum <= 5;

  const canSubmit = isManual ? manualTracking.trim().length > 0 : weightValid;

  const deliveryCharge = isManual
    ? 0
    : zone === "dhaka"
    ? courier.basePrice
    : courier.outside;

  const codFee = Math.max(Math.ceil(order.total * 0.01), 10);
  const totalCharge = deliveryCharge + codFee;
  const expectedDelivery = !isManual ? addDays(courier.etaDays) : null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);

    if (!isManual && !weightValid) {
      setError("Weight must be between 0.1 and 5 kg.");
      return;
    }

    setPhase("sending");

    /* 🔸 FUTURE API CALL
       const endpoint = isAdmin
         ? `/api/v1/admin/orders/${order.id}/ship`
         : `/api/v1/reseller/orders/${order.id}/ship`;
    */

    await new Promise((r) => setTimeout(r, 1200));

    const newTracking = isManual
      ? manualTracking.trim()
      : `SP-${Math.floor(1000000 + Math.random() * 9000000)}`;

    setTrackingId(newTracking);
    setPhase("done");

    setTimeout(() => {
      onSuccess?.({
        trackingId: newTracking,
        courier: courier.name,
        courierId: courier.id,
        charge: totalCharge,
        expectedDelivery,
        role,
      });
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-ink)]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => phase !== "sending" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {phase === "done" ? (
          <SuccessScreen
            order={order}
            courier={courier}
            trackingId={trackingId}
            charge={totalCharge}
            expectedDelivery={expectedDelivery}
            role={role}
            onClose={onClose}
          />
        ) : (
          <>
            {/* HEADER */}
            <div className="relative shrink-0 overflow-hidden border-b border-[var(--color-line)] px-6 pb-5 pt-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)]" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-brand-orange)]/10 text-2xl">
                    🚚
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                        Send to Courier
                      </h2>
                      {isAdmin && (
                        <span className="rounded-full bg-[var(--color-brand-navy)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-brand-navy)]">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-ink)]/55">
                      Order {order.id} · {order.customer.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={phase === "sending"}
                  aria-label="Close"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-[var(--color-ink)]/40 transition-colors hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)] disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Order summary */}
              <div className="rounded-2xl bg-[var(--color-brand-cream)] p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    {order.products.slice(0, 2).map((p, i) => (
                      <img
                        key={i}
                        src={p.image}
                        alt={p.name}
                        className={`absolute h-12 w-12 rounded-xl border-2 border-white object-cover shadow-sm ${
                          i === 0 ? "left-0 top-0" : "left-3 top-2 opacity-75"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                      {order.products.map((p) => p.name).join(" + ")}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-ink)]/55">
                      {order.customer.phone}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold tabular-nums text-[var(--color-ink)]">
                    ৳{fmt(order.total)}
                  </p>
                </div>
              </div>

              {/* Address block */}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--color-line)] bg-white p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    📍 Deliver to
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-ink)]">
                    {order.customer.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-ink)]/60">
                    {order.customer.address ?? "House 12, Road 5, Dhanmondi, Dhaka 1205"}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-line)] bg-white p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    🏪 Pickup from
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-ink)]">
                    {isAdmin ? "Main Warehouse" : "Your Store"}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-ink)]/60">
                    {isAdmin
                      ? "Bilash Warehouse, Tejgaon, Dhaka"
                      : "House 12, Road 5, Dhanmondi, Dhaka"}
                  </p>
                </div>
              </div>

              {/* Zone */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Delivery Zone
                  </p>
                  <span className="text-[10px] text-[var(--color-ink)]/40">
                    auto-detected
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "dhaka", label: "Dhaka City", sub: "Inside" },
                    { id: "outside", label: "Outside Dhaka", sub: "Suburb" },
                  ].map((z) => {
                    const on = zone === z.id;
                    return (
                      <button
                        key={z.id}
                        type="button"
                        disabled={phase === "sending"}
                        onClick={() => setZone(z.id)}
                        className={`flex cursor-pointer flex-col items-start rounded-xl border-2 p-3 text-left transition-all disabled:opacity-50 ${
                          on
                            ? "border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)]/5 ring-2 ring-[var(--color-brand-orange)]/20"
                            : "border-[var(--color-line)] bg-white hover:border-[var(--color-ink)]/30"
                        }`}
                      >
                        <p className="text-xs font-semibold text-[var(--color-ink)]">
                          {z.label}
                        </p>
                        <p className="text-[10px] text-[var(--color-ink)]/55">{z.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Courier selection */}
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                  Choose Courier
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {COURIERS.map((c) => {
                    const on = selected === c.id;
                    const price = zone === "dhaka" ? c.basePrice : c.outside;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        disabled={phase === "sending"}
                        onClick={() => setSelected(c.id)}
                        className={`flex cursor-pointer flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all disabled:opacity-50 ${
                          on
                            ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]/5 ring-2 ring-[var(--color-brand-navy)]/20"
                            : "border-[var(--color-line)] bg-white hover:border-[var(--color-ink)]/30"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="text-lg">{c.logo}</span>
                          {on && (
                            <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[8px] font-bold text-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[var(--color-ink)]">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-ink)]/55">
                          {c.eta}
                          {price > 0 && ` · ৳${price}`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual tracking */}
              {isManual && (
                <label className="mt-5 block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    Tracking Number
                  </span>
                  <input
                    type="text"
                    value={manualTracking}
                    onChange={(e) => setManualTracking(e.target.value)}
                    placeholder="e.g. SP-1234567"
                    disabled={phase === "sending"}
                    className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm font-mono outline-none transition-all placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20 disabled:opacity-50"
                  />
                </label>
              )}

              {/* Weight + COD */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                      Weight (kg)
                    </span>
                    {!isManual && !weightValid && weight !== "" && (
                      <span className="text-[10px] font-medium text-red-500">
                        0.1 – 5 kg
                      </span>
                    )}
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={phase === "sending" || isManual}
                    className={`mt-2 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 disabled:opacity-50 ${
                      !isManual && !weightValid && weight !== ""
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-[var(--color-line)] focus:border-[var(--color-brand-orange)] focus:ring-[var(--color-brand-orange)]/20"
                    }`}
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                    COD Amount
                  </span>
                  <input
                    type="text"
                    value={`৳${fmt(order.total)}`}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/60 px-3.5 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 outline-none"
                  />
                </label>
              </div>

              {/* Expected delivery */}
              {expectedDelivery && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--color-brand-teal)]/20 bg-[var(--color-brand-teal)]/5 p-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-teal)]">
                      Estimated delivery
                    </p>
                    <p className="text-xs font-semibold text-[var(--color-ink)]">
                      {expectedDelivery} · {courier.eta}
                    </p>
                  </div>
                </div>
              )}

              {/* Note */}
              <label className="mt-4 block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
                  Note to courier (optional)
                </span>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Fragile — handle with care"
                  disabled={phase === "sending"}
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20 disabled:opacity-50"
                />
              </label>

              {/* Charge preview */}
              {!isManual && (
                <div className="mt-5 rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/60 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-ink)]/60">Delivery charge</span>
                    <span className="font-bold tabular-nums text-[var(--color-ink)]">
                      ৳{deliveryCharge}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs">
                    <span className="text-[var(--color-ink)]/60">COD fee (1%)</span>
                    <span className="font-bold tabular-nums text-[var(--color-ink)]">
                      ৳{codFee}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-[var(--color-line)] pt-2">
                    <span className="text-xs font-semibold text-[var(--color-ink)]">
                      {isAdmin ? "Admin wallet" : "Your wallet"} pays
                    </span>
                    <span className="text-sm font-bold tabular-nums text-[var(--color-brand-orange)]">
                      ৳{totalCharge}
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  ⚠ {error}
                </div>
              )}

              {/* Info */}
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-[var(--color-brand-navy)]/5 p-3">
                <span className="text-base">💡</span>
                <p className="text-[11px] leading-relaxed text-[var(--color-ink)]/70">
                  {isAdmin
                    ? "As admin, this order ships from the warehouse. Customer and reseller get tracking updates."
                    : "After sending, order becomes Shipped. Customer gets the tracking ID via SMS."}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 gap-3 border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={phase === "sending"}
                className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] bg-white py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || phase === "sending"}
                className="flex-[1.6] cursor-pointer rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
              >
                {phase === "sending" ? "Sending to courier..." : "Confirm & Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SUCCESS SCREEN
   ============================================================ */
function SuccessScreen({ order, courier, trackingId, charge, expectedDelivery, role, onClose }) {
  const isAdmin = role === "admin";

  return (
    <div className="flex flex-col items-center p-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-[var(--color-brand-teal)]/20" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white shadow-xl shadow-teal-500/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-10 w-10">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
        Sent to Courier!
      </h2>
      <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
        {order.id} handed over to{" "}
        <span className="font-semibold text-[var(--color-ink)]">{courier.name}</span>
      </p>

      <div className="mt-6 w-full rounded-2xl border-2 border-dashed border-[var(--color-brand-teal)]/40 bg-[var(--color-brand-teal)]/5 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-teal)]">
          Tracking Number
        </p>
        <p className="mt-1 font-mono text-lg font-bold text-[var(--color-ink)]">
          {trackingId}
        </p>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(trackingId)}
          className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[var(--color-brand-teal)] hover:underline"
        >
          📋 Copy tracking ID
        </button>
      </div>

      {(charge > 0 || expectedDelivery) && (
        <div className="mt-3 w-full rounded-xl bg-[var(--color-brand-cream)] p-3 text-xs">
          {charge > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-ink)]/60">
                {isAdmin ? "Admin wallet" : "Your wallet"} charged
              </span>
              <span className="font-bold tabular-nums text-[var(--color-ink)]">
                ৳{charge}
              </span>
            </div>
          )}
          {expectedDelivery && (
            <div className="mt-2 flex items-center justify-between border-t border-[var(--color-line)] pt-2">
              <span className="text-[var(--color-ink)]/60">Expected delivery</span>
              <span className="font-bold text-[var(--color-ink)]">{expectedDelivery}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 w-full rounded-2xl bg-[var(--color-brand-cream)] p-4 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/50">
          What's next?
        </p>
        <ul className="mt-2 space-y-1.5 text-xs text-[var(--color-ink)]/65">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-brand-teal)]">✓</span>
            Order status is now <strong className="text-[var(--color-ink)]">Shipped</strong>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-brand-teal)]">✓</span>
            {isAdmin
              ? "Customer & reseller get tracking ID"
              : "Customer can track delivery"}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-brand-teal)]">✓</span>
            Payment settles after delivery
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
      >
        Done
      </button>
    </div>
  );
}