"use client";

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const SORT_OPTIONS = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'];
const PRICE_RANGES = [
    { label: 'All prices', min: 0, max: Infinity },
    { label: 'Under ৳500', min: 0, max: 500 },
    { label: '৳500 – 1,500', min: 500, max: 1500 },
    { label: '৳1,500 – 3,000', min: 1500, max: 3000 },
    { label: 'Above ৳3,000', min: 3000, max: Infinity },
];
const RATING_FILTERS = [4.5, 4, 3.5, 0];
const COLOR_SWATCHES = ['#12203D', '#FF5A1F', '#0FA98A', '#E7E1D6'];
const BRANDS = ['Xiaomi', 'Samsung', 'Anker', 'JBL', 'Philips', 'Logitech'];

const IMAGE_POOL = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
];


const generateFakeProducts = (slug, count = 20) => {
    const displayName = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return Array.from({ length: count }, (_, i) => {
        const basePrice = 250 + ((i * 137) % 3600);
        const hasDiscount = i % 3 !== 0;
        const discountPct = hasDiscount ? 15 + ((i * 7) % 45) : 0;
        const oldPrice = hasDiscount ? Math.round(basePrice / (1 - discountPct / 100)) : null;
        const stockLeft = (i * 17) % 30;

        return {
            id: `${slug}-${i + 1}`,
            name: `${displayName} ${['Classic', 'Pro', 'Lite', 'Max', 'Essential', 'Plus'][i % 6]}`,
            brand: BRANDS[i % BRANDS.length],
            image: IMAGE_POOL[i % IMAGE_POOL.length],
            price: basePrice,
            oldPrice,
            rating: Number((3.8 + ((i * 13) % 12) / 10).toFixed(1)),
            reviews: 20 + ((i * 53) % 900),
            sold: 10 + ((i * 29) % 500),
            badge: i % 5 === 0 ? 'New' : i % 4 === 0 ? 'Hot' : null,
            freeShipping: i % 3 === 0,
            lowStock: stockLeft > 0 && stockLeft <= 5,
            stockLeft,
            colors: COLOR_SWATCHES.slice(0, 2 + (i % 3)),
        };
    });
};

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
        <svg className="h-3.5 w-3.5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
        <span className="text-xs font-medium text-ink/70">{rating}</span>
    </div>
);

const ProductCard = ({ product }) => {
    const [wishlisted, setWishlisted] = useState(false);

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

            <Link href={`/category/product/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                    <span
                        className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white ${
                            product.badge === 'New' ? 'bg-brand-teal' : 'bg-brand-navy'
                        }`}
                    >
                        {product.badge}
                    </span>
                )}

                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-brand-navy/95 py-1.5 text-center transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-[11px] font-semibold text-white">Quick add to cart</span>
                </div>
            </Link>

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

const CategoryPage = () => {
    const params = useParams();
    const slug = params?.slug ?? 'products';

    const displayName = useMemo(
        () =>
            slug
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
        [slug]
    );

    const allProducts = useMemo(() => generateFakeProducts(slug), [slug]);
    const heroImage = allProducts[0]?.image;
    const avgRating = useMemo(
        () => (allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(1),
        [allProducts]
    );

    const [activePriceRange, setActivePriceRange] = useState(PRICE_RANGES[0]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
    const [visibleCount, setVisibleCount] = useState(9);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const filtered = useMemo(() => {
        let list = allProducts.filter(
            (p) =>
                p.price >= activePriceRange.min &&
                p.price <= activePriceRange.max &&
                p.rating >= minRating
        );

        switch (sortBy) {
            case 'Price: Low to High':
                list = [...list].sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                list = [...list].sort((a, b) => b.price - a.price);
                break;
            case 'Top Rated':
                list = [...list].sort((a, b) => b.rating - a.rating);
                break;
            case 'Newest':
                list = [...list].reverse();
                break;
            default:
                break;
        }
        return list;
    }, [allProducts, activePriceRange, minRating, sortBy]);

    const visibleProducts = filtered.slice(0, visibleCount);
    const hasActiveFilters = activePriceRange.label !== 'All prices' || minRating > 0;

    const clearFilters = () => {
        setActivePriceRange(PRICE_RANGES[0]);
        setMinRating(0);
        setVisibleCount(9);
    };

    const FilterPanel = () => (
        <div className="space-y-7">
            <div>
                <h3 className="text-sm font-bold text-brand-navy">Price</h3>
                <div className="mt-3 space-y-1">
                    {PRICE_RANGES.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => {
                                setActivePriceRange(range);
                                setVisibleCount(9);
                            }}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition ${
                                activePriceRange.label === range.label
                                    ? 'bg-brand-orange/10 font-semibold text-brand-orange'
                                    : 'text-ink/70 hover:bg-brand-cream'
                            }`}
                        >
                            <span
                                className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                                    activePriceRange.label === range.label
                                        ? 'border-brand-orange bg-brand-orange'
                                        : 'border-line'
                                }`}
                            />
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-line pt-6">
                <h3 className="text-sm font-bold text-brand-navy">Minimum rating</h3>
                <div className="mt-3 space-y-1">
                    {RATING_FILTERS.map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${
                                minRating === rating
                                    ? 'bg-brand-orange/10 font-semibold text-brand-orange'
                                    : 'text-ink/70 hover:bg-brand-cream'
                            }`}
                        >
                            {rating === 0 ? (
                                'Any rating'
                            ) : (
                                <>
                                    <svg className="h-3.5 w-3.5 fill-brand-orange" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                    {rating}+ &amp; up
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="w-full rounded-full border border-line py-2 text-xs font-semibold text-ink/60 transition hover:border-brand-orange hover:text-brand-orange"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <main className="min-h-screen">
            <div className="relative overflow-hidden bg-brand-navy">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                    }}
                />

                <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:py-16">
                    <div className="w-full text-center lg:max-w-lg lg:text-left">
                        <nav className="flex items-center justify-center gap-2 text-xs font-medium text-white/60 lg:justify-start">
                            <Link href="/" className="transition hover:text-white">Home</Link>
                            <span>/</span>
                            <span className="text-white">{displayName}</span>
                        </nav>

                        <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            {displayName}
                        </h1>
                        <p className="mt-3 text-sm text-white/70 sm:text-base">
                            Curated picks, verified sellers, and fast local delivery.
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                <span className="font-display text-base font-bold text-white">{allProducts.length}+</span>
                                <span className="text-xs text-white/70">products</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                <svg className="h-3.5 w-3.5 fill-brand-orange" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                                <span className="font-display text-base font-bold text-white">{avgRating}</span>
                                <span className="text-xs text-white/70">avg. rating</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                <span className="font-display text-base font-bold text-white">2–3</span>
                                <span className="text-xs text-white/70">days delivery</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full max-w-xs shrink-0 sm:max-w-sm">
                        <div className="overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl">
                            <img src={heroImage} alt={displayName} className="aspect-[4/3] w-full object-cover" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" />
                                </svg>
                            </span>
                            <div>
                                <p className="text-[10px] text-ink/40">Fast delivery</p>
                                <p className="text-xs font-bold text-brand-navy">2–3 business days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <aside className="hidden w-56 shrink-0 lg:block">
                        <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
                            <FilterPanel />
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-brand-navy lg:hidden"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6M11 16h2" />
                                </svg>
                                Filters
                                {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />}
                            </button>

                            <p className="hidden text-sm text-ink/50 lg:block">
                                {filtered.length} products
                            </p>

                            <div className="ml-auto flex items-center gap-2">
                                <label className="hidden text-xs font-medium text-ink/50 sm:block">Sort by</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-navy outline-none focus:border-brand-orange"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <p className="mt-2 text-xs text-ink/40 lg:hidden">{filtered.length} products found</p>

                        {visibleProducts.length > 0 ? (
                            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {visibleProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-16 flex flex-col items-center justify-center text-center">
                                <p className="text-sm text-ink/50">No products match these filters.</p>
                                <button onClick={clearFilters} className="mt-3 text-sm font-semibold text-brand-orange">
                                    Clear filters
                                </button>
                            </div>
                        )}

                        {visibleCount < filtered.length && (
                            <div className="mt-10 flex justify-center">
                                <button
                                    onClick={() => setVisibleCount((c) => c + 9)}
                                    className="rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-orange hover:text-brand-orange"
                                >
                                    Load more products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm"
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="font-display text-lg font-bold text-brand-navy">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="text-ink/40">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <FilterPanel />
                        <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="mt-6 w-full rounded-full bg-brand-navy py-3 text-sm font-semibold text-white"
                        >
                            Show {filtered.length} results
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CategoryPage;