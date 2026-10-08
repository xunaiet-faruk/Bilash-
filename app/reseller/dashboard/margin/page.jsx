"use client";

import { useEffect, useState } from "react";

// ==================== DEMO DATA ====================
// আসল project এ এই product টা admin এর data থেকে আসবে।
// wholesalePrice = admin এর দেওয়া দাম (reseller এর cost)
// marginOptions  = admin এর ঠিক করা profit % (reseller এর কাছে আসে)
const DEMO_PRODUCT = {
  id: "EB-204",
  name: "Wireless Earbuds Pro",
  image: "",
  wholesalePrice: 500,
  marginOptions: [20, 30],
};

// ==================== HELPERS ====================
const fmt = (n) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(
    Math.round(n || 0)
  );

const compact = (n) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(n || 0));

const priceFor = (cost, marginPct) => Math.round(cost / (1 - marginPct / 100));

const QTY_STEPS = [1, 5, 10, 25, 50, 100];

/*
  "Accept offer" চাপলে onAccept এ এই object যাবে।
  এটা দিয়ে আপনার API তে admin এর notification বানাবেন:

  {
    productId, productName,
    costPrice,          // admin এর দাম
    sellingPrice,       // reseller এর ঠিক করা দাম
    profitPerPiece,
    marginPercent,
    plannedQty,         // কয়টা বেচার plan
    expectedTotalProfit,
    note                // admin এর জন্য reseller এর মেসেজ (খালিও হতে পারে)
  }

  onAccept একটা Promise ফেরত দেবে। fail করলে throw করবেন, তাহলে error দেখাবে।
*/

// ==================== MAIN ====================
export default function MarginCalculatorPage({ product = DEMO_PRODUCT, onAccept } = {}) {
  const item = product && product.wholesalePrice ? product : DEMO_PRODUCT;
  const cost = Number(item.wholesalePrice) || 0;
  const options = item.marginOptions || [];
  const minOpt = options.length ? Math.min(...options) : null;
  const maxOpt = options.length ? Math.max(...options) : null;

  // ---------- state ----------
  const [pick, setPick] = useState(options.length ? 0 : "custom");
  const [customIn, setCustomIn] = useState("");
  const [qty, setQty] = useState(10);
  const [goalIn, setGoalIn] = useState("");
  const [note, setNote] = useState("");
  // idle | confirm | sending | error | sent
  const [status, setStatus] = useState("idle");
  const locked = status === "sent";

  const setQtyClean = (v) =>
    setQty(Math.max(1, Math.floor(Number(v)) || 1));

  // ---------- single source of truth ----------
  const selling =
    pick === "custom"
      ? Number(customIn) || 0
      : priceFor(cost, options[pick]);

  const valid = selling > 0;
  const profit = valid ? selling - cost : 0;
  const margin = valid ? (profit / selling) * 100 : 0;
  const markup = cost > 0 && valid ? (profit / cost) * 100 : 0;
  const canAccept = valid && profit > 0;

  const totalSales = valid ? selling * qty : 0;
  const totalCost = cost * qty;
  const totalProfit = valid ? profit * qty : 0;

  const goal = Number(goalIn) || 0;
  const needPieces = profit > 0 && goal > 0 ? Math.ceil(goal / profit) : 0;

  // ---------- verdict ----------
  let verdict = null;
  if (valid) {
    if (profit < 0)
      verdict = {
        tone: "bad",
        title: "You will lose money",
        text: `This price is ৳${fmt(-profit)} below what admin charges you. Raise your price.`,
      };
    else if (profit === 0)
      verdict = {
        tone: "bad",
        title: "No profit at this price",
        text: "You are selling at the admin price. Delivery or return costs will come out of your pocket.",
      };
    else if (minOpt !== null && margin < minOpt - 0.05)
      verdict = {
        tone: "warn",
        title: `Lower than admin's ${minOpt}%`,
        text: "You earn less than the admin offers. Fine for a quick sale, but thin if there are returns.",
      };
    else if (maxOpt !== null && margin > maxOpt + 0.05)
      verdict = {
        tone: "warn",
        title: `Higher than admin's ${maxOpt}%`,
        text: "More profit per sale, but check other shops first. A high price can slow down sales.",
      };
    else
      verdict = {
        tone: "good",
        title: "Good price",
        text:
          minOpt !== null
            ? "This is inside the profit range admin offers."
            : "This is a healthy profit for most products.",
      };
  }

  const toneColor =
    verdict?.tone === "good"
      ? "var(--color-brand-teal)"
      : verdict
      ? "var(--color-brand-orange-dark)"
      : "var(--color-ink)";

  const tagBg = !valid
    ? "rgba(27,31,39,0.12)"
    : profit <= 0
    ? "var(--color-brand-orange-dark)"
    : "var(--color-brand-orange)";

  const maxEarn = profit > 0 ? profit * QTY_STEPS[QTY_STEPS.length - 1] : 0;
  const adminPct = valid && profit > 0 ? (cost / selling) * 100 : 100;

  // ---------- how-it-works steps ----------
  const steps = [
    { title: "Admin sets price and profit", done: true },
    { title: "Check what you earn", done: canAccept },
    { title: "Accept. Admin gets notified", done: locked },
  ];
  const currentStep = steps.findIndex((s) => !s.done);

  // ---------- actions ----------
  const send = async () => {
    setStatus("sending");
    const payload = {
      productId: item.id,
      productName: item.name,
      costPrice: cost,
      sellingPrice: selling,
      profitPerPiece: profit,
      marginPercent: Number(margin.toFixed(2)),
      plannedQty: qty,
      expectedTotalProfit: totalProfit,
      note: note.trim(),
    };
    try {
      if (onAccept) await onAccept(payload);
      else await new Promise((r) => setTimeout(r, 900)); // demo
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  // Escape দিয়ে dialog বন্ধ
  useEffect(() => {
    if (status !== "confirm" && status !== "error") return;
    const onKey = (e) => {
      if (e.key === "Escape") setStatus("idle");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status]);

  const dialogOpen =
    status === "confirm" || status === "sending" || status === "error";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-3xl bg-[var(--color-brand-cream)] p-4 sm:p-6">
      {/* ========== PRODUCT STRIP ========== */}
      <div className="flex items-center gap-4 rounded-2xl bg-[var(--color-brand-navy)] p-4 text-white">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-navy-light)] text-xl font-bold text-white/80">
            {item.name?.[0] || "P"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{item.name}</p>
          <p className="mt-0.5 text-xs text-white/55">New product offer from admin</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-white/55">Admin price (your cost)</p>
          <p className="text-xl font-bold tabular-nums">৳{fmt(cost)}</p>
        </div>
      </div>

      {/* ========== HOW IT WORKS ========== */}
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((s, i) => {
          const current = i === currentStep;
          return (
            <li
              key={s.title}
              className="flex flex-col items-start gap-2 rounded-xl bg-white/70 p-3"
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                  s.done
                    ? "bg-[var(--color-brand-teal)] text-white"
                    : current
                    ? "border-2 border-[var(--color-brand-orange)] text-[var(--color-brand-orange)]"
                    : "border-2 border-[var(--color-line)] text-[var(--color-ink)]/35"
                }`}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs leading-snug ${
                  current
                    ? "font-semibold text-[var(--color-ink)]"
                    : "text-[var(--color-ink)]/60"
                }`}
              >
                {s.title}
              </span>
            </li>
          );
        })}
      </ol>

      {/* ========== ADMIN'S OFFER ========== */}
      <section>
        <h2 className="text-base font-semibold text-[var(--color-ink)]">
          Admin's profit offer for you
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          {options.length
            ? "Pick one of the profits below, or set your own selling price."
            : "Set the price you want to sell at."}
        </p>

        <div
          role="radiogroup"
          aria-label="Profit offer"
          className={`mt-3 grid grid-cols-1 gap-3 ${
            options.length >= 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {options.map((m, i) => {
            const active = pick === i;
            const p = priceFor(cost, m);
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={locked}
                onClick={() => setPick(i)}
                className={`rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] disabled:cursor-not-allowed ${
                  active
                    ? "border-[var(--color-brand-navy)] bg-[var(--color-brand-navy)] text-white"
                    : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]/30 disabled:opacity-60"
                }`}
              >
                <span
                  className={`text-xs ${
                    active ? "text-white/60" : "text-[var(--color-ink)]/50"
                  }`}
                >
                  Admin offers
                </span>
                <span className="mt-1 block text-4xl font-bold tabular-nums tracking-tight">
                  {m}%
                </span>
                <span
                  className={`mt-3 block text-sm ${
                    active ? "text-white/75" : "text-[var(--color-ink)]/60"
                  }`}
                >
                  Sell at <b className="tabular-nums">৳{fmt(p)}</b>
                </span>
                <span className="block text-sm font-semibold tabular-nums text-[var(--color-brand-teal)]">
                  You earn ৳{fmt(p - cost)} per piece
                </span>
              </button>
            );
          })}

          {/* custom price */}
          <div
            role="radio"
            aria-checked={pick === "custom"}
            aria-disabled={locked}
            tabIndex={locked ? -1 : 0}
            onClick={() => !locked && setPick("custom")}
            onKeyDown={(e) => {
              if (locked) return;
              if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
                e.preventDefault();
                setPick("custom");
              }
            }}
            className={`rounded-2xl border-2 p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] ${
              locked ? "opacity-60" : "cursor-pointer"
            } ${
              pick === "custom"
                ? "border-[var(--color-brand-orange)] bg-white"
                : "border-dashed border-[var(--color-line)] bg-white/60 hover:border-[var(--color-ink)]/30"
            }`}
          >
            <span className="text-xs text-[var(--color-ink)]/50">My own price</span>
            <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-[var(--color-brand-cream)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-brand-orange)]">
              <span className="text-lg font-semibold text-[var(--color-ink)]/35">৳</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                disabled={locked}
                value={customIn}
                onFocus={() => setPick("custom")}
                onChange={(e) => {
                  setPick("custom");
                  setCustomIn(e.target.value);
                }}
                placeholder={String(Math.round(cost * 1.25))}
                aria-label="My own selling price"
                className="w-full min-w-0 bg-transparent text-2xl font-bold tabular-nums text-[var(--color-ink)] outline-none placeholder:font-normal placeholder:text-[var(--color-ink)]/20"
              />
            </div>
            <span className="mt-3 block text-sm text-[var(--color-ink)]/60">
              {pick === "custom" && valid ? (
                <>
                  That is{" "}
                  <b className="tabular-nums" style={{ color: toneColor }}>
                    {margin.toFixed(1)}%
                  </b>{" "}
                  profit
                </>
              ) : (
                "Type the price you want to sell at"
              )}
            </span>
          </div>
        </div>
      </section>

      {/* ========== PER PIECE RESULT ========== */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4">
          <div
            className="relative py-5 pl-14 pr-6 text-white transition-colors duration-300"
            style={{
              background: tagBg,
              clipPath: "polygon(30px 0, 100% 0, 100% 100%, 30px 100%, 0 50%)",
            }}
          >
            <span className="absolute left-[26px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white" />
            <p className="text-xs text-white/80">Customer pays</p>
            <p
              className="text-4xl font-bold tabular-nums tracking-tight"
              style={{ color: valid ? "#fff" : "rgba(27,31,39,0.3)" }}
            >
              {valid ? `৳${fmt(selling)}` : "৳ —"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[var(--color-ink)]/60">
              You earn on every piece
            </p>
            <p
              className="text-4xl font-bold tabular-nums tracking-tight"
              style={{ color: valid ? toneColor : "rgba(27,31,39,0.25)" }}
            >
              {valid ? `${profit < 0 ? "−" : ""}৳${fmt(Math.abs(profit))}` : "৳ —"}
            </p>
          </div>

          <div>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
              <div
                className="h-full bg-[var(--color-brand-navy)] transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${adminPct}%` }}
              />
              <div
                className="h-full bg-[var(--color-brand-teal)] transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${100 - adminPct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-[var(--color-ink)]/60">
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-navy)]" />
                Admin gets ৳{fmt(cost)}
              </span>
              <span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--color-brand-teal)]" />
                You keep ৳{fmt(Math.max(profit, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl border-l-4 bg-white p-4"
            style={{ borderColor: valid ? toneColor : "var(--color-line)" }}
          >
            <p className="text-base font-semibold text-[var(--color-ink)]">
              {verdict ? verdict.title : "Pick a profit above"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]/65">
              {verdict
                ? verdict.text
                : "Choose one of the offers, or type your own price. Your result shows up here."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[var(--color-ink)]/55">Margin</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
                {valid ? `${margin.toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink)]/45">
                Profit out of the selling price
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4">
              <p className="text-xs text-[var(--color-ink)]/55">Markup</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
                {valid ? `${markup.toFixed(1)}%` : "—"}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink)]/45">
                Added on top of admin price
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EARNING PLAN ========== */}
      <section className="rounded-2xl border border-[var(--color-line)] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              How many pieces will you sell?
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">
              Tap a bar or type a number to see your total earning.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Fewer pieces"
              disabled={locked}
              onClick={() => setQtyClean(qty - 1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-brand-cream)] text-lg text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-line)] disabled:opacity-50"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              disabled={locked}
              value={qty}
              onChange={(e) => setQtyClean(e.target.value)}
              aria-label="Number of pieces"
              className="w-20 rounded-xl border border-[var(--color-line)] bg-white py-1.5 text-center text-base font-semibold tabular-nums outline-none focus:border-[var(--color-brand-orange)] disabled:opacity-60"
            />
            <button
              type="button"
              aria-label="More pieces"
              disabled={locked}
              onClick={() => setQtyClean(qty + 1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-brand-cream)] text-lg text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-line)] disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {/* bars */}
        {profit > 0 ? (
          <div className="mt-5 flex h-36 items-end gap-2 sm:gap-4">
            {QTY_STEPS.map((n) => {
              const total = profit * n;
              const h = Math.max((total / maxEarn) * 100, 4);
              const active = qty === n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={locked}
                  onClick={() => setQtyClean(n)}
                  aria-label={`${n} pieces, earn ৳${fmt(total)}`}
                  className="group flex h-full flex-1 flex-col items-center justify-end focus-visible:outline-none"
                >
                  <span
                    className={`mb-1 text-[11px] font-semibold tabular-nums ${
                      active
                        ? "text-[var(--color-brand-orange-dark)]"
                        : "text-[var(--color-ink)]/70"
                    }`}
                  >
                    ৳{compact(total)}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-[height,background-color] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-brand-orange)] motion-reduce:transition-none"
                    style={{
                      height: `${h}%`,
                      background: active
                        ? "var(--color-brand-orange)"
                        : "var(--color-brand-navy)",
                      opacity: active ? 1 : 0.8,
                    }}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-[var(--color-brand-cream)] p-4 text-sm text-[var(--color-ink)]/60">
            {valid
              ? `Set a price above ৳${fmt(cost)} to see how much you can earn.`
              : "Pick a profit above to see your earnings."}
          </p>
        )}
        {profit > 0 && (
          <div className="mt-2 flex gap-2 sm:gap-4">
            {QTY_STEPS.map((n) => (
              <span
                key={n}
                className="flex-1 text-center text-[11px] text-[var(--color-ink)]/50"
              >
                {n} {n === 1 ? "piece" : "pieces"}
              </span>
            ))}
          </div>
        )}

        {/* money flow for chosen qty */}
        <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-[var(--color-brand-cream)] p-4">
          <div>
            <p className="text-[11px] text-[var(--color-ink)]/55">
              Customers pay you
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
              {valid ? `৳${fmt(totalSales)}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--color-ink)]/55">
              You pay admin
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--color-ink)]">
              ৳{fmt(totalCost)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[var(--color-ink)]/55">
              You keep for {qty} {qty === 1 ? "piece" : "pieces"}
            </p>
            <p
              className="mt-0.5 text-lg font-bold tabular-nums"
              style={{ color: profit > 0 ? "var(--color-brand-teal)" : "var(--color-ink)" }}
            >
              {valid ? `${totalProfit < 0 ? "−" : ""}৳${fmt(Math.abs(totalProfit))}` : "—"}
            </p>
          </div>
        </div>

        {/* reverse: goal -> pieces */}
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-line)] p-4">
          <label
            htmlFor="goal"
            className="text-sm font-semibold text-[var(--color-ink)]"
          >
            Want to earn a target amount?
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-[var(--color-brand-cream)] px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--color-brand-orange)]">
              <span className="font-semibold text-[var(--color-ink)]/35">৳</span>
              <input
                id="goal"
                type="number"
                inputMode="decimal"
                min="0"
                disabled={locked}
                value={goalIn}
                onChange={(e) => setGoalIn(e.target.value)}
                placeholder="5000"
                className="w-28 bg-transparent text-base font-semibold tabular-nums outline-none placeholder:font-normal placeholder:text-[var(--color-ink)]/25"
              />
            </div>
            {needPieces > 0 ? (
              <>
                <p className="text-sm text-[var(--color-ink)]/70">
                  Sell <b className="tabular-nums text-[var(--color-ink)]">{fmt(needPieces)} pieces</b>{" "}
                  to earn ৳{fmt(goal)}.
                </p>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setQtyClean(needPieces)}
                  className="rounded-full bg-[var(--color-brand-navy)] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-brand-navy-light)] disabled:opacity-50"
                >
                  Use {fmt(needPieces)} pieces
                </button>
              </>
            ) : (
              <p className="text-sm text-[var(--color-ink)]/50">
                {profit > 0
                  ? "Type an amount to see how many pieces you need to sell."
                  : "Pick a price with profit first."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ========== SUMMARY + ACCEPT ========== */}
      <section className="rounded-2xl bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[var(--color-ink)]">
          Your offer summary
        </h2>

        <dl className="mt-3 divide-y divide-dashed divide-[var(--color-line)] text-sm">
          <SummaryRow label="Admin price (your cost)" value={`৳${fmt(cost)}`} />
          <SummaryRow
            label="Your selling price"
            value={valid ? `৳${fmt(selling)}` : "—"}
          />
          <SummaryRow
            label="Profit per piece"
            value={valid ? `৳${fmt(profit)} (${margin.toFixed(1)}%)` : "—"}
          />
          <SummaryRow label="Pieces you plan to sell" value={fmt(qty)} />
          <SummaryRow
            label="Total profit you can earn"
            value={canAccept ? `৳${fmt(totalProfit)}` : "—"}
            strong
          />
        </dl>

        {locked ? (
          <div className="mt-5 rounded-2xl bg-[var(--color-brand-teal)]/10 p-4">
            <p className="text-base font-semibold text-[var(--color-brand-teal)]">
              Offer accepted. Admin has been notified.
            </p>
            <ol className="mt-3 flex flex-col gap-2.5 text-sm text-[var(--color-ink)]/75">
              <TimelineItem done>You accepted this offer</TimelineItem>
              <TimelineItem done>Admin received your notification</TimelineItem>
              <TimelineItem>Waiting for admin to confirm</TimelineItem>
            </ol>
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={!canAccept}
              onClick={() => setStatus("confirm")}
              className="mt-5 w-full rounded-2xl bg-[var(--color-brand-orange)] py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)]/40 disabled:cursor-not-allowed disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30"
            >
              Accept this offer
            </button>
            <p className="mt-2 text-center text-xs text-[var(--color-ink)]/50">
              {canAccept
                ? "When you accept, admin gets a notification right away."
                : "Choose a price with profit to accept."}
            </p>
          </>
        )}
      </section>

      {/* ========== CONFIRM DIALOG ========== */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-brand-navy)]/60 p-0 sm:items-center sm:p-4"
          onClick={() => status !== "sending" && setStatus("idle")}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
          >
            <h3
              id="confirm-title"
              className="text-lg font-semibold text-[var(--color-ink)]"
            >
              Send this to admin?
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">
              Admin will get a notification that you accepted this offer.
            </p>

            <div className="mt-4 rounded-2xl bg-[var(--color-brand-cream)] p-4 text-sm">
              <p className="font-semibold text-[var(--color-ink)]">{item.name}</p>
              <p className="mt-1 text-[var(--color-ink)]/70">
                Sell at <b className="tabular-nums">৳{fmt(selling)}</b>, earn{" "}
                <b className="tabular-nums">৳{fmt(profit)}</b> per piece
              </p>
              <p className="text-[var(--color-ink)]/70">
                {fmt(qty)} pieces = ৳{fmt(totalProfit)} profit
              </p>
            </div>

            <label
              htmlFor="note"
              className="mt-4 block text-sm font-medium text-[var(--color-ink)]"
            >
              Message for admin <span className="font-normal text-[var(--color-ink)]/45">(optional)</span>
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Example: I will start selling from next week."
              className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-line)] p-3 text-sm outline-none placeholder:text-[var(--color-ink)]/30 focus:border-[var(--color-brand-orange)]"
            />

            {status === "error" && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-[var(--color-brand-orange)]/10 p-3 text-sm text-[var(--color-brand-orange-dark)]"
              >
                Could not send to admin. Check your internet and try again.
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={status === "sending"}
                onClick={() => setStatus("idle")}
                className="flex-1 rounded-xl border border-[var(--color-line)] py-3 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={status === "sending"}
                onClick={send}
                className="flex-[1.6] rounded-xl bg-[var(--color-brand-orange)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)] disabled:opacity-70"
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "error"
                  ? "Try again"
                  : "Accept and notify admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SMALL PIECES ====================
function SummaryRow({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-[var(--color-ink)]/60">{label}</dt>
      <dd
        className={`tabular-nums ${
          strong
            ? "text-lg font-bold text-[var(--color-brand-teal)]"
            : "font-semibold text-[var(--color-ink)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineItem({ done, children }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-[var(--color-brand-teal)] text-white"
            : "border-2 border-[var(--color-line)] text-transparent"
        }`}
      >
        ✓
      </span>
      <span className={done ? "" : "text-[var(--color-ink)]/50"}>{children}</span>
    </li>
  );
}