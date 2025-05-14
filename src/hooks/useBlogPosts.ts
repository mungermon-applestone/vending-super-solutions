
import { useContentfulBlogPosts } from '@/hooks/useContentfulBlogPosts';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';

// Re-export the ContentfulBlogPost type for wider use
export type { ContentfulBlogPost };

// This is a backward compatibility hook
export function useBlogPosts() {
  return useContentfulBlogPosts();
}
