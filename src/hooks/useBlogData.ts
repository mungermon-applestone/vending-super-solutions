
import { useQuery } from '@tanstack/react-query';
import { createClient } from 'contentful';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { transformBlogPost, createAdjacentPost } from './cms/transformers/blogPostTransformer';

// Create Contentful client
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

/**
 * Hook to fetch a paginated list of blog posts
 */
export function useBlogPosts(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['blogs', page, pageSize],
    queryFn: async (): Promise<{ posts: BlogPost[]; total: number }> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishedDate'],
          limit: pageSize,
          skip: (page - 1) * pageSize,
          'fields.status': 'published'
        });

        const posts = response.items.map(entry => transformBlogPost(entry));

        return {
          posts,
          total: response.total
        };
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useBlogPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async (): Promise<{ 
      post: BlogPost | null; 
      previousPost: AdjacentPost | null;
      nextPost: AdjacentPost | null;
    }> => {
      if (!slug) {
        return { post: null, previousPost: null, nextPost: null };
      }

      try {
        // Fetch the requested post
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
          limit: 1
        });

        if (response.items.length === 0) {
          return { post: null, previousPost: null, nextPost: null };
        }

        const post = transformBlogPost(response.items[0]);

        // Fetch adjacent posts (previous and next)
        // This is a simplified approach - in a real app you might want to
        // sort these by publish date or another criterion
        const adjacentPostsResponse = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishedDate'],
          'fields.status': 'published'
        });

        // Find the current post index in the sorted list
        const allPosts = adjacentPostsResponse.items;
        const currentIndex = allPosts.findIndex(p => p.fields.slug === slug);
        
        // Get adjacent posts
        const previousPost = currentIndex > 0 ? createAdjacentPost(allPosts[currentIndex - 1]) : null;
        const nextPost = currentIndex < allPosts.length - 1 ? createAdjacentPost(allPosts[currentIndex + 1]) : null;

        return { 
          post, 
          previousPost, 
          nextPost 
        };
      } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug
  });
}

/**
 * Hook to fetch recent blog posts (for widgets, sidebars, etc.)
 */
export function useRecentBlogPosts(limit = 3) {
  return useQuery({
    queryKey: ['blogs', 'recent', limit],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishedDate'],
          limit,
          'fields.status': 'published'
        });

        return response.items.map(entry => transformBlogPost(entry));
      } catch (error) {
        console.error('Error fetching recent blog posts:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch blog posts by tag
 */
export function useBlogPostsByTag(tag: string, limit = 10) {
  return useQuery({
    queryKey: ['blogs', 'tag', tag, limit],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.tags': tag,
          order: ['-fields.publishedDate'],
          limit,
          'fields.status': 'published'
        });

        return response.items.map(entry => transformBlogPost(entry));
      } catch (error) {
        console.error(`Error fetching blog posts with tag ${tag}:`, error);
        throw error;
      }
    },
    enabled: !!tag
  });
}
