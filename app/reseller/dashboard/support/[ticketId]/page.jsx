"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ============================================================
   HARDCODED MESSAGES — পরে API দিয়ে replace করবা
   sender: "you" | "admin" | "system"
   ============================================================ */
const TICKET_INFO = {
  id: "TKT-1024",
  subject: "Payout delayed for January",
  reason: "Payout",
  status: "open", // open | in_progress | resolved
  orderId: "RS-1024",
  opened: "Feb 12, 2026 · 10:30 AM",
  updatedAt: "30 min ago",
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "you",
    name: "Sadia Islam",
    text: "Hi, I requested a payout of ৳15,000 on Feb 5. It's been 7 days and I haven't received it.",
    createdAt: "2026-02-12T10:30:00Z",
  },
  {
    id: 2,
    sender: "admin",
    name: "Support Team",
    text: "Hi Sadia, thanks for reaching out. I've checked your request — it was processed on Feb 6. Let me verify with the bank.",
    createdAt: "2026-02-12T11:15:00Z",
  },
  {
    id: "s1",
    sender: "system",
    text: "Status changed to In progress",
    createdAt: "2026-02-12T11:16:00Z",
  },
  {
    id: 3,
    sender: "you",
    name: "Sadia Islam",
    text: "Yes, it's ****4567 — Dutch-Bangla Bank.",
    createdAt: "2026-02-12T11:20:00Z",
  },
  {
    id: 4,
    sender: "admin",
    name: "Support Team",
    text: "I see the issue — the bank flagged a name mismatch. Your KYC name is 'Sadia Islam' but the account holder is 'Sadia I.' Please update in Profile → Bank Details.",
    createdAt: "2026-02-12T12:05:00Z",
  },
];

const STATUS_META = {
  open: { label: "Open", cls: "bg-red-500/15 text-red-200", dot: "bg-red-400", step: 0 },
  in_progress: { label: "In progress", cls: "bg-amber-400/15 text-amber-200", dot: "bg-amber-400", step: 1 },
  resolved: { label: "Resolved", cls: "bg-brand-teal/20 text-emerald-200", dot: "bg-brand-teal", step: 2 },
};

const STEPS = ["Opened", "In progress", "Resolved"];

const QUICK_REPLIES = [
  "Done, please check again.",
  "I'm still facing the issue.",
  "Thanks, that worked!",
];

const MAX_FILES = 3;
const MAX_MB = 5;

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const dayLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [status, setStatus] = useState(TICKET_INFO.status);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [reply, setReply] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [confirmResolve, setConfirmResolve] = useState(false);
  const [rating, setRating] = useState(null); // "up" | "down" | null
  const bottomRef = useRef(null);
  const firstRender = useRef(true);
  const timers = useRef([]);

  const meta = STATUS_META[status];
  const isClosed = status === "resolved";
  const id = ticketId ?? TICKET_INFO.id;
  const realMessages = messages.filter((m) => m.sender !== "system");

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Auto scroll on new message (not on first load)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typing]);

  const addSystem = (text) =>
    setMessages((p) => [
      ...p,
      { id: `sys-${Date.now()}`, sender: "system", text, createdAt: new Date().toISOString() },
    ]);

  const addFiles = (list) => {
    const picked = Array.from(list);
    const tooBig = picked.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) return setSendError(`${tooBig.name} is larger than ${MAX_MB} MB.`);
    if (files.length + picked.length > MAX_FILES)
      return setSendError(`You can attach up to ${MAX_FILES} files.`);
    setSendError(null);
    setFiles((p) => [...p, ...picked]);
  };

  const canSend = (reply.trim() || files.length) && !sending;

  const send = () => {
    const text = reply.trim();
    if (!canSend) return;

    // Optimistic — add immediately
    const temp = {
      id: `tmp-${Date.now()}`,
      sender: "you",
      name: "Sadia Islam",
      text,
      files: files.map((f) => f.name),
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setSending(true);
    setSendError(null);
    setReply("");
    setFiles([]);
    setMessages((prev) => [...prev, temp]);

    // Simulate API call — পরে real API বসাবা
    later(() => {
      setMessages((prev) => prev.map((m) => (m.id === temp.id ? { ...m, pending: false } : m)));
      setSending(false);

      // Fake admin typing → reply
      setTyping(true);
      later(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "admin",
            name: "Support Team",
            text: "Thanks for the update. We'll get back to you shortly.",
            createdAt: new Date().toISOString(),
          },
        ]);
      }, 1800);
    }, 500);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  };

  const resolve = () => {
    setStatus("resolved");
    setConfirmResolve(false);
    addSystem("You marked this ticket as resolved");
  };

  const reopen = () => {
    setStatus("open");
    setRating(null);
    addSystem("You reopened this ticket");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <Link
        href="/reseller/dashboard/support"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-ink/55 transition-colors hover:text-ink"
      >
        ← All tickets
      </Link>

      {/* ============ HEADER ============ */}
      <header className="rounded-3xl bg-brand-navy p-5 text-white sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-white/50">{id}</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.cls}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">
              {TICKET_INFO.subject}
            </h1>
            <p className="mt-1 text-sm text-white/55">
              {TICKET_INFO.reason} · Opened {TICKET_INFO.opened}
            </p>
          </div>

          {!isClosed &&
            (confirmResolve ? (
              <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5 pl-3 text-sm">
                <span className="text-white/75">Problem solved?</span>
                <button
                  type="button"
                  onClick={resolve}
                  className="cursor-pointer rounded-lg bg-brand-teal px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                >
                  Yes, resolve
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResolve(false)}
                  className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  Not yet
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResolve(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span aria-hidden>✓</span> Mark as resolved
              </button>
            ))}
        </div>

        <Stepper step={meta.step} />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* ============ THREAD ============ */}
        <section className="flex min-w-0 flex-col">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:p-6">
            {messages.map((m, i) => {
              const day = dayLabel(m.createdAt);
              const prevDay = i > 0 ? dayLabel(messages[i - 1].createdAt) : null;
              return (
                <div key={m.id} className="flex flex-col gap-4">
                  {day !== prevDay && (
                    <div className="flex items-center gap-3 text-[11px] text-ink/40">
                      <span className="h-px flex-1 bg-line" />
                      {day}
                      <span className="h-px flex-1 bg-line" />
                    </div>
                  )}
                  {m.sender === "system" ? <SystemNote m={m} /> : <Bubble m={m} />}
                </div>
              );
            })}

            {typing && <Typing />}
            <div ref={bottomRef} />
          </div>

          {isClosed ? (
            <div className="mt-4 rounded-2xl border border-brand-teal/30 bg-brand-teal/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-teal text-sm text-white">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">This ticket is resolved.</p>
                    <p className="mt-0.5 text-[13px] text-ink/60">
                      Problem back?{" "}
                      <button
                        type="button"
                        onClick={reopen}
                        className="cursor-pointer font-semibold text-brand-orange underline hover:text-brand-orange-dark"
                      >
                        Reopen this ticket
                      </button>{" "}
                      or{" "}
                      <Link
                        href="/reseller/dashboard/support"
                        className="font-semibold text-brand-orange underline hover:text-brand-orange-dark"
                      >
                        open a new one
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-ink/70">
                  {rating ? (
                    <span className="font-medium">Thanks for the feedback.</span>
                  ) : (
                    <>
                      <span>Was support helpful?</span>
                      {[
                        ["up", "👍"],
                        ["down", "👎"],
                      ].map(([v, icon]) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRating(v)}
                          aria-label={v === "up" ? "Helpful" : "Not helpful"}
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-line bg-white transition-colors hover:border-brand-navy"
                        >
                          {icon}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Composer
              value={reply}
              onChange={setReply}
              onSend={send}
              onKeyDown={onKeyDown}
              canSend={!!canSend}
              sending={sending}
              error={sendError}
              files={files}
              onAddFiles={addFiles}
              onRemoveFile={(i) => setFiles((p) => p.filter((_, j) => j !== i))}
            />
          )}
        </section>

        {/* ============ INFO PANEL ============ */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-4">
            <p className="text-sm font-semibold text-ink">Ticket details</p>
            <dl className="mt-3 divide-y divide-line">
              {[
                ["Topic", TICKET_INFO.reason],
                ["Opened", TICKET_INFO.opened],
                ["Last update", TICKET_INFO.updatedAt],
                ["Messages", realMessages.length],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-2.5 text-[13px]">
                  <dt className="text-ink/50">{k}</dt>
                  <dd className="truncate text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            {TICKET_INFO.orderId && (
              <Link
                href={`/reseller/dashboard/orders`}
                className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-brand-cream px-3.5 py-3 transition-colors hover:bg-brand-cream/70"
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className="text-lg">📦</span>
                  <span>
                    <span className="block text-[11px] text-ink/50">Linked order</span>
                    <span className="block text-[13px] font-semibold text-ink">
                      {TICKET_INFO.orderId}
                    </span>
                  </span>
                </span>
                <span aria-hidden className="text-ink/35">›</span>
              </Link>
            )}

            <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
              Support usually replies within 4 hours, Saturday to Thursday.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   STEPPER
   ============================================================ */
function Stepper({ step }) {
  return (
    <ol className="mt-6 flex items-center" aria-label="Ticket progress">
      {STEPS.map((label, i) => {
        const done = i < step || step === 2;
        const current = i === step && step !== 2;
        return (
          <li
            key={label}
            className="flex flex-1 items-center gap-2.5 last:flex-none"
            aria-current={current ? "step" : undefined}
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                done
                  ? "bg-brand-teal text-white"
                  : current
                    ? "bg-brand-orange text-white ring-4 ring-brand-orange/25"
                    : "border border-white/25 text-white/40"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`text-xs font-medium ${done || current ? "text-white" : "text-white/40"}`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`mx-1 h-px flex-1 ${i < step ? "bg-brand-teal" : "bg-white/20"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ============================================================
   SYSTEM NOTE
   ============================================================ */
function SystemNote({ m }) {
  return (
    <p className="mx-auto rounded-full bg-brand-cream px-3.5 py-1 text-[11px] text-ink/55">
      {m.text} · {formatTime(m.createdAt)}
    </p>
  );
}

/* ============================================================
   TYPING INDICATOR
   ============================================================ */
function Typing() {
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-navy text-[11px] font-semibold text-white">
        ST
      </span>
      <span className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-brand-cream px-4 py-3.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            style={{ animationDelay: `${d}ms` }}
            className="h-1.5 w-1.5 rounded-full bg-ink/40 motion-safe:animate-bounce"
          />
        ))}
        <span className="sr-only">Support is typing</span>
      </span>
    </div>
  );
}

/* ============================================================
   BUBBLE
   ============================================================ */
function Bubble({ m }) {
  const mine = m.sender === "you";
  return (
    <div className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}>
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
          mine ? "bg-brand-orange/15 text-brand-orange-dark" : "bg-brand-navy text-white"
        }`}
      >
        {initials(m.name)}
      </span>

      <div className={`flex max-w-[82%] flex-col ${mine ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2 text-[11px] text-ink/45">
          <span className="font-medium text-ink/70">{mine ? "You" : m.name}</span>
          <span>{m.pending ? "Sending…" : formatTime(m.createdAt)}</span>
        </div>

        {m.text && (
          <p
            className={`mt-1 whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              mine
                ? "rounded-tr-md bg-brand-navy text-white"
                : "rounded-tl-md bg-brand-cream text-ink"
            } ${m.pending ? "opacity-60" : ""}`}
          >
            {m.text}
          </p>
        )}

        {m.files?.length > 0 && (
          <div className={`mt-1.5 flex flex-wrap gap-1.5 ${mine ? "justify-end" : ""}`}>
            {m.files.map((f, i) => (
              <span
                key={`${f}-${i}`}
                className="inline-flex max-w-[12rem] items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs text-ink/70"
              >
                📎 <span className="truncate">{f}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   COMPOSER
   ============================================================ */
function Composer({
  value,
  onChange,
  onSend,
  onKeyDown,
  canSend,
  sending,
  error,
  files,
  onAddFiles,
  onRemoveFile,
}) {
  const fileRef = useRef(null);

  return (
    <div className="sticky bottom-4 mt-4 rounded-2xl border border-line bg-white p-3 shadow-lg shadow-ink/5">
      {/* Quick replies */}
      {!value && (
        <div className="mb-2 flex gap-2 overflow-x-auto px-1 pb-1">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChange(q)}
              className="shrink-0 cursor-pointer rounded-full border border-line px-3 py-1 text-xs text-ink/65 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Write a reply"
        aria-label="Write a reply"
        className="w-full resize-none rounded-xl bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-ink/35"
      />

      {files.length > 0 && (
        <div className="mx-2 mb-2 flex flex-wrap gap-1.5">
          {files.map((f, i) => (
            <span
              key={`${f.name}-${i}`}
              className="inline-flex max-w-[11rem] items-center gap-1.5 rounded-full bg-brand-cream py-1 pl-3 pr-1.5 text-xs text-ink/70"
            >
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => onRemoveFile(i)}
                className="grid h-4 w-4 cursor-pointer place-items-center rounded-full text-[10px] text-ink/50 hover:bg-ink/10"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="mx-2 mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              onAddFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={files.length >= MAX_FILES}
            aria-label="Attach file"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-base text-ink/50 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            📎
          </button>
          <span className="hidden text-[11px] text-ink/40 sm:block">Ctrl + Enter to send</span>
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-orange px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/30"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}