
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { transformContentfulBlogPost, transformToAdjacentPost } from './cms/transformers/blogPostTransformer';

interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Hook to fetch blog posts from Contentful with pagination
 */
export function useContentfulBlogPosts(page = 1, limit = 10) {
  return useQuery<BlogPostsResponse>({
    queryKey: ['contentful', 'blog-posts', page, limit],
    queryFn: async () => {
      try {
        const skip = (page - 1) * limit;
        
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.status': 'published',
          order: ['-fields.publishedDate'],
          skip,
          limit,
        });
        
        const posts = response.items.map(entry => transformContentfulBlogPost(entry));
        
        return {
          posts,
          total: response.total,
          skip: response.skip,
          limit: response.limit
        };
      } catch (error) {
        console.error('Error fetching blog posts from Contentful:', error);
        return {
          posts: [],
          total: 0,
          skip: 0,
          limit
        };
      }
    },
  });
}

/**
 * Hook to fetch a single blog post by slug from Contentful
 */
export function useContentfulBlogPostBySlug(slug: string | undefined) {
  return useQuery<BlogPost | null>({
    queryKey: ['contentful', 'blog-post', slug],
    queryFn: async () => {
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
 * Hook to fetch featured blog posts from Contentful
 */
export function useContentfulFeaturedBlogPosts(limit = 3) {
  return useQuery<BlogPost[]>({
    queryKey: ['contentful', 'featured-blog-posts', limit],
    queryFn: async () => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.status': 'published',
          'fields.featured': true,
          order: ['-fields.publishedDate'],
          limit,
        });
        
        return response.items.map(entry => transformContentfulBlogPost(entry));
      } catch (error) {
        console.error('Error fetching featured blog posts from Contentful:', error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch adjacent (previous/next) blog posts from Contentful
 */
export function useContentfulAdjacentBlogPosts(currentSlug: string | undefined) {
  return useQuery<{ previous: AdjacentPost | null; next: AdjacentPost | null }>({
    queryKey: ['contentful', 'adjacent-blog-posts', currentSlug],
    queryFn: async () => {
      if (!currentSlug) {
        return { previous: null, next: null };
      }
      
      try {
        // Get all published posts ordered by date
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.status': 'published',
          order: ['-fields.publishedDate'],
          select: 'sys.id,fields.title,fields.slug,fields.publishedDate',
        });
        
        if (response.items.length === 0) {
          return { previous: null, next: null };
        }
        
        // Find current post index
        const currentIndex = response.items.findIndex(
          (item) => item.fields.slug === currentSlug
        );
        
        if (currentIndex === -1) {
          return { previous: null, next: null };
        }
        
        // Get previous and next posts
        const previousPost = currentIndex > 0 ? response.items[currentIndex - 1] : null;
        const nextPost = currentIndex < response.items.length - 1 ? response.items[currentIndex + 1] : null;
        
        return {
          previous: previousPost ? transformToAdjacentPost(previousPost) : null,
          next: nextPost ? transformToAdjacentPost(nextPost) : null,
        };
      } catch (error) {
        console.error('Error fetching adjacent blog posts from Contentful:', error);
        return { previous: null, next: null };
      }
    },
    enabled: !!currentSlug,
  });
}
