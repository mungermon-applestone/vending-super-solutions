
import { useQuery } from '@tanstack/react-query';
import { createClient } from 'contentful';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { transformContentfulBlogPost, transformToAdjacentPost } from './cms/transformers/blogPostTransformer';

// Contentful client setup
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_API_KEY || '',
});

/**
 * Hook to fetch all blog posts
 */
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      try {
        const entries = await client.getEntries({
          content_type: 'blogPost',
          'fields.status': 'published',
          order: ['-fields.publishedDate'],
        });
        
        return entries.items.map(entry => transformContentfulBlogPost(entry));
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a blog post by slug
 */
export function useBlogPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      try {
        const entries = await client.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
          limit: 1,
        });
        
        if (!entries.items.length) {
          return null;
        }
        
        return transformContentfulBlogPost(entries.items[0]);
      } catch (error) {
        console.error(`Failed to fetch blog post with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}

/**
 * Hook to fetch featured blog posts
 */
export function useFeaturedBlogPosts(limit = 3) {
  return useQuery({
    queryKey: ['featuredBlogPosts', limit],
    queryFn: async () => {
      try {
        const entries = await client.getEntries({
          content_type: 'blogPost',
          'fields.status': 'published',
          order: ['-fields.publishedDate'],
          limit,
        });
        
        return entries.items.map(entry => transformContentfulBlogPost(entry));
      } catch (error) {
        console.error('Failed to fetch featured blog posts:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch adjacent blog posts (previous and next)
 */
export function useAdjacentBlogPosts(currentSlug: string | undefined) {
  return useQuery({
    queryKey: ['adjacentBlogPosts', currentSlug],
    queryFn: async () => {
      if (!currentSlug) return { prev: null, next: null };
      
      try {
        // Get all published posts ordered by date
        const entries = await client.getEntries({
          content_type: 'blogPost',
          'fields.status': 'published',
          order: ['-fields.publishedDate'],
          select: 'sys.id,fields.title,fields.slug,fields.publishedDate',
        });
        
        const posts = entries.items;
        
        // Find the index of the current post
        const currentIndex = posts.findIndex(post => post.fields.slug === currentSlug);
        
        if (currentIndex === -1) {
          return { prev: null, next: null };
        }
        
        // Get adjacent posts
        const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
        
        return {
          prev: prevPost ? transformToAdjacentPost(prevPost) : null,
          next: nextPost ? transformToAdjacentPost(nextPost) : null,
        };
      } catch (error) {
        console.error(`Failed to fetch adjacent posts for ${currentSlug}:`, error);
        throw error;
      }
    },
    enabled: !!currentSlug,
  });
}

/**
 * These functions below are stubs for preserving API compatibility
 * They will be removed in a future update
 */
export function useCreateBlogPost() {
  return {
    mutateAsync: async () => {
      throw new Error('Legacy CMS operations are no longer supported. Please use Contentful directly.');
    },
    isPending: false
  };
}

export function useUpdateBlogPost() {
  return {
    mutateAsync: async () => {
      throw new Error('Legacy CMS operations are no longer supported. Please use Contentful directly.');
    },
    isPending: false
  };
}

export function useDeleteBlogPost() {
  return {
    mutateAsync: async () => {
      throw new Error('Legacy CMS operations are no longer supported. Please use Contentful directly.');
    },
    isPending: false
  };
}

export function useCloneBlogPost() {
  return {
    mutateAsync: async () => {
      throw new Error('Legacy CMS operations are no longer supported. Please use Contentful directly.');
    },
    isPending: false
  };
}
