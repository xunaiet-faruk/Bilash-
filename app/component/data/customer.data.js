export const CUSTOMER_USER = { name: 'Rahim Uddin', role: 'Customer' };

export const CUSTOMER_STATS = {
    totalOrders: 18,
    inTransit: 2,
    wishlistCount: 7,
    totalSpent: 24650,
};

export const CUSTOMER_ORDERS = [
    { id: 'ORD-1042', items: 'Wireless Headphone Pro', total: 1890, status: 'delivered', date: '2026-09-12' },
    { id: 'ORD-1039', items: 'Smart Watch Fit 2', total: 1450, status: 'shipped', date: '2026-09-18' },
    { id: 'ORD-1031', items: 'Everyday Cotton T-Shirt', total: 590, status: 'processing', date: '2026-09-20' },
    { id: 'ORD-1020', items: 'Classic Sneakers', total: 2190, status: 'cancelled', date: '2026-09-05' },
];

export const CUSTOMER_WISHLIST = [
    { id: 'p1', name: 'Everyday Travel Backpack', price: 1120, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
    { id: 'p2', name: 'Classic Polarized Sunglasses', price: 850, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80' },
    { id: 'p3', name: 'Wireless Headphones Pro', price: 1890, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
];

export const CUSTOMER_NAV = [
    {
        label: 'Menu',
        links: [
            { label: 'Overview', href: '/customer', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { label: 'Orders', href: '/customer/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { label: 'Wishlist', href: '/customer/wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', badge: 7 },
            { label: 'Addresses', href: '/customer/addresses', icon: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Profile', href: '/customer/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        ],
    },
];