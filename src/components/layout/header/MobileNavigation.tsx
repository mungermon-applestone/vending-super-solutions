
import React from 'react';
import MobileNavItem from './MobileNavItem';
import { X } from 'lucide-react';
import { useNavigationContent } from '@/hooks/cms/useNavigationContent';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const navigationContent = useNavigationContent();
  
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-40 bg-black bg-opacity-25" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-40 w-64 bg-background py-6 px-4 shadow-xl transform ease-in-out transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold">Menu</div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-2">
          <MobileNavItem title="Home" path="/" onClick={onClose} />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.products} 
            path="/products" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.machines} 
            path="/machines" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.businessGoals} 
            path="/business-goals" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.technology} 
            path="/technology" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.blog} 
            path="/blog" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.about} 
            path="/about" 
            onClick={onClose} 
          />
          <MobileNavItem 
            title={navigationContent.isLoading ? "Loading..." : navigationContent.contact} 
            path="/contact" 
            onClick={onClose} 
          />
          <div className="border-t pt-4 mt-4">
            <MobileNavItem 
              title="Customer Login"
              path="/customer-login" 
              onClick={onClose} 
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
