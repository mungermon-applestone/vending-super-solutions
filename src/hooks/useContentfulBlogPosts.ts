
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';

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
 * Hook to fetch all blog posts with options
 */
export function useContentfulBlogPosts(options = { limit: 10, skip: 0 }) {
  return useQuery({
    queryKey: ['contentful', 'blogPosts', options],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('blogPost', {
          order: '-fields.publishDate',
          limit: options.limit,
          skip: options.skip,
          include: 2
        });
        
        return entries.map(entry => ({
          sys: entry.sys,
          id: entry.sys.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          content: entry.fields.content,
          excerpt: entry.fields.excerpt,
          publishDate: entry.fields.publishDate,
          status: entry.fields.status || 'published',
          author: entry.fields.author,
          tags: entry.fields.tags || [],
          fields: entry.fields,
          includes: entry.includes
        }));
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
        
        return {
          sys: entry.sys,
          id: entry.sys.id,
          title: entry.fields.title,
          slug: entry.fields.slug,
          content: entry.fields.content,
          excerpt: entry.fields.excerpt,
          publishDate: entry.fields.publishDate,
          status: entry.fields.status || 'published',
          author: entry.fields.author,
          tags: entry.fields.tags || [],
          fields: entry.fields,
          includes: entry.includes,
          featuredImage: entry.fields.featuredImage ? {
            url: `https:${entry.fields.featuredImage.fields?.file?.url}`,
            title: entry.fields.featuredImage.fields?.title || '',
            width: entry.fields.featuredImage.fields?.file?.details?.image?.width,
            height: entry.fields.featuredImage.fields?.file?.details?.image?.height
          } : undefined
        };
      } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
