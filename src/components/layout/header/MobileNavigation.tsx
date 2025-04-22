
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MobileNavItem from './MobileNavItem';

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
      <div className="fixed inset-y-0 right-0 z-40 w-64 bg-background py-6 px-4 shadow-xl">
        <nav className="flex flex-col space-y-2">
          <MobileNavItem title="Home" path="/" onClick={onClose} />
          <MobileNavItem title="Products" path="/products" onClick={onClose} />
          <MobileNavItem title="Machines" path="/machines" onClick={onClose} />
          <MobileNavItem title="Business Goals" path="/goals" onClick={onClose} />
          <MobileNavItem title="Technology" path="/technology" onClick={onClose} />
          <MobileNavItem title="Blog" path="/blog" onClick={onClose} />
          <MobileNavItem title="About" path="/about" onClick={onClose} />
          <MobileNavItem title="Contact Us" path="/contact" onClick={onClose} />
          
          {/* Admin links */}
          <div className="border-t border-gray-200 my-2 pt-2">
            {isAdmin ? (
              <>
                <MobileNavItem title="Admin Dashboard" path="/admin" onClick={onClose} />
                <MobileNavItem title="Manage Products" path="/admin/products" onClick={onClose} />
                <MobileNavItem title="Manage Machines" path="/admin/machines" onClick={onClose} />
                <MobileNavItem title="Manage Business Goals" path="/admin/business-goals" onClick={onClose} />
                <MobileNavItem title="Manage Technology" path="/admin/technology" onClick={onClose} />
                <MobileNavItem title="Manage Blog" path="/admin/blog" onClick={onClose} />
                <MobileNavItem title="Media Library" path="/admin/media" onClick={onClose} />
                <MobileNavItem title="Admin Users" path="/admin/users" onClick={onClose} />
              </>
            ) : (
              <MobileNavItem title="Admin Sign In" path="/admin/sign-in" onClick={onClose} />
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
