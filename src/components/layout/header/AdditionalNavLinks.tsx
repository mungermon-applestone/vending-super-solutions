
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigationContent } from '@/hooks/cms/useNavigationContent';
import { LogIn } from 'lucide-react';

interface AdditionalNavLinksProps {
  isAboutActive?: boolean;
}

const AdditionalNavLinks = ({ isAboutActive }: AdditionalNavLinksProps) => {
  const location = useLocation();
  const navigationContent = useNavigationContent();
  
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
  
  // Show loading state or fallback text
  if (navigationContent.isLoading) {
    return (
      <div className="flex items-center space-x-2">
        {/* Show skeleton buttons while loading */}
        <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        asChild 
        variant="ghost"
        className={getButtonStyles(isMachinesActive)}
      >
        <Link to="/machines">{navigationContent.machines}</Link>
      </Button>
      <Button 
        asChild 
        className={getButtonStyles(isBusinessActive)}
        variant="ghost"
      >
        <Link to="/business-goals">{navigationContent.businessGoals}</Link>
      </Button>
      <Button 
        asChild 
        className={getButtonStyles(isAboutActive || false)}
        variant="ghost"
      >
        <Link to="/about">{navigationContent.about}</Link>
      </Button>
      <Button 
        asChild
        className={getButtonStyles(isBlogActive)}
        variant="ghost"
      >
        <Link to="/blog">{navigationContent.blog}</Link>
      </Button>
      <Button 
        asChild
        className={getButtonStyles(isContactActive)}
        variant="ghost"
      >
        <Link to="/contact">{navigationContent.contact}</Link>
      </Button>
      <Button 
        asChild
        variant="default"
        className="ml-2 bg-vending-blue hover:bg-vending-blue-dark text-white border-0 gap-2"
      >
        <Link to="/customer-login">
          <LogIn className="h-4 w-4" />
          Customer Login
        </Link>
      </Button>
    </div>
  );
};

export default AdditionalNavLinks;
