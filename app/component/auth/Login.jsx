"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BARCODE = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 3, 1, 2, 1, 4, 3, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4];

const TRUST_ITEMS = [
    { label: 'Verified sellers only', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Cash on delivery available', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: '7-day easy return', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
];

const EyeIcon = ({ open }) => (
    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        {open ? (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </>
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        )}
    </svg>
);

const MemberTag = () => {
    return (
        <div className="relative">
            <p className="mb-6 font-display text-2xl font-bold text-white">Bilash</p>

            <div
                className="relative rotate-[-2deg] bg-brand-cream pl-11 pr-6 py-6 shadow-[0_20px_40px_rgba(18,32,61,0.35)]"
                style={{ clipPath: 'polygon(7% 0%, 100% 0%, 100% 100%, 7% 100%, 0% 50%)' }}
            >
                <span className="absolute left-[26px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-brand-navy/30 bg-brand-navy"></span>

                <div className="flex items-center justify-between border-b border-dashed border-brand-navy/25 pb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-navy/50">Member tag</span>
                    <span className="font-mono text-[10px] text-brand-navy/40">BD-4471-8823</span>
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                    <p className="text-brand-navy/40">From <span className="text-brand-navy/70">Bilash Fulfillment, Dhaka</span></p>
                    <p className="text-brand-navy/40">To <span className="font-semibold text-brand-navy">You</span></p>
                </div>

                <div className="mt-4 flex h-8 items-end gap-[2px] overflow-hidden">
                    {BARCODE.map((w, i) => (
                        <span
                            key={i}
                            className={i % 2 === 0 ? 'h-full bg-brand-navy' : 'h-full bg-transparent'}
                            style={{ width: (w * 2) + 'px' }}
                        ></span>
                    ))}
                </div>

                <div className="pointer-events-none absolute -bottom-3 -right-3 rotate-[-9deg] rounded-md border-2 border-brand-orange px-3 py-1">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-brand-orange">Awaiting scan</span>
                </div>
            </div>

            <ul className="mt-14 space-y-3">
                {TRUST_ITEMS.map((item) => (
                    <li key={item.label} className="flex items-center gap-2.5 text-sm text-white/70">
                        <svg className="h-4 w-4 shrink-0 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/');
        }, 700);
    };

    return (
        <main className="grid  lg:grid-cols-2 ">
            <div className="relative hidden overflow-hidden bg-brand-navy px-12 py-14 lg:flex lg:flex-col lg:justify-center">
                <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-orange/10"></div>
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-brand-teal/10"></div>
                <div className="relative mx-auto w-full max-w-sm">
                    <MemberTag />
                </div>
            </div>

            <div className="flex items-center justify-center bg-white px-6 py-14 sm:px-10">
                <div className="w-full max-w-sm">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-brand-orange">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to shop
                    </Link>

                    <h1 className="mt-8 font-display text-3xl font-bold text-brand-navy">Sign in to Bilash</h1>
                    <p className="mt-2 text-sm text-ink/50">Pick up right where your cart left off.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="identifier" className="text-sm font-medium text-brand-navy">
                                Email or phone number
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                required
                                placeholder="you@example.com"
                                className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm text-brand-navy placeholder:text-ink/30 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-brand-navy">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-brand-orange hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="********"
                                    className="w-full rounded-xl border border-line px-4 py-3 pr-11 text-sm text-brand-navy placeholder:text-ink/30 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-brand-navy"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-ink/60">
                            <input type="checkbox" className="h-4 w-4 rounded border-line text-brand-orange focus:ring-brand-orange/30" />
                            Keep me signed in
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy py-3.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Signing in
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <span className="h-px flex-1 bg-line"></span>
                        <span className="text-xs text-ink/40">or</span>
                        <span className="h-px flex-1 bg-line"></span>
                    </div>

                    <a
                        href="https://wa.me/8801XXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-teal py-3 text-sm font-semibold text-brand-teal transition hover:bg-brand-teal hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.15-4.9-4.34-.14-.19-1.17-1.56-1.17-2.98 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.18-.27.37-.22.62-.13.25.09 1.6.75 1.87.89.27.14.45.21.51.32.07.12.07.68-.17 1.36z"></path>
                        </svg>
                        Continue with WhatsApp
                    </a>

                    <p className="mt-8 text-center text-sm text-ink/50">
                        New to Bilash?{' '}
                        <Link href="/register" className="font-semibold text-brand-orange hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Login;