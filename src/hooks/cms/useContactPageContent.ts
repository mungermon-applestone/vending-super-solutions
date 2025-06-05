
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

export interface ContactPageContent {
  navigationLinkText: string;
  // Add other contact page fields as needed
}

export function useContactPageContent() {
  return useQuery({
    queryKey: ['contentful', 'contactPageContent'],
    queryFn: async () => {
      try {
        console.log('[useContactPageContent] Fetching contact page content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'contactPageContent',
          limit: 1
        });

        console.log('[useContactPageContent] Raw response:', entries);
        
        if (!entries.items.length) {
          console.warn('[useContactPageContent] No content found');
          return null;
        }

        const fields = entries.items[0].fields as any;
        return {
          navigationLinkText: fields.navigationLinkText || 'Contact',
        };
      } catch (error) {
        console.error('[useContactPageContent] Error:', error);
        return null;
      }
    },
    retry: 2
  });
}
