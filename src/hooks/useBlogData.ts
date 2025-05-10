
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchBlogPosts, 
  fetchBlogPostBySlug, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  cloneBlogPost,
  getAdjacentPosts
} from '@/services/cms/contentTypes/blog';
import { BlogPostFormData } from '@/types/blog';

// Hook for fetching blog posts
export const useBlogPosts = (filters?: { 
  status?: string;
  slug?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['blog-posts', filters],
    queryFn: async () => fetchBlogPosts(filters || {}),
  });
};

// Hook for fetching a single blog post by slug
export const useBlogPostBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => slug ? fetchBlogPostBySlug(slug) : null,
    enabled: !!slug,
  });
};

// Hook for getting adjacent (next/previous) posts
export const useAdjacentPosts = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['adjacent-posts', slug],
    queryFn: async () => slug ? getAdjacentPosts(slug) : { previous: null, next: null },
    enabled: !!slug,
  });
};

// Hook for creating a blog post
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postData: BlogPostFormData) => createBlogPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

// Hook for updating a blog post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, postData }: { id: string; postData: BlogPostFormData }) => 
      updateBlogPost(id, postData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['adjacent-posts'] });
    },
  });
};

// Hook for deleting a blog post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['adjacent-posts'] });
    },
  });
};

// Hook for cloning a blog post
export const useCloneBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => cloneBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};
