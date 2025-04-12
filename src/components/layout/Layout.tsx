
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import AdminControls from "../admin/AdminControls";
import AdminNavBar from "../admin/AdminNavBar";

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
  
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavBar />
      <Header />
      <main className={`flex-grow ${className}`}>{children}</main>
      {!noFooter && <Footer />}
      <AdminControls />
    </div>
  );
};

export default Layout;
