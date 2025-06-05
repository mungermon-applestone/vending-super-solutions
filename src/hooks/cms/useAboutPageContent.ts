
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

export interface AboutPageContent {
  navigationLinkText: string;
  // Add other about page fields as needed
}

export function useAboutPageContent() {
  return useQuery({
    queryKey: ['contentful', 'about'],
    queryFn: async () => {
      try {
        console.log('[useAboutPageContent] Fetching about page content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'about',
          limit: 1
        });

        console.log('[useAboutPageContent] Raw response:', entries);
        
        if (!entries.items.length) {
          console.warn('[useAboutPageContent] No content found');
          return null;
        }

        const fields = entries.items[0].fields as any;
        return {
          navigationLinkText: fields.navigationLinkText || 'About',
        };
      } catch (error) {
        console.error('[useAboutPageContent] Error:', error);
        return null;
      }
    },
    retry: 2
  });
}
