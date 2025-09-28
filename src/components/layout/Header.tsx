
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavigation from './header/MobileNavigation';
import DesktopNavigation from './header/DesktopNavigation';
import LanguageSelector from '@/components/language/LanguageSelector';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header-container sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Logo and language selector row */}
      {!isMobile && (
        <div className="container mx-auto flex justify-between items-center py-2 px-4 border-b border-gray-100">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Applestone Solutions</span>
          </Link>
          <LanguageSelector />
        </div>
      )}
      
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {isMobile && (
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Applestone Solutions</span>
          </Link>
        )}
        
        <div className={`flex items-center gap-4 ${!isMobile ? 'w-full justify-center' : ''}`}>
          {isMobile ? (
            <button 
              onClick={toggleMobileMenu} 
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          ) : (
            <DesktopNavigation />
          )}
        </div>
      </div>
      
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

// Simple NavLink component with TypeScript props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link 
      to={href} 
      className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
    >
      {children}
    </Link>
  );
};

export default Header;
