
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';

export function useContentfulBlogPosts() {
  return useQuery({
    queryKey: ['contentful', 'blogPosts'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries(CMS_MODELS.BLOG_POST, {
          order: '-fields.publishDate'
        });
        
        return entries;
      } catch (error) {
        console.error('[useContentfulBlogPosts] Error fetching blog posts:', error);
        return [];
      }
    }
  });
}
