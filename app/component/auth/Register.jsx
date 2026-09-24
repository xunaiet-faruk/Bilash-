"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BARCODE = [2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 3, 2, 1, 3, 4, 1, 2, 3, 1];

const BENEFITS = [
    { label: 'Track every order in real time', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Save items to your wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { label: 'Checkout in a single tap', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
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

const NewMemberTag = () => (
    <div className="relative">
        <p className="mb-6 font-display text-2xl font-bold text-white">Bilash</p>

        <div
            className="relative rotate-[-2deg] bg-brand-cream pl-11 pr-6 py-6 shadow-[0_20px_40px_rgba(18,32,61,0.35)]"
            style={{ clipPath: 'polygon(7% 0%, 100% 0%, 100% 100%, 7% 100%, 0% 50%)' }}
        >
            <span className="absolute left-[26px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-brand-navy/30 bg-brand-navy" />

            <div className="flex items-center justify-between border-b border-dashed border-brand-navy/25 pb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-navy/50">New member tag</span>
                <span className="font-mono text-[10px] text-brand-navy/40">BD-9902-1147</span>
            </div>

            <div className="mt-3 space-y-1.5 text-sm">
                <p className="text-brand-navy/40">From <span className="text-brand-navy/70">Bilash Fulfillment, Dhaka</span></p>
                <p className="text-brand-navy/40">To <span className="font-semibold text-brand-navy">New customer</span></p>
            </div>

            <div className="mt-4 flex h-8 items-end gap-[2px] overflow-hidden">
                {BARCODE.map((w, i) => (
                    <span
                        key={i}
                        className={`h-full ${i % 2 === 0 ? 'bg-brand-navy' : 'bg-transparent'}`}
                        style={{ width: `${w * 2}px` }}
                    />
                ))}
            </div>

            <div className="pointer-events-none absolute -bottom-3 -right-3 rotate-[-9deg] rounded-md border-2 border-brand-teal px-3 py-1">
                <span className="text-[11px] font-bold uppercase tracking-wide text-brand-teal">Printing tag</span>
            </div>
        </div>

        <ul className="mt-14 space-y-3">
            {BENEFITS.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-white/70">
                    <svg className="h-4 w-4 shrink-0 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                </li>
            ))}
        </ul>
    </div>
);

const Register = () => {
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
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Tag panel */}
            <div className="relative hidden overflow-hidden bg-brand-navy px-12 py-14 lg:flex lg:flex-col lg:justify-center">
                <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-teal/10" />
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-brand-orange/10" />
                <div className="relative mx-auto w-full max-w-sm">
                    <NewMemberTag />
                </div>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center bg-white px-6 py-14 sm:px-10">
                <div className="w-full max-w-sm">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-brand-orange">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to shop
                    </Link>

                    <h1 className="mt-8 font-display text-3xl font-bold text-brand-navy">Create your Bilash account</h1>
                    <p className="mt-2 text-sm text-ink/50">Faster checkout, saved carts, and order tracking in one place.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-brand-navy">
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                placeholder="Rahim Uddin"
                                className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm text-brand-navy placeholder:text-ink/30 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="identifier" className="text-sm font-medium text-brand-navy">
                                Email or phone number
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                required
                                placeholder="you@example.com"
                                className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-sm text-brand-navy placeholder:text-ink/30 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-brand-navy">
                                Password
                            </label>
                            <div className="relative mt-1.5">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    placeholder="At least 8 characters"
                                    className="w-full rounded-xl border border-line px-4 py-3 pr-11 text-sm text-brand-navy placeholder:text-ink/30 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
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

                        <label className="flex items-start gap-2 text-sm text-ink/60">
                            <input
                                type="checkbox"
                                required
                                className="mt-0.5 h-4 w-4 rounded border-line text-brand-teal focus:ring-brand-teal/30"
                            />
                            <span>
                                I agree to Bilash's{' '}
                                <Link href="/terms" className="font-semibold text-brand-navy hover:underline">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="font-semibold text-brand-navy hover:underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-teal py-3.5 text-sm font-semibold text-white transition hover:bg-brand-teal/90 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Creating account
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-ink/50">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-brand-teal hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Register;