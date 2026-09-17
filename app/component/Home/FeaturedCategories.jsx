"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const FILTERS = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Kids'];
const slugify = (name) => name.toLowerCase().trim().replace(/\s+/g, '-');


const CATEGORIES = [
    { name: 'T-Shirt', group: 'Fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', tag: 'New' },
    { name: 'Headphone', group: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
    { name: 'Sneakers', group: 'Fashion', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80', tag: 'Hot' },
    { name: 'Smart Watch', group: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { name: 'Sunglasses', group: 'Fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
    { name: 'Backpack', group: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
    { name: 'Perfume', group: 'Beauty', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80' },
    { name: 'Skincare', group: 'Beauty', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80', tag: 'New' },
    { name: 'Blender', group: 'Home', image: 'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=400&q=80' },
    { name: 'Phone Case', group: 'Electronics', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&q=80' },
    { name: 'Sofa', group: 'Home', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
    { name: 'Kids Toy', group: 'Kids', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80' },
    { name: 'Speaker', group: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', tag: 'Hot' },
    { name: 'Handbag', group: 'Fashion', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80' },
];

const VISIBLE_DESKTOP = 6;
const AUTO_SLIDE_MS = 3000;

const FeaturedCategories = () => {
    const scrollRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeCategory, setActiveCategory] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const router = useRouter();


    const visible =
        activeFilter === 'All'
            ? CATEGORIES
            : CATEGORIES.filter((c) => c.group === activeFilter);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateScrollState);
        window.addEventListener('resize', updateScrollState);
        return () => {
            el.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [visible]);

    useEffect(() => {
        if (isPaused) return;
        const el = scrollRef.current;
        if (!el) return;

        const id = setInterval(() => {
            const card = el.querySelector('[data-card]');
            if (!card) return;
            const step = card.offsetWidth + 20; // card + gap
            const maxScroll = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft >= maxScroll - 4) {
                // sesh e pouche gele abar shuru te jabe
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: step, behavior: 'smooth' });
            }
        }, AUTO_SLIDE_MS);

        return () => clearInterval(id);
    }, [isPaused, visible]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }, [activeFilter]);

    const scrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const card = el.querySelector('[data-card]');
        if (!card) return;
        const step = card.offsetWidth + 20;
        el.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

   

     const handleCategoryClick = (cat) => {
        setActiveCategory(cat.name);
        router.push(`/category/${slugify(cat.name)}`);
       
    }

    return (
        <section className=" px-4 py-20 sm:px-6 lg:px-8">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                @keyframes catIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="mx-auto max-w-7xl">
                {/* Header + Filter */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                     
                        <h2 className="mt-1 font-display text-2xl font-bold text-brand-navy sm:text-3xl">
                            Find what you're looking for
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                                    activeFilter === f
                                        ? 'bg-brand-orange text-white'
                                        : 'border border-line bg-white text-brand-navy hover:border-brand-orange/40'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rail */}
                <div
                    className="relative mt-8"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                
                    {/* Scroll container */}
                    <div
                        ref={scrollRef}
                        className="no-scrollbar flex gap-5 overflow-x-auto px-1 py-2"
                        style={{
                            scrollSnapType: 'x mandatory',
                            scrollbarWidth: 'none',    
                            msOverflowStyle: 'none',     
                        }}
                    >
                        {visible.map((cat, idx) => {
                            const isActive = activeCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    data-card
                                    onClick={() => handleCategoryClick(cat)}
                                    className="group flex shrink-0 flex-col items-center gap-3"
                                    style={{
                                        scrollSnapAlign: 'start',
                                        flexBasis: 'calc((100% - 5 * 1.25rem) / 6)',
                                        animation: `catIn 0.4s ease-out ${idx * 0.03}s both`,
                                    }}
                                >
                                    {/* Ring + Image — */}
                                    <div
                                        className={`relative aspect-square w-full rounded-full p-[3px] transition-all duration-300 ${
                                            isActive
                                                ? 'bg-brand-orange scale-105'
                                                : 'bg-line group-hover:bg-brand-orange/50 group-hover:scale-[1.03]'
                                        }`}
                                    >
                                        <div className="h-full cursor-pointer w-full overflow-hidden rounded-full border-[3px] border-brand-cream bg-white shadow-sm">
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {cat.tag && (
                                            <span
                                                className={`absolute -right-1 -top-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md ${
                                                    cat.tag === 'New' ? 'bg-brand-teal' : 'bg-brand-orange'
                                                }`}
                                            >
                                                {cat.tag}
                                            </span>
                                        )}
                                    </div>

                                    <span
                                        className={`line-clamp-1 text-sm font-semibold transition ${
                                            isActive
                                                ? 'text-brand-orange'
                                                : 'text-ink/75 group-hover:text-brand-navy'
                                        }`}
                                    >
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                   
                    {canScrollLeft && (
                        <button
                            onClick={() => scrollBy(-1)}
                            aria-label="Scroll left"
                            className="cursor-pointer absolute -left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-brand-navy shadow-md transition hover:border-brand-orange hover:text-brand-orange lg:flex"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {canScrollRight && (
                        <button
                            onClick={() => scrollBy(1)}
                            aria-label="Scroll right"
                            className="cursor-pointer absolute -right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-brand-navy shadow-md transition hover:border-brand-orange hover:text-brand-orange lg:flex"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* ✅ Auto-slide progress bar (optional, subtle) */}
                    <div className="mt-6 flex justify-center">
                        <div className="flex gap-1.5">
                            {visible.map((_, i) => (
                                <span
                                    key={i}
                                    className="h-1 w-1 rounded-full bg-ink/15"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;