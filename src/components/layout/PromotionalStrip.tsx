import React from 'react';
import { usePromotionalStrip } from '@/hooks/cms/usePromotionalStrip';

const PromotionalStrip: React.FC = () => {
  const { data, isLoading } = usePromotionalStrip();

  // Don't render if loading, no data, or not active
  if (isLoading || !data || !data.isActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
      {/* Desktop: Static centered text */}
      <div className="hidden md:block container mx-auto px-4 py-2">
        <p className="text-center text-sm font-medium tracking-wide">
          {data.text}
        </p>
      </div>
      
      {/* Mobile: Marquee scrolling animation */}
      <div className="md:hidden py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium tracking-wide mx-8">
            {data.text}
          </span>
          {/* Duplicate for seamless loop */}
          <span className="text-sm font-medium tracking-wide mx-8">
            {data.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromotionalStrip;
