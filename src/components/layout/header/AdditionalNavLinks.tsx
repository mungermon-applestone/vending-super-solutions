
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigationContent } from '@/hooks/cms/useNavigationContent';
import { LogIn } from 'lucide-react';
import TranslatableText from '@/components/translation/TranslatableText';
import LanguageSelector from '@/components/language/LanguageSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdditionalNavLinksProps {
  isAboutActive?: boolean;
}

const AdditionalNavLinks = ({ isAboutActive }: AdditionalNavLinksProps) => {
  const location = useLocation();
  const navigationContent = useNavigationContent();
  const isMobile = useIsMobile();
  const { currentLanguage } = useLanguage();
  
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
    <div className="relative flex items-center space-x-2">
      <Button 
        asChild 
        variant="ghost"
        className={getButtonStyles(isMachinesActive)}
      >
        <Link to="/machines">
          <TranslatableText context="navigation">
            {navigationContent.machines}
          </TranslatableText>
        </Link>
      </Button>
      <Button 
        asChild 
        className={getButtonStyles(isBusinessActive)}
        variant="ghost"
      >
        <Link to="/business-goals">
          <TranslatableText context="navigation">
            {navigationContent.businessGoals}
          </TranslatableText>
        </Link>
      </Button>
      <Button 
        asChild 
        className={getButtonStyles(isAboutActive || false)}
        variant="ghost"
      >
        <Link to="/about">
          <TranslatableText context="navigation">
            {navigationContent.about}
          </TranslatableText>
        </Link>
      </Button>
      <Button 
        asChild
        className={getButtonStyles(isBlogActive)}
        variant="ghost"
      >
        <Link to="/blog">
          <TranslatableText context="navigation">
            {navigationContent.blog}
          </TranslatableText>
        </Link>
      </Button>
      <Button 
        asChild
        className={getButtonStyles(isContactActive)}
        variant="ghost"
      >
        <Link to="/contact">
          <TranslatableText context="navigation">
            {navigationContent.contact}
          </TranslatableText>
        </Link>
      </Button>
      
      {/* Language selector positioned below contact button on desktop */}
      {!isMobile && (
        <div className={`absolute top-full right-0 z-50 ${
          currentLanguage !== 'en' ? 'mt-12' : 'mt-4'
        }`}>
          <LanguageSelector />
        </div>
      )}
      
      {/* TODO: Uncomment when ready to implement customer login functionality
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
      */}
    </div>
  );
};

export default AdditionalNavLinks;
