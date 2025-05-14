
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulAsset } from '@/types/contentful';

export interface ContentfulBlogPost {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    publishDate?: string;
    content?: any;
    excerpt?: string;
    featuredImage?: ContentfulAsset;
    author?: string;
    tags?: string[];
  };
  includes?: {
    Asset?: any[];
  };
}

export function useContentfulBlogPostBySlug(slug?: string) {
  return useQuery({
    queryKey: ['contentful', 'blogPost', slug],
    queryFn: async () => {
      if (!slug) {
        return null;
      }
      
      try {
        const query = {
          'fields.slug': slug,
          include: 2, // Include linked assets
          limit: 1
        };
        
        const entries = await fetchContentfulEntries('blogPost', query);
        
        if (!entries || entries.length === 0) {
          console.log(`[useContentfulBlogPostBySlug] No blog post found with slug: ${slug}`);
          return null;
        }
        
        // Return the first matching post
        return entries[0] as ContentfulBlogPost;
      } catch (error) {
        console.error(`[useContentfulBlogPostBySlug] Error fetching blog post: ${slug}`, error);
        return null;
      }
    },
    enabled: !!slug
  });
}
