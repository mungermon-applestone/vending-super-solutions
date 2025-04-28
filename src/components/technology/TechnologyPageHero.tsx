
import React, { useEffect } from 'react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';

interface TechnologyPageHeroProps {
  entryId: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackImageUrl?: string;
}

const TechnologyPageHero: React.FC<TechnologyPageHeroProps> = ({ 
  entryId,
  fallbackTitle = "Advanced Vending Machines",
  fallbackSubtitle = "Our machines combine cutting-edge technology with reliable performance to meet your business needs.",
  fallbackImageUrl = "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
}) => {
  const { data: hero, isLoading, error, refetch } = useHeroContent(entryId);
  
  // Enhanced error handling logging
  useEffect(() => {
    if (error) {
      console.log(`[TechnologyPageHero] Error loading hero content for entryId: ${entryId}`, {
        errorType: error instanceof Error ? error.message : 'Unknown error',
        isConfigError: error instanceof Error && error.message === 'CONTENTFUL_CONFIG_MISSING',
        isNotFoundError: error instanceof Error && error.message.includes('CONTENTFUL_ENTRY_NOT_FOUND')
      });
    }
  }, [error, entryId]);
  
  // Display a fallback when there's an error or no data
  const shouldUseFallback = !hero || error;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide py-16 md:py-24">
        {shouldUseFallback && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <div>
                <p className="text-sm text-amber-800">
                  {error instanceof Error && error.message === 'CONTENTFUL_CONFIG_MISSING' 
                    ? "Contentful is not configured. Using fallback content." 
                    : error instanceof Error && error.message.includes('CONTENTFUL_ENTRY_NOT_FOUND')
                      ? `Content entry (${entryId}) not found in Contentful`
                      : "Error loading content from Contentful. Using fallback content."}
                </p>
                {error instanceof Error && error.message === 'CONTENTFUL_CONFIG_MISSING' && (
                  <p className="text-xs text-amber-700 mt-1">Configure Contentful in Admin > Environment Variables</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              {shouldUseFallback ? fallbackTitle : hero.title}
            </h1>
            <p className="text-xl text-gray-700">
              {shouldUseFallback ? fallbackSubtitle : hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {(!shouldUseFallback && hero.primaryButtonText) ? (
                <Button asChild size="lg">
                  <Link to={hero.primaryButtonUrl || '#'}>
                    {hero.primaryButtonText}
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link to="/contact">
                    Request Information
                  </Link>
                </Button>
              )}
              
              {(!shouldUseFallback && hero.secondaryButtonText) ? (
                <Button asChild variant="outline" size="lg">
                  <Link to={hero.secondaryButtonUrl || '#'}>
                    {hero.secondaryButtonText}
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg">
                  <Link to="/products">
                    View Products
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img 
                src={shouldUseFallback ? fallbackImageUrl : `https:${hero.image?.url}`}
                alt={shouldUseFallback ? "Vending Machines" : (hero.image?.alt || hero.title)}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyPageHero;
