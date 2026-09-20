"use client";

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/component/shared/Cartcontext';

const ProductCard = ({ product }) => {
    const [wishlisted, setWishlisted] = useState(false);
    const { addItem } = useCart(); 

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-navy/10">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setWishlisted((w) => !w);
                }}
                aria-label="Toggle wishlist"
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"
            >
                <svg
                    className={`h-3.5 w-3.5 transition ${wishlisted ? 'fill-brand-orange text-brand-orange' : 'fill-none text-ink/40'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {product.oldPrice && (
                <div
                    className="absolute left-0 top-2.5 z-10 flex h-5 items-center bg-brand-orange pl-2 pr-2.5 text-[9px] font-bold text-white shadow-sm"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)' }}
                >
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
            )}

            {/* 👇 Ekhon div + Link + button — 3 ta alada element */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
                <Link href={`/category/product/${product.id}`} className="block h-full w-full">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.badge && (
                        <span
                            className={`absolute bottom-9 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white sm:bottom-2 ${
                                product.badge === 'New' ? 'bg-brand-teal' : 'bg-brand-navy'
                            }`}
                        >
                            {product.badge}
                        </span>
                    )}
                </Link>

                {/* ✅ Real button — click korle cart e add hobe, page e jabe na */}
                <button
                    type="button"
                    onClick={() => addItem(product)}
                    className="absolute inset-x-0 bottom-0 bg-brand-navy/95 py-1.5 text-center text-[11px] font-semibold text-white transition-transform duration-300 sm:translate-y-full sm:group-hover:translate-y-0 sm:focus-visible:translate-y-0"
                >
                    Quick add to cart
                </button>
            </div>

            <Link href={`/category/product/${product.id}`} className="flex flex-1 flex-col p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                    {product.brand}
                </p>

                <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-brand-navy sm:text-sm">
                    {product.name}
                </h3>

                <div className="mt-1.5 flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-[11px] text-ink/40">({product.reviews})</span>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-display text-sm font-bold text-brand-navy sm:text-base">
                        ৳{product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                        <span className="text-[11px] text-ink/40 line-through">
                            ৳{product.oldPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                    {product.colors.map((c) => (
                        <span
                            key={c}
                            className="h-3.5 w-3.5 rounded-full border border-line"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <span className="text-[10px] text-ink/40">{product.colors.length} colors</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {product.freeShipping && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-teal/10 px-2 py-0.5 text-[9px] font-semibold text-brand-teal">
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-3H5a2 2 0 00-2 2v1z" />
                            </svg>
                            Free shipping
                        </span>
                    )}
                    {product.lowStock && (
                        <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[9px] font-semibold text-brand-orange">
                            Only {product.stockLeft} left
                        </span>
                    )}
                </div>

                <p className="mt-auto pt-2 text-[10px] text-ink/40">{product.sold} sold</p>
            </Link>
        </div>
    );
};