
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MobileNavItem from './MobileNavItem';
import { X } from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  
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
          <MobileNavItem title="Products" path="/products" onClick={onClose} />
          <MobileNavItem title="Machines" path="/machines" onClick={onClose} />
          <MobileNavItem title="Business Goals" path="/business-goals" onClick={onClose} />
          <MobileNavItem title="Technology" path="/technology" onClick={onClose} />
          <MobileNavItem title="Blog" path="/blog" onClick={onClose} />
          <MobileNavItem title="About" path="/about" onClick={onClose} />
          <MobileNavItem title="Contact Us" path="/contact" onClick={onClose} />
          
          {/* Admin links */}
          {isAdmin && (
            <div className="border-t border-gray-200 my-2 pt-2">
              <MobileNavItem title="Admin Dashboard" path="/admin" onClick={onClose} />
              <MobileNavItem title="Manage Products" path="/admin/products" onClick={onClose} />
              <MobileNavItem title="Manage Machines" path="/admin/machines" onClick={onClose} />
              <MobileNavItem title="Manage Business Goals" path="/admin/business-goals" onClick={onClose} />
              <MobileNavItem title="Manage Technology" path="/admin/technology" onClick={onClose} />
              <MobileNavItem title="Manage Blog" path="/admin/blog" onClick={onClose} />
              <MobileNavItem title="Media Library" path="/admin/media" onClick={onClose} />
              <MobileNavItem title="Admin Users" path="/admin/users" onClick={onClose} />
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
