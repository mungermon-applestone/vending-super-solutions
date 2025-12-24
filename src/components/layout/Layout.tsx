
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import TranslationDisclaimer from '@/components/language/TranslationDisclaimer';
import PromotionalStrip from './PromotionalStrip';
import PromotionalPopover from './PromotionalPopover';

interface LayoutProps {
  children?: React.ReactNode;
}

/**
 * Layout Component
 * 
 * This component provides the main application layout structure with Header, Footer, and main content area.
 * 
 * IMPORTANT USAGE NOTES:
 * - This component is configured as the root layout in src/routes.tsx
 * - Page components should NEVER wrap themselves with <Layout />
 * - The router configuration automatically provides layout to all child routes
 * - Direct usage of this component should be limited to the router configuration
 * 
 * REGRESSION PREVENTION:
 * - If you see double navigation or footers, check that page components
 *   are not incorrectly importing and wrapping content with this Layout component
 * - Page components should return their content directly
 * 
 * @param children - Optional children to render instead of <Outlet />
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <PromotionalStrip />
      <PromotionalPopover />
      <Header />
      <TranslationDisclaimer />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
