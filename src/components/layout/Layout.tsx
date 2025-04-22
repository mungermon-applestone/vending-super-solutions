
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

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
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${className}`}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
};

export default Layout;
