
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileNavItem from './MobileNavItem';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose?: () => void;
}

const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden py-2 px-2 space-y-1">
      <MobileNavItem title="Products" path="/products" onClick={onClose} />
      <MobileNavItem title="Machines" path="/machines" onClick={onClose} />
      <MobileNavItem title="Business Goals" path="/goals" onClick={onClose} />
      <MobileNavItem title="Technology" path="/technology" onClick={onClose} />
      <MobileNavItem title="About Us" path="/about" onClick={onClose} />
      <MobileNavItem title="Contact" path="/contact" onClick={onClose} />
      <div className="pt-2">
        <Button asChild variant="default" size="sm" className="w-full" onClick={onClose}>
          <Link to="/partner">Become a Partner</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
