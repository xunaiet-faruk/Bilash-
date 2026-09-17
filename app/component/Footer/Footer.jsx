import React from 'react';
import Link from 'next/link';
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaXTwitter,
    FaWhatsapp,
    FaApple,
    FaGooglePlay,
} from 'react-icons/fa6';
import payfooter from '../../../public/images/payfooter.png';


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

const SOCIALS = [
    { icon: FaFacebookF, label: 'Facebook', href: '#' },
    { icon: FaInstagram, label: 'Instagram', href: '#' },
    { icon: FaYoutube, label: 'YouTube', href: '#' },
    { icon: FaXTwitter, label: 'Twitter / X', href: '#' },
    { icon: FaWhatsapp, label: 'WhatsApp', href: '#' },
];

const Footer = () => {
    return (
        <footer className="border-t border-line bg-brand-navy text-white/70 container mx-auto">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand + socials */}
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

                        {/* Social media icons */}
                        <div className="mt-6 flex items-center gap-2.5">
                            {SOCIALS.map(({ icon: Icon, label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-brand-orange hover:bg-brand-orange hover:text-white"
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </Link>
                            ))}
                        </div>

                        {/* App download badges */}
                        <div className="mt-7">
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                                Get the app
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2.5">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 transition hover:border-brand-orange/50 hover:bg-white/10"
                                >
                                    <FaApple className="h-5 w-5 text-white" />
                                    <span className="leading-tight">
                                        <span className="block text-[9px] text-white/50">Download on the</span>
                                        <span className="block text-xs font-semibold text-white">App Store</span>
                                    </span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 transition hover:border-brand-orange/50 hover:bg-white/10"
                                >
                                    <FaGooglePlay className="h-4 w-4 text-white" />
                                    <span className="leading-tight">
                                        <span className="block text-[9px] text-white/50">Get it on</span>
                                        <span className="block text-xs font-semibold text-white">Google Play</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
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

                {/* Payment methods strip */}
                <div className="mt-12 border-t border-white/10 pt-8">
                    <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/40 sm:text-left">
                        We accept
                    </p>
                    <div className="mt-3 flex justify-center sm:justify-start">
                        <img
                            src={payfooter.src}
                            alt="Payment methods — bKash, Nagad, SSLCommerz and more"
                            className="h-auto w-full "
                        />
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-xs text-white/50">
                        © {new Date().getFullYear()} Bazario. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/50">
                        <span>Courier partners:</span>
                        <span>Steadfast</span>
                        <span>·</span>
                        <span>Pathao</span>
                        <span>·</span>
                        <span>RedX</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;