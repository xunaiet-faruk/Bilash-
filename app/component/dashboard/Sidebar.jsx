"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ items, accentColor = 'brand-orange', brandLabel = 'Bazario' }) => {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 shrink-0 flex-col bg-brand-navy lg:flex">
            <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
                <span className={`h-2 w-2 rounded-full bg-${accentColor}`} />
                <span className="font-display text-lg font-bold text-white">{brandLabel}</span>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                {items.map((group, gi) => (
                    <div key={gi} className="mb-5">
                        {group.label && (
                            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-white/30">
                                {group.label}
                            </p>
                        )}
                        {group.links.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                        isActive
                                            ? `bg-${accentColor}/15 text-white`
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <svg
                                        className={`h-4.5 w-4.5 shrink-0 ${isActive ? `text-${accentColor}` : 'text-white/40'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.label}
                                    {item.badge ? (
                                        <span className={`ml-auto rounded-full bg-${accentColor} px-1.5 py-0.5 text-[10px] font-bold text-white`}>
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 p-4">
                <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to store
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;