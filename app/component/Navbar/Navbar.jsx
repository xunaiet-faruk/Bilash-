"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const userRole = "admin";
  const dashboardHref = `/${userRole}/dashboard`;

  const NAV_LINKS = [
    { label: "Shop", href: "/" },
    { label: "China Direct", href: "/china-direct" },
    { label: "Become a Reseller", href: "/reseller" },
    { label: "Dashboard", href: dashboardHref },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 transition-transform hover:scale-[1.02]">
          <img
            className="h-12 w-auto object-contain sm:h-14"
            src="/images/Logo.png"
            alt="Bilash Logo"
          />
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="w-full max-w-md">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for products, brands, or sellers"
                className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              />
            </label>
          </div>
        </div>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-orange-600"
                    : "text-slate-700 hover:text-orange-600"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-orange-500 transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}

          <Link
            href="/login"
            className="ml-2 cursor-pointer rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/70 bg-white px-4 pb-4 pt-3 shadow-lg lg:hidden">
          <label className="relative mb-3 block">
            <span className="sr-only">Search products</span>
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products"
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
            />
          </label>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    active
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 cursor-pointer rounded-full bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;