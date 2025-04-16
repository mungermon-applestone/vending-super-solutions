
import React, { useEffect } from 'react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { useContentfulHeroByKey } from '@/hooks/cms/useContentfulHero';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LandingPage } from '@/types/landingPage';
import { toast } from 'sonner';

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
  // Fetch hero content from both Supabase and Contentful
  const { data: landingPage } = useLandingPageByKey(pageKey);
  const { data: contentfulHero, isLoading: isContentfulLoading, error: contentfulError } = useContentfulHeroByKey(pageKey);
  
  // Log data sources for debugging
  useEffect(() => {
    console.log(`PageHero component for ${pageKey}:`, {
      supabaseData: landingPage,
      contentfulData: contentfulHero,
      usingContentful: !!contentfulHero
    });
    
    if (contentfulError) {
      console.error(`PageHero component for ${pageKey} - Contentful Error:`, contentfulError);
    }
  }, [pageKey, landingPage, contentfulHero, contentfulError]);
  
  // Prioritize Contentful data over Supabase data
  // If no CMS data, fall back to props
  const typedLandingPage = landingPage as LandingPage | null;
  const supabaseHeroContent = typedLandingPage?.hero_content || null;
  
  // Determine which content to use (Contentful > Supabase > Fallback)
  const title = contentfulHero?.title || supabaseHeroContent?.title || fallbackTitle;
  const subtitle = contentfulHero?.subtitle || supabaseHeroContent?.subtitle || fallbackSubtitle;
  const imageUrl = contentfulHero?.image?.url || supabaseHeroContent?.image_url || fallbackImage;
  const imageAlt = contentfulHero?.image?.alt || supabaseHeroContent?.image_alt || fallbackImageAlt;
  const primaryButtonText = contentfulHero?.primaryButtonText || supabaseHeroContent?.cta_primary_text || fallbackPrimaryButtonText;
  const primaryButtonUrl = contentfulHero?.primaryButtonUrl || supabaseHeroContent?.cta_primary_url || fallbackPrimaryButtonUrl;
  const secondaryButtonText = contentfulHero?.secondaryButtonText || supabaseHeroContent?.cta_secondary_text || fallbackSecondaryButtonText;
  const secondaryButtonUrl = contentfulHero?.secondaryButtonUrl || supabaseHeroContent?.cta_secondary_url || fallbackSecondaryButtonUrl;
  const backgroundClass = contentfulHero?.backgroundClass || supabaseHeroContent?.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light';
  
  return (
    <section className={`py-16 ${backgroundClass}`} data-testid={`page-hero-${pageKey}`}>
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
            
            {/* Optional badge to show content source - can be removed in production */}
            {contentfulHero && (
              <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded inline-block">
                ✓ Using Contentful hero
              </div>
            )}
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
