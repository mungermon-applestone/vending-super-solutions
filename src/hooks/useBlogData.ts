
import { useQuery } from '@tanstack/react-query';
import { useContentfulBlogPostBySlug } from './useContentfulBlogPostBySlug';
import { useContentfulBlogPosts } from './useContentfulBlogPosts';

// Helper function to convert parameters to the correct format
function normalizeSlugParam(slugParam: string | { slug: string }): string {
  if (typeof slugParam === 'string') {
    return slugParam;
  }
  if (slugParam && typeof slugParam === 'object' && 'slug' in slugParam) {
    return slugParam.slug;
  }
  return '';
}

/**
 * Hook to fetch a blog post by slug
 */
export function useBlogPostBySlug(slugParam: string | { slug: string } | undefined) {
  const normalizedSlug = slugParam ? normalizeSlugParam(slugParam) : undefined;
  
  return useContentfulBlogPostBySlug(normalizedSlug);
}

/**
 * Hook to fetch adjacent posts (previous and next) for navigation
 */
export function useAdjacentPosts(currentSlug: string | { slug: string } | undefined) {
  const normalizedSlug = currentSlug ? normalizeSlugParam(currentSlug) : undefined;
  const { data: allPosts } = useContentfulBlogPosts();

  return useQuery({
    queryKey: ['adjacentPosts', normalizedSlug],
    queryFn: () => {
      if (!normalizedSlug || !allPosts || allPosts.length === 0) {
        return { previous: null, next: null };
      }

      // Sort posts by date (newest first)
      const sortedPosts = [...allPosts].sort((a, b) => {
        if (!a.publishDate && !b.publishDate) return 0;
        if (!a.publishDate) return 1;
        if (!b.publishDate) return -1;
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });

      // Find the index of the current post
      const currentIndex = sortedPosts.findIndex(post => post.slug === normalizedSlug);
      if (currentIndex === -1) return { previous: null, next: null };

      // Get adjacent posts
      const previousPost = currentIndex < sortedPosts.length - 1 
        ? { 
            slug: sortedPosts[currentIndex + 1].slug,
            title: sortedPosts[currentIndex + 1].title 
          } 
        : null;

      const nextPost = currentIndex > 0 
        ? { 
            slug: sortedPosts[currentIndex - 1].slug,
            title: sortedPosts[currentIndex - 1].title 
          } 
        : null;

      return { previous: previousPost, next: nextPost };
    },
    enabled: !!normalizedSlug && !!allPosts && allPosts.length > 0
  });
}
