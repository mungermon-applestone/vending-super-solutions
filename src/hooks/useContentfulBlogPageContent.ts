
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';

export function useContentfulBlogPageContent() {
  return useQuery({
    queryKey: ['contentful', 'blogPageContent'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('blogPageSettings', {});
        
        if (!entries || entries.length === 0) {
          return null;
        }
        
        return entries[0];
      } catch (error) {
        console.error('[useContentfulBlogPageContent] Error:', error);
        return null;
      }
    }
  });
}
