
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { Skeleton } from '@/components/ui/skeleton';
import { LandingPage } from '@/types/landingPage';

interface PageHeroProps {
  pageKey: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackImage?: string;
  fallbackImageAlt?: string;
  fallbackPrimaryButtonText?: string;
  fallbackPrimaryButtonUrl?: string;
  fallbackSecondaryButtonText?: string;
  fallbackSecondaryButtonUrl?: string;
  fallbackBackgroundClass?: string;
}

const PageHero = ({
  pageKey,
  fallbackTitle = "Page Title",
  fallbackSubtitle = "Page description",
  fallbackImage = "",
  fallbackImageAlt = "Image",
  fallbackPrimaryButtonText = "",
  fallbackPrimaryButtonUrl = "",
  fallbackSecondaryButtonText = "",
  fallbackSecondaryButtonUrl = "",
  fallbackBackgroundClass = "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light"
}: PageHeroProps) => {
  const { data: landingPage, isLoading, error } = useLandingPageByKey(pageKey);
  
  // If we're loading, show a skeleton
  if (isLoading) {
    return (
      <div className={fallbackBackgroundClass}>
        <div className="container mx-auto py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="flex justify-center">
              <Skeleton className="w-full h-60 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If there's an error or no data, use fallback content
  if (error || !landingPage) {
    console.warn(`Falling back to default hero content for page: ${pageKey}`);
    return (
      <div className={fallbackBackgroundClass}>
        <div className="container mx-auto py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-vending-blue-dark">
                {fallbackTitle}
              </h1>
              <p className="text-lg text-gray-700">
                {fallbackSubtitle}
              </p>
              {fallbackPrimaryButtonText && (
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button asChild className="btn-primary">
                    <Link to={fallbackPrimaryButtonUrl}>
                      {fallbackPrimaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  {fallbackSecondaryButtonText && (
                    <Button asChild variant="outline">
                      <Link to={fallbackSecondaryButtonUrl}>
                        {fallbackSecondaryButtonText}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
            {fallbackImage && (
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src={fallbackImage} 
                    alt={fallbackImageAlt} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Type assertion to ensure landingPage is treated correctly
  const typedLandingPage = landingPage as LandingPage;
  const hero = typedLandingPage.hero_content;
  
  return (
    <div className={hero.background_class || fallbackBackgroundClass}>
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-vending-blue-dark">
              {hero.title}
            </h1>
            <p className="text-lg text-gray-700">
              {hero.subtitle}
            </p>
            {hero.cta_primary_text && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild className="btn-primary">
                  <Link to={hero.cta_primary_url || "#"}>
                    {hero.cta_primary_text} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {hero.cta_secondary_text && (
                  <Button asChild variant="outline">
                    <Link to={hero.cta_secondary_url || "#"}>
                      {hero.cta_secondary_text}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
          {hero.image_url && (
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src={hero.image_url} 
                  alt={hero.image_alt} 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    if (fallbackImage) e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHero;
