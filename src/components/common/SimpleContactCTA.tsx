
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomePageContent } from '@/hooks/useHomePageContent';

interface SimpleContactCTAProps {
  title?: string;
  description?: string;
  className?: string;
}

export const SimpleContactCTA: React.FC<SimpleContactCTAProps> = ({ 
  title, 
  description,
  className = "" 
}) => {
  const { data: homeContent } = useHomePageContent();
  
  // Use provided props or fallback to CMS content
  const displayTitle = title || homeContent?.ctaSectionTitle || "Ready to Transform Your Vending Operations?";
  const displayDescription = description || homeContent?.ctaSectionDescription || 
    "Get started with our solution today and see the difference in your operations.";
  const primaryButtonText = homeContent?.ctaPrimaryButtonText || "Request a Demo";
  const primaryButtonUrl = homeContent?.ctaPrimaryButtonUrl || "/contact";
  const secondaryButtonText = homeContent?.ctaSecondaryButtonText || "Learn More";
  const secondaryButtonUrl = homeContent?.ctaSecondaryButtonUrl || "/products";

  return (
    <section className={`bg-vending-blue-light py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{displayTitle}</h2>
          <p className="text-lg text-gray-600 mb-8">{displayDescription}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to={primaryButtonUrl}>
                {primaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={secondaryButtonUrl}>
                {secondaryButtonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
