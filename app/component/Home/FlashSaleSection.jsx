"use client";

import React, { useEffect, useRef, useState } from 'react';

const DEALS = [
    {
        name: 'Wireless Earbuds Pro',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
        price: '৳990',
        oldPrice: '৳1,990',
        claimed: 68,
    },
    {
        name: 'Smart Watch Fit 2',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        price: '৳1,450',
        oldPrice: '৳2,900',
        claimed: 41,
    },
    {
        name: 'Bluetooth Speaker Mini',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
        price: '৳750',
        oldPrice: '৳1,200',
        claimed: 82,
    },
    {
        name: 'Classic Sneakers',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
        price: '৳1,890',
        oldPrice: '৳2,600',
        claimed: 24,
    },
    {
        name: 'Everyday Backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
        price: '৳1,120',
        oldPrice: '৳1,600',
        claimed: 71,
    },
];

const getTargetTime = () => {
    const target = new Date();
    target.setHours(target.getHours() + 6, 30, 0, 0);
    return target;
};

const useCountdown = () => {
    const [target] = useState(getTargetTime);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, target.getTime() - Date.now());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft({ h, m, s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);

    return timeLeft;
};

const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 font-display text-lg font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
            {String(value).padStart(2, '0')}
        </div>
        <span className="mt-1 text-[9px] font-medium uppercase tracking-wide text-white/40">
            {label}
        </span>
    </div>
);

const ClaimGauge = ({ percent }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    const isHot = percent >= 70;

    return (
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            {isHot && (
                <span
                    className="absolute inset-0 rounded-full bg-brand-orange/25"
                    style={{ animation: 'gaugeGlow 1.8s ease-in-out infinite' }}
                />
            )}
            <svg viewBox="0 0 56 56" className="relative h-14 w-14 -rotate-90">
                <circle cx="28" cy="28" r={radius} fill="none" strokeWidth="5" className="stroke-brand-cream" />
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="stroke-brand-orange transition-all duration-700"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <span className="absolute font-display text-[11px] font-bold text-brand-navy">
                {percent}%
            </span>
        </div>
    );
};

const FlashSaleSection = () => {
    const { h, m, s } = useCountdown();
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // ✅ Infinity loop er jonno DEALS duplicate
    const LOOPED_DEALS = [...DEALS, ...DEALS, ...DEALS];

    // ✅ Auto-slide — infinity loop, ek card kore
    useEffect(() => {
        if (isPaused) return;
        const el = scrollRef.current;
        if (!el) return;

        const id = setInterval(() => {
            const card = el.querySelector('[data-deal]');
            if (!card) return;

            const step = card.offsetWidth + 12;          // card + gap
            const halfWidth = el.scrollWidth / 3;         // 1 set er width
            const maxScroll = el.scrollWidth - el.clientWidth;

            const next = el.scrollLeft + step;

            if (next >= halfWidth * 2) {
                // ✅ 2nd set sesh — silently 1st set e reset (no visible jump)
                el.scrollTo({ left: next - halfWidth, behavior: 'auto' });
            } else {
                el.scrollBy({ left: step, behavior: 'smooth' });
            }
        }, 3000);

        return () => clearInterval(id);
    }, [isPaused]);

    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <style>{`
                @keyframes riseIn {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes boltFlicker {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.92); }
                }
                @keyframes gaugeGlow {
                    0%, 100% { transform: scale(0.9); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.15; }
                }
                @keyframes badgePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.06); }
                }
                @keyframes shimmerSweep {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .ticket-notch::before, .ticket-notch::after {
                    content: '';
                    position: absolute;
                    width: 28px;
                    height: 28px;
                    background: var(--ticket-bg, #fff9f2);
                    border-radius: 9999px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .ticket-notch::before { left: -14px; }
                .ticket-notch::after { right: -14px; }

                .deal-card {
                    position: relative;
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }
                .deal-card:hover,
                .deal-card:focus-within {
                    transform: translateY(-6px);
                    box-shadow: 0 14px 28px -12px rgba(18, 32, 61, 0.35);
                }
                .deal-card .shine {
                    position: absolute;
                    inset: 0;
                    z-index: 20;
                    overflow: hidden;
                    pointer-events: none;
                    border-radius: inherit;
                }
                .deal-card .shine::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 35%;
                    height: 100%;
                    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.65), transparent);
                    transform: translateX(-100%) skewX(-20deg);
                    transition: transform 0.7s ease;
                }
                .deal-card:hover .shine::after {
                    transform: translateX(280%) skewX(-20deg);
                }
                .img-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
                    animation: shimmerSweep 1.8s ease-out 1;
                }
            `}</style>

            <div className="mx-auto max-w-7xl">
                <div
                    className="ticket-notch relative flex flex-col overflow-hidden rounded-3xl bg-brand-navy lg:flex-row"
                    style={{ animation: 'riseIn 0.6s ease-out both' }}
                >
                    {/* Left stub — countdown */}
                    <div className="relative flex shrink-0 flex-col justify-center gap-4 p-6 sm:p-8 lg:w-72">
                        <div className="flex items-center gap-3">
                            <span
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-xl"
                                style={{ animation: 'boltFlicker 1.8s ease-in-out infinite' }}
                            >
                                ⚡
                            </span>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-orange">
                                    Flash Sale
                                </p>
                                <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                                    Up to 60% off
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <TimeBox value={h} label="Hrs" />
                            <span className="pb-4 text-lg font-bold text-white/25">:</span>
                            <TimeBox value={m} label="Min" />
                            <span className="pb-4 text-lg font-bold text-white/25">:</span>
                            <TimeBox value={s} label="Sec" />
                        </div>

                        <p className="text-[11px] leading-relaxed text-white/40">
                            Grab it before the timer runs out — stock refreshes daily.
                        </p>
                    </div>

                    {/* Perforated divider */}
                    <div
                        className="relative hidden shrink-0 lg:block"
                        style={{
                            width: '1px',
                            backgroundImage:
                                'repeating-linear-gradient(180deg, rgba(255,255,255,0.25) 0 8px, transparent 8px 16px)',
                        }}
                    />
                    <div
                        className="relative block h-px w-full lg:hidden"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 8px, transparent 8px 16px)',
                        }}
                    />

                    {/* Right — horizontal auto-sliding deal strip */}
                    <div
                        className="relative flex-1 overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        onFocus={() => setIsPaused(true)}
                        onBlur={() => setIsPaused(false)}
                    >
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-brand-navy to-transparent lg:block" />

                        <div
                            ref={scrollRef}
                            className="no-scrollbar flex gap-3 overflow-x-auto p-4 sm:gap-4 sm:p-5"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {LOOPED_DEALS.map((deal, i) => {
                                const isHot = deal.claimed >= 70;
                                return (
                                    <div
                                        key={`${deal.name}-${i}`}
                                        data-deal
                                        tabIndex={0}
                                        className="deal-card group flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl bg-white sm:w-44"
                                        style={{
                                            scrollSnapAlign: 'start',
                                            animation: `riseIn 0.5s ease-out ${0.1 + (i % DEALS.length) * 0.06}s both`,
                                        }}
                                    >
                                        <div className="shine" />

                                        {isHot && (
                                            <span
                                                className="absolute right-2 top-2 z-30 rounded-full bg-brand-orange px-2 py-0.5 text-[9px] font-bold text-white shadow-sm"
                                                style={{ animation: 'badgePulse 1.4s ease-in-out infinite' }}
                                            >
                                                Almost gone
                                            </span>
                                        )}

                                        <div className="relative h-28 w-full overflow-hidden sm:h-32">
                                            <img
                                                src={deal.image}
                                                alt={deal.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="img-shimmer" />
                                        </div>

                                        <div className="flex flex-1 items-center gap-2.5 p-2.5 sm:p-3">
                                            <ClaimGauge percent={deal.claimed} />
                                            <div className="min-w-0">
                                                <h3 className="truncate text-[11px] font-semibold text-brand-navy sm:text-xs">
                                                    {deal.name}
                                                </h3>
                                                <div className="mt-1 flex items-baseline gap-1">
                                                    <span className="font-display text-xs font-bold text-brand-navy sm:text-sm">
                                                        {deal.price}
                                                    </span>
                                                    <span className="text-[10px] text-ink/40 line-through">
                                                        {deal.oldPrice}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashSaleSection;