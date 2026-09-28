import Sidebar from "../../component/dashboard/sidebar";
export default function ResellerLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6f8] text-slate-900">
      <Sidebar role="reseller" userName="Sadia Islam" userEmail="sadia@bilash.io" />
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}