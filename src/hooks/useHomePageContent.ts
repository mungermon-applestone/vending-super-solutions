
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

/**
 * Hook to fetch home page content from Contentful
 */
export function useHomePageContent() {
  return useQuery({
    queryKey: ['contentful', 'homepageContent'],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'homepageContent',
          limit: 1,
          include: 2, // Include linked entries
        });
        
        if (!response.items || response.items.length === 0) {
          console.warn('[useHomePageContent] No homepage content found');
          return null;
        }
        
        return response.items[0];
      } catch (error) {
        console.error('[useHomePageContent] Error fetching homepage content:', error);
        return null;
      }
    },
  });
}
