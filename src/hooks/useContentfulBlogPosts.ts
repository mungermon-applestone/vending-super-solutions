
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';

// Export the interface for blog posts
export interface ContentfulBlogPost {
  id: string;
  title: string;
  slug: string;
  publishDate?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  author?: string;
  tags?: string[];
}

export function useContentfulBlogPosts() {
  return useQuery({
    queryKey: ['contentful', 'blogPosts'],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries(CMS_MODELS.BLOG_POST, {
          order: '-fields.publishDate'
        });
        
        // Transform entries to match expected format
        return entries.map(entry => ({
          id: entry.sys?.id || '',
          title: entry.fields?.title || 'Untitled',
          slug: entry.fields?.slug || '',
          publishDate: entry.fields?.publishDate,
          content: entry.fields?.content,
          excerpt: entry.fields?.excerpt,
          featuredImage: entry.fields?.featuredImage?.fields ? {
            url: `https:${entry.fields.featuredImage.fields.file?.url}` || '',
            title: entry.fields.featuredImage.fields.title || '',
            width: entry.fields.featuredImage.fields.file?.details?.image?.width,
            height: entry.fields.featuredImage.fields.file?.details?.image?.height
          } : undefined,
          author: entry.fields?.author,
          tags: entry.fields?.tags || []
        })) as ContentfulBlogPost[];
      } catch (error) {
        console.error('[useContentfulBlogPosts] Error fetching blog posts:', error);
        return [];
      }
    }
  });
}
