"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   ORDER PROP SHAPE (orders page theke adapter diye pathano hoy)
   {
     id, customerName, phone, address, district,
     items: [{ name, qty, emoji? }],
     total,            // number
     payment,          // "Paid" | "COD" | ...
     preferredCourier, // optional, e.g. "Steadfast"
     weight            // optional, kg
   }
   ============================================================ */

/* ============================================================
   COURIERS 🔸 API: GET /api/v1/shipping/couriers
   days = [min, max], inside/outside = delivery charge (৳)
   ============================================================ */
const COURIERS = [
  { id: "steadfast", name: "Steadfast", days: [2, 3], inside: 60, outside: 110 },
  { id: "pathao", name: "Pathao", days: [1, 2], inside: 70, outside: 120 },
  { id: "redx", name: "RedX", days: [2, 3], inside: 65, outside: 110 },
  { id: "paperfly", name: "Paperfly", days: [3, 4], inside: 50, outside: 100 },
  { id: "sundarban", name: "Sundarban", days: [3, 5], inside: 55, outside: 105 },
];
const MANUAL = { id: "manual", name: "Manual entry", days: [0, 0], inside: 0, outside: 0 };

/* ============================================================
   API 🔸 ekhane real call boshabe
   const endpoint = role === "admin"
     ? `/api/v1/admin/orders/${payload.orderId}/ship`
     : `/api/v1/reseller/orders/${payload.orderId}/ship`;
   const res = await fetch(endpoint, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload),
   });
   if (!res.ok) throw new Error((await res.json()).message ?? "Could not send to courier");
   return res.json(); // { trackingId }
   ============================================================ */
async function sendShipment(payload, role) {
  await new Promise((r) => setTimeout(r, 1200));
  return { trackingId: payload.trackingId || `SP-${Math.floor(1000000 + Math.random() * 9000000)}` };
}

/* ============================================================
   HELPERS
   ============================================================ */
const taka = (n) => `৳${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}`;

const detectZone = (o) =>
  `${o.district ?? ""} ${o.address ?? ""}`.toLowerCase().includes("dhaka") ? "inside" : "outside";

const dateAfter = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const etaText = (c) => (c.days[0] === c.days[1] ? `${c.days[0]} days` : `${c.days[0]}–${c.days[1]} days`);

function Icon({ d, className = "h-4 w-4", sw = 2 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const P = {
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 13l4 4L19 7",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
  copy: "M8 4h10a2 2 0 0 1 2 2v10M4 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z",
  alert: "M12 9v4m0 4h.01M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
};

const labelCls = "mb-2 block text-sm font-semibold text-brand-navy";
const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:opacity-50";

/* ============================================================
   MAIN
   ============================================================ */
export default function SendToCourierModal({ order, role = "admin", onClose, onSuccess }) {
  const isAdmin = role === "admin";
  const dialogRef = useRef(null);

  const [courierId, setCourierId] = useState(
    () => COURIERS.find((c) => c.name.toLowerCase() === String(order.preferredCourier ?? "").toLowerCase())?.id ?? "steadfast"
  );
  const [zone, setZone] = useState(() => detectZone(order));
  const [zoneAuto, setZoneAuto] = useState(true);
  const [weight, setWeight] = useState(order.weight ? String(order.weight) : "0.5");
  const [note, setNote] = useState("");
  const [tracking, setTracking] = useState("");
  const [manualName, setManualName] = useState("");
  const [phase, setPhase] = useState("form"); // form | sending | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const busy = phase === "sending";

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, busy]);

  /* ---------- derived ---------- */
  const manual = courierId === "manual";
  const courier = manual ? MANUAL : COURIERS.find((c) => c.id === courierId);
  const rate = (c) => (zone === "inside" ? c.inside : c.outside);

  const cheapestId = COURIERS.reduce((a, b) => (rate(b) < rate(a) ? b : a)).id;
  const fastestId = COURIERS.reduce((a, b) => (b.days[1] < a.days[1] ? b : a)).id;

  const w = Number(weight);
  const weightOk = w >= 0.1 && w <= 5;
  const isCod = order.payment === "COD";

  const delivery = manual ? 0 : rate(courier);
  const codFee = !manual && isCod ? Math.max(Math.ceil(order.total * 0.01), 10) : 0;
  const charge = delivery + codFee;
  const expected = manual ? null : dateAfter(courier.days[1]);

  const canSubmit = !busy && (manual ? tracking.trim().length > 0 : weightOk);

  const bump = (d) => {
    const next = Math.round(((Number(weight) || 0) + d) * 10) / 10;
    setWeight(String(Math.min(5, Math.max(0.1, next))));
  };

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setPhase("sending");
    try {
      const courierName = manual ? manualName.trim() || "Manual" : courier.name;
      const res = await sendShipment(
        {
          orderId: order.id,
          courierId,
          courierName,
          zone,
          weight: manual ? null : w,
          note: note.trim(),
          trackingId: manual ? tracking.trim() : undefined,
        },
        role
      );
      const out = { trackingId: res.trackingId, courier: courierName, courierId, charge, expectedDelivery: expected };
      setResult(out);
      setPhase("done");
      onSuccess?.(out);
    } catch (err) {
      setError(err?.message || "Something went wrong. Try again.");
      setPhase("form");
    }
  };

  const copyTracking = async () => {
    try {
      await navigator.clipboard.writeText(result.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const shownItems = order.items.slice(0, 3);
  const moreItems = order.items.length - shownItems.length;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-brand-navy/60 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={() => !busy && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Send to courier"
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl outline-none sm:rounded-2xl ${
          phase === "done" ? "max-w-md" : "max-w-3xl"
        }`}
      >
        {phase === "done" && result ? (
          /* ================= SUCCESS ================= */
          <div className="flex flex-col items-center overflow-y-auto px-8 py-10 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-teal text-white">
              <Icon d={P.check} className="h-7 w-7" sw={2.5} />
            </span>
            <h2 className="mt-5 text-xl font-bold text-brand-navy">Handed over to {result.courier}</h2>
            <p className="mt-1 text-sm text-ink/55">Order #{order.id} is now marked as shipped.</p>

            <div className="mt-6 w-full rounded-xl border border-line bg-brand-cream/60 p-4">
              <p className="text-xs text-ink/55">Tracking number</p>
              <p className="mt-1 font-mono text-xl font-bold tracking-wide text-ink">{result.trackingId}</p>
              <button
                type="button"
                onClick={copyTracking}
                className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink/75 transition-colors hover:bg-brand-cream"
              >
                <Icon d={copied ? P.check : P.copy} className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy tracking number"}
              </button>
            </div>

            <dl className="mt-4 w-full divide-y divide-line rounded-xl border border-line text-sm">
              {result.expectedDelivery && (
                <div className="flex justify-between px-4 py-2.5">
                  <dt className="text-ink/55">Expected delivery</dt>
                  <dd className="font-semibold text-ink">{result.expectedDelivery}</dd>
                </div>
              )}
              <div className="flex justify-between px-4 py-2.5">
                <dt className="text-ink/55">{isAdmin ? "Admin wallet" : "Your wallet"} charged</dt>
                <dd className="font-semibold tabular-nums text-ink">{result.charge > 0 ? taka(result.charge) : "Nothing"}</dd>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <dt className="text-ink/55">Customer</dt>
                <dd className="font-semibold text-ink">Gets the tracking link by SMS</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full cursor-pointer rounded-lg bg-brand-orange py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
            >
              Done
            </button>
          </div>
        ) : (
          /* ================= FORM ================= */
          <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[minmax(0,1fr)_300px] md:overflow-hidden">
            {/* ---------- left: choices ---------- */}
            <div className="flex min-h-0 flex-col md:overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-brand-navy">Send to courier</h2>
                  <p className="mt-0.5 text-sm text-ink/55">
                    Order #{order.id} · {order.customerName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-ink/45 transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-40"
                >
                  <Icon d={P.x} />
                </button>
              </div>

              <div className="flex flex-col gap-6 px-6 py-6">
                {/* Zone */}
                <div>
                  <span className={labelCls}>Delivery area</span>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-ink/5 p-1">
                    {[
                      ["inside", "Inside Dhaka"],
                      ["outside", "Outside Dhaka"],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        disabled={busy}
                        onClick={() => { setZone(id); setZoneAuto(false); }}
                        className={`cursor-pointer rounded-md py-2 text-sm font-semibold transition-all disabled:opacity-50 ${
                          zone === id ? "bg-white text-brand-navy shadow-sm" : "text-ink/55 hover:text-ink"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {zoneAuto && <p className="mt-1.5 text-xs text-ink/45">Picked from the customer's address. Change it if it's wrong.</p>}
                </div>

                {/* Courier list */}
                <div>
                  <span className={labelCls}>Courier</span>
                  <div role="radiogroup" aria-label="Courier" className="flex flex-col gap-2">
                    {COURIERS.map((c) => {
                      const on = courierId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          disabled={busy}
                          onClick={() => setCourierId(c.id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:opacity-50 ${
                            on ? "border-brand-navy bg-brand-navy/[0.04] ring-1 ring-brand-navy" : "border-line bg-white hover:border-ink/30"
                          }`}
                        >
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                              on ? "bg-brand-navy text-white" : "bg-brand-cream text-brand-navy"
                            }`}
                          >
                            {c.name[0]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-ink">{c.name}</span>
                              {c.id === cheapestId && (
                                <span className="rounded bg-brand-teal/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-teal">Cheapest</span>
                              )}
                              {c.id === fastestId && (
                                <span className="rounded bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-orange-dark">Fastest</span>
                              )}
                            </span>
                            <span className="text-xs text-ink/50">Delivers in {etaText(c)}</span>
                          </span>
                          <span className="text-sm font-bold tabular-nums text-ink">{taka(rate(c))}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      role="radio"
                      aria-checked={manual}
                      disabled={busy}
                      onClick={() => setCourierId("manual")}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-left transition-colors disabled:opacity-50 ${
                        manual ? "border-brand-navy bg-brand-navy/[0.04]" : "border-line bg-white hover:border-ink/30"
                      }`}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/5 text-ink/50">
                        <Icon d={P.plus} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-ink">Enter tracking manually</span>
                        <span className="text-xs text-ink/50">Use this if you already booked the parcel elsewhere</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Manual fields */}
                {manual && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelCls}>Tracking number</span>
                      <input
                        type="text"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        placeholder="e.g. SP-1234567"
                        disabled={busy}
                        autoFocus
                        className={`${inputCls} font-mono`}
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Courier name</span>
                      <input
                        type="text"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder="Optional"
                        disabled={busy}
                        className={inputCls}
                      />
                    </label>
                  </div>
                )}

                {/* Weight + COD */}
                {!manual && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ship-weight" className={labelCls}>Parcel weight (kg)</label>
                      <div className="flex items-stretch">
                        <button
                          type="button"
                          onClick={() => bump(-0.5)}
                          disabled={busy}
                          aria-label="Decrease weight"
                          className="grid w-10 cursor-pointer place-items-center rounded-l-lg border border-r-0 border-line bg-white text-ink/60 hover:bg-brand-cream disabled:opacity-50"
                        >
                          <Icon d={P.minus} className="h-3.5 w-3.5" />
                        </button>
                        <input
                          id="ship-weight"
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="5"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          disabled={busy}
                          className={`w-full border bg-white px-3 py-2.5 text-center text-sm tabular-nums outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 disabled:opacity-50 ${
                            weightOk ? "border-line" : "border-red-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => bump(0.5)}
                          disabled={busy}
                          aria-label="Increase weight"
                          className="grid w-10 cursor-pointer place-items-center rounded-r-lg border border-l-0 border-line bg-white text-ink/60 hover:bg-brand-cream disabled:opacity-50"
                        >
                          <Icon d={P.plus} className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {!weightOk && <p className="mt-1.5 text-xs text-red-600">Weight must be between 0.1 and 5 kg.</p>}
                    </div>

                    <div>
                      <span className={labelCls}>Cash to collect</span>
                      <div className="rounded-lg border border-line bg-brand-cream/60 px-3.5 py-2.5 text-sm">
                        {isCod ? (
                          <span className="font-bold tabular-nums text-ink">{taka(order.total)}</span>
                        ) : (
                          <span className="text-ink/55">Prepaid, nothing to collect</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Note */}
                <label className="block">
                  <span className={labelCls}>Note for the courier <span className="font-normal text-ink/45">(optional)</span></span>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Fragile, call before arriving"
                    disabled={busy}
                    className={`${inputCls} resize-none`}
                  />
                </label>
              </div>
            </div>

            {/* ---------- right: shipment summary ---------- */}
            <aside className="flex flex-col bg-brand-navy p-6 text-white md:overflow-y-auto">
              <p className="text-sm font-semibold">Shipment</p>

              {/* route */}
              <div className="relative mt-5">
                <span className="absolute bottom-3 left-[5px] top-3 w-px bg-white/25" />
                <div className="relative pb-5 pl-7">
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-white/70 bg-brand-navy" />
                  <p className="text-xs text-white/55">Pickup</p>
                  <p className="text-sm font-semibold">{isAdmin ? "Main warehouse" : "Your store"}</p>
                  <p className="text-xs text-white/55">{isAdmin ? "Tejgaon, Dhaka" : "Dhanmondi, Dhaka"}</p>
                </div>
                <div className="relative pl-7">
                  <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full bg-brand-orange" />
                  <p className="text-xs text-white/55">Deliver to</p>
                  <p className="text-sm font-semibold">{order.customerName}</p>
                  <p className="text-xs leading-snug text-white/55">{order.address}</p>
                  <p className="mt-0.5 text-xs text-white/55">{order.phone}</p>
                </div>
              </div>

              {/* items */}
              <ul className="mt-5 flex flex-col gap-1.5 border-t border-white/10 pt-4 text-xs text-white/75">
                {shownItems.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="tabular-nums text-white/45">{it.qty}×</span>
                    <span className="truncate">{it.name}</span>
                  </li>
                ))}
                {moreItems > 0 && <li className="text-white/45">+{moreItems} more</li>}
              </ul>

              {/* costs */}
              <dl className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
                {manual ? (
                  <p className="text-xs leading-relaxed text-white/60">
                    Manual shipments aren't billed from your wallet. We only save the tracking number.
                  </p>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-white/60">Delivery · {courier.name}</dt>
                      <dd className="tabular-nums">{taka(delivery)}</dd>
                    </div>
                    {isCod && (
                      <div className="flex justify-between">
                        <dt className="text-white/60">COD fee (1%)</dt>
                        <dd className="tabular-nums">{taka(codFee)}</dd>
                      </div>
                    )}
                    <div className="mt-1 flex items-baseline justify-between border-t border-white/10 pt-3">
                      <dt className="text-white/80">{isAdmin ? "Admin wallet" : "Your wallet"} pays</dt>
                      <dd className="text-lg font-bold tabular-nums text-white">{taka(charge)}</dd>
                    </div>
                    <p className="text-xs text-white/50">Expected delivery by {expected}</p>
                  </>
                )}
              </dl>

              {error && (
                <div role="alert" className="mt-4 flex gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-100">
                  <Icon d={P.alert} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="mt-auto flex flex-col gap-2 pt-6">
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-orange py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40"
                >
                  {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                  {busy ? "Sending…" : "Confirm and send"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="w-full cursor-pointer rounded-lg py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}