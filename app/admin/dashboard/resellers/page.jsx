"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

/* ───────── CONFIG ───────── */
const USE_MOCK = true;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commarse-three.vercel.app";
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("access_token") || "" : "");

async function api(path, { method = "GET", body, params } = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params || {}).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(json?.message || `Request failed (${res.status})`);
  return json?.data ?? json;
}

/* ───────── HELPERS ───────── */
const cx = (...a) => a.filter(Boolean).join(" ");
const money = (n) => `৳${Number(n || 0).toLocaleString("en-IN")}`;
const initials = (s = "") => s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const BTN = {
  primary: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0",
  success: "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0",
  danger: "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40",
  teal: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition-all hover:-translate-y-0.5",
  ghost: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm disabled:opacity-50",
};

const PATHS = {
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  x: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7",
  star: "m12 3 2.6 5.6 6 .7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.2 6-.7Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5",
  crown: "m4 17 1.5-9L9 12l3-6 3 6 3.5-4L20 17H4Z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  ban: "M18.4 5.6 5.6 18.4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  shield: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3zM9 12l2 2 4-4",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  rotate: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
};
const Icon = ({ name, className = "h-4 w-4", sw = 2, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className} style={style} aria-hidden="true">
    <path d={PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ───────── KYC CHECKLIST ───────── */
const FIELDS = ["name", "dob", "nid", "tin", "bank", "face"];
const DOC_KINDS = [["profile", "Profile"], ["nid-front", "NID front"], ["nid-back", "NID back"], ["selfie", "Selfie"], ["bank", "Bank proof"]];
const mkDocs = (missing = []) => DOC_KINDS.map(([kind, k]) => ({ id: kind, kind, k, missing: missing.includes(kind) }));
const docsOf = (r) => (r.docs || mkDocs()).filter((d) => !d.missing);
const medal = ["#FFCB6B", "#C9D3DC", "#D8985A"];

/* ───────── DOCUMENT IMAGES ─────────
   Real data: put the image link in doc.url (and avatar for the profile photo).
   No url? A sample picture is drawn so the UI always has something to show. */
const Person = ({ x, y, s = 1, h }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 90 Q-60 30 0 30 Q60 30 60 90Z" fill={`hsl(${h} 35% 40%)`} />
    <circle cx="0" cy="-5" r="34" fill="#E3B58F" />
    <path d="M-36 -8 Q-36 -48 0 -48 Q36 -48 36 -8 Q20 -30 0 -30 Q-20 -30 -36 -8Z" fill="#2b2118" />
  </g>
);

function DocArt({ d, p = {} }) {
  const [bad, setBad] = useState(false);
  const photo = !bad && p.avatar ? p.avatar : null;
  if (!bad && (d.url || (d.kind === "profile" && p.avatar)))
    return <img src={d.url || p.avatar} alt={d.k || "photo"} onError={() => setBad(true)} className="h-full w-full object-cover" />;
  const nm = p.owner || p.name || "Name";
  const h = [...nm].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const nid = p.nid || "1990 0000 0000 0", dob = p.dob || "01 Jan 1990";
  const Mark = () => <text x="388" y="290" textAnchor="end" fontSize="11" fill="#737373" opacity=".6" fontFamily="sans-serif">SAMPLE</text>;
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
      {d.kind === "profile" && (<><rect width="400" height="300" fill={`hsl(${h} 40% 86%)`} /><Person x={200} y={165} s={2.1} h={h} /></>)}
      {d.kind === "selfie" && (<>
        <rect width="400" height="300" fill={`hsl(${h} 25% 82%)`} />
        {photo ? <image href={photo} x="0" y="0" width="400" height="300" preserveAspectRatio="xMidYMid slice" onError={() => setBad(true)} /> : <Person x={200} y={125} s={1.5} h={h} />}
        <g transform="rotate(-4 320 245)"><rect x="258" y="196" width="128" height="86" rx="8" fill="#fff" stroke="#0d9488" strokeWidth="3" />
          <rect x="258" y="196" width="128" height="16" rx="8" fill="#0d9488" />
          {photo ? <image href={photo} x="266" y="222" width="34" height="46" preserveAspectRatio="xMidYMid slice" /> : <rect x="266" y="222" width="34" height="46" fill={`hsl(${h} 40% 86%)`} />}
          <rect x="308" y="224" width="68" height="6" fill="#d4d4d4" /><rect x="308" y="238" width="54" height="6" fill="#d4d4d4" /><rect x="308" y="252" width="62" height="6" fill="#d4d4d4" /></g><Mark /></>)}
      {d.kind === "nid-front" && (<>
        <rect width="400" height="300" fill="#F0FDFA" /><rect width="400" height="58" fill="#0d9488" /><rect y="58" width="400" height="5" fill="#f97316" />
        <text x="24" y="36" fontSize="20" fontWeight="700" fill="#fff" fontFamily="sans-serif">NATIONAL ID CARD</text>
        <svg x="26" y="84" width="112" height="136" viewBox="0 0 112 136"><rect width="112" height="136" fill={`hsl(${h} 40% 86%)`} />{photo ? <image href={photo} width="112" height="136" preserveAspectRatio="xMidYMid slice" onError={() => setBad(true)} /> : <Person x={56} y={78} s={0.9} h={h} />}</svg>
        {[["Name", nm, 96], ["Date of birth", dob, 150], ["NID No.", nid, 204]].map(([l, v, y]) => (
          <g key={l}><text x="160" y={y} fontSize="12" fill="#737373" fontFamily="sans-serif">{l}</text><text x="160" y={y + 22} fontSize="20" fontWeight="700" fill="#171717" fontFamily="sans-serif">{v}</text></g>))}
        <Mark /></>)}
      {d.kind === "nid-back" && (<>
        <rect width="400" height="300" fill="#F0FDFA" /><rect y="26" width="400" height="44" fill="#262626" />
        <text x="26" y="100" fontSize="12" fill="#737373" fontFamily="sans-serif">Address</text>
        <text x="26" y="124" fontSize="17" fontWeight="600" fill="#171717" fontFamily="sans-serif">{p.address || p.location || "Dhaka, Bangladesh"}</text>
        <rect x="26" y="140" width="250" height="8" fill="#d4d4d4" /><rect x="26" y="158" width="190" height="8" fill="#d4d4d4" />
        {Array.from({ length: 44 }, (_, i) => <rect key={i} x={26 + i * 8} y={200} width={(i * 7) % 3 + 2} height={62} fill="#171717" />)}<Mark /></>)}
      {d.kind === "bank" && (<>
        <rect width="400" height="300" fill="#fff" /><rect width="400" height="50" fill="#f97316" />
        <text x="24" y="32" fontSize="18" fontWeight="700" fill="#fff" fontFamily="sans-serif">ACCOUNT STATEMENT</text>
        <text x="24" y="86" fontSize="12" fill="#737373" fontFamily="sans-serif">Account holder</text><text x="24" y="108" fontSize="19" fontWeight="700" fill="#171717" fontFamily="sans-serif">{nm}</text>
        <text x="24" y="140" fontSize="12" fill="#737373" fontFamily="sans-serif">Account</text><text x="24" y="162" fontSize="17" fontWeight="600" fill="#171717" fontFamily="sans-serif">{p.bank || "—"}</text>
        {[190, 214, 238].map((y) => <g key={y}><rect x="24" y={y} width="170" height="8" fill="#e5e5e5" /><rect x="300" y={y} width="76" height="8" fill="#e5e5e5" /></g>)}<Mark /></>)}
    </svg>
  );
}

const Avatar = ({ p, cls = "h-12 w-12", onClick }) => {
  const T = onClick ? "button" : "span";
  return (
    <T type={onClick ? "button" : undefined} onClick={onClick} title={onClick ? "View photo" : undefined}
      className={cx("relative block shrink-0 overflow-hidden rounded-full shadow-md ring-2 ring-white", onClick && "cursor-zoom-in transition hover:ring-orange-400", cls)}>
      <DocArt d={{ kind: "profile" }} p={p} />
    </T>
  );
};

/* ───────── IMAGE VIEWER (modal) ───────── */
function Lightbox({ docs, index, person, onClose, onIndex }) {
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const d = docs[index];
  useEffect(() => { setZoom(1); setRot(0); }, [index]);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % docs.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + docs.length) % docs.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [index, docs.length, onClose, onIndex]);
  if (!d) return null;
  const ib = "grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20";
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-neutral-950/95 backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-center justify-between gap-3 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="min-w-0 text-white">
          <p className="truncate text-sm font-bold">{d.k}</p>
          <p className="truncate text-xs text-neutral-400">{person?.name} · {index + 1} of {docs.length}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={ib} onClick={() => setZoom((z) => Math.max(1, z - 0.5))} title="Zoom out"><Icon name="minus" /></button>
          <button type="button" className={ib} onClick={() => setZoom((z) => Math.min(3, z + 0.5))} title="Zoom in"><Icon name="plus" /></button>
          <button type="button" className={ib} onClick={() => setRot((r) => r + 90)} title="Rotate"><Icon name="rotate" /></button>
          <button type="button" className={ib} onClick={onClose} title="Close"><Icon name="x" /></button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 overflow-auto px-4">
        <div onClick={(e) => e.stopPropagation()} className="m-auto aspect-[4/3] shrink-0 overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl transition-all duration-200"
          style={{ width: `min(${zoom * 92}vw, ${zoom * 860}px)`, transform: `rotate(${rot}deg)` }}>
          <DocArt d={d} p={person} />
        </div>
        {docs.length > 1 && (<>
          <button type="button" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + docs.length) % docs.length); }} className={cx(ib, "fixed left-3 top-1/2 -translate-y-1/2")}><Icon name="left" /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % docs.length); }} className={cx(ib, "fixed right-3 top-1/2 -translate-y-1/2")}><Icon name="right" /></button>
        </>)}
      </div>
      <div className="flex justify-center gap-2 p-4" onClick={(e) => e.stopPropagation()}>
        {docs.map((x, i) => (
          <button key={x.id} type="button" onClick={() => onIndex(i)} className={cx("h-14 w-[74px] cursor-pointer overflow-hidden rounded-lg ring-2 transition", i === index ? "ring-orange-500" : "opacity-60 ring-transparent hover:opacity-100")}>
            <DocArt d={x} p={person} />
          </button>
        ))}
      </div>
    </div>
  );
}
const REASONS = [
  "NID photo is blurry",
  "Name does not match account holder",
  "Selfie does not match NID",
  "Form information incomplete",
];

/* ───────── MOCK DATA (swap with API later) ───────── */
const initialApps = [
  { id: "k1", userId: "u101", avatar: "https://randomuser.me/api/portraits/men/32.jpg", resellerId: "r101", name: "Coastal Goods BD", owner: "Farhan Kabir", email: "farhan@coastalgoods.example", phone: "+880 1711-222001", location: "Cox's Bazar", applied: "2 days ago", dob: "12 Mar 1994", nid: "1994 5521 8890 1", tin: "512-884-1203", bank: "bKash 01711-222001", docs: mkDocs(["bank"]) },
  { id: "k2", userId: "u102", avatar: "https://randomuser.me/api/portraits/men/45.jpg", resellerId: "r102", name: "Prime Gadgets", owner: "Shuvo Das", email: "shuvo@primegadgets.example", phone: "+880 1811-222002", location: "Dhaka", applied: "3 days ago", dob: "30 Jan 1991", nid: "1991 7788 2200 5", tin: "623-110-8841", bank: "DBBL · 1051200098", docs: mkDocs() },
  { id: "k3", userId: "u103", avatar: "https://randomuser.me/api/portraits/women/44.jpg", resellerId: "r103", name: "Little Steps", owner: "Nabila Haque", email: "nabila@littlesteps.example", phone: "+880 1911-222003", location: "Rajshahi", applied: "5 days ago", dob: "25 Jul 1998", nid: "1998 3310 4421 7", tin: "", bank: "Nagad 01911-222003", docs: mkDocs(["nid-back", "selfie", "bank"]) },
];

const initialResellers = [
  { id: "r1", userId: "u1", avatar: "https://randomuser.me/api/portraits/men/12.jpg", name: "Bilash Traders", owner: "Rafiul Islam", email: "bilash@example.com", phone: "+880 1711-000111", location: "Chattogram", joined: "Mar 2024", rating: 4.8, revenue: 48200, commissionOwed: 3856, liveProducts: 42, approvalRate: 96, status: "active", commissionRate: 8, trend: [30, 34, 33, 38, 41, 44, 48], payouts: [{ date: "20 Sep 2026", amount: 4200, status: "Paid" }, { date: "20 Aug 2026", amount: 3950, status: "Paid" }] },
  { id: "r2", userId: "u2", avatar: "https://randomuser.me/api/portraits/men/67.jpg", name: "Nur Enterprise", owner: "Nurul Amin", email: "nur@example.com", phone: "+880 1811-000222", location: "Dhaka", joined: "Nov 2024", rating: 4.5, revenue: 29800, commissionOwed: 2384, liveProducts: 27, approvalRate: 88, status: "active", commissionRate: 10, trend: [18, 20, 24, 22, 26, 28, 30], payouts: [{ date: "20 Sep 2026", amount: 2650, status: "Paid" }] },
  { id: "r3", userId: "u3", avatar: "https://randomuser.me/api/portraits/women/65.jpg", name: "Green Valley Shop", owner: "Sumaiya Akter", email: "greenvalley@example.com", phone: "+880 1611-000555", location: "Sylhet", joined: "Aug 2025", rating: 4.6, revenue: 18400, commissionOwed: 1472, liveProducts: 19, approvalRate: 91, status: "active", commissionRate: 9, trend: [10, 11, 13, 15, 14, 17, 18], payouts: [{ date: "20 Sep 2026", amount: 1620, status: "Paid" }] },
  { id: "r4", userId: "u4", avatar: "https://randomuser.me/api/portraits/men/75.jpg", name: "Al-Amin Store", owner: "Al-Amin Hossain", email: "alamin@example.com", phone: "+880 1911-000333", location: "Khulna", joined: "Feb 2025", rating: 4.2, revenue: 12850, commissionOwed: 1028, liveProducts: 15, approvalRate: 79, status: "warning", commissionRate: 10, trend: [14, 13, 12, 13, 11, 12, 12], payouts: [{ date: "20 Sep 2026", amount: 940, status: "Pending" }] },
  { id: "r5", userId: "u5", avatar: "https://randomuser.me/api/portraits/men/22.jpg", name: "Zaman Retail", owner: "Tariq Zaman", email: "zaman@example.com", phone: "+880 1511-000444", location: "Rajshahi", joined: "Jun 2025", rating: 3.6, revenue: 4240, commissionOwed: 339, liveProducts: 8, approvalRate: 61, status: "suspended", commissionRate: 12, trend: [9, 8, 7, 6, 5, 4, 4], payouts: [] },
];

const statusMeta = {
  active: { label: "Active", dot: "bg-gradient-to-br from-teal-400 to-teal-600", chip: "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 ring-1 ring-teal-200" },
  warning: { label: "Warning", dot: "bg-gradient-to-br from-amber-400 to-orange-500", chip: "bg-gradient-to-r from-amber-50 to-orange-100 text-orange-700 ring-1 ring-orange-200" },
  suspended: { label: "Suspended", dot: "bg-gradient-to-br from-neutral-400 to-neutral-600", chip: "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 ring-1 ring-neutral-300" },
};

/* ───────── SMALL PIECES ───────── */
const Stars = ({ v = 0 }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon key={n} name="star" className={"h-3 w-3 " + (n <= Math.round(v) ? "fill-orange-500 text-orange-500" : "fill-neutral-200 text-neutral-200")} />
    ))}
  </span>
);

function Sparkline({ data, className = "" }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1, step = 64 / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${22 - ((v - min) / range) * 22}`).join(" ");
  return (
    <svg viewBox="0 0 64 22" className={className} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────── PAGE ───────── */
export default function ResellersPage() {
  const [apps, setApps] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selId, setSelId] = useState(null);
  const [ticks, setTicks] = useState({});
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [docIdx, setDocIdx] = useState(0);
  const [box, setBox] = useState(null);
  const touchX = useRef(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [rateDraft, setRateDraft] = useState(null);

  const load = async () => {
    try {
      if (USE_MOCK) {
        await wait(400);
        setApps(initialApps);
        setResellers(initialResellers);
        setSelId((c) => c ?? initialApps[0]?.id ?? null);
      } else {
        // Docs: GET /api/v1/admin/kyc (filter) + GET /api/v1/admin/resellers
        const [k, r] = await Promise.all([
          api("/api/v1/admin/kyc", { params: { status: "PENDING" } }),
          api("/api/v1/admin/resellers", { params: { limit: 100 } }),
        ]);
        const list = k?.items ?? k ?? [];
        setApps(list);
        setResellers(r?.items ?? r ?? []);
        setSelId((c) => c ?? list[0]?.id ?? null);
      }
    } catch (e) {
      toast.error(e?.message || "Could not load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && (setOpenId(null), setRateDraft(null));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const app = apps.find((a) => a.id === selId) || null;
  const ranked = useMemo(() => [...resellers].sort((a, b) => b.revenue - a.revenue), [resellers]);
  const maxRev = Math.max(...ranked.map((r) => r.revenue), 1);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter((r) => (status === "all" || r.status === status) && (!q || `${r.name} ${r.owner} ${r.location}`.toLowerCase().includes(q)));
  }, [ranked, query, status]);
  const opened = resellers.find((r) => r.id === openId) || null;
  const counts = { active: 0, warning: 0, suspended: 0 };
  resellers.forEach((r) => counts[r.status]++);
  const totalRev = resellers.reduce((s, r) => s + r.revenue, 0);

  const nextSel = (id) => {
    const rest = apps.filter((a) => a.id !== id);
    setSelId(rest[0]?.id ?? null);
    setDocIdx(0);
    setRejecting(false);
    setReason("");
  };

  /* Approve = KYC review (VERIFIED) → verify reseller (role sync) */
  const approve = async () => {
    setBusy(true);
    try {
      if (USE_MOCK) {
        await wait(500);
        setResellers((c) => [...c, { id: `r${Date.now()}`, userId: app.userId, name: app.name, owner: app.owner, email: app.email, phone: app.phone, location: app.location, joined: "Just now", rating: 0, revenue: 0, commissionOwed: 0, liveProducts: 0, approvalRate: 100, status: "active", commissionRate: 10, trend: [0, 0, 0, 0, 0, 0, 0], payouts: [] }]);
      } else {
        await api(`/api/v1/admin/kyc/review/${app.userId}`, { method: "PUT", body: { status: "VERIFIED" } });
        await api(`/api/v1/admin/resellers/${app.resellerId}/verify`, { method: "PUT" });
        await load();
      }
      setApps((c) => c.filter((a) => a.id !== app.id));
      toast.success(`${app.name} verified & onboarded`);
      nextSel(app.id);
    } catch (e) {
      toast.error(e?.message || "Could not approve");
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    setBusy(true);
    try {
      if (USE_MOCK) await wait(500);
      else await api(`/api/v1/admin/kyc/review/${app.userId}`, { method: "PUT", body: { status: "REJECTED", reason: reason.trim() } });
      setApps((c) => c.filter((a) => a.id !== app.id));
      toast.success(`${app.name} rejected`);
      nextSel(app.id);
    } catch (e) {
      toast.error(e?.message || "Could not reject");
    } finally {
      setBusy(false);
    }
  };

  const setResellerStatus = async (r, s) => {
    try {
      if (USE_MOCK) await wait(250);
      else await api(`/api/v1/admin/users/${r.userId}/status`, { method: "PUT", body: { status: s } });
      setResellers((c) => c.map((x) => (x.id === r.id ? { ...x, status: s } : x)));
      toast.success(`${r.name} marked ${statusMeta[s].label.toLowerCase()}`);
    } catch (e) {
      toast.error(e?.message || "Could not update status");
    }
  };

  const saveRate = async () => {
    try {
      if (USE_MOCK) await wait(250);
      else await api("/api/v1/admin/finance/commission-rates", { method: "PUT", body: { reseller_id: opened.id, rate: rateDraft } });
      setResellers((c) => c.map((x) => (x.id === opened.id ? { ...x, commissionRate: rateDraft } : x)));
      toast.success("Commission rate updated");
      setRateDraft(null);
    } catch (e) {
      toast.error(e?.message || "Could not save rate");
    }
  };

  const myTicks = ticks[selId] || {};
  const done = FIELDS.filter((k) => myTicks[k]).length;
  const allTicked = done === FIELDS.length;
  const toggleTick = (k) => setTicks((t) => ({ ...t, [selId]: { ...(t[selId] || {}), [k]: !(t[selId] || {})[k] } }));
  const selectApp = (id) => { setSelId(id); setDocIdx(0); setRejecting(false); };
  const cur = app?.docs[docIdx];
  const avail = app ? app.docs.filter((d) => !d.missing) : [];
  const missingN = app ? app.docs.length - avail.length : 0;
  const ready = allTicked && missingN === 0;
  const openBox = (i) => setBox({ docs: avail, index: i, person: app });
  const goDoc = (dl) => setDocIdx((i) => { const n = app?.docs.length || 1; return (i + dl + n) % n; });

  /* ───────── RENDER ───────── */
  return (
    <div className="min-h-screen w-full">
      <Toaster position="bottom-center" toastOptions={{ className: "!rounded-full !bg-neutral-900 !text-white !text-sm !font-medium !shadow-2xl !border-0", duration: 3000 }} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-8">
        {/* HEADER */}
        <header>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Resellers</h1>
            {USE_MOCK && <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">DEMO</span>}
          </div>
          <p className="mt-1 text-sm text-neutral-500">Verify new partners, then keep an eye on how they perform.</p>
        </header>

        {/* ───── KYC DESK ───── */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Icon name="shield" className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-bold text-neutral-900">KYC desk</h2>
            {apps.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />{apps.length} waiting
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-80 animate-pulse rounded-3xl bg-neutral-100" />
          ) : apps.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-600"><Icon name="check" className="h-6 w-6" sw={2.5} /></span>
              <p className="mt-3 text-sm font-bold text-neutral-800">Queue is clear</p>
              <p className="mt-1 text-xs text-neutral-500">New KYC submissions will appear here.</p>
            </div>
          ) : (
            <>
              {/* applicant cards */}
              <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-4 pt-1">
                {apps.map((a) => {
                  const on = a.id === selId;
                  const got = a.docs.filter((d) => !d.missing).length;
                  return (
                    <button key={a.id} type="button" onClick={() => selectApp(a.id)}
                      className={cx("w-[310px] shrink-0 snap-start cursor-pointer rounded-3xl border-2 p-4 text-left transition-all", on ? "border-orange-400 bg-orange-50/60 shadow-xl shadow-orange-500/10" : "border-neutral-200 bg-white hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md")}>
                      <span className="flex items-center gap-4">
                        <Avatar p={a} cls="h-[72px] w-[72px]" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-base font-bold text-neutral-900">{a.name}</span>
                          <span className="block truncate text-sm text-neutral-500">{a.owner}</span>
                          <span className="mt-1 block truncate text-xs text-neutral-400">{a.location} · {a.applied}</span>
                        </span>
                      </span>
                      <span className="mt-4 grid grid-cols-5 gap-1.5">
                        {a.docs.map((d) => (
                          <span key={d.id} title={d.k} className={cx("relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg", d.missing ? "border border-dashed border-orange-300 bg-orange-50" : "ring-1 ring-neutral-200")}>
                            {d.missing ? <Icon name="alert" className="h-3.5 w-3.5 text-orange-500" /> : <DocArt d={d} p={a} />}
                          </span>
                        ))}
                      </span>
                      <span className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-500">Documents</span>
                        <span className={cx("rounded-full px-2 py-0.5 font-bold", got === a.docs.length ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200" : "bg-orange-50 text-orange-700 ring-1 ring-orange-200")}>{got}/{a.docs.length} received</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {app && (
                <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm lg:grid lg:grid-cols-[1.15fr_1fr]">
                  {/* EVIDENCE STAGE (slider) */}
                  <div className="bg-neutral-900 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">Evidence</p>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-300">{cur?.k} · {docIdx + 1}/{app.docs.length}</span>
                    </div>
                    <div className="group relative mt-3 overflow-hidden rounded-2xl bg-neutral-800"
                      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                      onTouchEnd={(e) => { if (touchX.current == null) return; const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null; if (Math.abs(dx) > 40) goDoc(dx < 0 ? 1 : -1); }}>
                      <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${docIdx * 100}%)` }}>
                        {app.docs.map((d, i) => (
                          <button key={d.id} type="button" tabIndex={i === docIdx ? 0 : -1} disabled={d.missing} onClick={() => openBox(avail.findIndex((x) => x.id === d.id))}
                            className={cx("relative block aspect-[4/3] w-full shrink-0", d.missing ? "cursor-default" : "cursor-zoom-in")}>
                            {d.missing ? (
                              <span className="grid h-full w-full place-items-center border-2 border-dashed border-orange-400/50 text-center">
                                <span><Icon name="alert" className="mx-auto h-7 w-7 text-orange-400" /><span className="mt-2 block text-sm font-semibold text-orange-300">{d.k} was not uploaded</span></span>
                              </span>
                            ) : <DocArt d={d} p={app} />}
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={() => goDoc(-1)} aria-label="Previous" className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"><Icon name="left" /></button>
                      <button type="button" onClick={() => goDoc(1)} aria-label="Next" className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"><Icon name="right" /></button>
                      {!cur?.missing && (
                        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                          <Icon name="expand" className="h-3.5 w-3.5" />Click to enlarge
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                        {app.docs.map((d, i) => <span key={d.id} className={cx("h-1.5 rounded-full transition-all", i === docIdx ? "w-5 bg-orange-500" : "w-1.5 bg-white/60")} />)}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {app.docs.map((d, i) => (
                        <button key={d.id} type="button" onClick={() => setDocIdx(i)}
                          className={cx("relative aspect-square cursor-pointer overflow-hidden rounded-xl ring-2 transition", i === docIdx ? "ring-orange-500" : "opacity-70 ring-transparent hover:opacity-100", d.missing && "grid place-items-center border border-dashed border-neutral-600 bg-neutral-800")}>
                          {d.missing ? <Icon name="alert" className="h-4 w-4 text-orange-400" /> : <DocArt d={d} p={app} />}
                          <span className="absolute inset-x-0 bottom-0 truncate bg-black/65 px-1 py-0.5 text-center text-[9px] font-semibold text-white">{d.k}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VERIFY PANEL */}
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-3 border-b border-neutral-100 p-5">
                      <Avatar p={app} cls="h-14 w-14" onClick={() => openBox(0)} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-neutral-900">{app.name}</h3>
                        <p className="truncate text-xs text-neutral-500">{app.owner} · {app.phone}</p>
                        <p className="truncate text-xs text-neutral-400">{app.email}</p>
                      </div>
                      <span className="relative grid h-12 w-12 shrink-0 place-items-center" title={`${done} of ${FIELDS.length} verified`}>
                        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                          <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3.5" className="stroke-neutral-200" />
                          <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${(done / FIELDS.length) * 94.2} 94.2`} className={cx("transition-all duration-300", allTicked ? "stroke-teal-500" : "stroke-orange-500")} />
                        </svg>
                        <span className="text-[11px] font-bold tabular-nums text-neutral-700">{done}/{FIELDS.length}</span>
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 p-5">
                      <p className="text-xs text-neutral-500">Compare each detail with the evidence, then tap to confirm it.</p>
                      {[
                        ["name", "Full name", app.owner],
                        ["dob", "Date of birth", app.dob],
                        ["nid", "NID number", app.nid, true],
                        ["tin", "TIN", app.tin || "Not provided"],
                        ["bank", "Payout account", app.bank],
                        ["face", "Selfie matches NID photo"],
                      ].map(([k, label, val, mono]) => (
                        <button key={k} type="button" onClick={() => toggleTick(k)}
                          className={cx("flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition", myTicks[k] ? "border-teal-300 bg-teal-50" : "border-neutral-200 bg-white hover:border-neutral-300")}>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[11px] font-medium text-neutral-400">{label}</span>
                            {k === "face" ? (
                              <span className="mt-1 flex items-center gap-1.5">
                                <span className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white"><DocArt d={{ kind: "profile" }} p={app} /></span>
                                <span className="text-neutral-300">=</span>
                                <span className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white"><DocArt d={{ kind: "selfie" }} p={app} /></span>
                              </span>
                            ) : (
                              <span className={cx("block truncate text-sm font-bold text-neutral-900", mono && "font-mono tracking-wide")}>{val}</span>
                            )}
                          </span>
                          <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-full text-white transition", myTicks[k] ? "bg-gradient-to-br from-teal-500 to-teal-600" : "bg-neutral-200")}>
                            <Icon name="check" className="h-3.5 w-3.5" sw={3} />
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-neutral-100 bg-neutral-50/60 p-4">
                      {rejecting ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1.5">
                            {REASONS.map((r) => (
                              <button key={r} type="button" onClick={() => setReason(r)}
                                className={cx("cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ring-1 transition", reason === r ? "bg-red-50 text-red-700 ring-red-300" : "bg-white text-neutral-600 ring-neutral-200 hover:ring-neutral-300")}>{r}</button>
                            ))}
                          </div>
                          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason shown to the reseller"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5" />
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setRejecting(false)} className={BTN.ghost}>Back</button>
                            <button type="button" disabled={!reason.trim() || busy} onClick={reject} className={BTN.danger}>{busy ? "Working…" : "Confirm rejection"}</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className={cx("text-xs", missingN ? "font-semibold text-orange-600" : "text-neutral-500")}>
                            {missingN ? `${missingN} file${missingN > 1 ? "s" : ""} missing. Reject so the reseller can upload again.` : allTicked ? "All verified. Ready to approve." : "Confirm every detail to unlock approval."}
                          </p>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setRejecting(true)} className={BTN.ghost}><Icon name="x" className="h-4 w-4" />Reject</button>
                            <button type="button" disabled={!ready || busy} onClick={approve} className={BTN.success}>
                              {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Icon name="check" className="h-4 w-4" sw={2.5} />}
                              Approve
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ───── LEADERBOARD ───── */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Leaderboard</h2>
              <p className="text-xs text-neutral-500">Ranked by revenue</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
                {[["all", "All"], ["active", "Active"], ["warning", "Warning"], ["suspended", "Suspended"]].map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setStatus(k)}
                    className={cx("cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all", status === k ? "bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] text-white shadow-md shadow-orange-500/25" : "text-neutral-500 hover:text-neutral-900")}>{l}</button>
                ))}
              </div>
              <label className="relative hidden sm:block">
                <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search partner..."
                  className="w-56 rounded-full border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/5" />
              </label>
            </div>
          </div>

          <ul className="divide-y divide-neutral-100">
            {filtered.map((r, idx) => {
              const meta = statusMeta[r.status];
              const top3 = idx < 3 && status === "all" && !query;
              return (
                <li key={r.id}>
                  <button type="button" onClick={() => setOpenId(r.id)} className="flex w-full cursor-pointer items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 sm:px-5">
                    <span className="grid w-6 shrink-0 place-items-center">
                      {top3 ? <Icon name="crown" className="h-4 w-4" sw={1.6} style={{ color: medal[idx] }} /> : <span className="text-sm font-bold tabular-nums text-neutral-400">{idx + 1}</span>}
                    </span>
                    <span className="relative shrink-0">
                      <Avatar p={r} cls="h-11 w-11" />
                      <span className={cx("absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white", meta.dot)} />
                    </span>
                    <span className="min-w-0 flex-[1.3]">
                      <span className="block truncate text-sm font-bold text-neutral-900">{r.name}</span>
                      <span className="flex items-center gap-1.5 text-xs text-neutral-500"><Stars v={r.rating} /> {r.location}</span>
                    </span>
                    <span className="hidden flex-1 sm:block">
                      <span className="flex items-baseline justify-between text-xs">
                        <span className="text-sm font-bold tabular-nums text-neutral-900">{money(r.revenue)}</span>
                        <span className="text-neutral-400">revenue</span>
                      </span>
                      <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <span className="block h-full rounded-full bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] transition-all" style={{ width: `${(r.revenue / maxRev) * 100}%` }} />
                      </span>
                    </span>
                    <span className={cx("hidden shrink-0 md:block", r.trend[6] >= r.trend[0] ? "text-teal-500" : "text-orange-500")}><Sparkline data={r.trend} className="h-5 w-16" /></span>
                    <span className="hidden w-20 shrink-0 text-center lg:block">
                      <span className={cx("block text-sm font-bold tabular-nums", r.approvalRate < 80 ? "text-orange-600" : "text-neutral-900")}>{r.approvalRate}%</span>
                      <span className="block text-[11px] text-neutral-500">approved</span>
                    </span>
                    <span className={cx("hidden w-24 shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-bold sm:block", meta.chip)}>{meta.label}</span>
                    <Icon name="arrow" className="hidden h-4 w-4 shrink-0 text-neutral-300 sm:block" />
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-5 py-14 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-3 text-sm font-semibold text-neutral-700">No partners found</p>
                <p className="mt-1 text-xs text-neutral-500">Try a different filter or search</p>
              </li>
            )}
          </ul>
        </section>
      </div>

      {opened && <ResellerDrawer r={opened} onClose={() => { setOpenId(null); setRateDraft(null); }} onStatus={setResellerStatus} rateDraft={rateDraft} setRateDraft={setRateDraft} onSaveRate={saveRate} onView={(docs, i) => setBox({ docs, index: i, person: opened })} />}
      {box && <Lightbox docs={box.docs} index={box.index} person={box.person} onClose={() => setBox(null)} onIndex={(i) => setBox((b) => ({ ...b, index: i }))} />}
    </div>
  );
}

/* ───────── DRAWER ───────── */
function ResellerDrawer({ r, onClose, onStatus, rateDraft, setRateDraft, onSaveRate, onView }) {
  const docs = docsOf(r);
  const meta = statusMeta[r.status];
  const changed = rateDraft !== null && rateDraft !== r.commissionRate;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-white shadow-2xl sm:w-[440px]">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 p-5">
          <div className="flex items-start gap-3">
            <Avatar p={r} cls="h-14 w-14" onClick={() => onView(docs, 0)} />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-neutral-900">{r.name}</h2>
              <p className="text-sm text-neutral-500">{r.owner} · since {r.joined}</p>
              <span className={cx("mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold", meta.chip)}>
                <span className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} />{meta.label}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100"><Icon name="x" /></button>
        </div>

        <div className="flex-1 space-y-6 p-5">
          <div className="grid grid-cols-3 gap-2">
            {[["Revenue", money(r.revenue), "text-neutral-900"], ["Products", r.liveProducts, "text-neutral-900"], ["Approved", `${r.approvalRate}%`, r.approvalRate < 80 ? "text-orange-600" : "text-teal-600"]].map(([k, v, c]) => (
              <div key={k} className="rounded-2xl border border-neutral-200 p-3 text-center">
                <p className={cx("text-base font-bold tabular-nums", c)}>{v}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{k}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-2.5 text-sm">
            {[["mail", r.email], ["phone", r.phone], ["pin", r.location]].map(([ic, t]) => (
              <li key={t} className="flex items-center gap-2.5 text-neutral-600"><Icon name={ic} className="h-4 w-4 shrink-0 text-neutral-400" /><span className="truncate">{t}</span></li>
            ))}
          </ul>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-neutral-900">KYC documents</h3>
              <span className="flex items-center gap-1 text-xs font-semibold text-teal-600"><Icon name="shield" className="h-3.5 w-3.5" />Verified</span>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {docs.map((d, i) => (
                <button key={d.id} type="button" onClick={() => onView(docs, i)} title={`View ${d.k}`}
                  className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xl ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:ring-orange-400 hover:shadow-md">
                  <DocArt d={d} p={r} />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 py-0.5 text-center text-[9px] font-semibold text-white">{d.k}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Commission rate</h3>
              <span className="text-lg font-bold tabular-nums text-neutral-900">{rateDraft ?? r.commissionRate}%</span>
            </div>
            <input type="range" min="0" max="30" value={rateDraft ?? r.commissionRate} onChange={(e) => setRateDraft(Number(e.target.value))} className="mt-3 w-full cursor-pointer accent-[var(--color-brand-orange)]" />
            {changed && (
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setRateDraft(null)} className={cx(BTN.ghost, "!px-3 !py-1.5 !text-xs")}>Cancel</button>
                <button type="button" onClick={onSaveRate} className={cx(BTN.primary, "!px-3 !py-1.5 !text-xs")}>Save rate</button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Payout history</h3>
              <span className="text-xs text-neutral-500">{money(r.commissionOwed)} owed now</span>
            </div>
            <ul className="mt-2 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200">
              {r.payouts.length === 0 && <li className="px-4 py-3 text-sm text-neutral-400">No payouts yet.</li>}
              {r.payouts.map((p) => (
                <li key={p.date} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-neutral-600">{p.date}</span>
                  <span className="font-bold tabular-nums text-neutral-900">{money(p.amount)}</span>
                  <span className={cx("rounded-full px-2 py-0.5 text-[10px] font-bold", p.status === "Paid" ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200" : "bg-orange-50 text-orange-700 ring-1 ring-orange-200")}>{p.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 border-t border-neutral-100 bg-neutral-50/50 p-4">
          {r.status === "suspended" ? (
            <button type="button" onClick={() => onStatus(r, "active")} className={cx(BTN.teal, "flex-1")}><Icon name="check" />Reinstate</button>
          ) : (
            <>
              {r.status === "active" ? (
                <button type="button" onClick={() => onStatus(r, "warning")} className={cx(BTN.ghost, "flex-1")}><Icon name="alert" />Warn</button>
              ) : (
                <button type="button" onClick={() => onStatus(r, "active")} className={cx(BTN.success, "flex-1")}><Icon name="check" />Clear warning</button>
              )}
              <button type="button" onClick={() => onStatus(r, "suspended")} className={cx(BTN.danger, "flex-1")}><Icon name="ban" />Suspend</button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}