"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Topbar = ({ title, user = { name: 'User', role: 'Member' } }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-ink/50 hover:bg-brand-cream lg:hidden" aria-label="Open menu">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="font-display text-lg font-bold text-brand-navy sm:text-xl">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative rounded-full p-2 text-ink/50 hover:bg-brand-cream" aria-label="Notifications">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                    </svg>
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-orange" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setOpen((o) => !o)}
                        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-brand-cream"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                            {user.name.charAt(0)}
                        </span>
                        <span className="hidden text-left sm:block">
                            <span className="block text-xs font-semibold text-brand-navy">{user.name}</span>
                            <span className="block text-[10px] text-ink/40">{user.role}</span>
                        </span>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="block w-full px-4 py-2.5 text-left text-sm text-ink/70 hover:bg-brand-cream"
                            >
                                Profile
                            </button>
                            <button className="block w-full px-4 py-2.5 text-left text-sm text-ink/70 hover:bg-brand-cream">Settings</button>
                            <button className="block w-full border-t border-line px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50">Log out</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;