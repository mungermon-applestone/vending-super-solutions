
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { isContentfulEntry } from '@/utils/contentfulTypeGuards';
import { safeString, safeAssetToImage } from '@/services/cms/utils/safeTypeUtilities';

export interface HeroContent {
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
}

export function useHeroContent(pageKey?: string) {
  return useQuery({
    queryKey: ['contentful', 'hero', pageKey],
    queryFn: async () => {
      try {
        if (!pageKey) {
          throw new Error("Page key is required");
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
        
        return {
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
          }
        } as HeroContent;
      } catch (error) {
        console.error(`[useHeroContent] Error fetching hero content for page: ${pageKey}`, error);
        return null;
      }
    },
    enabled: !!pageKey
  });
}
