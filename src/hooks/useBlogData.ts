
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { BlogPost, AdjacentPost } from '@/types/contentful';

/**
 * Safely access nested Contentful fields
 */
const getField = <T>(entry: any, fieldPath: string, defaultValue: T): T => {
  try {
    const paths = fieldPath.split('.');
    let value = entry?.fields;
    
    for (const path of paths) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path];
      } else {
        return defaultValue;
      }
    }
    
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (e) {
    console.error(`Error accessing field ${fieldPath}:`, e);
    return defaultValue;
  }
};

/**
 * Transform a Contentful blog post entry to our application's BlogPost type
 */
function transformContentfulBlogPost(entry: any): BlogPost {
  return {
    id: entry.sys.id,
    title: getField(entry, 'title', 'Untitled Post'),
    slug: getField(entry, 'slug', ''),
    author: getField(entry, 'author', 'Anonymous'),
    summary: getField(entry, 'summary', ''),
    content: getField(entry, 'content', ''),
    status: getField(entry, 'status', 'draft'),
    featured_image: getField<any>(entry, 'featuredImage', null)?.fields?.file?.url 
      ? `https:${getField<any>(entry, 'featuredImage', null).fields.file.url}` 
      : undefined,
    published_date: getField(entry, 'publishedDate', null) 
      ? new Date(getField(entry, 'publishedDate', '')).toISOString()
      : undefined,
    tags: getField(entry, 'tags', []),
    category: getField(entry, 'category', ''),
    reading_time: getField(entry, 'readingTime', 0) || calculateReadingTime(getField(entry, 'content', '')),
  };
}

/**
 * Transform a Contentful entry to an AdjacentPost type (used for prev/next navigation)
 */
function transformToAdjacentPost(entry: any): AdjacentPost {
  return {
    id: entry.sys.id,
    title: getField(entry, 'title', 'Untitled Post'),
    slug: getField(entry, 'slug', ''),
  };
}

/**
 * Calculate estimated reading time based on word count
 */
function calculateReadingTime(content: string): number {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Hook to fetch a list of blog posts from Contentful
 */
export function useContentfulBlogPosts() {
  return useQuery({
    queryKey: ['contentful', 'blogPosts'],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishedDate'],
        });
        
        return response.items.map(transformContentfulBlogPost);
      } catch (error) {
        console.error('Error fetching blog posts from Contentful:', error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useContentfulBlogPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'blogPost', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;
      
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
          limit: 1,
        });
        
        if (response.items.length === 0) {
          return null;
        }
        
        return transformContentfulBlogPost(response.items[0]);
      } catch (error) {
        console.error(`Error fetching blog post with slug "${slug}" from Contentful:`, error);
        return null;
      }
    },
    enabled: !!slug,
  });
}

/**
 * Hook to fetch featured blog posts
 */
export function useContentfulFeaturedBlogPosts(limit = 3) {
  return useQuery({
    queryKey: ['contentful', 'featuredBlogPosts', limit],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.featured': true,
          order: ['-fields.publishedDate'],
          limit,
        });
        
        return response.items.map(transformContentfulBlogPost);
      } catch (error) {
        console.error('Error fetching featured blog posts from Contentful:', error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch adjacent blog posts for navigation
 */
export function useContentfulAdjacentBlogPosts(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'adjacentPosts', slug],
    queryFn: async () => {
      if (!slug) return { previous: null, next: null };
      
      try {
        // First, get all posts sorted by publishedDate
        const allPosts = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['fields.publishedDate'],
          select: 'sys.id,fields.title,fields.slug,fields.publishedDate',
        });
        
        if (allPosts.items.length === 0) {
          return { previous: null, next: null };
        }
        
        // Find the index of the current post
        const currentIndex = allPosts.items.findIndex(
          item => getField(item, 'slug', '') === slug
        );
        
        if (currentIndex === -1) {
          return { previous: null, next: null };
        }
        
        // Get previous and next posts
        const previousPost = currentIndex > 0 
          ? transformToAdjacentPost(allPosts.items[currentIndex - 1]) 
          : null;
          
        const nextPost = currentIndex < allPosts.items.length - 1 
          ? transformToAdjacentPost(allPosts.items[currentIndex + 1]) 
          : null;
          
        return { previous: previousPost, next: nextPost };
      } catch (error) {
        console.error(`Error fetching adjacent posts for slug "${slug}" from Contentful:`, error);
        return { previous: null, next: null };
      }
    },
    enabled: !!slug,
  });
}
