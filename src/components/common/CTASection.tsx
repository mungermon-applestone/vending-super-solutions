
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useHomePageContent } from '@/hooks/useHomePageContent';

const CTASection: React.FC = () => {
  const { data: homeContent, isLoading } = useHomePageContent();
  
  console.log('[CTASection] Content:', homeContent);

  return (
    <section className="py-16 md:py-24 bg-vending-blue-light">
      <div className="container-wide text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
          {homeContent?.ctaSectionTitle || "Ready to Transform Your Vending Operations?"}
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          {homeContent?.ctaSectionDescription || "Get started with our platform today and see the difference in your operations."}
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link to={homeContent?.ctaPrimaryButtonUrl || "/contact"}>
              {homeContent?.ctaPrimaryButtonText || "Request a Demo"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to={homeContent?.ctaSecondaryButtonUrl || "/products"}>
              {homeContent?.ctaSecondaryButtonText || "Learn More"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
