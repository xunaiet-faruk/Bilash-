"use client";

import React from 'react';

const STEPS = [
    {
        title: 'Factory Pickup',
        desc: 'Sourced straight from verified factories in China',
        day: 'Day 0',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M13 21V11l6 3v7M9 9v.01M9 12v.01M9 15v.01" />
        ),
    },
    {
        title: 'Sea / Air Cargo',
        desc: 'Bulk shipment consolidated and cleared for export',
        day: 'Day 3–10',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20l1.5-7h13L20 20M12 3v10m0 0l-3-3m3 3l3-3" />
        ),
    },
    {
        title: 'Customs Clearance',
        desc: 'Batch tracked, duties settled, quality checked',
        day: 'Day 10–14',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
    },
    {
        title: 'Your Doorstep',
        desc: 'Handed to local courier for last-mile delivery',
        day: 'Day 14–18',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-3H5a2 2 0 00-2 2v1z" />
        ),
    },
];

const TIERS = [
    { qty: '1–9 pcs', label: 'Retail', price: '৳990', highlight: false },
    { qty: '10–49 pcs', label: 'Bulk', price: '৳860', highlight: false },
    { qty: '50+ pcs', label: 'Wholesale', price: '৳720', highlight: true },
];

const ChinaDirectSection = () => {
    return (
        <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <style>{`
                @keyframes moveDot {
                    0% { left: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
                @keyframes moveDotY {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes conveyor {
                    to { background-position: -24px 0; }
                }
                @keyframes riseIn {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .conveyor-belt {
                    background-image: repeating-linear-gradient(
                        90deg,
                        rgba(0, 0, 0, 0.15) 0 6px,
                        transparent 6px 14px
                    );
                    animation: conveyor 1.6s linear infinite;
                }
                .conveyor-belt-y {
                    background-image: repeating-linear-gradient(
                        180deg,
                        rgba(0, 0, 0, 0.15) 0 6px,
                        transparent 6px 14px
                    );
                    animation: conveyor 1.6s linear infinite;
                }
            `}</style>

            <div className="relative mx-auto max-w-7xl">

                {/* ============ HEADER ============ */}
                <div
                    className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between"
                    style={{ animation: 'riseIn 0.7s ease-out both' }}
                >
                    <div className="max-w-2xl">
                      

                        <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] text-gray-900 sm:text-4xl lg:text-5xl">
                            Factory prices.{' '}
                            <span className="">
                                <span className="">Zero middleman</span>
                                
                            </span>
                        </h2>

                    </div>

                    <button className="group relative shrink-0 overflow-hidden rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition hover:bg-brand-orange-dark">
                        <span className="relative z-10 flex items-center gap-2">
                            Browse China Direct
                            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* ============ TIMELINE ============ */}
                <div className="relative mt-16">

                    {/* Desktop conveyor belt */}
                    <div className="absolute left-0 right-0 top-8 hidden h-[2px] md:block">
                        <div className="conveyor-belt h-full w-full" />
                        <span
                            className="absolute -top-[7px] h-4 w-4 rounded-full bg-brand-orange shadow-[0_0_14px_3px_rgba(255,90,31,0.5)]"
                            style={{ animation: 'moveDot 6s linear infinite' }}
                        />
                    </div>

                    {/* Mobile conveyor belt */}
                    <div className="absolute bottom-0 left-8 top-0 w-[2px] md:hidden">
                        <div className="conveyor-belt-y h-full w-full" />
                        <span
                            className="absolute -left-[7px] h-4 w-4 rounded-full bg-brand-orange shadow-[0_0_14px_3px_rgba(255,90,31,0.5)]"
                            style={{ animation: 'moveDotY 6s linear infinite' }}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-5">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.title}
                                className="group relative flex items-start gap-5 md:flex-col md:gap-0"
                                style={{ animation: `riseIn 0.6s ease-out ${i * 0.12}s both` }}
                            >
                                {/* Icon node */}
                                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center">
                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-brand-orange shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-brand-orange/40 group-hover:shadow-md">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                                            {step.icon}
                                        </svg>
                                    </div>
                                    {/* Step number badge */}
                                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white shadow-md">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="md:mt-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                                            {step.day}
                                        </span>
                                    </div>
                                    <h3 className="mt-1.5 font-display text-base font-bold text-gray-900 sm:text-lg">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1.5 max-w-[240px] text-sm leading-relaxed text-gray-500">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ============ PRICING TIERS ============ */}
                <div className="mt-20">
                    <div
                        className="mb-6 flex items-end justify-between"
                        style={{ animation: 'riseIn 0.6s ease-out 0.3s both' }}
                    >
                        <div>
                            <h3 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">
                                Bulk pricing
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Landed price · duty &amp; delivery included
                            </p>
                        </div>
                        <span className="hidden text-xs font-medium uppercase tracking-wider text-gray-400 sm:block">
                            Per unit pricing
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {TIERS.map((tier, i) => (
                            <div
                                key={tier.qty}
                                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                                    tier.highlight
                                        ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/25'
                                        : 'border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-md'
                                }`}
                                style={{ animation: `riseIn 0.6s ease-out ${0.35 + i * 0.1}s both` }}
                            >
                                {/* Left accent stripe */}
                                <span
                                    className={`absolute left-0 top-0 h-full w-1 ${
                                        tier.highlight ? 'bg-white/40' : 'bg-brand-orange/60'
                                    }`}
                                />

                                {tier.highlight && (
                                    <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange shadow-sm">
                                        Best value
                                    </span>
                                )}

                                <p
                                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                                        tier.highlight ? 'text-white/75' : 'text-gray-400'
                                    }`}
                                >
                                    {tier.label} · {tier.qty}
                                </p>

                                <p className="mt-3 font-display text-4xl font-bold leading-none">
                                    {tier.price}
                                    <span
                                        className={`ml-1 text-sm font-medium ${
                                            tier.highlight ? 'text-white/75' : 'text-gray-400'
                                        }`}
                                    >
                                        /pc
                                    </span>
                                </p>

                                <div
                                    className={`mt-5 h-px w-full ${
                                        tier.highlight ? 'bg-white/20' : 'bg-gray-100'
                                    }`}
                                />

                                <p
                                    className={`mt-4 text-xs ${
                                        tier.highlight ? 'text-white/80' : 'text-gray-500'
                                    }`}
                                >
                                    {tier.highlight
                                        ? 'Reseller & dropship tier'
                                        : 'Standard marketplace tier'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

              

            </div>
        </section>
    );
};

export default ChinaDirectSection;