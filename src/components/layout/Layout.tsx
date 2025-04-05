
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import AdminControls from "../admin/AdminControls";

interface LayoutProps {
  children: ReactNode;
  noFooter?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Layout = ({
  children,
  noFooter = false,
  fullWidth = false,
  className = "",
}: LayoutProps) => {
  const location = useLocation();

  // Don't show admin controls on admin pages
  const showAdminControls = !location.pathname.startsWith('/admin/');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${className}`}>{children}</main>
      {!noFooter && <Footer />}
      {showAdminControls && <AdminControls />}
    </div>
  );
};

export default Layout;
