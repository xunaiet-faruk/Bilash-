"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const COLOR_SWATCHES = ['#12203D', '#FF5A1F', '#0FA98A', '#E7E1D6'];
const BRANDS = ['Xiaomi', 'Samsung', 'Anker', 'JBL', 'Philips', 'Logitech'];
const STORE_PHONE_DISPLAY = '+880 1XXX-XXXXXX';
const STORE_PHONE_TEL = '+8801XXXXXXXXX';
const STORE_WHATSAPP = '8801XXXXXXXXX';

const IMAGE_POOL = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
];

const FEATURE_ICONS = [
    'M13 10V3L4 14h7v7l9-11h-7z',
    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
];

const parseProductId = (id) => {
    const parts = id.split('-');
    const index = Number(parts[parts.length - 1]) || 1;
    const slug = parts.slice(0, -1).join('-') || 'products';
    return { slug, index };
};

const generateFakeProduct = (id) => {
    const { slug, index } = parseProductId(id);
    const i = index - 1;
    const displayName = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    const variantName = ['Classic', 'Pro', 'Lite', 'Max', 'Essential', 'Plus'][i % 6];

    const basePrice = 250 + ((i * 137) % 3600);
    const hasDiscount = i % 3 !== 0;
    const discountPct = hasDiscount ? 15 + ((i * 7) % 45) : 0;
    const oldPrice = hasDiscount ? Math.round(basePrice / (1 - discountPct / 100)) : null;
    const stockLeft = (i * 17) % 30;

    const images = [
        IMAGE_POOL[i % IMAGE_POOL.length],
        IMAGE_POOL[(i + 2) % IMAGE_POOL.length],
        IMAGE_POOL[(i + 5) % IMAGE_POOL.length],
    ];

    const ratingBreakdown = [
        { stars: 5, pct: 58 + (i % 10) },
        { stars: 4, pct: 24 - (i % 6) },
        { stars: 3, pct: 10 },
        { stars: 2, pct: 5 },
        { stars: 1, pct: 3 },
    ];

    return {
        id,
        slug,
        name: `${displayName} ${variantName}`,
        variantName,
        brand: BRANDS[i % BRANDS.length],
        images,
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
        description: `The ${displayName} ${variantName} is engineered for everyday reliability — sourced through our China-direct and local warehouse pipeline, quality-checked before it ever reaches your door, and backed by verified sellers with easy returns.`,
        highlights: [
            { title: 'Fast delivery', desc: '2–3 days across Dhaka, 4–6 days nationwide.', icon: FEATURE_ICONS[0] },
            { title: 'Quality checked', desc: 'Inspected before dispatch by our fulfillment team.', icon: FEATURE_ICONS[1] },
            { title: '7-day returns', desc: 'Full refund if it is not what you expected.', icon: FEATURE_ICONS[2] },
            { title: '12-month warranty', desc: 'Covered against manufacturing defects.', icon: FEATURE_ICONS[3] },
        ],
        specs: [
            { label: 'Brand', value: BRANDS[i % BRANDS.length] },
            { label: 'Model', value: `${displayName.slice(0, 3).toUpperCase()}-${1000 + i}` },
            { label: 'Warranty', value: '12 months' },
            { label: 'Origin', value: i % 2 === 0 ? 'China Direct' : 'Local Stock' },
            { label: 'Weight', value: `${(0.2 + (i % 5) * 0.15).toFixed(2)} kg` },
            { label: 'Material', value: i % 2 === 0 ? 'ABS + Aluminum' : 'Reinforced polymer' },
            { label: 'In the box', value: '1x unit, manual, warranty card' },
        ],
        ratingBreakdown,
    };
};

const generateRelated = (slug, excludeId, count = 4) =>
    Array.from({ length: count }, (_, i) => generateFakeProduct(`${slug}-${i + 10}`)).filter(
        (p) => p.id !== excludeId
    );

const StarRating = ({ rating, size = 'h-4 w-4' }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
            <svg
                key={n}
                className={`${size} ${n <= Math.round(rating) ? 'text-brand-orange' : 'text-line'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        ))}
    </div>
);

const useCountUp = (target, duration = 500) => {
    const [value, setValue] = useState(target);
    const prevRef = useRef(target);
    useEffect(() => {
        const from = prevRef.current;
        const to = target;
        let raf;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(from + (to - from) * eased);
            if (progress < 1) {
                raf = requestAnimationFrame(step);
            } else {
                prevRef.current = to;
            }
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return value;
};

const Accordion = ({ title, defaultOpen, children }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-line">
            <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-4 text-left">
                <span className="text-sm font-bold text-brand-navy">{title}</span>
                <svg
                    className={`h-4 w-4 text-ink/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className="grid overflow-hidden transition-all duration-300" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                <div className="min-h-0 overflow-hidden pb-5">{children}</div>
            </div>
        </div>
    );
};

/* ============================================================
   🔍 IMAGE GALLERY with hover-zoom (fixed)
   ============================================================ */
const ImageGallery = ({ product, activeImage, setActiveImage }) => {
    const [zoomed, setZoomed] = useState(false);
    const [origin, setOrigin] = useState({ x: 50, y: 50 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        // clamp between 0 and 100 so it never overshoots
        setOrigin({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        });
    };

    return (
        <div>
            <div className="flex gap-3">
                {/* Vertical thumbnail rail — desktop */}
                <div className="hidden shrink-0 flex-col gap-3 sm:flex">
                    {product.images.map((img, i) => (
                        <button
                            key={img + i}
                            onClick={() => {
                                setActiveImage(i);
                                setZoomed(false);
                            }}
                            onMouseEnter={() => setActiveImage(i)}
                            className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                                activeImage === i ? 'border-brand-orange' : 'border-line hover:border-brand-orange/40'
                            }`}
                        >
                            <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Main image with hover-zoom */}
                <div
                    ref={containerRef}
                    className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-white"
                    onMouseEnter={() => setZoomed(true)}
                    onMouseLeave={() => setZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <img
                        key={activeImage}
                        src={product.images[activeImage]}
                        alt={product.name}
                        draggable={false}
                        className="pointer-events-none h-full w-full select-none object-cover will-change-transform"
                        style={{
                            transform: zoomed ? 'scale(2.2)' : 'scale(1)',
                            transformOrigin: `${origin.x}% ${origin.y}%`,
                            transition: zoomed
                                ? 'transform 0.08s linear'
                                : 'transform 0.35s ease-out',
                        }}
                    />

                    {product.badge && (
                        <span
                            className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${
                                product.badge === 'New' ? 'bg-brand-teal' : 'bg-brand-navy'
                            }`}
                        >
                            {product.badge}
                        </span>
                    )}
                    {product.oldPrice && (
                        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-sm">
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                        </span>
                    )}

                    {/* Zoom hint */}
                    <div
                        className={`pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-brand-navy/80 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur transition-opacity duration-200 ${
                            zoomed ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0zM11 8v6M8 11h6" />
                        </svg>
                        Hover to zoom
                    </div>
                </div>
            </div>

            {/* Horizontal thumbnail row — mobile */}
            <div className="mt-3 flex gap-2.5 sm:hidden">
                {product.images.map((img, i) => (
                    <button
                        key={img + i}
                        onClick={() => setActiveImage(i)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activeImage === i ? 'border-brand-orange' : 'border-line'
                        }`}
                    >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

// Compact card used in the "Featured products" rail — quick add-to-cart
// without leaving the page, but the card itself still opens the detail page.
const FeatureProductCard = ({ product, onAddToCart, justAddedId }) => (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-navy/10">
        <Link href={`/category/product/${product.id}`} className="relative aspect-square w-full overflow-hidden">
            <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {product.badge && (
                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white ${product.badge === 'New' ? 'bg-brand-teal' : 'bg-brand-navy'}`}>
                    {product.badge}
                </span>
            )}
            {product.oldPrice && (
                <span className="absolute right-2 top-2 rounded-full bg-brand-orange px-2 py-0.5 text-[9px] font-bold text-white">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
            )}
        </Link>
        <Link href={`/category/product/${product.id}`} className="flex flex-1 flex-col p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-brand-teal">{product.brand}</p>
            <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold text-brand-navy sm:text-sm">{product.name}</h3>
            <div className="mt-1 flex items-center gap-1.5">
                <StarRating rating={product.rating} size="h-3 w-3" />
                <span className="text-[10px] text-ink/40">({product.reviews})</span>
            </div>
            <p className="mt-1.5 font-display text-sm font-bold text-brand-navy">
                ৳{product.price.toLocaleString()}
            </p>
        </Link>
        <button
            onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
            }}
            className={`mx-3 mb-3 rounded-full py-2 text-[11px] font-semibold transition ${
                justAddedId === product.id
                    ? 'bg-brand-teal text-white'
                    : 'bg-brand-navy text-white hover:bg-brand-navy-light'
            }`}
        >
            {justAddedId === product.id ? 'Added ✓' : 'Add to cart'}
        </button>
    </div>
);

const ProductDetails = () => {
    const params = useParams();
    const id = params?.id ?? 'product-1';

    const product = useMemo(() => generateFakeProduct(id), [id]);
    const related = useMemo(() => generateRelated(product.slug, product.id), [product]);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const [addedPulse, setAddedPulse] = useState(false);
    const [justAddedId, setJustAddedId] = useState(null);

    const totalPrice = product.price * quantity;
    const animatedTotal = useCountUp(totalPrice);

    // reset scroll position when switching images (nice-to-have)
    useEffect(() => {
        setActiveImage(0);
    }, [id]);

    const handleAddToCart = () => {
        setAddedPulse(true);
        setTimeout(() => setAddedPulse(false), 900);
    };

    const handleFeatureAdd = (p) => {
        setJustAddedId(p.id);
        setTimeout(() => setJustAddedId(null), 1200);
    };

    const whatsappHref = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
        `Hi, I want to order: ${product.name} (Qty: ${quantity}) — ৳${totalPrice.toLocaleString()}`
    )}`;
    const callHref = `tel:${STORE_PHONE_TEL}`;

    return (
        <main className="pb-28 lg:pb-10">
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes popCart {
                    0% { transform: scale(1); }
                    40% { transform: scale(0.94); }
                    70% { transform: scale(1.03); }
                    100% { transform: scale(1); }
                }
                @keyframes ringExpand {
                    0% { box-shadow: 0 0 0 0 rgba(255,90,31,0.35); }
                    100% { box-shadow: 0 0 0 14px rgba(255,90,31,0); }
                }
                @keyframes barGrow { from { width: 0%; } }
                @keyframes priceFlash {
                    0% { color: var(--brand-orange, #FF5A1F); transform: scale(1.06); }
                    100% { color: inherit; transform: scale(1); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>

            {/* Breadcrumb */}
            <div className="border-b border-line px-4 py-3 sm:px-6 lg:px-8">
                <nav className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-ink/50">
                    <Link href="/" className="hover:text-brand-orange">Home</Link>
                    <span>/</span>
                    <Link href={`/category/${product.slug}`} className="capitalize hover:text-brand-orange">
                        {product.slug.replace(/-/g, ' ')}
                    </Link>
                    <span>/</span>
                    <span className="truncate text-brand-navy">{product.name}</span>
                </nav>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* GALLERY */}
                    <div style={{ animation: 'fadeUp 0.5s ease-out both' }}>
                        <ImageGallery
                            product={product}
                            activeImage={activeImage}
                            setActiveImage={setActiveImage}
                        />
                    </div>

                    {/* DETAILS + PURCHASE PANEL */}
                    <div style={{ animation: 'fadeUp 0.5s ease-out 0.1s both' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">{product.brand}</p>
                        <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
                            {product.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-3">
                            <StarRating rating={product.rating} />
                            <span className="text-sm font-medium text-ink/70">{product.rating}</span>
                            <span className="text-sm text-ink/40">
                                ({product.reviews} reviews) · {product.sold} sold
                            </span>
                        </div>

                        {/* Unit price */}
                        <div className="mt-5 flex items-baseline gap-3 border-y border-line py-5">
                            <span className="font-display text-2xl font-bold text-brand-navy">
                                ৳{product.price.toLocaleString()}
                            </span>
                            {product.oldPrice && (
                                <>
                                    <span className="text-base text-ink/40 line-through">
                                        ৳{product.oldPrice.toLocaleString()}
                                    </span>
                                    <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-bold text-brand-orange">
                                        Save {Math.round((1 - product.price / product.oldPrice) * 100)}%
                                    </span>
                                </>
                            )}
                            <span className="text-xs text-ink/40">/ unit</span>
                        </div>

                        {/* Color */}
                        <div className="mt-5">
                            <p className="text-sm font-semibold text-brand-navy">Color</p>
                            <div className="mt-2 flex items-center gap-2.5">
                                {product.colors.map((c, i) => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedColor(i)}
                                        aria-label={`Color ${i + 1}`}
                                        className={`h-8 w-8 rounded-full border-2 transition ${
                                            selectedColor === i ? 'scale-110 border-brand-navy' : 'border-line'
                                        }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quantity + live total */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line p-4">
                            <div>
                                <p className="text-sm font-semibold text-brand-navy">Quantity</p>
                                <div className="mt-2 flex items-center rounded-full border border-line">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="flex h-9 w-9 items-center justify-center text-brand-navy transition hover:text-brand-orange"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-brand-navy">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="flex h-9 w-9 items-center justify-center text-brand-navy transition hover:text-brand-orange"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-ink/40">Total price</p>
                                <p
                                    key={quantity}
                                    className="font-display text-2xl font-bold text-brand-navy"
                                    style={{ animation: 'priceFlash 0.4s ease-out both' }}
                                >
                                    ৳{Math.round(animatedTotal).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {product.lowStock && (
                            <p className="mt-3 text-xs font-semibold text-brand-orange">
                                Only {product.stockLeft} left in stock — order soon
                            </p>
                        )}

                        {/* 4 action buttons */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="relative flex items-center justify-center gap-2 rounded-full bg-brand-navy py-3.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
                                style={addedPulse ? { animation: 'popCart 0.5s ease-out, ringExpand 0.6s ease-out' } : undefined}
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {addedPulse ? 'Added ✓' : 'Add to cart'}
                            </button>

                            <button className="flex items-center justify-center gap-2 rounded-full bg-brand-orange py-3.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Buy now
                            </button>

                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-full border-2 border-brand-teal py-3 text-sm font-semibold text-brand-teal transition hover:bg-brand-teal hover:text-white"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.15-4.9-4.34-.14-.19-1.17-1.56-1.17-2.98 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.18-.27.37-.22.62-.13.25.09 1.6.75 1.87.89.27.14.45.21.51.32.07.12.07.68-.17 1.36z" />
                                </svg>
                                WhatsApp
                            </a>

                            <a
                                href={callHref}
                                className="flex items-center justify-center gap-2 rounded-full border-2 border-brand-navy py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call to order
                            </a>
                        </div>

                        <p className="mt-3 text-center text-xs text-ink/40 sm:text-left">
                            Call us at <span className="font-semibold text-brand-navy">{STORE_PHONE_DISPLAY}</span> for order assistance
                        </p>

                        {/* Trust badges */}
                        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
                            {[
                                { label: 'Verified seller', icon: FEATURE_ICONS[1] },
                                { label: '7-day return', icon: FEATURE_ICONS[2] },
                                { label: 'Cash on delivery', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                                    <svg className="h-5 w-5 text-brand-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    <span className="text-[11px] text-ink/60">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* About + highlights — redesigned full-width section */}
                <div className="mt-16" style={{ animation: 'fadeUp 0.5s ease-out 0.15s both' }}>
                    <div className="flex items-center gap-3">
                        <span className="h-px flex-1 bg-line" />
                        <h2 className="font-display text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
                            About this product
                        </h2>
                        <span className="h-px flex-1 bg-line" />
                    </div>

                    <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand-cream/40 via-white to-brand-cream/20">
                        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
                            <div className="relative">
                                <svg className="absolute -left-2 -top-2 h-10 w-10 text-brand-orange/15" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9.5 6C6.5 6 4 8.5 4 11.5S6.5 17 9.5 17c.4 0 .8-.1 1.2-.2-.6 1.2-1.8 2.1-3.2 2.4l.5 1.8c3-.6 5-3.3 5-6.6V11.5C13 8.5 12 6 9.5 6zm9 0C15.5 6 13 8.5 13 11.5S15.5 17 18.5 17c.4 0 .8-.1 1.2-.2-.6 1.2-1.8 2.1-3.2 2.4l.5 1.8c3-.6 5-3.3 5-6.6V11.5C22 8.5 21 6 18.5 6z" />
                                </svg>
                                <p className="relative pl-6 text-[15px] leading-[1.85] text-ink/75">
                                    {product.description}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2 pl-6">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/5 px-3 py-1.5 text-[11px] font-semibold text-brand-navy">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                                        Verified quality
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/5 px-3 py-1.5 text-[11px] font-semibold text-brand-navy">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                                        Top seller
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/5 px-3 py-1.5 text-[11px] font-semibold text-brand-navy">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                                        Fast dispatch
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {product.highlights.map((h, idx) => (
                                    <div
                                        key={h.title}
                                        className="group rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-md hover:shadow-brand-navy/5"
                                        style={{ animation: `fadeUp 0.5s ease-out ${0.2 + idx * 0.05}s both` }}
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition group-hover:bg-brand-orange group-hover:text-white">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={h.icon} />
                                            </svg>
                                        </span>
                                        <h3 className="mt-3 text-sm font-bold text-brand-navy">{h.title}</h3>
                                        <p className="mt-1 text-[11px] leading-relaxed text-ink/50">{h.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs accordion */}
                <div className="mt-14 max-w-2xl" style={{ animation: 'fadeUp 0.5s ease-out 0.25s both' }}>
                    <h2 className="font-display text-xl font-bold text-brand-navy">Full specifications</h2>
                    <div className="mt-3 border-t border-line">
                        <Accordion title="Technical details" defaultOpen>
                            <div className="divide-y divide-line">
                                {product.specs.map((spec) => (
                                    <div key={spec.label} className="flex items-center justify-between py-2.5 text-sm">
                                        <span className="text-ink/50">{spec.label}</span>
                                        <span className="font-medium text-brand-navy">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Accordion>
                        <Accordion title="Shipping & returns">
                            <p className="text-sm leading-relaxed text-ink/60">
                                Dispatched within 24 hours. Local delivery in 2–3 business days,
                                nationwide in 4–6 days. Free returns within 7 days if the item
                                arrives damaged or not as described.
                            </p>
                        </Accordion>
                        <Accordion title="Seller information">
                            <p className="text-sm leading-relaxed text-ink/60">
                                Sold and shipped by a verified Bazario marketplace seller.
                                98% positive feedback over the last 6 months.
                            </p>
                        </Accordion>
                    </div>
                </div>

                {/* Rating breakdown */}
                <div className="mt-14" style={{ animation: 'fadeUp 0.5s ease-out 0.3s both' }}>
                    <h2 className="font-display text-xl font-bold text-brand-navy">Customer ratings</h2>
                    <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-center">
                        <div className="flex shrink-0 flex-col items-center">
                            <span className="font-display text-5xl font-bold text-brand-navy">{product.rating}</span>
                            <StarRating rating={product.rating} size="h-4 w-4" />
                            <span className="mt-1 text-xs text-ink/40">{product.reviews} reviews</span>
                        </div>
                        <div className="flex-1 space-y-2 sm:max-w-md">
                            {product.ratingBreakdown.map((row) => (
                                <div key={row.stars} className="flex items-center gap-3">
                                    <span className="w-8 text-xs font-medium text-ink/50">{row.stars}★</span>
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/60">
                                        <div
                                            className="h-full rounded-full bg-brand-orange"
                                            style={{ width: `${row.pct}%`, animation: 'barGrow 0.8s ease-out both' }}
                                        />
                                    </div>
                                    <span className="w-9 text-right text-xs text-ink/40">{row.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FEATURED PRODUCTS — with quick add-to-cart */}
                <div className="mt-14" style={{ animation: 'fadeUp 0.5s ease-out 0.35s both' }}>
                    <h2 className="font-display text-xl font-bold text-brand-navy sm:text-2xl">Featured products</h2>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {related.map((p) => (
                            <FeatureProductCard key={p.id} product={p} onAddToCart={handleFeatureAdd} justAddedId={justAddedId} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky mobile buy bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-2 border-t border-line bg-white p-2.5 shadow-[0_-4px_16px_rgba(18,32,61,0.08)] lg:hidden">
                <button onClick={handleAddToCart} className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-navy py-2 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-[9px] font-semibold">Cart</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-orange py-2 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-[9px] font-semibold">Buy now</span>
                </button>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-brand-teal py-2 text-brand-teal">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2z" />
                    </svg>
                    <span className="text-[9px] font-semibold">WhatsApp</span>
                </a>
                <a href={callHref} className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-brand-navy py-2 text-brand-navy">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-[9px] font-semibold">Call</span>
                </a>
            </div>
        </main>
    );
};

export default ProductDetails;