import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePromotionalStrip } from '@/hooks/cms/usePromotionalStrip';

const PromotionalStrip: React.FC = () => {
  const { data, isLoading } = usePromotionalStrip();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if previously dismissed this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('promo-strip-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('promo-strip-dismissed', 'true');
  };

  // Don't render if loading, no data, not active, or dismissed
  if (isLoading || !data || !data.isActive || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
      {/* Desktop: Static centered text */}
      <div className="hidden md:flex items-center justify-center container mx-auto px-4 py-2.5 relative">
        <p className="text-center text-base font-medium tracking-wide">
          {data.text}
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-4 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          aria-label="Dismiss promotional banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Mobile: Marquee scrolling animation */}
      <div className="md:hidden py-2.5 overflow-hidden flex items-center relative">
        <div className="animate-marquee whitespace-nowrap pr-12">
          <span className="text-sm font-medium tracking-wide mx-8">
            {data.text}
          </span>
          {/* Duplicate for seamless loop */}
          <span className="text-sm font-medium tracking-wide mx-8">
            {data.text}
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors z-10 bg-primary/80"
          aria-label="Dismiss promotional banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromotionalStrip;
