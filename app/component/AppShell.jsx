"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FloatingCart from "./shared/FloatingCart";

const AUTH_PATHS = ["/login", "/register"];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname);
  const isDashboardPage = pathname === "/dashboard" || pathname.startsWith("/admin") || pathname.startsWith("/reseller");

  if (isAuthPage || isDashboardPage) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <FloatingCart />
      <Footer />
    </>
  );
}