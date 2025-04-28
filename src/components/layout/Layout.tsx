
import Footer from './Footer';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// This component is modified to not add another header since RootLayout already has one
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header removed to prevent duplication */}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
