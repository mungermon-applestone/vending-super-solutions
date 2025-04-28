
import React, { useEffect } from 'react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Loader2 } from 'lucide-react';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <HeroContent 
            title={shouldUseFallback ? fallbackTitle : hero.title}
            subtitle={shouldUseFallback ? fallbackSubtitle : hero.subtitle}
            primaryButtonText={!shouldUseFallback && hero.primaryButtonText ? hero.primaryButtonText : "Request Information"}
            primaryButtonUrl={!shouldUseFallback && hero.primaryButtonUrl ? hero.primaryButtonUrl : "/contact"}
            secondaryButtonText={!shouldUseFallback && hero.secondaryButtonText ? hero.secondaryButtonText : "View Products"}
            secondaryButtonUrl={!shouldUseFallback && hero.secondaryButtonUrl ? hero.secondaryButtonUrl : "/products"}
            error={error}
            isUsingFallback={shouldUseFallback}
            entryId={entryId}
          />
          <HeroImage 
            imageUrl={shouldUseFallback ? fallbackImageUrl : `https:${hero.image?.url}`}
            imageAlt={shouldUseFallback ? "Vending Machines" : (hero.image?.alt || hero.title)}
          />
        </div>
      </div>
    </section>
  );
};

export default TechnologyPageHero;
