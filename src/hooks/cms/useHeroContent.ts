
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

/**
 * Hook to fetch hero content from Contentful
 */
export function useHeroContent(contentType: string = 'homepageContent') {
  return useQuery({
    queryKey: ['contentful', 'hero-content', contentType],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: contentType,
          limit: 1,
        });
        
        if (!response.items || response.items.length === 0) {
          console.warn(`[useHeroContent] No ${contentType} found`);
          return null;
        }
        
        return response.items[0];
      } catch (error) {
        console.error(`[useHeroContent] Error fetching ${contentType}:`, error);
        return null;
      }
    },
  });
}
