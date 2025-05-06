
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  const dismissBanner = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 px-4 py-2 flex items-center justify-between"
      role="alert"
      aria-live="polite"
    >
      <div className="text-sm text-gray-600 mr-4">
        This website uses cookies to improve your experience. By continuing to use this site, you consent to our use of cookies.
        <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={acceptCookies} 
          className="text-xs h-8"
        >
          Accept
        </Button>
        <button 
          onClick={dismissBanner} 
          className="p-1 rounded-full hover:bg-gray-100" 
          aria-label="Close cookie banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
