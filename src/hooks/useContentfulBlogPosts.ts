
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';
import { isContentfulEntry, isContentfulAsset } from '@/utils/contentfulTypeGuards';
import { safeString } from '@/services/cms/utils/safeTypeUtilities';

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
  sys?: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
  fields?: {
    title: string;
    slug: string;
    publishDate?: string;
    content?: any;
    excerpt?: string;
    featuredImage?: any;
    author?: string;
    tags?: string[];
  };
}

export interface BlogPostQueryOptions {
  limit?: number;
  skip?: number;
  order?: string;
}

export function useContentfulBlogPosts(options?: BlogPostQueryOptions) {
  return useQuery({
    queryKey: ['contentful', 'blogPosts', options],
    queryFn: async () => {
      try {
        const queryOptions: Record<string, any> = {
          limit: options?.limit || 100,
          skip: options?.skip || 0,
          order: options?.order || '-fields.publishDate'
        };
        
        const entries = await fetchContentfulEntries(CMS_MODELS ? CMS_MODELS.BLOG_POST : 'blogPost', queryOptions);
        
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
              title: safeString(entry.fields.featuredImage.fields.title || ''),
              width: entry.fields.featuredImage.fields.file?.details?.image?.width,
              height: entry.fields.featuredImage.fields.file?.details?.image?.height
            };
          }
          
          return {
            id: entry.sys?.id || '',
            title: safeString(entry.fields?.title || 'Untitled'),
            slug: safeString(entry.fields?.slug || ''),
            publishDate: entry.fields?.publishDate ? safeString(entry.fields.publishDate) : undefined,
            content: entry.fields?.content,
            excerpt: entry.fields?.excerpt ? safeString(entry.fields.excerpt) : undefined,
            featuredImage,
            author: entry.fields?.author ? safeString(entry.fields.author) : undefined,
            tags: Array.isArray(entry.fields?.tags) 
              ? entry.fields.tags.map(tag => safeString(tag)) 
              : [],
            sys: {
              id: entry.sys?.id || '',
              createdAt: entry.sys?.createdAt,
              updatedAt: entry.sys?.updatedAt
            },
            fields: entry.fields
          };
        }).filter(Boolean) as ContentfulBlogPost[];
      } catch (error) {
        console.error('[useContentfulBlogPosts] Error fetching blog posts:', error);
        return [];
      }
    }
  });
}
