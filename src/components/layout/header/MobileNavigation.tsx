
import React from 'react';
import MobileNavItem from './MobileNavItem';
import { X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/language/LanguageSelector';
import { useTranslatedNavigationContent } from '@/hooks/cms/useTranslatedNavigationContent';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const translatedNav = useTranslatedNavigationContent();
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-40 bg-black bg-opacity-25" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-40 w-64 bg-background py-6 px-4 shadow-xl transform ease-in-out transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold">{translatedNav.menu}</div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-2">
          <MobileNavItem title={translatedNav.home} path="/" onClick={onClose} />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.products} 
            path="/products" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.machines} 
            path="/machines" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.businessGoals} 
            path="/business-goals" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.technology} 
            path="/technology" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.blog} 
            path="/blog" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.about} 
            path="/about" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={translatedNav.isLoading ? translatedNav.loading : translatedNav.contact} 
            path="/contact" 
            onClick={onClose} 
          />
          
          {/* Language selector for mobile */}
          <div className="border-t pt-4 mt-4">
            <div className="px-3 pb-2">
              <span className="text-sm font-medium text-foreground">{translatedNav.language}</span>
            </div>
            <div className="px-3">
              <LanguageSelector />
            </div>
          </div>
          
          {/* TODO: Uncomment when ready to implement customer login functionality
          <div className="border-t pt-4 mt-4">
            <Button 
              asChild
              variant="default"
              className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white gap-2"
              onClick={onClose}
            >
              <Link to="/customer-login">
                <LogIn className="h-4 w-4" />
                Customer Login
              </Link>
            </Button>
          </div>
          */}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
