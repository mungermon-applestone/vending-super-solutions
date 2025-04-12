
import React, { useEffect } from 'react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { Button } from '@/components/ui/button';

interface PageHeroProps {
  pageKey: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  fallbackImage: string;
  fallbackImageAlt: string;
  fallbackPrimaryButtonText?: string;
  fallbackPrimaryButtonUrl?: string;
  fallbackSecondaryButtonText?: string;
  fallbackSecondaryButtonUrl?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  pageKey,
  fallbackTitle,
  fallbackSubtitle,
  fallbackImage,
  fallbackImageAlt,
  fallbackPrimaryButtonText,
  fallbackPrimaryButtonUrl,
  fallbackSecondaryButtonText,
  fallbackSecondaryButtonUrl,
}) => {
  const { data: landingPage, isLoading } = useLandingPageByKey(pageKey);
  
  // Add debugging to track what's happening
  useEffect(() => {
    console.log(`PageHero component for ${pageKey}:`, {
      landingPage,
      isLoading,
      hasCmsData: !!landingPage,
    });
  }, [pageKey, landingPage, isLoading]);
  
  // Use CMS data if available, otherwise fall back to props
  const heroContent = landingPage?.hero_content || null;
  
  const title = heroContent?.title || fallbackTitle;
  const subtitle = heroContent?.subtitle || fallbackSubtitle;
  const imageUrl = heroContent?.image_url || fallbackImage;
  const imageAlt = heroContent?.image_alt || fallbackImageAlt;
  const primaryButtonText = heroContent?.cta_primary_text || fallbackPrimaryButtonText;
  const primaryButtonUrl = heroContent?.cta_primary_url || fallbackPrimaryButtonUrl;
  const secondaryButtonText = heroContent?.cta_secondary_text || fallbackSecondaryButtonText;
  const secondaryButtonUrl = heroContent?.cta_secondary_url || fallbackSecondaryButtonUrl;
  const backgroundClass = heroContent?.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light';
  
  return (
    <section className={`py-16 ${backgroundClass}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              {primaryButtonText && primaryButtonUrl && (
                <a href={primaryButtonUrl}>
                  <Button size="lg">
                    {primaryButtonText}
                  </Button>
                </a>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <a href={secondaryButtonUrl}>
                  <Button size="lg" variant="outline">
                    {secondaryButtonText}
                  </Button>
                </a>
              )}
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              style={{ maxHeight: '500px' }}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800x500?text=Image+Not+Found";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
