
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { isContentfulEntry } from '@/utils/contentfulTypeGuards';
import { safeString } from '@/services/cms/utils/safeTypeUtilities';

export interface ContentfulBlogPost {
  id?: string;
  sys?: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    contentType?: {
      sys: {
        id: string;
      }
    };
  };
  title?: string;
  slug?: string;
  content?: any;
  excerpt?: string;
  publishDate?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  featuredImage?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  author?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  fields?: {
    title: string;
    slug: string;
    publishDate?: string;
    content?: any;
    excerpt?: string;
    featuredImage?: any;
    author?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
    visible?: boolean;
  };
  includes?: any;
}

/**
 * Safely extract string field from Contentful entry
 */
function getEntryStringField(entry: any, fieldName: string, defaultValue: string = ''): string {
  if (!entry || !entry.fields || typeof entry.fields !== 'object') {
    return defaultValue;
  }
  
  const field = entry.fields[fieldName];
  if (field === null || field === undefined) {
    return defaultValue;
  }
  
  return String(field);
}

/**
 * Hook to fetch all blog posts with options
 */
export function useContentfulBlogPosts(options = { limit: 10, skip: 0 }) {
  return useQuery({
    queryKey: ['contentful', 'blogPosts', options],
    queryFn: async () => {
      try {
        const queryOptions = {
          limit: options.limit,
          skip: options.skip,
          include: 2
        };
        
        // Add order if it exists in the options
        if ('order' in options && typeof options.order === 'string') {
          Object.assign(queryOptions, { order: options.order });
        } else {
          // Default sorting
          Object.assign(queryOptions, { order: '-fields.publishDate' });
        }
        
        const entries = await fetchContentfulEntries('blogPost', queryOptions);
        
        return entries.map(entry => {
          const processedEntry: ContentfulBlogPost = {
            sys: entry.sys,
            id: entry.sys.id,
            title: getEntryStringField(entry, 'title'),
            slug: getEntryStringField(entry, 'slug'),
            content: entry.fields?.content,
            excerpt: getEntryStringField(entry, 'excerpt'),
            publishDate: getEntryStringField(entry, 'publishDate'),
            status: getEntryStringField(entry, 'status', 'published') as 'draft' | 'published' | 'archived',
            author: getEntryStringField(entry, 'author'),
            tags: Array.isArray(entry.fields?.tags) ? entry.fields.tags : [],
            fields: entry.fields,
          };
          
          // Handle includes data
          if (typeof entry.includes === 'object') {
            processedEntry.includes = entry.includes;
          }
          
          // Handle featured image if it exists
          if (entry.fields?.featuredImage) {
            try {
              processedEntry.featuredImage = {
                url: `https:${entry.fields.featuredImage.fields?.file?.url || ''}`,
                title: entry.fields.featuredImage.fields?.title || '',
                width: entry.fields.featuredImage.fields?.file?.details?.image?.width,
                height: entry.fields.featuredImage.fields?.file?.details?.image?.height
              };
            } catch (e) {
              console.error('Error processing featured image:', e);
            }
          }
          
          return processedEntry;
        });
      } catch (error) {
        console.error('Error fetching blog posts from Contentful:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useContentfulBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'blogPost', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      try {
        const entries = await fetchContentfulEntries('blogPost', {
          'fields.slug': slug,
          include: 10 // Deep include for rich text content
        });
        
        if (!entries || entries.length === 0) return null;
        
        const entry = entries[0];
        
        const result: ContentfulBlogPost = {
          sys: entry.sys,
          id: entry.sys.id,
          title: getEntryStringField(entry, 'title'),
          slug: getEntryStringField(entry, 'slug'),
          content: entry.fields?.content,
          excerpt: getEntryStringField(entry, 'excerpt'),
          publishDate: getEntryStringField(entry, 'publishDate'),
          status: getEntryStringField(entry, 'status', 'published') as 'draft' | 'published' | 'archived',
          author: getEntryStringField(entry, 'author'),
          tags: Array.isArray(entry.fields?.tags) ? entry.fields.tags : [],
          fields: entry.fields,
        };
        
        // Handle includes data
        if (typeof entry.includes === 'object') {
          result.includes = entry.includes;
        }
        
        // Handle featured image if it exists
        if (entry.fields?.featuredImage) {
          result.featuredImage = {
            url: `https:${entry.fields.featuredImage.fields?.file?.url || ''}`,
            title: entry.fields.featuredImage.fields?.title || '',
            width: entry.fields.featuredImage.fields?.file?.details?.image?.width,
            height: entry.fields.featuredImage.fields?.file?.details?.image?.height
          };
        }
        
        return result;
      } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
