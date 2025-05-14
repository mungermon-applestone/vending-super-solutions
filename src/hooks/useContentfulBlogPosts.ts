
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
  content?: any;
  excerpt?: string;
  featuredImage?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  author?: string;
  tags?: string[];
  sys: {
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
  // For BlogPost compatibility
  status?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  // Support for includes (used for rich text resolution)
  includes?: any;
}

export interface BlogPostQueryOptions {
  limit?: number;
  skip?: number;
  order?: string;
  status?: string; // Added for compatibility
}

// Updated hook to not require parameters
export function useContentfulBlogPosts(options?: BlogPostQueryOptions) {
  return useQuery({
    queryKey: ['contentful', 'blogPosts', options],
    queryFn: async () => {
      try {
        const queryOptions: Record<string, any> = {
          limit: options?.limit || 100,
          skip: options?.skip || 0,
          order: options?.order || '-fields.publishDate',
          include: 2, // Include linked assets and entries for rich text resolution
        };
        
        const entries = await fetchContentfulEntries(CMS_MODELS.BLOG_POST, queryOptions);
        
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
          
          const publishDate = entry.fields?.publishDate ? safeString(entry.fields.publishDate) : undefined;
          
          const blogPost: ContentfulBlogPost = {
            id: entry.sys?.id || '',
            title: safeString(entry.fields?.title || 'Untitled'),
            slug: safeString(entry.fields?.slug || ''),
            publishDate,
            published_at: publishDate, // For backward compatibility
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
            fields: entry.fields,
            status: 'published', // Default status for Contentful posts
            created_at: entry.sys?.createdAt,
            updated_at: entry.sys?.updatedAt
          };
          
          // Add includes for rich text resolution if they exist in the original entry
          if ((entry as any).includes) {
            blogPost.includes = (entry as any).includes;
          }
          
          return blogPost;
        }).filter(Boolean) as ContentfulBlogPost[];
      } catch (error) {
        console.error('[useContentfulBlogPosts] Error fetching blog posts:', error);
        return [];
      }
    }
  });
}
