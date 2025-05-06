
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// This component is designed to be used within pages when RootLayout is already providing the header/footer
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content only - Header and Footer are provided by RootLayout */}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
