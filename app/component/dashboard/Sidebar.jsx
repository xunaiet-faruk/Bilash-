"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ============================================================
   ICONS
   ============================================================ */
function HomeIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BoxIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M3.3 7 12 12l8.7-5M12 12v9M3.3 7 12 3l8.7 4v10L12 21l-8.7-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TagIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M20.6 12.3 12.7 20.2a1.5 1.5 0 0 1-2.1 0l-6.8-6.8a1.5 1.5 0 0 1 0-2.1L11.8 3.4H19a1.6 1.6 0 0 1 1.6 1.6z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15.5" cy="8.5" r="1.3" />
    </svg>
  );
}
function ReceiptIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" strokeLinejoin="round" />
      <path d="M9 8h6M9 12h6" strokeLinecap="round" />
    </svg>
  );
}
function UsersIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <path d="M16 4.3c1.7.4 3 2 3 3.9 0 1.9-1.3 3.5-3 3.9M21 20c0-2.8-2-5.1-4.7-5.8" strokeLinecap="round" />
    </svg>
  );
}
function StoreIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M4 9V5h16v4M4 9l1 11h14l1-11M4 9h16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WalletIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" strokeLinejoin="round" />
      <path d="M15 12h4M15 12a1.5 1.5 0 0 0 0 3h4v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChartIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M5 19V10M12 19V5M19 19v-7" strokeLinecap="round" />
    </svg>
  );
}
function StarIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="m12 3 2.6 5.6 6 .7-4.5 4.2 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.2 6-.7Z" strokeLinejoin="round" />
    </svg>
  );
}
function SupportIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6.4 6.4 9.5 9.5M17.6 6.4 14.5 9.5M6.4 17.6 9.5 14.5M17.6 17.6 14.5 14.5" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path
        d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1h-.2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.2 7.5a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TruckIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </svg>
  );
}
function GlobeIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" />
    </svg>
  );
}
function ShieldIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
   NAV CONFIG — SRS Section 3.5 অনুযায়ী
   ============================================================ */
const NAV = {
  admin: [
    {
      group: "Overview",
      items: [
        { label: "Global Dashboard", href: "", icon: HomeIcon },
        { label: "Analytics", href: "/analytics", icon: ChartIcon },
      ],
    },
    {
      group: "Commerce",
      items: [
        { label: "Catalog & Approvals", href: "/catalog", icon: BoxIcon },
        { label: "Categories", href: "/categories", icon: TagIcon },
        { label: "Orders", href: "/orders", icon: ReceiptIcon },
        { label: "Payout & Escrow", href: "/finance", icon: WalletIcon },
      ],
    },
    {
      group: "Operations",
      items: [
        { label: "China Sourcing", href: "/china-sourcing", icon: GlobeIcon },
        { label: "Courier & Logistics", href: "/logistics", icon: TruckIcon },
        { label: "Fraud & Risk", href: "/security/fraud", icon: ShieldIcon },
      ],
    },
    {
      group: "People",
      items: [
        { label: "Customers", href: "/customers", icon: UsersIcon },
        { label: "Resellers", href: "/resellers", icon: StoreIcon },
        { label: "Sellers", href: "/sellers", icon: StoreIcon },
      ],
    },
    {
      group: "System",
      items: [
        { label: "Reviews", href: "/reviews", icon: StarIcon },
        { label: "Support", href: "/support", icon: SupportIcon },
        { label: "Settings", href: "/settings", icon: SettingsIcon },
      ],
    },
  ],
  reseller: [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", href: "", icon: HomeIcon },
        { label: "Earnings", href: "/earnings", icon: ChartIcon },
      ],
    },
    {
      group: "Commerce",
      items: [
        { label: "Wholesale Catalog", href: "/catalog", icon: BoxIcon },
        { label: "My Orders", href: "/orders", icon: ReceiptIcon },
        { label: "Wallet", href: "/wallet", icon: WalletIcon },
      ],
    },
    {
      group: "Other",
      items: [
        { label: "Reviews", href: "/reviews", icon: StarIcon },
        { label: "Support", href: "/support", icon: SupportIcon },
        { label: "Settings", href: "/settings", icon: SettingsIcon },
      ],
    },
  ],
};

/* ============================================================
   SIDEBAR
   ============================================================ */
const Sidebar = ({
  defaultRole = "admin",
  userName = "Rafiul Sarker",
  userEmail = "rafiul@bilash.io",
}) => {
  const [role, setRole] = useState(defaultRole);
  const pathname = usePathname();

  const basePath = `/${role}/dashboard`;

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const groups = NAV[role];

  return (
    <aside className="relative flex h-screen w-[260px] shrink-0 flex-col overflow-hidden bg-[#0b0f17]">
      <div className="pointer-events-none absolute -top-32 -left-20 h-64 w-64 rounded-full bg-orange-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -right-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-center gap-3 px-5 pt-6 pb-5">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-base font-black text-white shadow-lg shadow-orange-500/40">
          B
          <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0f17]" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-white">Bilash</p>
          <p className="text-[10.5px] uppercase tracking-[0.14em] text-white/35">
            Commerce Suite
          </p>
        </div>
      </div>

      <div className="relative mx-4 mb-5">
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur">
          {["admin", "reseller"].map((r) => {
            const active = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={
                  "relative flex-1 cursor-pointer rounded-lg py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all " +
                  (active
                    ? "bg-gradient-to-b from-white/[0.14] to-white/[0.06] text-white shadow-inner"
                    : "text-white/40 hover:text-white/70")
                }
              >
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
                )}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <nav className="relative flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
        {groups.map(({ group, items }) => (
          <div key={group} className="mb-4">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map(({ label, href, icon: Icon }) => {
                const fullHref = basePath + href;
                const active =
                  href === ""
                    ? pathname === basePath
                    : pathname === fullHref || pathname.startsWith(fullHref + "/");
                return (
                  <Link
                    key={fullHref}
                    href={fullHref}
                    className={
                      "group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150 " +
                      (active
                        ? "bg-gradient-to-r from-orange-500/[0.15] via-orange-500/[0.06] to-transparent text-white"
                        : "text-white/45 hover:bg-white/[0.04] hover:text-white/85")
                    }
                  >
                    <span
                      className={
                        "absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full transition-all " +
                        (active
                          ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]"
                          : "bg-transparent")
                      }
                    />
                    <span
                      className={
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-all " +
                        (active
                          ? "bg-orange-500/[0.14] text-orange-300"
                          : "text-white/40 group-hover:bg-white/[0.05] group-hover:text-white/70")
                      }
                    >
                      <Icon className="h-[15px] w-[15px]" />
                    </span>
                    <span className="truncate">{label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-white/[0.06] p-3">
        <div className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5 backdrop-blur transition-colors hover:bg-white/[0.05]">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-[11px] font-bold text-white shadow-lg shadow-cyan-500/30">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0f17]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{userName}</p>
            <p className="truncate text-[11px] text-white/40">{userEmail}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-white/60">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;