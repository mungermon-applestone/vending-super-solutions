
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/contentful/utils';
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
        };
        
        if (fields.backgroundImage) {
          heroContent.backgroundImage = {
            url: `https:${fields.backgroundImage.fields.file.url}`,
            alt: fields.backgroundImage.fields.title || '',
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
