import DashboardShell from '../component/dashboard/DashboardShell';

const navItems = [
    {
        label: 'Admin',
        links: [
            { label: 'Overview', href: '/admin', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
            { label: 'Products', href: '/admin/products', icon: 'M4 6h16M4 12h16M4 18h16' },
            { label: 'Orders', href: '/admin/orders', icon: 'M5 4h14v16H5z' },
            { label: 'Categories', href: '/admin/categories', icon: 'M4 6h16v12H4z' },
            { label: 'Users', href: '/admin/users', icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m6-10a4 4 0 100-8 4 4 0 000 8zm8-3a3 3 0 100-6' },
            { label: 'Vendors', href: '/admin/vendors', icon: 'M3 10l2-5h14l2 5M5 10v9h14v-9M9 19v-5h6v5' },
            { label: 'Payouts', href: '/admin/payouts', icon: 'M4 6h16v12H4zM8 12h8' },
            { label: 'Settings', href: '/admin/settings', icon: 'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z' },
        ],
    },
    {
        label: 'Reseller',
        links: [
            { label: 'Overview', href: '/reseller', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
            { label: 'Catalog', href: '/reseller/catalog', icon: 'M4 6h16M4 12h16M4 18h16' },
            { label: 'Store', href: '/reseller/store', icon: 'M3 10l2-5h14l2 5M5 10v9h14v-9' },
            { label: 'Orders', href: '/reseller/orders', icon: 'M5 4h14v16H5z' },
            { label: 'Wallet', href: '/reseller/wallet', icon: 'M3 7h18v12H3zM16 13h2' },
        ],
    },
];

export default function DashboardPage() {
    return (
        <DashboardShell navItems={navItems} title="Dashboard" user={{ name: 'User', role: 'Admin / Reseller' }}>
            <div className="mx-auto max-w-6xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">Bilash Dashboard</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-brand-navy">Welcome back</h2>
                <p className="mt-3 max-w-xl text-ink/60">Choose a section from the sidebar to manage the admin or reseller workspace.</p>
            </div>
        </DashboardShell>
    );
}