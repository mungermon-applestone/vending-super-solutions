
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

export interface BlogPageContent {
  navigationLinkText: string;
  introTitle?: string;
  introDescription?: string;
  featuredPostsTitle?: string;
  latestArticlesTitle?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterButtonText?: string;
  newsletterPlaceholder?: string;
}

export function useBlogPageContent() {
  return useQuery({
    queryKey: ['contentful', 'blogPageContent'],
    queryFn: async () => {
      try {
        console.log('[useBlogPageContent] Fetching blog page content');
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'blogPageContent',
          limit: 1
        });

        console.log('[useBlogPageContent] Raw response:', entries);
        
        if (!entries.items.length) {
          console.warn('[useBlogPageContent] No content found');
          return null;
        }

        const fields = entries.items[0].fields as any;
        return {
          navigationLinkText: fields.navigationLinkText || 'Updates',
          introTitle: fields.introTitle || '',
          introDescription: fields.introDescription || '',
          featuredPostsTitle: fields.featuredPostsTitle || '',
          latestArticlesTitle: fields.latestArticlesTitle || '',
          newsletterTitle: fields.newsletterTitle || '',
          newsletterDescription: fields.newsletterDescription || '',
          newsletterButtonText: fields.newsletterButtonText || '',
          newsletterPlaceholder: fields.newsletterPlaceholder || '',
        };
      } catch (error) {
        console.error('[useBlogPageContent] Error:', error);
        return null;
      }
    },
    retry: 2
  });
}
