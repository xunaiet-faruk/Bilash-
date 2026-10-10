"use client";

import { useEffect } from "react";
import Link from "next/link";
const STATUS = {
  placed:    { label: "Placed",    dot: "bg-slate-400",   text: "text-slate-700",   bg: "bg-slate-100",  step: 1 },
  packed:    { label: "Packed",    dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50",    step: 2 },
  shipped:   { label: "Shipped",   dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   step: 3 },
  delivered: { label: "Delivered", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", step: 4 },
  cancelled: { label: "Cancelled", dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50",     step: 0 },
};

const PAYMENT = {
  paid:     { label: "Paid",     cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  pending:  { label: "Pending",  cls: "bg-amber-50 text-amber-700 border-amber-100" },
  refunded: { label: "Refunded", cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

const STEPS = ["placed", "packed", "shipped", "delivered"];

const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

/* ============================================================
   MODAL
   ============================================================ */
export default function OrderDetailsModal({ order, onClose }) {
  const status = STATUS[order.status];
  const payment = PAYMENT[order.payment];
  const totalQty = order.products.reduce((s, p) => s + p.qty, 0);
  const subtotal = order.products.reduce((s, p) => s + p.qty * p.price, 0);
  const currentStep = status.step;

  // Esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* ============ HEADER ============ */}
        <div className="relative shrink-0 overflow-hidden border-b border-slate-100 px-6 pb-5 pt-6">
          {/* Top accent */}
          <div className={`absolute inset-x-0 top-0 h-1 ${status.dot}`} />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900">
                  {order.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${payment.cls}`}
                >
                  {payment.label}
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Order details
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Placed {formatDate(order.placedAt)} at {formatTime(order.placedAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ============ BODY ============ */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* --- PROGRESS STEPPER --- */}
          {order.status !== "cancelled" ? (
            <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Order Progress
              </p>
              <div className="mt-4 flex items-center">
                {STEPS.map((key, i) => {
                  const step = i + 1;
                  const isDone = currentStep > step;
                  const isCurrent = currentStep === step;
                  return (
                    <div key={key} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold ${
                            isDone
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : isCurrent
                              ? "border-orange-500 bg-white text-orange-600 ring-4 ring-orange-100"
                              : "border-slate-200 bg-white text-slate-300"
                          }`}
                        >
                          {isDone ? "✓" : step}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isDone || isCurrent ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {STATUS[key].label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`mx-1 mb-5 h-0.5 flex-1 ${
                            isDone ? "bg-emerald-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-700">
                ❌ This order was cancelled
              </p>
              <p className="mt-1 text-xs text-red-600/80">
                Reason: Customer requested cancellation before dispatch.
              </p>
            </div>
          )}

          {/* --- TWO COLUMN: Customer + Shipping --- */}
          <section className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Customer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Customer
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-sm font-bold text-orange-700">
                  {order.customer.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {order.customer.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {order.customer.phone}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                <DetailRow label="Customer ID" value={`CUS-${order.id.slice(-4)}`} mono />
                <DetailRow label="Total orders" value="12" />
                <DetailRow label="Rating" value="⭐ 4.8" />
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Shipping
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-lg">
                  🚚
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {order.courier}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {order.trackingId ?? "Awaiting tracking"}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                <DetailRow label="Method" value="Standard delivery" />
                <DetailRow label="Est. delivery" value="2-3 days" />
                <DetailRow label="Last update" value={order.updatedAt} />
              </div>
            </div>
          </section>

          {/* --- ITEMS --- */}
          <section className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Items in this order
              </p>
              <span className="text-xs font-semibold tabular-nums text-slate-500">
                {totalQty} {totalQty === 1 ? "piece" : "pieces"}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              {order.products.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 rounded-xl border border-slate-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      SKU: SKU-{String(i + 1).padStart(3, "0")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                        Qty: {p.qty}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                        Unit: ৳{fmt(p.price)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Subtotal
                    </p>
                    <p className="text-base font-bold tabular-nums text-slate-900">
                      ৳{fmt(p.qty * p.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- PRICE SUMMARY --- */}
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Payment Summary
            </p>

            <dl className="mt-3 divide-y divide-dashed divide-slate-100">
              <SummaryRow label="Subtotal" value={`৳${fmt(subtotal)}`} />
              <SummaryRow label="Shipping" value="Free" />
              <SummaryRow label="Discount" value="—" muted />
              <SummaryRow
                label="Total Paid"
                value={`৳${fmt(order.total)}`}
                strong
              />
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-xs font-semibold text-emerald-700">
                  Your Profit
                </dt>
                <dd className="text-base font-bold tabular-nums text-emerald-600">
                  +৳{fmt(order.profit)}
                </dd>
              </div>
            </dl>
          </section>

          {/* --- TIMELINE (Activity Log) --- */}
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Activity Timeline
            </p>
            <ol className="mt-4">
              <TimelineItem
                done
                label="Order placed"
                detail={`${formatDate(order.placedAt)} · ${formatTime(order.placedAt)}`}
              />
              {currentStep >= 2 && (
                <TimelineItem
                  done
                  label="Packed by admin"
                  detail="Same day"
                />
              )}
              {currentStep >= 3 && (
                <TimelineItem
                  done
                  label={`Shipped via ${order.courier}`}
                  detail={order.trackingId ?? ""}
                />
              )}
              {currentStep >= 4 && (
                <TimelineItem
                  done
                  label="Delivered to customer"
                  detail={order.updatedAt}
                  last
                />
              )}
              {currentStep < 4 && (
                <TimelineItem
                  label="Awaiting delivery"
                  detail="In progress"
                  last
                />
              )}
            </ol>
          </section>
        </div>

        {/* ============ FOOTER ============ */}
        <div className="flex shrink-0 flex-wrap gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Link
            href={`/reseller/dashboard/orders/${order.id}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
          >
            📄 Open Full Page
          </Link>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            🖨️ Print Invoice
          </button>
          {order.trackingId && (
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              🚚 Track Shipment
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function DetailRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold text-slate-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function SummaryRow({ label, value, strong, muted }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className={`text-xs ${muted ? "text-slate-400" : "text-slate-600"}`}>
        {label}
      </dt>
      <dd
        className={`tabular-nums ${
          strong
            ? "text-base font-bold text-slate-900"
            : "text-sm font-semibold text-slate-700"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineItem({ done, label, detail, last }) {
  return (
    <li className="relative flex items-start gap-3 pb-4 last:pb-0">
      {!last && (
        <span
          className={`absolute left-[10px] top-5 h-full w-0.5 ${
            done ? "bg-emerald-500" : "bg-slate-200"
          }`}
        />
      )}
      <span
        className={`relative grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-200 bg-white"
        }`}
      >
        {done && (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>
          {label}
        </p>
        {detail && (
          <p className={`text-xs ${done ? "text-slate-500" : "text-slate-400"}`}>
            {detail}
          </p>
        )}
      </div>
    </li>
  );
}