
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileNavItem from './MobileNavItem';

interface MobileNavigationProps {
  isOpen: boolean;
}

const MobileNavigation = ({ isOpen }: MobileNavigationProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden py-2 px-2 space-y-1">
      <MobileNavItem title="Products" path="/products" />
      <MobileNavItem title="Machines" path="/machines" />
      <MobileNavItem title="Business Goals" path="/goals" />
      <MobileNavItem title="Technology" path="/technology" />
      <MobileNavItem title="About Us" path="/about" />
      <MobileNavItem title="Contact" path="/contact" />
      <div className="pt-2">
        <Button asChild variant="default" size="sm" className="w-full">
          <Link to="/partner">Become a Partner</Link>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavigation;
