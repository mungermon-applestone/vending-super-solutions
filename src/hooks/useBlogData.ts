
import { useQuery } from '@tanstack/react-query';
import { useContentfulBlogPosts } from './useContentfulBlogPosts';
import { useContentfulBlogPostBySlug } from './useContentfulBlogPostBySlug';
import { convertContentfulBlogPostToBlogPost } from '@/utils/contentfulTypeGuards';

/**
 * Hook for retrieving a blog post by slug
 */
export function useBlogPostBySlug(slug?: string) {
  const query = useContentfulBlogPostBySlug(slug);
  
  // Convert the result to our standard BlogPost format if possible
  return {
    ...query,
    data: query.data ? convertContentfulBlogPostToBlogPost(query.data) : null
  };
}

interface AdjacentPost {
  slug: string;
  title: string;
}

/**
 * Hook for retrieving the adjacent (previous and next) posts for a given post slug
 */
export function useAdjacentPosts(slug?: string) {
  // Get all blog posts to find adjacent ones
  const { data: allPosts = [], isLoading } = useContentfulBlogPosts({
    order: '-fields.publishDate'
  });
  
  return useQuery({
    queryKey: ['blog', 'adjacent', slug],
    queryFn: () => {
      if (!slug || allPosts.length === 0) {
        return { previous: null, next: null };
      }
      
      // Find the current post index
      const currentIndex = allPosts.findIndex(post => post.slug === slug);
      
      if (currentIndex === -1) {
        return { previous: null, next: null };
      }
      
      // Get previous and next posts
      const previous = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
      const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
      
      return {
        previous: previous ? { slug: previous.slug, title: previous.title } as AdjacentPost : null,
        next: next ? { slug: next.slug, title: next.title } as AdjacentPost : null
      };
    },
    enabled: !isLoading && !!slug && allPosts.length > 0
  });
}

/**
 * Export all blog-related hooks for compatibility
 */
export { useContentfulBlogPosts as useBlogPosts };
