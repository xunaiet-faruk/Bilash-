"use client";

export const StarRating = ({ rating, size = 'h-3 w-3' }) => (
    <div className="flex items-center gap-0.5">
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