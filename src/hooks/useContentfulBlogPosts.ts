
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';
import { isContentfulEntry, isContentfulAsset } from '@/utils/contentfulTypeGuards';

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
        return entries.map(entry => {
          if (!isContentfulEntry(entry)) {
            console.error('[useContentfulBlogPosts] Invalid entry format:', entry);
            return null;
          }
          
          // Featured image handling with type safety
          let featuredImage = undefined;
          if (entry.fields.featuredImage && isContentfulAsset(entry.fields.featuredImage)) {
            featuredImage = {
              url: `https:${entry.fields.featuredImage.fields.file.url}`,
              title: String(entry.fields.featuredImage.fields.title || ''),
              width: entry.fields.featuredImage.fields.file?.details?.image?.width,
              height: entry.fields.featuredImage.fields.file?.details?.image?.height
            };
          }
          
          return {
            id: entry.sys?.id || '',
            title: String(entry.fields?.title || 'Untitled'),
            slug: String(entry.fields?.slug || ''),
            publishDate: entry.fields?.publishDate ? String(entry.fields.publishDate) : undefined,
            content: entry.fields?.content,
            excerpt: entry.fields?.excerpt ? String(entry.fields.excerpt) : undefined,
            featuredImage,
            author: entry.fields?.author ? String(entry.fields.author) : undefined,
            tags: Array.isArray(entry.fields?.tags) 
              ? entry.fields.tags.map(tag => String(tag)) 
              : []
          };
        }).filter(Boolean) as ContentfulBlogPost[];
      } catch (error) {
        console.error('[useContentfulBlogPosts] Error fetching blog posts:', error);
        return [];
      }
    }
  });
}
