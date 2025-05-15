
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { isContentfulEntry } from '@/utils/contentfulTypeGuards';
import { safeString, safeAssetToImage } from '@/services/cms/utils/safeTypeUtilities';

export interface HeroContent {
  // Standard properties
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
  backgroundImageUrl?: string;
  image: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  
  // Legacy properties for backward compatibility
  headline?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCTAText?: string;
  secondaryCTALink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
}

export function useHeroContent(pageKey?: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', pageKey],
    queryFn: async () => {
      try {
        // If no page key is provided, return a simplified response
        if (!pageKey) {
          console.log('[useHeroContent] No page key provided, returning generic hero content');
          return {
            title: "Software Solutions for Vending",
            subtitle: "Innovative technology that powers modern vending machines",
            primaryButtonText: "Request Demo",
            primaryButtonUrl: "/contact",
            secondaryButtonText: "Learn More",
            secondaryButtonUrl: "/products",
            backgroundClass: "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light",
            image: {
              url: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3",
              alt: "Vending Technology",
            },
            // Add legacy field mappings
            headline: "Software Solutions for Vending",
            subheading: "Innovative technology that powers modern vending machines",
            ctaText: "Request Demo",
            ctaLink: "/contact",
            secondaryCTAText: "Learn More",
            secondaryCTALink: "/products",
            backgroundImage: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3",
            backgroundImageAlt: "Vending Technology"
          } as HeroContent;
        }
        
        // Query the hero content for the specific page
        const entries = await fetchContentfulEntries('hero', {
          'fields.pageKey': pageKey,
          limit: 1
        });
        
        if (!entries || entries.length === 0) {
          console.warn(`[useHeroContent] No hero content found for page: ${pageKey}`);
          return null;
        }
        
        const entry = entries[0];
        
        if (!isContentfulEntry(entry)) {
          console.error('[useHeroContent] Invalid entry format:', entry);
          return null;
        }
        
        // Extract image data
        const image = entry.fields.image ? safeAssetToImage(entry.fields.image) : null;
        
        if (!image) {
          console.warn(`[useHeroContent] Missing image for hero content: ${pageKey}`);
        }
        
        // Create the result with both standard and legacy property names
        const result = {
          title: safeString(entry.fields.title),
          subtitle: safeString(entry.fields.subtitle),
          primaryButtonText: safeString(entry.fields.primaryButtonText),
          primaryButtonUrl: safeString(entry.fields.primaryButtonUrl),
          secondaryButtonText: safeString(entry.fields.secondaryButtonText),
          secondaryButtonUrl: safeString(entry.fields.secondaryButtonUrl),
          backgroundClass: safeString(entry.fields.backgroundClass),
          backgroundImageUrl: safeString(entry.fields.backgroundImageUrl),
          image: image || {
            url: '/placeholder-image.jpg',
            alt: 'Placeholder',
          },
          // Legacy field mappings
          headline: safeString(entry.fields.title),
          subheading: safeString(entry.fields.subtitle),
          ctaText: safeString(entry.fields.primaryButtonText),
          ctaLink: safeString(entry.fields.primaryButtonUrl),
          secondaryCTAText: safeString(entry.fields.secondaryButtonText),
          secondaryCTALink: safeString(entry.fields.secondaryButtonUrl),
          backgroundImage: safeString(entry.fields.backgroundImageUrl),
          backgroundImageAlt: safeString(entry.fields.title)
        } as HeroContent;
        
        return result;
      } catch (error) {
        console.error(`[useHeroContent] Error fetching hero content for page: ${pageKey}`, error);
        return null;
      }
    },
    enabled: true
  });
}
