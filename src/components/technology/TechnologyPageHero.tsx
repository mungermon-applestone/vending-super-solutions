
import React, { useEffect, useState } from 'react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Loader2 } from 'lucide-react';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';
import { toast } from 'sonner';

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
  // Track explicit retries for the machines page hero
  const [retryCount, setRetryCount] = useState(0);
  const [hasManuallyRetried, setHasManuallyRetried] = useState(false);
  
  // Enhanced logging for the machines page hero
  useEffect(() => {
    console.log(`[TechnologyPageHero] Initializing with entry ID: ${entryId}`, {
      fallbackTitle,
      fallbackSubtitle,
      retryCount,
      hasManuallyRetried
    });
    
    // Special detailed logging for the machines hero ID
    if (entryId === '3bH4WrT0pLKDeG35mUekGq') {
      console.log(`[TechnologyPageHero] MACHINES HERO - This is the special machines hero entry ID that's been troublesome`);
    }
  }, [entryId, fallbackTitle, fallbackSubtitle, retryCount, hasManuallyRetried]);
  
  const { 
    data: hero, 
    isLoading, 
    error, 
    refetch,
    isError
  } = useHeroContent(entryId);
  
  // Enhanced error handling logging
  useEffect(() => {
    if (error) {
      console.log(`[TechnologyPageHero] Error loading hero content for entryId: ${entryId}`, {
        errorType: error instanceof Error ? error.message : 'Unknown error',
        isConfigError: error instanceof Error && error.message === 'CONTENTFUL_CONFIG_MISSING',
        isNotFoundError: error instanceof Error && error.message.includes('CONTENTFUL_ENTRY_NOT_FOUND'),
        errorDetails: error,
        retryCount
      });
    }
  }, [error, entryId, retryCount]);
  
  // Try to refetch on mount for machines page to ensure we get the content
  useEffect(() => {
    // Special case for machines entry ID - retry additional times on mount
    if (entryId === '3bH4WrT0pLKDeG35mUekGq') {
      console.log(`[TechnologyPageHero] Special case: Attempting refetch for machines hero (${entryId})`);
      
      // Refetch once on mount
      refetch().catch(refetchError => {
        console.error(`[TechnologyPageHero] Initial refetch failed for ${entryId}:`, refetchError);
      });
      
      // Add a second retry with a delay to ensure Contentful client is fully initialized
      const retryTimer = setTimeout(() => {
        if (!hero && (error || isLoading)) {
          setRetryCount(prev => prev + 1);
          console.log(`[TechnologyPageHero] Attempting delayed refetch for machines hero (${entryId}), retry #${retryCount + 1}`);
          refetch().then(result => {
            if (result.data) {
              console.log(`[TechnologyPageHero] Delayed refetch successful for machines hero:`, result.data);
              toast.success("Content loaded successfully!");
            } else {
              console.error(`[TechnologyPageHero] Delayed refetch failed to get data:`, result);
            }
          }).catch(retryError => {
            console.error(`[TechnologyPageHero] Delayed refetch failed for ${entryId}:`, retryError);
          });
        }
      }, 2000);
      
      // Additional retry with longer delay if needed
      const secondRetryTimer = setTimeout(() => {
        if (!hero && (error || isLoading) && !hasManuallyRetried) {
          setHasManuallyRetried(true);
          setRetryCount(prev => prev + 1);
          console.log(`[TechnologyPageHero] Attempting second delayed refetch for machines hero (${entryId}), retry #${retryCount + 2}`);
          refetch().then(result => {
            if (result.data) {
              console.log(`[TechnologyPageHero] Second delayed refetch successful for machines hero:`, result.data);
              toast.success("Content loaded on second retry!");
            }
          }).catch(secondRetryError => {
            console.error(`[TechnologyPageHero] Second delayed refetch failed for ${entryId}:`, secondRetryError);
          });
        }
      }, 5000);
      
      return () => {
        clearTimeout(retryTimer);
        clearTimeout(secondRetryTimer);
      };
    }
  }, [entryId, refetch, hero, error, isLoading, retryCount, hasManuallyRetried]);
  
  // Display a fallback when there's an error or no data
  const isUsingFallback = Boolean(!hero || isError);
  
  if (isLoading && !hero && retryCount === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">Loading content for entry: {entryId}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <HeroContent 
            title={isUsingFallback ? fallbackTitle : hero.title}
            subtitle={isUsingFallback ? fallbackSubtitle : hero.subtitle}
            primaryButtonText={!isUsingFallback && hero.primaryButtonText ? hero.primaryButtonText : "Request Information"}
            primaryButtonUrl={!isUsingFallback && hero.primaryButtonUrl ? hero.primaryButtonUrl : "/contact"}
            secondaryButtonText={!isUsingFallback && hero.secondaryButtonText ? hero.secondaryButtonText : "View Products"}
            secondaryButtonUrl={!isUsingFallback && hero.secondaryButtonUrl ? hero.secondaryButtonUrl : "/products"}
            error={error}
            isUsingFallback={isUsingFallback}
            entryId={entryId}
          />
          <HeroImage 
            imageUrl={isUsingFallback ? fallbackImageUrl : `https:${hero?.image?.url || ''}`}
            imageAlt={isUsingFallback ? "Vending Machines" : (hero?.image?.alt || hero?.title || "Vending Technology")}
          />
        </div>
      </div>
    </section>
  );
};

export default TechnologyPageHero;
