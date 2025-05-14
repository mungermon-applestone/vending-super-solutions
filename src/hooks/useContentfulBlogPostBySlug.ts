
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';

export interface ContentfulBlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    content: Document;
    excerpt?: string;
    publishDate: string;
    featuredImage?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
  includes?: {
    Asset?: Array<{
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
          contentType: string;
          details?: {
            image?: {
              width: number;
              height: number;
            };
          };
        };
      };
    }>;
  };
}

export function useContentfulBlogPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'blogPost', slug],
    queryFn: async () => {
      if (!slug) {
        console.warn('[useContentfulBlogPostBySlug] No slug provided');
        return null;
      }
      
      try {
        console.log(`[useContentfulBlogPostBySlug] Fetching blog post with slug: ${slug}`);
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
          include: 3 // Include 3 levels of linked entries
        });
        
        if (entries.items.length === 0) {
          console.warn(`[useContentfulBlogPostBySlug] No blog post found with slug: ${slug}`);
          return null;
        }
        
        const post = entries.items[0] as unknown as ContentfulBlogPost;
        post.includes = entries.includes;
        
        return post;
      } catch (error) {
        console.error('[useContentfulBlogPostBySlug] Error:', error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}

// Re-export the type for use in other files
export type { ContentfulBlogPost };
