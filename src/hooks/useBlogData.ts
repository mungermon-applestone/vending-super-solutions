
import { useQuery, useMutation } from '@tanstack/react-query';
import { BlogPost, BlogPostFormData } from '@/types/blog';
import { useContentfulBlogPostBySlug as useContentfulPost } from '@/hooks/useContentfulBlogPostBySlug';
import { convertContentfulBlogPostToBlogPost } from '@/utils/contentfulTypeGuards';
import { useContentfulBlogPosts } from '@/hooks/useContentfulBlogPosts';

/**
 * Hook to fetch a single blog post by slug
 */
export function useBlogPostBySlug(slug?: string) {
  return useContentfulPost(slug);
}

/**
 * Hook to fetch all blog posts
 */
export function useBlogPosts() {
  return useContentfulBlogPosts();
}

/**
 * Hook to fetch adjacent posts (previous and next)
 */
export function useAdjacentPosts(currentSlug?: string) {
  return useQuery({
    queryKey: ['blog', 'adjacent-posts', currentSlug],
    queryFn: async () => {
      // In a full implementation, you'd fetch adjacent posts based on the current slug
      // For now, we return a mock implementation
      return {
        previous: currentSlug ? { slug: 'previous-post', title: 'Previous Post' } : null,
        next: currentSlug ? { slug: 'next-post', title: 'Next Post' } : null
      };
    },
    enabled: !!currentSlug
  });
}

/**
 * Hook to create a new blog post
 */
export function useCreateBlogPost() {
  return useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      console.log('Creating post with data:', data);
      // This would call an API in a real implementation
      return {
        id: 'new-post-id',
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as BlogPost;
    }
  });
}

/**
 * Hook to update a blog post
 */
export function useUpdateBlogPost() {
  return useMutation({
    mutationFn: async ({ id, postData }: { id: string, postData: BlogPostFormData }) => {
      console.log(`Updating post ${id} with data:`, postData);
      // This would call an API in a real implementation
      return {
        id,
        ...postData,
        updated_at: new Date().toISOString()
      } as BlogPost;
    }
  });
}
