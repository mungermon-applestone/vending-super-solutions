
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/contentful/client';
import { Document } from '@contentful/rich-text-types';

export interface HeroContent {
  title: string;
  subtitle: string;
  description?: Document;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  // Additional properties needed by components
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  image?: {
    url: string;
    alt?: string;
  };
  backgroundClass?: string;
}

/**
 * Hook to fetch hero content for a specific page
 * @param pageKey The key identifying which page's hero to fetch
 */
export function useHeroContent(pageKey: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', pageKey],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('hero', {
          'fields.pageKey': pageKey,
          include: 2
        });
        
        if (entries.items.length === 0) {
          console.warn(`No hero content found for page: ${pageKey}`);
          return null;
        }
        
        const item = entries.items[0];
        
        // Type assertion here to safely access fields
        const fields = item.fields as any;
        
        const heroContent: HeroContent = {
          title: fields.title || '',
          subtitle: fields.subtitle || '',
          description: fields.description || null,
          ctaText: fields.ctaText || '',
          ctaLink: fields.ctaLink || '',
          secondaryCtaText: fields.secondaryCtaText || '',
          secondaryCtaLink: fields.secondaryCtaLink || '',
          primaryButtonText: fields.primaryButtonText || fields.ctaText || '',
          primaryButtonUrl: fields.primaryButtonUrl || fields.ctaLink || '',
          secondaryButtonText: fields.secondaryButtonText || fields.secondaryCtaText || '',
          secondaryButtonUrl: fields.secondaryButtonUrl || fields.secondaryCtaLink || '',
          backgroundClass: fields.backgroundClass || '',
        };
        
        if (fields.backgroundImage) {
          heroContent.backgroundImage = {
            url: `https:${fields.backgroundImage.fields.file.url}`,
            alt: fields.backgroundImage.fields.title || '',
          };
        }
        
        if (fields.image) {
          heroContent.image = {
            url: `https:${fields.image.fields.file.url}`,
            alt: fields.image.fields.title || '',
          };
        }
        
        return heroContent;
      } catch (error) {
        console.error(`Error fetching hero content for page ${pageKey}:`, error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
