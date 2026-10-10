"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

/* ============================================================
   HARDCODED DATA — replace with API later
   waitingOn: "you" = reseller must reply, "support" = admin's turn
   ============================================================ */
const TICKETS = [
  {
    id: "TKT-1024",
    subject: "Payout delayed for January",
    reason: "payout",
    status: "open",
    waitingOn: "support",
    orderId: "RS-1024",
    updatedAt: "30 min ago",
    messageCount: 4,
    lastMessage: "Support: We're checking with the bank now.",
  },
  {
    id: "TKT-1023",
    subject: "Order #RS-1019 not confirmed",
    reason: "order",
    status: "in_progress",
    waitingOn: "support",
    orderId: "RS-1019",
    updatedAt: "4 hours ago",
    messageCount: 3,
    lastMessage: "You: Customer received but system shows pending",
  },
  {
    id: "TKT-1021",
    subject: "Product images are not loading",
    reason: "technical",
    status: "open",
    waitingOn: "you",
    orderId: null,
    updatedAt: "6 hours ago",
    messageCount: 2,
    lastMessage: "Support: Can you share a screenshot of the page?",
  },
  {
    id: "TKT-1022",
    subject: "Cannot update profile picture",
    reason: "account",
    status: "resolved",
    waitingOn: null,
    orderId: null,
    updatedAt: "2 days ago",
    messageCount: 6,
    lastMessage: "Support: Fixed. Please try again now.",
  },
];

const REASONS = [
  { id: "order", label: "Order", icon: "📦", hint: "Include the order ID so we can find it faster." },
  { id: "payout", label: "Payout", icon: "💸", hint: "Payouts arrive in 2-3 business days (Friday–Saturday excluded)." },
  { id: "product", label: "Product", icon: "🏷️", hint: "Add the product name or link to help us locate it." },
  { id: "account", label: "Account", icon: "👤", hint: "Tell us which page you were on when the issue happened." },
  { id: "technical", label: "Technical", icon: "🛠️", hint: "A screenshot helps us resolve faster." },
  { id: "other", label: "Something else", icon: "💬", hint: "Just describe it clearly — we'll help." },
];

const FAQ = [
  { q: "How long does a payout take?", a: "2-3 business days after the request (Friday & Saturday excluded)." },
  { q: "When will I get a refund for a cancelled order?", a: "Within 1-2 days, the amount returns to your wallet." },
  { q: "What is the commission rate?", a: "5-10% depending on the category. Each product shows its rate." },
  { q: "How do I update my bank details?", a: "Go to Profile → Bank Details and update the account name and number." },
];

const STATUS_LABEL = { open: "Open", in_progress: "In progress", resolved: "Resolved" };
const STATUS_DOT = { open: "bg-red-500", in_progress: "bg-amber-500", resolved: "bg-emerald-500" };

const reasonOf = (id) => REASONS.find((r) => r.id === id);

function isSupportOnline() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === "weekday")?.value;
  const h = Number(parts.find((p) => p.type === "hour")?.value) % 24;
  return wd !== "Fri" && h >= 10 && h < 20;
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function SupportPage() {
  const [tickets, setTickets] = useState(TICKETS);
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [toast, setToast] = useState(null);
  const [online, setOnline] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setOnline(isSupportOnline());
    const t = setInterval(() => setOnline(isSupportOnline()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim();

  const answers = useMemo(() => {
    const s = q.toLowerCase();
    if (!s) return [];
    return FAQ.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(s));
  }, [q]);

  const groups = useMemo(
    () => ({
      you: tickets.filter((t) => t.status !== "resolved" && t.waitingOn === "you"),
      support: tickets.filter((t) => t.status !== "resolved" && t.waitingOn !== "you"),
      resolved: tickets.filter((t) => t.status === "resolved"),
    }),
    [tickets]
  );

  const handleCreated = (ticket) => {
    setTickets((prev) => [ticket, ...prev]);
    setDrawer(null);
    setQuery("");
    setToast(`Ticket ${ticket.id} opened`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl sm:right-6 sm:top-6"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-xs">✓</span>
          {toast}
        </div>
      )}

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-6 py-12 text-white sm:px-12 sm:py-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Subtle dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative">
          <div className="mx-auto flex max-w-xl items-center justify-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-orange-500/20 text-xs">
              🎧
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300">
              Support Center
            </span>
          </div>
          <h1 className="mx-auto mt-3 max-w-xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-white/60">
            Search for an answer first. If it's not there, we'll open a ticket together.
          </p>

          {/* Search bar */}
          <div className="relative mx-auto mt-7 max-w-xl">
            <svg
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — payout, order, commission..."
              aria-label="Search help"
              className="w-full rounded-2xl border-0 bg-white py-4 pr-12 text-base text-slate-900 shadow-xl outline-none ring-2 ring-transparent transition-all placeholder:text-slate-400 focus:ring-orange-500"
              style={{ paddingLeft: "3.25rem" }}
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-400 sm:block">
              /
            </kbd>
          </div>

          {/* Search results OR topic pills */}
          <div className="mx-auto mt-4 max-w-xl">
            {q ? (
              <div className="overflow-hidden rounded-2xl bg-white text-left text-slate-900 shadow-xl">
                {answers.map((f) => (
                  <div key={f.q} className="border-b border-slate-100 px-5 py-4">
                    <p className="text-sm font-semibold">{f.q}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{f.a}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setDrawer({ reason: "other", subject: q })}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="text-sm text-slate-600">
                    {answers.length ? "Still need help?" : "No answer found."}{" "}
                    <span className="font-semibold text-orange-600">
                      Ask about "{q.length > 28 ? `${q.slice(0, 28)}…` : q}"
                    </span>
                  </span>
                  <span className="text-slate-400">›</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                {REASONS.slice(0, 5).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setDrawer({ reason: r.id, subject: "" })}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
                  >
                    <span>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Online status */}
          <p className="mt-7 flex items-center justify-center gap-2 text-[13px] text-white/50">
            <span
              className={`h-2 w-2 rounded-full ${
                online === null
                  ? "bg-white/30"
                  : online
                  ? "bg-emerald-400"
                  : "bg-white/40"
              }`}
            />
            {online === null
              ? "Checking support hours..."
              : online
              ? "Support is online — usually replies in 4 hours"
              : "Support is offline — back Saturday to Thursday, 10 AM to 8 PM"}
          </p>
        </div>
      </section>

      {/* ============ YOUR TICKETS ============ */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Your tickets
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-500">
              {tickets.length === 0
                ? "No tickets yet"
                : `${tickets.length} total · ${
                    groups.you.length + groups.support.length
                  } active`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDrawer({ reason: "order", subject: "" })}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
          >
            <span className="text-base leading-none">+</span>
            New ticket
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
            <p className="text-3xl">🎫</p>
            <p className="mt-3 text-sm font-medium text-slate-900">No tickets yet</p>
            <p className="mt-1 text-xs text-slate-500">
              If something goes wrong, open a ticket and we'll reply here.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {groups.you.length > 0 && (
              <TicketGroup
                title="Needs your reply"
                tone="orange"
                items={groups.you}
              />
            )}
            {groups.support.length > 0 && (
              <TicketGroup title="With support" items={groups.support} />
            )}
            {groups.resolved.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowResolved((v) => !v)}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  <span
                    className={`inline-block transition-transform ${
                      showResolved ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                  {showResolved ? "Hide" : "Show"} {groups.resolved.length} resolved
                </button>
                {showResolved && (
                  <div className="mt-3">
                    <TicketGroup items={groups.resolved} muted />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ============ FAQ ============ */}
      {!q && (
        <section className="pb-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Quick answers
          </h2>
          <div className="mt-4 grid gap-2.5">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 transition-all open:border-orange-300 open:bg-orange-50/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 transition-all group-open:rotate-45 group-open:bg-orange-500 group-open:text-white">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {drawer && (
        <NewTicketDrawer
          initialReason={drawer.reason}
          initialSubject={drawer.subject}
          onClose={() => setDrawer(null)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

/* ============================================================
   TICKET GROUP + ROW
   ============================================================ */
function TicketGroup({ title, tone, items, muted }) {
  return (
    <div>
      {title && (
        <p
          className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
            tone === "orange" ? "text-orange-700" : "text-slate-700"
          }`}
        >
          {tone === "orange" && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
          )}
          {title}
          <span className="font-normal tabular-nums text-slate-400">
            {items.length}
          </span>
        </p>
      )}
      <ul
        className={`divide-y divide-slate-100 overflow-hidden rounded-2xl border bg-white ${
          tone === "orange" ? "border-orange-200" : "border-slate-200"
        } ${muted ? "opacity-80" : ""}`}
      >
        {items.map((t) => (
          <TicketRow key={t.id} t={t} />
        ))}
      </ul>
    </div>
  );
}

function TicketRow({ t }) {
  const reason = reasonOf(t.reason);
  const yourTurn = t.waitingOn === "you" && t.status !== "resolved";

  return (
    <li>
      <Link
        href={`/reseller/dashboard/support/${t.id}`}
        className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500 sm:px-5"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-xl">
          {reason?.icon ?? "🎫"}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[15px] font-semibold text-slate-900">
              {t.subject}
            </p>
            {yourTurn && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                Your turn
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">{t.lastMessage}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="font-mono">{t.id}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
              {STATUS_LABEL[t.status]}
            </span>
            {t.orderId && <span>Order {t.orderId}</span>}
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-1 text-[11px] text-slate-400 sm:flex">
          <span>{t.updatedAt}</span>
          <span className="inline-flex items-center gap-1">
            <span>💬</span>
            {t.messageCount}
          </span>
        </div>

        <span className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500">
          ›
        </span>
      </Link>
    </li>
  );
}

/* ============================================================
   NEW TICKET DRAWER
   ============================================================ */
const MAX_FILES = 3;
const MAX_MB = 5;
const MAX_MESSAGE = 1000;

function NewTicketDrawer({ initialReason, initialSubject, onClose, onCreated }) {
  const [form, setForm] = useState({
    reason: initialReason,
    orderId: "",
    subject: initialSubject,
    message: "",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [entered, setEntered] = useState(false);
  const subjectRef = useRef(null);
  const fileRef = useRef(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const canSubmit = form.subject.trim() && form.message.trim() && !submitting;
  const reason = reasonOf(form.reason);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    subjectRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, submitting]);

  const addFiles = (list) => {
    const picked = Array.from(list);
    const tooBig = picked.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) return setError(`${tooBig.name} is larger than ${MAX_MB} MB.`);
    if (files.length + picked.length > MAX_FILES)
      return setError(`You can attach up to ${MAX_FILES} files.`);
    setError(null);
    setFiles((p) => [...p, ...picked]);
  };

  const submit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setTimeout(() => {
      const id = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
      onCreated({
        id,
        subject: form.subject.trim(),
        reason: form.reason,
        status: "open",
        waitingOn: "support",
        orderId: form.orderId.trim() || null,
        updatedAt: "Just now",
        messageCount: 1,
        lastMessage: `You: ${form.message.slice(0, 60)}${form.message.length > 60 ? "..." : ""}`,
      });
    }, 600);
  };

  const field =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
  const label = "text-xs font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      {/* Backdrop with blur */}
      <div
        onClick={() => !submitting && onClose()}
        className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-ticket-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-slate-100 px-6 pb-5 pt-6">
          {/* Subtle top accent */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />

          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-xl">
              {reason?.icon ?? "🎫"}
            </span>
            <div>
              <h2
                id="new-ticket-title"
                className="text-lg font-semibold tracking-tight text-slate-900"
              >
                New ticket
              </h2>
              <p className="mt-0.5 text-[13px] text-slate-500">
                Our team replies here in the ticket.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {/* Reason pills */}
          <div>
            <span className={label}>What is it about?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {REASONS.map((r) => {
                const on = form.reason === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => set("reason", r.id)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      on
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    <span>{r.icon}</span>
                    {r.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 rounded-xl bg-orange-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700">
              💡 {reason.hint}
            </p>
          </div>

          <label className="block">
            <span className={label}>Subject</span>
            <input
              ref={subjectRef}
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              placeholder="Payout not received"
              maxLength={90}
              className={field}
            />
          </label>

          <label className="block">
            <span className={label}>
              Order ID <span className="text-slate-400">(if any)</span>
            </span>
            <input
              value={form.orderId}
              onChange={(e) => set("orderId", e.target.value)}
              placeholder="RS-1024"
              className={field}
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between">
              <span className={label}>Details</span>
              <span className="text-[11px] tabular-nums text-slate-400">
                {form.message.length}/{MAX_MESSAGE}
              </span>
            </span>
            <textarea
              rows={5}
              value={form.message}
              maxLength={MAX_MESSAGE}
              onChange={(e) => set("message", e.target.value)}
              placeholder="What happened, and what did you expect?"
              className={`${field} resize-none`}
            />
          </label>

          <div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={files.length >= MAX_FILES}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                📎 Attach screenshot or PDF
              </button>
              {files.map((f, i) => (
                <span
                  key={`${f.name}-${i}`}
                  className="inline-flex max-w-[11rem] items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-xs text-slate-700"
                >
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                    className="grid h-4 w-4 cursor-pointer place-items-center rounded-full text-[10px] text-slate-500 hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Up to {MAX_FILES} files, {MAX_MB} MB each.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="flex-[1.6] cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
          >
            {submitting ? "Opening..." : "Open ticket"}
          </button>
        </div>
      </aside>
    </div>
  );
}