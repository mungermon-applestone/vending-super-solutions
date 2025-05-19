
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { ProductsPageContent } from '@/hooks/cms/useProductsPageContent';
import ContentfulHero from '@/components/contentful/ContentfulHero';

interface ProductsHeroProps {
  pageContent?: ProductsPageContent;
  isLoading?: boolean;
  error?: unknown;
}

export default function ProductsHero({ pageContent, isLoading, error }: ProductsHeroProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !pageContent) {
    console.error("[ProductsHero] Error loading hero content:", error);
    // Fallback content
    return (
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
                Vending Product Solutions
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                Discover our range of software solutions designed for various types of vending operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Request Demo <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/technology">
                    Explore Technology
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3"
                  alt="Vending Machine Products"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Use the reusable ContentfulHero component with direct page content
  return (
    <ContentfulHero
      title={pageContent.heroTitle}
      description={pageContent.heroDescription}
      image={pageContent.heroImage?.fields?.file?.url}
      altText={pageContent.heroImage?.fields?.title || "Products"}
      primaryButtonText={pageContent.heroPrimaryButtonText}
      primaryButtonUrl={pageContent.heroPrimaryButtonUrl}
      secondaryButtonText={pageContent.heroSecondaryButtonText}
      secondaryButtonUrl={pageContent.heroSecondaryButtonUrl}
    />
  );
}
