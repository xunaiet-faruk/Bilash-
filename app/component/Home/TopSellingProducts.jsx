"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/component/shared/Cartcontext';

const TABS = ['Today', 'This Week', 'This Month'];
const slugify = (value) => value.toLowerCase().trim().replace(/\s+/g, '-');

const BASE_PRODUCTS = [
    {
        name: 'Wireless Earbuds Pro',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
        price: '৳990',
        oldPrice: '৳1,990',
        sold: { Today: 128, 'This Week': 940, 'This Month': 3800 },
        rating: 4.6,
        category: 'Audio',
    },
    {
        name: 'Smart Watch Fit 2',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        price: '৳1,450',
        oldPrice: '৳2,900',
        sold: { Today: 96, 'This Week': 820, 'This Month': 3100 },
        rating: 4.8,
        category: 'Wearable',
    },
    {
        name: 'Bluetooth Speaker Mini',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
        price: '৳750',
        oldPrice: '৳1,200',
        sold: { Today: 74, 'This Week': 610, 'This Month': 2400 },
        rating: 4.5,
        category: 'Audio',
    },
    {
        name: 'Classic Sneakers',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
        price: '৳1,890',
        oldPrice: '৳2,600',
        sold: { Today: 61, 'This Week': 505, 'This Month': 1950 },
        rating: 4.4,
        category: 'Fashion',
    },
    {
        name: 'Everyday Backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        price: '৳1,120',
        oldPrice: '৳1,600',
        sold: { Today: 48, 'This Week': 390, 'This Month': 1500 },
        rating: 4.7,
        category: 'Fashion',
    },
    {
        name: 'Skincare Gift Set',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
        price: '৳680',
        oldPrice: '৳980',
        sold: { Today: 35, 'This Week': 300, 'This Month': 1100 },
        rating: 4.9,
        category: 'Beauty',
    },
];

const TopSellingProducts = () => {
    const [activeTab, setActiveTab] = useState('Today');
    const { addItem } = useCart();

    const ranked = [...BASE_PRODUCTS].sort(
        (a, b) => b.sold[activeTab] - a.sold[activeTab]
    );
    const maxSold = ranked[0].sold[activeTab];

    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <style>{`
                @keyframes rowIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="mx-auto max-w-7xl">
                {/* Header */}
        
                    <div>
                      
                        <h2 className="mt-1 font-display text-center text-3xl font-bold leading-[1.1] text-gray-900  text-brand-navy sm:text-3xl">
                            Top selling right now
                        </h2>
                    </div>

               

                {/* Ranked list — card aro boro */}
                <div className="mt-8 space-y-4">
                    {ranked.map((product, i) => {
                        const pct = Math.round((product.sold[activeTab] / maxSold) * 100);

                        return (
                            <div
                                key={product.name}
                                className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-navy/20 hover:shadow-xl hover:shadow-brand-navy/10 sm:gap-7 sm:p-6 md:p-7"
                                style={{ animation: `rowIn 0.4s ease-out ${i * 0.05}s both` }}
                            >
                                {/* Ghost rank number */}
                                <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-display text-[100px] font-bold leading-none text-brand-navy/[0.04] sm:text-[130px] md:text-[150px]">
                                    {i + 1}
                                </span>

                              
                                <Link
                                    href={`/category/product/${slugify(product.name)}-1`}
                                    aria-label={`View ${product.name} details`}
                                    className="relative z-10 h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand-cream sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-48 lg:w-48"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {i < 3 && (
                                        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-xs shadow-md backdrop-blur-sm">
                                            🔥
                                        </span>
                                    )}
                                </Link>

                                {/* Info */}
                                <Link
                                    href={`/category/product/${slugify(product.name)}-1`}
                                    className="relative z-10 min-w-0 flex-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                                            {product.category}
                                        </span>
                                        {i < 3 && (
                                            <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-[9px] font-bold text-brand-navy">
                                                #{i + 1} TRENDING
                                            </span>
                                        )}
                                    </div>

                                    {/* ✅ Name aro boro */}
                                    <h3 className="mt-1.5 truncate font-display text-lg font-bold text-brand-navy sm:text-xl md:text-2xl">
                                        {product.name}
                                    </h3>

                                    <div className="mt-1.5 flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <svg className="h-4 w-4 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                            <span className="text-sm font-medium text-ink/70">{product.rating}</span>
                                        </div>
                                        <span className="text-ink/20">•</span>
                                        <span className="text-sm font-medium text-ink/60">
                                            {product.sold[activeTab]} sold
                                        </span>
                                    </div>

                                    {/* ✅ Sales bar — tomar main base color (brand-navy) */}
                                    <div className="mt-3 h-2 w-full max-w-[340px] overflow-hidden rounded-full bg-brand-navy/10">
                                        <div
                                            className="h-full rounded-full bg-brand-navy transition-all duration-700"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </Link>

                                {/* Price + action */}
                                <div className="relative z-10 flex shrink-0 flex-col items-end gap-3">
                                    <div className="text-right">
                                        {/* ✅ Price aro boro */}
                                        <p className="font-display text-lg font-bold text-brand-navy sm:text-xl md:text-2xl">
                                            {product.price}
                                        </p>
                                        <p className="text-sm text-ink/40 line-through">
                                            {product.oldPrice}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => addItem({
                                            ...product,
                                            id: slugify(product.name),
                                            price: Number(product.price.replace(/[^0-9.-]/g, '')) || 0,
                                            oldPrice: Number(product.oldPrice.replace(/[^0-9.-]/g, '')) || null,
                                        })}
                                        aria-label={`Add ${product.name} to cart`}
                                        className="flex cursor-pointer h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-white transition hover:bg-brand-orange sm:h-12 sm:w-12"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            
            </div>
        </section>
    );
};

export default TopSellingProducts;