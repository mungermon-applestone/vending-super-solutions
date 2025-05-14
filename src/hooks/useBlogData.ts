
import { useQuery } from '@tanstack/react-query';
import { useContentfulBlogPosts, ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import { AdjacentPost } from '@/types/blog';

/**
 * Hook to fetch all blog posts
 */
export function useBlogPosts() {
  return useContentfulBlogPosts();
}

/**
 * Get a blog post by its slug
 */
export function useBlogPostBySlug(slug?: string) {
  return useContentfulBlogPostBySlug(slug);
}

/**
 * Get previous and next posts relative to a given slug
 */
export function useAdjacentPosts(currentSlug?: string) {
  const { data: posts = [], isLoading } = useContentfulBlogPosts();
  
  return useQuery({
    queryKey: ['contentful', 'adjacentPosts', currentSlug],
    queryFn: async () => {
      if (!currentSlug || posts.length === 0) {
        return { previous: null, next: null };
      }
      
      // Sort posts by publish date (newest first)
      const sortedPosts = [...posts].sort((a, b) => {
        const dateA = a.publishDate || a.published_at || '';
        const dateB = b.publishDate || b.published_at || '';
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      
      // Find current post index
      const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);
      if (currentIndex === -1) {
        return { previous: null, next: null };
      }
      
      // Get adjacent posts
      const previous: AdjacentPost | null = currentIndex < sortedPosts.length - 1
        ? {
            slug: sortedPosts[currentIndex + 1].slug,
            title: sortedPosts[currentIndex + 1].title
          }
        : null;
        
      const next: AdjacentPost | null = currentIndex > 0
        ? {
            slug: sortedPosts[currentIndex - 1].slug,
            title: sortedPosts[currentIndex - 1].title
          }
        : null;
      
      return { previous, next };
    },
    enabled: !isLoading && posts.length > 0 && !!currentSlug
  });
}

// Add these stubs for backward compatibility
export const useCreateBlogPost = () => {
  console.warn('useCreateBlogPost is deprecated and not implemented with Contentful');
  return { mutateAsync: () => Promise.reject('Not implemented') };
};

export const useUpdateBlogPost = () => {
  console.warn('useUpdateBlogPost is deprecated and not implemented with Contentful');
  return { mutateAsync: () => Promise.reject('Not implemented') };
};
