
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

// This component is modified to not add another header or footer since RootLayout already has them
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header removed to prevent duplication */}
      <main className="flex-grow">{children}</main>
      {/* Footer removed to prevent duplication */}
    </div>
  );
};

export default Layout;
