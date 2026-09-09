import React from 'react';
import Link from 'next/link';

const FOOTER_COLUMNS = [
    {
        title: 'Shop',
        links: ['China Direct', 'Local Stock', 'Flash Sale', 'Categories'],
    },
    {
        title: 'Sell & earn',
        links: ['Become a Reseller', 'Sell on Bazario', 'Affiliate Program'],
    },
    {
        title: 'Support',
        links: ['Track Order', 'Returns & Refunds', 'Payment Methods', 'Contact Us'],
    },
];

const Footer = () => {
    return (
        <footer className="border-t border-line bg-brand-navy text-white/70">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange font-display text-lg font-bold text-brand-navy">
                                B
                            </span>
                            <span className="font-display text-xl font-bold text-white">Bazario</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed">
                            China-direct and local products, resellers, and affiliates —
                            one platform, built for Bangladesh.
                        </p>
                    </div>

                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h3 className="font-display text-sm font-semibold text-white">{col.title}</h3>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm transition hover:text-brand-orange">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-xs text-white/50">© {new Date().getFullYear()} Bazario. All rights reserved.</p>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                        <span>bKash</span>
                        <span>·</span>
                        <span>Nagad</span>
                        <span>·</span>
                        <span>SSLCommerz</span>
                        <span>·</span>
                        <span>Steadfast</span>
                        <span>·</span>
                        <span>Pathao</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;