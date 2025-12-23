
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

export interface AboutPageContent {
  navigationLinkText: string;
}

export function useAboutPageContent() {
  return useQuery({
    queryKey: ['contentful', 'about-from-privacy'],
    queryFn: async () => {
      try {
        console.log('[useAboutPageContent] Fetching about content from privacyPolicy');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'privacyPolicy',
          limit: 1
        });

        console.log('[useAboutPageContent] Raw response:', entries);
        
        if (!entries.items.length) {
          console.warn('[useAboutPageContent] No content found');
          return null;
        }

        const fields = entries.items[0].fields as any;
        return {
          navigationLinkText: fields.aboutUsNavigation || 'About',
        };
      } catch (error) {
        console.error('[useAboutPageContent] Error:', error);
        return null;
      }
    },
    retry: 2
  });
}
