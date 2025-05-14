
import { useQuery } from '@tanstack/react-query';
import { useContentfulBlogPosts } from '@/hooks/useContentfulBlogPosts';

// This is a backward compatibility hook
export function useBlogPosts() {
  return useContentfulBlogPosts();
}
