"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
    { label: 'Shop', href: '/' },
    { label: 'China Direct', href: '/china-direct' },
    { label: 'Become a Reseller', href: '/reseller' },
    { label: 'Affiliate', href: '/affiliate' },
    { label: 'Sell on Bazario', href: '/seller' },
];

const Navbar = () => {
    const [active, setActive] = useState('Shop');
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-brand-cream/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy font-display text-lg font-bold text-brand-orange">
                        B
                    </span>
                    <span className="hidden font-display text-xl font-bold tracking-tight text-brand-navy sm:block">
                        Bazario
                    </span>
                </Link>

                <div className="hidden flex-1 justify-center md:flex">
                    <div className="w-full max-w-md">
                        <label className="relative block">
                            <span className="sr-only">Search products</span>
                            <svg
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search for products, brands, or sellers"
                                className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25"
                            />
                        </label>
                    </div>
                </div>

                <nav className="ml-auto hidden items-center gap-1 lg:flex">
                    {NAV_LINKS.map((link) => {
                        const isActive = active === link.label;
                        return (
                            <button
                                key={link.label}
                                onClick={() => setActive(link.label)}
                                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive ? 'text-brand-orange' : 'text-brand-navy hover:text-brand-orange'
                                }`}
                            >
                                {link.label}
                                <span
                                    className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-orange transition-transform duration-300 ${
                                        isActive ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                                />
                            </button>
                        );
                    })}
                    <Link
                        href="/account"
                        className="ml-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
                    >
                        Sign in
                    </Link>
                </nav>

                <button
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                    className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy lg:hidden"
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
                <div className="border-t border-line bg-brand-cream px-4 pb-4 pt-3 lg:hidden">
                    <label className="relative mb-3 block">
                        <span className="sr-only">Search products</span>
                        <input
                            type="text"
                            placeholder="Search products"
                            className="w-full rounded-full border border-line bg-white py-2.5 pl-4 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25"
                        />
                    </label>
                    <nav className="flex flex-col gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = active === link.label;
                            return (
                                <button
                                    key={link.label}
                                    onClick={() => {
                                        setActive(link.label);
                                        setMenuOpen(false);
                                    }}
                                    className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                                        isActive ? 'bg-brand-orange/10 text-brand-orange' : 'text-brand-navy'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            );
                        })}
                        <Link
                            href="/account"
                            className="mt-2 rounded-full bg-brand-navy px-4 py-2.5 text-center text-sm font-semibold text-white"
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