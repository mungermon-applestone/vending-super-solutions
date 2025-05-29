
import React from 'react';
import MobileNavItem from './MobileNavItem';
import { X } from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
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
          <MobileNavItem title="Sell Any Product" path="/products" onClick={onClose} />
          <MobileNavItem title="Machines and Lockers" path="/machines" onClick={onClose} />
          <MobileNavItem title="Business Goals" path="/business-goals" onClick={onClose} />
          <MobileNavItem title="Technology" path="/technology" onClick={onClose} />
          <MobileNavItem title="Blog" path="/blog" onClick={onClose} />
          <MobileNavItem title="About" path="/about" onClick={onClose} />
          <MobileNavItem title="Contact Us" path="/contact" onClick={onClose} />
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
