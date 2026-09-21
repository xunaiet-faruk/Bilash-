"use client";

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/component/shared/Cartcontext';
import { StarRating } from '@/app/component/shared/StarRating';

/* ─────────────────────────────────────────────
   COMPACT PRODUCT CARD
   ───────────────────────────────────────────── */
const ProductCard = ({ product, index }) => {
    const [wishlisted, setWishlisted] = useState(false);
    const { addItem } = useCart();

    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-line/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(18,32,61,0.22)] hover:ring-brand-navy/15"
            style={{ animation: `cardIn 0.4s ease-out ${index * 0.04}s both` }}
        >
            {/* Top badges */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-2">
                {discount > 0 ? (
                    <span className="rounded-full bg-gradient-to-br from-brand-orange to-red-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                        −{discount}%
                    </span>
                ) : <span />}

                <button
                    onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
                    aria-label="Wishlist"
                    className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition ${
                        wishlisted
                            ? 'bg-brand-orange/95 scale-105 shadow-md shadow-brand-orange/30'
                            : 'bg-white/85 hover:bg-white shadow-sm'
                    }`}
                >
                    <svg
                        className={`h-3 w-3 transition ${wishlisted ? 'fill-white text-white' : 'fill-none text-brand-navy'}`}
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Image — shorter aspect */}
            <Link href={`/category/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-brand-cream">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />

                {product.badge && (
                    <span
                        className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm ${
                            product.badge === 'New' ? 'bg-brand-teal/95' : 'bg-brand-navy/95'
                        }`}
                    >
                        {product.badge}
                    </span>
                )}

                {/* Quick add — slides up */}
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); addItem(product); }}
                    className="absolute inset-x-2 bottom-2 z-10 flex translate-y-[130%] items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 text-[10px] font-bold text-brand-navy shadow-md backdrop-blur-md transition-all duration-300 hover:bg-brand-navy hover:text-white group-hover:translate-y-0"
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Quick Add
                </button>
            </Link>

            {/* Compact info */}
            <Link href={`/category/product/${product.id}`} className="flex flex-1 flex-col p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-brand-teal">
                    {product.brand}
                </p>

                <h3 className="mt-0.5 line-clamp-1 text-xs font-semibold leading-snug text-brand-navy transition-colors group-hover:text-brand-orange">
                    {product.name}
                </h3>

                <div className="mt-1 flex items-center gap-1">
                    <StarRating rating={product.rating} size="h-2.5 w-2.5" />
                    <span className="text-[9px] text-ink/50">({product.reviews})</span>
                </div>

                <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="font-display text-sm font-bold tracking-tight text-brand-navy">
                        ৳{product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                        <span className="text-[10px] text-ink/40 line-through">
                            ৳{product.oldPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-line/60 pt-2">
                    <div className="flex items-center gap-0.5">
                        {product.colors.slice(0, 3).map((c, i) => (
                            <span
                                key={c}
                                className="h-3 w-3 rounded-full ring-[1.5px] ring-white"
                                style={{ backgroundColor: c, marginLeft: i > 0 ? '-5px' : 0 }}
                            />
                        ))}
                    </div>
                    <span className="text-[9px] font-medium text-ink/40">{product.sold} sold</span>
                </div>
            </Link>
        </div>
    );
};

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const CATEGORY_PRODUCTS = [
    { id: 't-shirt-1', name: 'Everyday Cotton T-Shirt', brand: 'Bilash Basics', price: 590, oldPrice: 790, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', rating: 4.5, reviews: 128, colors: ['#12203D', '#E7E1D6', '#0FA98A'], badge: 'New', freeShipping: true, sold: 340 },
    { id: 'headphone-1', name: 'Wireless Headphones Pro', brand: 'Anker', price: 1890, oldPrice: 2490, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', rating: 4.7, reviews: 284, colors: ['#12203D', '#E7E1D6'], badge: 'Hot', freeShipping: true, sold: 512 },
    { id: 'sneakers-1', name: 'Classic Everyday Sneakers', brand: 'Puma', price: 2190, oldPrice: 2990, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', rating: 4.4, reviews: 96, colors: ['#E7E1D6', '#12203D'], badge: null, freeShipping: false, sold: 188 },
    { id: 'smart-watch-1', name: 'Smart Watch Fit 2', brand: 'Xiaomi', price: 1450, oldPrice: 2900, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', rating: 4.8, reviews: 410, colors: ['#12203D', '#FF5A1F'], badge: 'Hot', freeShipping: true, sold: 690 },
    { id: 'sunglasses-1', name: 'Classic Polarized Sunglasses', brand: 'Bilash Select', price: 850, oldPrice: 1200, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', rating: 4.3, reviews: 74, colors: ['#12203D', '#E7E1D6'], badge: null, freeShipping: false, sold: 142 },
    { id: 'backpack-1', name: 'Everyday Travel Backpack', brand: 'Bilash Gear', price: 1120, oldPrice: 1600, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', rating: 4.6, reviews: 151, colors: ['#12203D', '#0FA98A'], badge: 'New', freeShipping: true, sold: 275 },
];

/* ─────────────────────────────────────────────
   FILTER CONFIG
   ───────────────────────────────────────────── */
const PRICE_RANGES = [
    { key: 'under-1k', label: 'Under ৳1,000', test: (p) => p.price < 1000 },
    { key: '1k-2k', label: '৳1,000 – ৳2,000', test: (p) => p.price >= 1000 && p.price <= 2000 },
    { key: '2k-3k', label: '৳2,000 – ৳3,000', test: (p) => p.price > 2000 && p.price <= 3000 },
    { key: 'above-3k', label: 'Above ৳3,000', test: (p) => p.price > 3000 },
];

const RATING_FILTERS = [
    { key: '4.5', label: '4.5★ & above', test: (p) => p.rating >= 4.5 },
    { key: '4', label: '4.0★ & above', test: (p) => p.rating >= 4 },
    { key: '3.5', label: '3.5★ & above', test: (p) => p.rating >= 3.5 },
];

const SORT_OPTIONS = [
    { key: 'featured', label: 'Featured' },
    { key: 'price-low', label: 'Price: Low → High' },
    { key: 'price-high', label: 'Price: High → Low' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'discount', label: 'Biggest Discount' },
    { key: 'popular', label: 'Most Popular' },
];

const COLOR_SWATCHES = [
    { hex: '#12203D', name: 'Navy' },
    { hex: '#FF5A1F', name: 'Orange' },
    { hex: '#0FA98A', name: 'Teal' },
    { hex: '#E7E1D6', name: 'Cream' },
];

/* ─────────────────────────────────────────────
   SIDEBAR
   ───────────────────────────────────────────── */
const FilterSidebar = ({
    brands, allColors,
    selectedBrands, toggleBrand,
    selectedPrices, togglePrice,
    selectedRatings, toggleRating,
    selectedColors, toggleColor,
    showOnlyDeals, setShowOnlyDeals,
    freeShippingOnly, setFreeShippingOnly,
    resetAll, activeCount,
    isOpen, onClose,
}) => {
    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white p-5 shadow-xl transition-transform duration-300 lg:sticky lg:top-20 lg:z-0 lg:max-h-[calc(100vh-6rem)] lg:w-full lg:translate-x-0 lg:rounded-2xl lg:border lg:border-line/60 lg:p-5 lg:shadow-none ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <h2 className="text-sm font-bold text-brand-navy">Filters</h2>
                        {activeCount > 0 && (
                            <span className="rounded-full bg-brand-orange px-1.5 py-0.5 text-[9px] font-bold text-white">
                                {activeCount}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {activeCount > 0 && (
                            <button onClick={resetAll} className="text-[10px] font-semibold text-brand-orange hover:underline">
                                Clear
                            </button>
                        )}
                        <button onClick={onClose} className="lg:hidden">
                            <svg className="h-4 w-4 text-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Quick toggles */}
                <div className="mb-5 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setShowOnlyDeals(!showOnlyDeals)}
                        className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition ${
                            showOnlyDeals
                                ? 'bg-brand-orange text-white shadow-sm'
                                : 'bg-brand-cream/70 text-brand-navy hover:bg-brand-cream'
                        }`}
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Deals
                    </button>
                    <button
                        onClick={() => setFreeShippingOnly(!freeShippingOnly)}
                        className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition ${
                            freeShippingOnly
                                ? 'bg-brand-teal text-white shadow-sm'
                                : 'bg-brand-cream/70 text-brand-navy hover:bg-brand-cream'
                        }`}
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-3H5a2 2 0 00-2 2v1z" />
                        </svg>
                        Free Ship
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Brand */}
                    <FilterSection title="Brand" defaultOpen>
                        <div className="space-y-1.5">
                            {brands.map((b) => (
                                <label key={b} className="flex cursor-pointer items-center gap-2 text-[11px] text-ink/70 hover:text-brand-navy">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(b)}
                                        onChange={() => toggleBrand(b)}
                                        className="h-3.5 w-3.5 accent-brand-orange"
                                    />
                                    <span>{b}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Price */}
                    <FilterSection title="Price" defaultOpen>
                        <div className="space-y-1.5">
                            {PRICE_RANGES.map((r) => (
                                <label key={r.key} className="flex cursor-pointer items-center gap-2 text-[11px] text-ink/70 hover:text-brand-navy">
                                    <input
                                        type="checkbox"
                                        checked={selectedPrices.includes(r.key)}
                                        onChange={() => togglePrice(r.key)}
                                        className="h-3.5 w-3.5 accent-brand-orange"
                                    />
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Rating */}
                    <FilterSection title="Rating" defaultOpen>
                        <div className="space-y-1.5">
                            {RATING_FILTERS.map((r) => (
                                <label key={r.key} className="flex cursor-pointer items-center gap-2 text-[11px] text-ink/70 hover:text-brand-navy">
                                    <input
                                        type="checkbox"
                                        checked={selectedRatings.includes(r.key)}
                                        onChange={() => toggleRating(r.key)}
                                        className="h-3.5 w-3.5 accent-brand-orange"
                                    />
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Color */}
                    <FilterSection title="Color" defaultOpen>
                        <div className="flex flex-wrap gap-2">
                            {allColors.map((c) => {
                                const active = selectedColors.includes(c.hex);
                                return (
                                    <button
                                        key={c.hex}
                                        onClick={() => toggleColor(c.hex)}
                                        title={c.name}
                                        className={`h-7 w-7 rounded-full transition-all ${
                                            active
                                                ? 'ring-2 ring-brand-orange ring-offset-2 scale-105'
                                                : 'ring-1 ring-line hover:scale-105'
                                        }`}
                                        style={{ backgroundColor: c.hex }}
                                    />
                                );
                            })}
                        </div>
                    </FilterSection>
                </div>
            </aside>
        </>
    );
};

/* Sidebar section wrapper (collapsible) */
const FilterSection = ({ title, defaultOpen = false, children }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-line/60 pt-4 first:border-t-0 first:pt-0">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="text-[11px] font-bold uppercase tracking-wide text-brand-navy">{title}</span>
                <svg
                    className={`h-3 w-3 text-ink/40 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className="grid overflow-hidden transition-all duration-300"
                style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
                <div className="min-h-0 overflow-hidden pt-3">{children}</div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   CATEGORY PAGE
   ───────────────────────────────────────────── */
export default function CategoryPage() {
    const { slug } = useParams();
    const categoryName = String(slug || 'shop').replace(/-/g, ' ');

    const [sortBy, setSortBy] = useState('featured');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [showOnlyDeals, setShowOnlyDeals] = useState(false);
    const [freeShippingOnly, setFreeShippingOnly] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const brands = useMemo(
        () => Array.from(new Set(CATEGORY_PRODUCTS.map((p) => p.brand))).sort(),
        []
    );

    /* ─── Filter pipeline ─── */
    const products = useMemo(() => {
        let list = [...CATEGORY_PRODUCTS];

        if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));

        if (selectedPrices.length) {
            list = list.filter((p) =>
                selectedPrices.some((key) => {
                    const r = PRICE_RANGES.find((x) => x.key === key);
                    return r?.test(p);
                })
            );
        }

        if (selectedRatings.length) {
            list = list.filter((p) =>
                selectedRatings.some((key) => {
                    const r = RATING_FILTERS.find((x) => x.key === key);
                    return r?.test(p);
                })
            );
        }

        if (selectedColors.length) {
            list = list.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
        }

        if (showOnlyDeals) list = list.filter((p) => p.oldPrice);
        if (freeShippingOnly) list = list.filter((p) => p.freeShipping);

        if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'popular') list.sort((a, b) => b.sold - a.sold);
        else if (sortBy === 'discount') {
            list.sort((a, b) => {
                const da = a.oldPrice ? 1 - a.price / a.oldPrice : 0;
                const db = b.oldPrice ? 1 - b.price / b.oldPrice : 0;
                return db - da;
            });
        }

        return list;
    }, [selectedBrands, selectedPrices, selectedRatings, selectedColors, showOnlyDeals, freeShippingOnly, sortBy]);

    /* ─── Toggle helpers ─── */
    const toggle = (setter) => (val) =>
        setter((arr) => (arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]));

    const toggleBrand = toggle(setSelectedBrands);
    const togglePrice = toggle(setSelectedPrices);
    const toggleRating = toggle(setSelectedRatings);
    const toggleColor = toggle(setSelectedColors);

    const resetAll = () => {
        setSelectedBrands([]);
        setSelectedPrices([]);
        setSelectedRatings([]);
        setSelectedColors([]);
        setShowOnlyDeals(false);
        setFreeShippingOnly(false);
    };

    const activeCount =
        selectedBrands.length +
        selectedPrices.length +
        selectedRatings.length +
        selectedColors.length +
        (showOnlyDeals ? 1 : 0) +
        (freeShippingOnly ? 1 : 0);

    const allColors = useMemo(() => {
        const set = new Map();
        CATEGORY_PRODUCTS.forEach((p) => p.colors.forEach((c) => {
            if (!set.has(c)) {
                const found = COLOR_SWATCHES.find((s) => s.hex === c);
                set.set(c, found || { hex: c, name: c });
            }
        }));
        return Array.from(set.values());
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-b from-brand-cream/20 via-white to-white">
           <style>{`
    /* Global cursor fix */
    button:not(:disabled),
    a,
    select,
    label[for],
    [role="button"],
    input[type="checkbox"],
    input[type="radio"] {
        cursor: pointer;
    }

    /* Disabled buttons */
    button:disabled {
        cursor: not-allowed;
    }

    @keyframes cardIn {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatShape {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        50%      { transform: translate(10px, -10px) rotate(8deg); }
    }
    @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
    }
`}</style>
            {/* ─── HERO ─── */}
          {/* ─── PREMIUM HERO BANNER ─── */}
<section className="relative overflow-hidden border-b border-line/60 bg-gradient-to-br from-brand-navy via-[#1a2d52] to-brand-navy">
    {/* Decorative grid pattern */}
    <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
        }}
    />

    {/* Floating color blobs */}
    <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-orange/30 blur-3xl"
        style={{ animation: 'floatShape 8s ease-in-out infinite' }}
    />
    <div
        className="pointer-events-none absolute -bottom-24 right-1/4 h-60 w-60 rounded-full bg-brand-teal/25 blur-3xl"
        style={{ animation: 'floatShape 10s ease-in-out infinite reverse' }}
    />

    {/* Content */}
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <nav
            className="flex items-center gap-2 text-[11px] text-white/60"
            style={{ animation: 'heroIn 0.5s ease-out both' }}
        >
            <Link href="/" className="transition hover:text-brand-orange">Home</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="capitalize font-medium text-white">{categoryName}</span>
        </nav>

        {/* Title + Subtitle */}
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div style={{ animation: 'heroIn 0.6s ease-out 0.05s both' }}>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
                        Curated Collection
                    </span>
                </div>

                <h1 className="mt-3 font-display text-3xl font-bold capitalize leading-tight tracking-tight text-white sm:text-4xl lg:text-[44px]">
                    {categoryName}
                </h1>

                <p className="mt-2 max-w-xl text-sm text-white/60">
                    Hand-picked pieces with verified quality, fast delivery, and easy returns.
                </p>
            </div>

            {/* Stats chips */}
            <div
                className="flex flex-wrap items-center gap-2"
                style={{ animation: 'heroIn 0.6s ease-out 0.15s both' }}
            >
                <StatChip label="Products" value={products.length} />
                <StatChip label="Deals" value={CATEGORY_PRODUCTS.filter((p) => p.oldPrice).length} accent />
                <StatChip label="Top Rated" value="4.5★+" />
            </div>
        </div>
    </div>

    {/* Bottom gradient line */}
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-orange/60 to-transparent" />
</section>

            {/* ─── MAIN LAYOUT: SIDEBAR + GRID ─── */}
            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-6">
                    {/* SIDEBAR */}
                    <FilterSidebar
                        brands={brands}
                        allColors={allColors}
                        selectedBrands={selectedBrands}
                        toggleBrand={toggleBrand}
                        selectedPrices={selectedPrices}
                        togglePrice={togglePrice}
                        selectedRatings={selectedRatings}
                        toggleRating={toggleRating}
                        selectedColors={selectedColors}
                        toggleColor={toggleColor}
                        showOnlyDeals={showOnlyDeals}
                        setShowOnlyDeals={setShowOnlyDeals}
                        freeShippingOnly={freeShippingOnly}
                        setFreeShippingOnly={setFreeShippingOnly}
                        resetAll={resetAll}
                        activeCount={activeCount}
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                    />

                    {/* RIGHT CONTENT */}
                    <div>
                        {/* Top toolbar */}
                        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-white px-3 py-2">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-1.5 rounded-lg bg-brand-cream/70 px-3 py-1.5 text-[11px] font-bold text-brand-navy transition hover:bg-brand-cream lg:hidden"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters {activeCount > 0 && `(${activeCount})`}
                            </button>

                            <p className="hidden text-[11px] text-ink/50 lg:block">
                                Showing <span className="font-bold text-brand-navy">{products.length}</span> results
                            </p>

                            <div className="ml-auto relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="cursor-pointer appearance-none rounded-full border border-line bg-white py-1.5 pl-3 pr-7 text-[11px] font-semibold text-brand-navy outline-none transition hover:border-brand-navy/30 focus:border-brand-orange"
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.key} value={o.key}>{o.label}</option>
                                    ))}
                                </select>
                                <svg
                                    className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/40"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Active filter chips */}
                        {activeCount > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1.5">
                                {selectedBrands.map((b) => (
                                    <Chip key={`b-${b}`} label={b} onRemove={() => toggleBrand(b)} />
                                ))}
                                {selectedPrices.map((p) => (
                                    <Chip key={`p-${p}`} label={PRICE_RANGES.find((r) => r.key === p)?.label} onRemove={() => togglePrice(p)} />
                                ))}
                                {selectedRatings.map((r) => (
                                    <Chip key={`r-${r}`} label={RATING_FILTERS.find((x) => x.key === r)?.label} onRemove={() => toggleRating(r)} />
                                ))}
                                {selectedColors.map((c) => (
                                    <Chip
                                        key={`c-${c}`}
                                        label={COLOR_SWATCHES.find((s) => s.hex === c)?.name || c}
                                        swatch={c}
                                        onRemove={() => toggleColor(c)}
                                    />
                                ))}
                                {showOnlyDeals && <Chip label="Deals only" onRemove={() => setShowOnlyDeals(false)} />}
                                {freeShippingOnly && <Chip label="Free shipping" onRemove={() => setFreeShippingOnly(false)} />}
                            </div>
                        )}

                        {/* Grid */}
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-line/60 bg-white py-20 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream">
                                    <svg className="h-6 w-6 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-3 text-sm font-bold text-brand-navy">No matches</h3>
                                <p className="mt-1 text-xs text-ink/50">Try adjusting your filters</p>
                                <button
                                    onClick={resetAll}
                                    className="mt-4 rounded-full bg-brand-navy px-4 py-1.5 text-[11px] font-semibold text-white transition hover:bg-brand-navy-light"
                                >
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product, i) => (
                                    <ProductCard key={product.id} product={product} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

/* ─────────────────────────────────────────────
   ACTIVE FILTER CHIP
   ───────────────────────────────────────────── */
const Chip = ({ label, swatch, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/5 py-1 pl-2.5 pr-1.5 text-[10px] font-semibold text-brand-navy">
        {swatch && (
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-line" style={{ backgroundColor: swatch }} />
        )}
        {label}
        <button
            onClick={onRemove}
            className="flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-brand-navy/10"
        >
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </span>
);

/* ─────────────────────────────────────────────
   HERO STAT CHIP
   ───────────────────────────────────────────── */
const StatChip = ({ label, value, accent = false }) => (
    <div
        className={`flex flex-col rounded-xl border px-3 py-2 backdrop-blur-sm ${
            accent
                ? 'border-brand-orange/40 bg-brand-orange/15'
                : 'border-white/15 bg-white/5'
        }`}
    >
        <span className={`text-[9px] font-bold uppercase tracking-wider ${accent ? 'text-brand-orange' : 'text-white/50'}`}>
            {label}
        </span>
        <span className="mt-0.5 font-display text-base font-bold text-white">
            {value}
        </span>
    </div>
);