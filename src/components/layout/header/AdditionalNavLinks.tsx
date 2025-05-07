
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdditionalNavLinksProps {
  isAboutActive?: boolean;
}

const AdditionalNavLinks = ({ isAboutActive }: AdditionalNavLinksProps) => {
  const location = useLocation();
  const isBlogActive = location.pathname.startsWith('/blog');
  const isBusinessActive = location.pathname.startsWith('/business') || location.pathname.startsWith('/business-goals');
  const isMachinesActive = location.pathname.startsWith('/machines');
  const isContactActive = location.pathname.startsWith('/contact');
  
  // Common styling for all navigation buttons
  const getButtonStyles = (isActive: boolean) => cn(
    "rounded-md border text-sm font-medium transition-colors",
    isActive 
      ? "bg-vending-blue text-white border-vending-blue" 
      : "bg-gray-50 text-gray-900 hover:bg-gray-100 border-transparent"
  );
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        asChild 
        variant="ghost"
        className={getButtonStyles(isMachinesActive)}
      >
        <Link to="/machines">Machines</Link>
      </Button>
      <Button 
        asChild 
        className={getButtonStyles(isBusinessActive)}
        variant="ghost"
      >
        <Link to="/business-goals">Business Goals</Link>
      </Button>
      <Button 
        asChild 
        className={getButtonStyles(isAboutActive || false)}
        variant="ghost"
      >
        <Link to="/about">About</Link>
      </Button>
      <Button 
        asChild
        className={getButtonStyles(isBlogActive)}
        variant="ghost"
      >
        <Link to="/blog">Updates</Link>
      </Button>
      <Button 
        asChild
        className={getButtonStyles(isContactActive)}
        variant="ghost"
      >
        <Link to="/contact">Contact</Link>
      </Button>
    </div>
  );
};

export default AdditionalNavLinks;
