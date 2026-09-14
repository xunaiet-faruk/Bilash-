"use client";

import React, { useEffect, useState } from 'react';

const SLIDES = [
  {
    tag: 'China Direct',
    title: 'Factory prices,\nno middleman.',
    accent: '#12203d',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600&q=80',
    product: {
      name: 'Wireless Earbuds Pro',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      price: '৳990',
      oldPrice: '৳1,990',
      discount: '50% OFF',
      rating: 4.6,
      reviews: '2.3k',
    },
  },
  {
    tag: 'Local Warehouse',
    title: 'Dhaka to your door\nin 2–3 days.',
    accent: '#0fa98a',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80',
    product: {
      name: 'Smart Watch Fit 2',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      price: '৳1,450',
      oldPrice: '৳2,900',
      discount: '50% OFF',
      rating: 4.8,
      reviews: '5.1k',
    },
  },
  {
    tag: 'Reseller Program',
    title: 'Sell with zero\ninventory.',
    accent: '#e04713',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80',
    product: {
      name: 'Reseller Starter Pack',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      price: '৳0',
      oldPrice: '৳500',
      discount: 'FREE JOIN',
      rating: 4.9,
      reviews: '900+',
    },
  },
];

const BANNER_INTERVAL = 5500;
const PRODUCT_INTERVAL = 4000;

const Hero = () => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  // prev index track kori — slide out er jonno
  const [prevBanner, setPrevBanner] = useState(null);
  const [prevProduct, setPrevProduct] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setPrevBanner(bannerIndex);
      setBannerIndex((i) => (i + 1) % SLIDES.length);
    }, BANNER_INTERVAL);
    return () => clearInterval(id);
  }, [bannerIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      setPrevProduct(productIndex);
      setProductIndex((i) => (i + 1) % SLIDES.length);
    }, PRODUCT_INTERVAL);
    return () => clearInterval(id);
  }, [productIndex]);

  const banner = SLIDES[bannerIndex];
  const product = SLIDES[productIndex].product;

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translate3d(0, 0, 0); }
          100% { transform: scale(1.08) translate3d(-1%, -1%, 0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row">
          {/* ============ BANNER (70%) ============ */}
          <div className="relative w-full overflow-hidden rounded-3xl shadow-lg shadow-brand-navy/10 md:w-[75%]">
            <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
              {/* PREVIOUS slide — slides out to left */}
              {prevBanner !== null && prevBanner !== bannerIndex && (
                <div
                  key={`prev-b-${prevBanner}`}
                  className="absolute inset-0 z-[1]"
                  style={{ animation: 'slideOutLeft 0.8s ease-in-out both' }}
                >
                  <img
                    src={SLIDES[prevBanner].image}
                    alt={SLIDES[prevBanner].tag}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(100deg, ${SLIDES[prevBanner].accent}E6 0%, ${SLIDES[prevBanner].accent}99 35%, transparent 75%)`,
                    }}
                  />
                </div>
              )}

              {/* CURRENT slide — slides in from right */}
              <div
                key={`cur-b-${bannerIndex}`}
                className="absolute inset-0 z-[2]"
                style={{ animation: 'slideInRight 0.8s ease-in-out both' }}
              >
                <img
                  src={banner.image}
                  alt={banner.tag}
                  className="h-full w-full object-cover"
                  style={{ animation: `kenBurns ${BANNER_INTERVAL}ms ease-out both` }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(100deg, ${banner.accent}E6 0%, ${banner.accent}99 35%, transparent 75%)`,
                  }}
                />
              </div>

              {/* Progress bars */}
              <div className="absolute left-8 right-8 top-6 z-10 flex gap-1.5 md:left-12 md:right-12">
                {SLIDES.map((s, i) => (
                  <div key={s.tag} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                    {i === bannerIndex && (
                      <div
                        key={`p-${bannerIndex}`}
                        className="h-full bg-white"
                        style={{ animation: `progress ${BANNER_INTERVAL}ms linear both` }}
                      />
                    )}
                    {i < bannerIndex && <div className="h-full bg-white" />}
                  </div>
                ))}
              </div>

              {/* Text content */}
              <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-12">
                <div key={`txt-${bannerIndex}`} style={{ animation: 'fadeUp 0.7s ease-out both' }}>
                  <span className="inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {banner.tag}
                  </span>
                  <h2 className="mt-4 whitespace-pre-line font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                    {banner.title}
                  </h2>
                  <button className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-white/90">
                    Shop this deal
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* ============ PRODUCT ============ */}
<div className="relative w-full overflow-hidden rounded-3xl bg-white shadow-lg shadow-brand-navy/10 md:w-[25%]">
  <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
    {prevProduct !== null && prevProduct !== productIndex && (
      <div
        key={`prev-p-${prevProduct}`}
        className="absolute inset-0 z-[1] flex flex-col"
        style={{ animation: 'slideOutLeft 0.7s ease-in-out both' }}
      >
        <ProductContent product={SLIDES[prevProduct].product} />
      </div>
    )}

    {/* CURRENT product */}
    <div
      key={`cur-p-${productIndex}`}
      className="absolute inset-0 z-[2] flex flex-col"
      style={{ animation: 'slideInRight 0.7s ease-in-out both' }}
    >
      <ProductContent product={product} />
    </div>

    {/* Vertical indicator */}
    <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5">
      {SLIDES.map((s, i) => (
        <span
          key={s.tag}
          className={`h-1.5 w-1.5 rounded-full transition-all ${
            i === productIndex ? 'bg-brand-orange' : 'bg-ink/15'
          }`}
        />
      ))}
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
};

// ✅ Reusable product content — prev + current dutar jonno
const ProductContent = ({ product }) => (
  <>
    <div className="relative h-40 w-full overflow-hidden sm:h-44 md:h-48">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
        {product.discount}
      </span>
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-brand-teal">
        Featured deal
      </span>
    </div>

    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
      <div>
        <h3 className="font-display text-base font-bold leading-snug text-brand-navy sm:text-lg">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="text-xs font-medium text-ink/70">{product.rating}</span>
          <span className="text-xs text-ink/40">({product.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-brand-navy sm:text-xl">
            {product.price}
          </span>
          <span className="text-xs text-ink/40 line-through">{product.oldPrice}</span>
        </div>
      </div>
      <button className="mt-3 w-full rounded-full bg-brand-navy py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light">
        Add to cart
      </button>
    </div>
  </>
);

export default Hero;