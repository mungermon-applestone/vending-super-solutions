
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { BlogPost, AdjacentPost } from '@/types/contentful';
import { transformContentfulBlogPost, transformToAdjacentPost } from './cms/transformers/blogPostTransformer';

/**
 * Hook to fetch all blog posts from Contentful
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
        
        return response.items.map(entry => transformContentfulBlogPost(entry));
      } catch (error) {
        console.error('Error fetching blog posts from Contentful:', error);
        return [];
      }
    },
  });
}

/**
 * Hook to fetch a single blog post by slug from Contentful
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
 * Hook to fetch adjacent blog posts for navigation from Contentful
 */
export function useContentfulAdjacentBlogPosts(currentSlug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'adjacentPosts', currentSlug],
    queryFn: async (): Promise<{prev: AdjacentPost | null, next: AdjacentPost | null}> => {
      if (!currentSlug) {
        return { prev: null, next: null };
      }
      
      try {
        // Get all posts to find the current post's position
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishedDate'],
          select: 'sys.id,fields.title,fields.slug,fields.publishedDate',
        });
        
        const posts = response.items;
        const currentIndex = posts.findIndex(post => post.fields.slug === currentSlug);
        
        if (currentIndex === -1) {
          return { prev: null, next: null };
        }
        
        const prevPost = currentIndex < posts.length - 1 
          ? transformToAdjacentPost(posts[currentIndex + 1]) 
          : null;
          
        const nextPost = currentIndex > 0 
          ? transformToAdjacentPost(posts[currentIndex - 1]) 
          : null;
        
        return {
          prev: prevPost,
          next: nextPost
        };
      } catch (error) {
        console.error('Error fetching adjacent posts from Contentful:', error);
        return { prev: null, next: null };
      }
    },
    enabled: !!currentSlug,
  });
}

/**
 * Hook to fetch featured blog posts from Contentful
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
        
        return response.items.map(entry => transformContentfulBlogPost(entry));
      } catch (error) {
        console.error('Error fetching featured blog posts from Contentful:', error);
        return [];
      }
    },
  });
}
