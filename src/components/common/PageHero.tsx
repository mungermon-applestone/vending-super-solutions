
import React, { useEffect } from 'react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { Button } from '@/components/ui/button';
import { LandingPage } from '@/types/landingPage';
import { Link } from 'react-router-dom';

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
  const { data: landingPage, isLoading, error } = useLandingPageByKey(pageKey);
  
  // Add enhanced debugging to track what's happening
  useEffect(() => {
    console.log(`PageHero component for ${pageKey}:`, {
      landingPage,
      isLoading,
      error,
      hasCmsData: !!landingPage,
      heroContent: landingPage ? landingPage.hero_content : null,
    });
  }, [pageKey, landingPage, isLoading, error]);
  
  // Use CMS data if available, otherwise fall back to props
  const heroContent = landingPage?.hero_content || null;
  
  // Debug what content we're actually using
  useEffect(() => {
    console.log(`PageHero for ${pageKey} - Using content:`, {
      usingCmsData: !!heroContent,
      title: heroContent?.title || fallbackTitle,
      subtitle: heroContent?.subtitle || fallbackSubtitle,
    });
  }, [heroContent, pageKey, fallbackTitle, fallbackSubtitle]);
  
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
                <Link to={primaryButtonUrl}>
                  <Button size="lg">
                    {primaryButtonText}
                  </Button>
                </Link>
              )}
              {secondaryButtonText && secondaryButtonUrl && (
                <Link to={secondaryButtonUrl}>
                  <Button size="lg" variant="outline">
                    {secondaryButtonText}
                  </Button>
                </Link>
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
                console.log("Image failed to load:", imageUrl);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
