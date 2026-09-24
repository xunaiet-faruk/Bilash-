import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardShell = ({ children, navItems, accentColor, title, user }) => {
    return (
        <div className="flex min-h-screen bg-brand-cream/30">
            <Sidebar items={navItems} accentColor={accentColor} />
            <div className="flex flex-1 flex-col">
                <Topbar title={title} user={user} />
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
};

export default DashboardShell;