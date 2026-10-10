"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

/* ============================================================
   HARDCODED DATA — পরে API দিয়ে replace করবা
   waitingOn: "you" = reseller reply দিতে হবে, "support" = admin এর হাতে
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
  { id: "order", label: "Order", icon: "📦", hint: "Order ID দিলে আমরা দ্রুত খুঁজে পাব।" },
  { id: "payout", label: "Payout", icon: "💸", hint: "Withdraw request এর পর ২-৩ business days লাগে (শুক্র-শনি বাদে)।" },
  { id: "product", label: "Product", icon: "🏷️", hint: "Product এর নাম বা link দিলে সুবিধা হয়।" },
  { id: "account", label: "Account", icon: "👤", hint: "কোন page এ সমস্যা হচ্ছে সেটা লিখে দিন।" },
  { id: "technical", label: "Technical", icon: "🛠️", hint: "Screenshot attach করলে সমস্যা বুঝতে সময় কম লাগে।" },
  { id: "other", label: "Something else", icon: "💬", hint: "যা জানতে চান সহজ ভাষায় লিখে দিন।" },
];

const FAQ = [
  { q: "Payout কত দিনে আসে?", a: "Withdraw request এর পর ২-৩ business days (শুক্র-শনি বাদে)।" },
  { q: "Order cancel করলে টাকা কখন ফেরত আসবে?", a: "Cancel হওয়ার ১-২ দিনের মধ্যে wallet এ ফেরত আসে।" },
  { q: "Commission rate কত?", a: "Category অনুযায়ী ৫-১০%। প্রতি product এ দেখানো থাকে।" },
  { q: "Bank details কোথায় update করব?", a: "Profile → Bank Details এ গিয়ে account name ও number update করুন।" },
];

const STATUS_LABEL = { open: "Open", in_progress: "In progress", resolved: "Resolved" };
const STATUS_DOT = { open: "bg-red-500", in_progress: "bg-amber-500", resolved: "bg-brand-teal" };

const reasonOf = (id) => REASONS.find((r) => r.id === id);

/* Support hours: Sat–Thu, 10am–8pm (Dhaka time) */
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
  const [drawer, setDrawer] = useState(null); // { reason, subject } | null
  const [showResolved, setShowResolved] = useState(false);
  const [toast, setToast] = useState(null);
  const [online, setOnline] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setOnline(isSupportOnline());
    const t = setInterval(() => setOnline(isSupportOnline()), 60000);
    return () => clearInterval(t);
  }, []);

  // "/" focuses the search
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
    <div className="mx-auto flex max-w-4xl flex-col gap-10">
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-2xl bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-2xl sm:right-6 sm:top-6"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-teal text-xs">✓</span>
          {toast}
        </div>
      )}

      {/* ============ HELP HERO ============ */}
      <section className="rounded-[2rem] bg-brand-cream px-5 py-10 sm:px-12 sm:py-14">
        <h1 className="mx-auto max-w-xl text-center text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">
          How can we help?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-[15px] text-ink/60">
          Search for an answer first. If it's not there, we'll open a ticket together.
        </p>

        {/* Search */}
        <div className="relative mx-auto mt-7 max-w-xl">
          <svg
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Payout, order, commission…"
            aria-label="Search help"
            className="w-full rounded-2xl border border-line bg-white py-4 pl-13 pr-12 text-base text-ink shadow-sm outline-none transition-shadow placeholder:text-ink/35 focus:border-brand-orange focus:shadow-md"
            style={{ paddingLeft: "3.25rem" }}
          />
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-line px-1.5 text-[11px] text-ink/40 sm:block">
            /
          </kbd>
        </div>

        {/* Live results OR topics */}
        <div className="mx-auto mt-4 max-w-xl">
          {q ? (
            <div className="overflow-hidden rounded-2xl border border-line bg-white text-left">
              {answers.map((f) => (
                <div key={f.q} className="border-b border-line px-5 py-4">
                  <p className="text-sm font-semibold text-ink">{f.q}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{f.a}</p>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDrawer({ reason: "other", subject: q })}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-brand-cream/60"
              >
                <span className="text-sm text-ink/70">
                  {answers.length ? "Still need help?" : "No answer found."}{" "}
                  <span className="font-semibold text-brand-orange">
                    Ask support about “{q.length > 28 ? `${q.slice(0, 28)}…` : q}”
                  </span>
                </span>
                <span aria-hidden className="text-ink/35">›</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setDrawer({ reason: r.id, subject: "" })}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:border-brand-navy hover:text-brand-navy"
                >
                  <span aria-hidden>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-7 flex items-center justify-center gap-2 text-[13px] text-ink/50">
          <span
            className={`h-2 w-2 rounded-full ${
              online === null ? "bg-ink/20" : online ? "bg-brand-teal" : "bg-ink/30"
            }`}
          />
          {online === null
            ? "Checking support hours…"
            : online
              ? "Support is online. Usually replies within 4 hours."
              : "Support is offline. We reply Saturday to Thursday, 10 AM – 8 PM."}
        </p>
      </section>

      {/* ============ YOUR TICKETS ============ */}
      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Your tickets</h2>
          <button
            type="button"
            onClick={() => setDrawer({ reason: "order", subject: "" })}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
          >
            <span aria-hidden>+</span> New ticket
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
            <p className="text-sm font-medium text-ink">No tickets yet</p>
            <p className="mt-1 text-xs text-ink/50">
              If something goes wrong, open a ticket and we'll reply here.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {groups.you.length > 0 && (
              <TicketGroup title="Needs your reply" tone="orange" items={groups.you} />
            )}
            {groups.support.length > 0 && (
              <TicketGroup title="With support" items={groups.support} />
            )}
            {groups.resolved.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowResolved((v) => !v)}
                  aria-expanded={showResolved}
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink/55 transition-colors hover:text-ink"
                >
                  <span
                    aria-hidden
                    className={`inline-block transition-transform ${showResolved ? "rotate-90" : ""}`}
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
          <h2 className="text-xl font-semibold tracking-tight text-ink">Quick answers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-line bg-white px-5 py-4 open:border-brand-navy/25"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-ink/35 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{f.a}</p>
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
            tone === "orange" ? "text-brand-orange-dark" : "text-ink/70"
          }`}
        >
          {tone === "orange" && <span className="h-2 w-2 rounded-full bg-brand-orange" />}
          {title}
          <span className="font-normal tabular-nums text-ink/40">{items.length}</span>
        </p>
      )}
      <ul
        className={`divide-y divide-line overflow-hidden rounded-2xl border bg-white ${
          tone === "orange" ? "border-brand-orange/40" : "border-line"
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
  return (
    <li>
      <Link
        href={`/reseller/dashboard/support/${t.id}`}
        className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-brand-cream/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-orange sm:px-5"
      >
        <span aria-hidden className="text-xl">
          {reason?.icon ?? "🎫"}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-ink">{t.subject}</p>
          <p className="mt-0.5 truncate text-sm text-ink/55">{t.lastMessage}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/45">
            <span>{t.id}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
              {STATUS_LABEL[t.status]}
            </span>
            {t.orderId && <span>Order {t.orderId}</span>}
          </p>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-ink/45 sm:flex">
          <span>{t.updatedAt}</span>
          <span>💬 {t.messageCount}</span>
        </div>

        <span
          aria-hidden
          className="text-ink/25 transition-transform group-hover:translate-x-0.5 group-hover:text-ink/60"
        >
          ›
        </span>
      </Link>
    </li>
  );
}

/* ============================================================
   NEW TICKET DRAWER (slides in from the right)
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

  // slide-in, Esc to close, lock background scroll
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

    // Simulate network delay — পরে API call বসাবা
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
    "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-brand-orange";
  const label = "text-xs font-medium text-ink/70";

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      {/* backdrop */}
      <div
        onClick={() => !submitting && onClose()}
        className={`absolute inset-0 bg-brand-navy/50 transition-opacity duration-300 motion-reduce:transition-none ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-ticket-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
          <div>
            <h2 id="new-ticket-title" className="text-xl font-semibold tracking-tight text-ink">
              New ticket
            </h2>
            <p className="mt-1 text-[13px] text-ink/50">Our team replies here, in the ticket.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-ink/45 transition-colors hover:bg-ink/5 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
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
                    aria-pressed={on}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-line text-ink/65 hover:border-ink/30"
                    }`}
                  >
                    <span aria-hidden>{r.icon}</span>
                    {r.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 rounded-xl bg-brand-cream px-3.5 py-2.5 text-[13px] leading-relaxed text-ink/65">
              {reason.hint}
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
              Order ID <span className="text-ink/40">(if any)</span>
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
              <span className="text-[11px] tabular-nums text-ink/35">
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
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink/25 px-3.5 py-2 text-xs font-medium text-ink/65 transition-colors hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40"
              >
                📎 Attach screenshot or PDF
              </button>
              {files.map((f, i) => (
                <span
                  key={`${f.name}-${i}`}
                  className="inline-flex max-w-[11rem] items-center gap-1.5 rounded-full bg-brand-cream py-1 pl-3 pr-1.5 text-xs text-ink/70"
                >
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                    className="grid h-4 w-4 cursor-pointer place-items-center rounded-full text-[10px] text-ink/50 hover:bg-ink/10"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-ink/40">
              Up to {MAX_FILES} files, {MAX_MB} MB each.
            </p>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 cursor-pointer rounded-xl border border-line bg-white py-2.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="flex-[1.6] cursor-pointer rounded-xl bg-brand-orange py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/30"
          >
            {submitting ? "Opening…" : "Open ticket"}
          </button>
        </div>
      </aside>
    </div>
  );
}