"use client";

import React, { useEffect, useState } from 'react';

const SLIDES = [
    { tag: 'China Direct', title: 'Factory prices,\nno middleman.', from: '#12203d', to: '#1c2f52' },
    { tag: 'Local Warehouse', title: 'Dhaka to your door\nin 2–3 days.', from: '#0fa98a', to: '#0c8570' },
    { tag: 'Reseller Program', title: 'Sell with zero\ninventory.', from: '#e04713', to: '#ff5a1f' },
];

const STATS = [
    { value: '18K+', label: 'Verified sellers' },
    { value: '2–3 days', label: 'Local delivery' },
    { value: '70+', label: 'Product categories' },
];

const Hero = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setActive((i) => (i + 1) % SLIDES.length);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="relative overflow-hidden bg-brand-cream">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
                <div className="max-w-xl" style={{ animation: 'riseIn 0.7s ease-out both' }}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange-dark">
                        China imports + local stock, one checkout
                    </span>

                    <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-[3.4rem]">
                        One marketplace for
                        <br />
                        buyers, resellers,
                        <br />
                        and sellers.
                    </h1>

                    <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
                        Shop verified local and China-direct products, launch a
                        zero-inventory reseller shop, or open your own storefront —
                        built for Bangladesh, from bKash to courier tracking.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <button className="rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-orange/30 transition hover:bg-brand-orange-dark">
                            Start shopping
                        </button>
                        <button className="rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-navy hover:bg-brand-navy/5">
                            Become a reseller
                        </button>
                    </div>

                    <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <dt className="font-display text-xl font-bold text-brand-navy sm:text-2xl">{stat.value}</dt>
                                <dd className="mt-1 text-xs text-ink/60 sm:text-sm">{stat.label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="relative h-80 sm:h-96 lg:h-[26rem]" style={{ animation: 'riseIn 0.8s 0.15s ease-out both' }}>
                    <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-xl shadow-brand-navy/10">
                        {SLIDES.map((slide, i) => (
                            <div
                                key={slide.tag}
                                className="absolute inset-0 flex flex-col justify-end p-8"
                                style={{
                                    background: `linear-gradient(135deg, ${slide.from}, ${slide.to})`,
                                    opacity: i === active ? 1 : 0,
                                    transition: 'opacity 0.6s ease',
                                }}
                            >
                                <span className="mb-3 inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                                    {slide.tag}
                                </span>
                                <h2 className="whitespace-pre-line font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                                    {slide.title}
                                </h2>
                            </div>
                        ))}
                    </div>

                    <div
                        className="absolute -left-4 top-6 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-brand-navy/15 sm:-left-8"
                        style={{ animation: 'chipFloat 4.5s ease-in-out infinite' }}
                    >
                        <p className="text-xs font-medium text-ink/50">Flash Sale</p>
                        <p className="font-display text-lg font-bold text-brand-orange">Up to 70% off</p>
                    </div>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {SLIDES.map((slide, i) => (
                            <button
                                key={slide.tag}
                                aria-label={`Show slide ${i + 1}`}
                                onClick={() => setActive(i)}
                                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;