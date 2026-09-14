"use client";

import React from 'react';

const BRANDS = [
    { name: 'Xiaomi', initial: 'Xi', count: '1.2k+', accent: 'navy' },
    { name: 'Samsung', initial: 'Sa', count: '2.4k+', accent: 'orange' },
    { name: 'Anker', initial: 'An', count: '640+', accent: 'teal' },
    { name: 'Puma', initial: 'Pu', count: '890+', accent: 'navy' },
    { name: 'Nivea', initial: 'Ni', count: '510+', accent: 'orange' },
    { name: 'Philips', initial: 'Ph', count: '760+', accent: 'teal' },
    { name: 'JBL', initial: 'JB', count: '430+', accent: 'navy' },
    { name: 'Adidas', initial: 'Ad', count: '1.1k+', accent: 'orange' },
    { name: 'Oral-B', initial: 'Or', count: '320+', accent: 'teal' },
    { name: 'Logitech', initial: 'Lo', count: '580+', accent: 'navy' },
];

const ACCENT_MAP = {
    navy: { bg: 'bg-brand-navy', text: 'text-brand-navy', soft: 'bg-brand-navy/10' },
    orange: { bg: 'bg-brand-orange', text: 'text-brand-orange', soft: 'bg-brand-orange/10' },
    teal: { bg: 'bg-brand-teal', text: 'text-brand-teal', soft: 'bg-brand-teal/10' },
};

const Topbrands = () => {
    const loop = [...BRANDS, ...BRANDS];

    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <style>{`
                @keyframes marqueeScroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .brand-track {
                    animation: marqueeScroll 26s linear infinite;
                }
                .brand-track:hover {
                    animation-play-state: paused;
                }
                @keyframes riseIn {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .shine-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -60%;
                    width: 40%;
                    height: 100%;
                    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
                    transform: skewX(-20deg);
                    transition: left 0.65s ease;
                }
                .shine-card:hover::before {
                    left: 130%;
                }
            `}</style>

            <div className="mx-auto max-w-7xl">
                <div
                    className="flex flex-col items-center gap-2 text-center"
                    style={{ animation: 'riseIn 0.6s ease-out both' }}
                >
                 
                    <h2 className="font-display text-2xl font-bold text-brand-navy sm:text-3xl">
                        Top brands on Bilash
                    </h2>
                </div>

                <div className="relative mt-10 overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-cream to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-cream to-transparent" />

                    <div className="brand-track flex w-max gap-5">
                        {loop.map((brand, i) => {
                            const accent = ACCENT_MAP[brand.accent];
                            return (
                                <div
                                    key={`${brand.name}-${i}`}
                                    className="shine-card group relative flex h-32 w-48 shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-navy/10 sm:w-52"
                                >
                                    {/* Diagonal stamp badge — top corner */}
                                    <div
                                        className={`absolute -right-6 -top-6 flex h-16 w-16 rotate-45 items-end justify-center pb-2 text-[10px] font-bold text-white ${accent.bg}`}
                                    >
                                        <span className="-rotate-45">{brand.initial}</span>
                                    </div>

                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg font-display text-xs font-bold ${accent.soft} ${accent.text}`}>
                                        {brand.initial}
                                    </div>

                                    <div>
                                        <h3 className="font-display text-base font-bold text-brand-navy">
                                            {brand.name}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-ink/40">
                                            {brand.count} products
                                        </p>
                                    </div>

                                    <span className={`h-0.5 w-8 rounded-full ${accent.bg} transition-all duration-300 group-hover:w-14`} />
                                </div>
                            );
                        })}
                    </div>
                </div>

               
            </div>
        </section>
    );
};

export default Topbrands;