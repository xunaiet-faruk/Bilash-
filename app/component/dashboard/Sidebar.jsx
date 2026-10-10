"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart2,
  Package,
  Tag,
  Receipt,
  CreditCard,
  Globe,
  Truck,
  Shield,
  Users,
  ShoppingBag,
  Star,
  LifeBuoy,
  Settings,
  Share2,
  User,
  ChevronDown,
} from "lucide-react";

/* ============================================================
   NAV CONFIG — SRS Section 3.5 অনুযায়ী
   ============================================================ */
const NAV = {
  admin: [
    {
      group: "Overview",
      items: [
        { label: "Global Dashboard", href: "", icon: Home },
        { label: "Analytics", href: "/analytics", icon: BarChart2 },
      ],
    },
    {
      group: "Commerce",
      items: [
        { label: "Catalog & Approvals", href: "/catalog", icon: Package },
        { label: "Categories", href: "/categories", icon: Tag },
        { label: "Orders", href: "/orders", icon: Receipt },
        { label: "Payout & Escrow", href: "/finance", icon: CreditCard },
      ],
    },
    {
      group: "Operations",
      items: [
        { label: "China Sourcing", href: "/china-sourcing", icon: Globe },
        { label: "Courier & Logistics", href: "/logistics", icon: Truck },
        { label: "Fraud & Risk", href: "/security/fraud", icon: Shield },
      ],
    },
    {
      group: "People",
      items: [
        { label: "Customers", href: "/customers", icon: Users },
        { label: "Resellers", href: "/resellers", icon: ShoppingBag },
        { label: "Sellers", href: "/sellers", icon: ShoppingBag },
      ],
    },
    {
      group: "System",
      items: [
        { label: "Reviews", href: "/reviews", icon: Star },
        { label: "Support", href: "/support", icon: LifeBuoy },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ],
  reseller: [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", href: "", icon: Home },
        { label: "Wallet", href: "/wallet", icon: CreditCard },
      ],
    },
    {
      group: "Reseller",
      items: [
        { label: "My Catalog", href: "/catalog", icon: Package },
        { label: "Margin Calculator", href: "/margin", icon: BarChart2 },
        { label: "Share Links", href: "/share-link", icon: Share2 },
        { label: "My-products", href: "/my-products", icon: ShoppingBag },
      ],
    },
    {
      group: "Account",
      items: [
        { label: "Profile", href: "/profile", icon: User },
        { label: "Store Setup", href: "/setup", icon: Settings },
        { label: "Support", href: "/support", icon: LifeBuoy },

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
                      {Icon && <Icon className="h-[15px] w-[15px]" />}
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
          <ChevronDown className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-white/60" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;