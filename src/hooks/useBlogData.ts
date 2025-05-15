
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from 'contentful';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { transformBlogPost, createAdjacentPost, ContentfulBlogPost } from '@/hooks/cms';

// Create a Contentful client
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

// Helper function to validate and transform blog posts
const transformContentfulBlogPost = (entry: any): BlogPost => {
  const contentfulEntry = {
    sys: entry.sys,
    fields: {
      title: entry.fields.title || '',
      slug: entry.fields.slug || '',
      content: entry.fields.content,
      summary: entry.fields.summary,
      author: entry.fields.author,
      publishedDate: entry.fields.publishedDate,
      category: entry.fields.category,
      tags: entry.fields.tags,
      image: entry.fields.image,
      status: entry.fields.status || 'draft'
    }
  } as ContentfulBlogPost;
  
  return transformBlogPost(contentfulEntry);
};

// Hook to fetch all blog posts
export const useBlogPosts = (params = { limit: 10, offset: 0 }) => {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: async () => {
      const response = await contentfulClient.getEntries({
        content_type: 'blogPost',
        limit: params.limit,
        skip: params.offset,
        order: '-fields.publishedDate',
        ...((params as any).status ? { 'fields.status': (params as any).status } : {})
      });

      const posts = response.items.map(transformContentfulBlogPost);
      return { posts, total: response.total };
    }
  });
};

// Hook to fetch a single blog post by slug
export const useBlogPostBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const response = await contentfulClient.getEntries({
        content_type: 'blogPost',
        'fields.slug': slug,
        limit: 1
      });

      if (response.items.length === 0) return null;
      
      return transformContentfulBlogPost(response.items[0]);
    },
    enabled: !!slug
  });
};

// Hook to fetch adjacent (previous/next) blog posts
export const useAdjacentBlogPosts = (slug?: string) => {
  return useQuery({
    queryKey: ['adjacent-blog-posts', slug],
    queryFn: async () => {
      if (!slug) return { previous: null, next: null };

      // Get all published posts sorted by publish date
      const response = await contentfulClient.getEntries({
        content_type: 'blogPost',
        'fields.status': 'published',
        order: '-fields.publishedDate',
        limit: 100 // We need all posts to find adjacent ones
      });

      // Find the index of the current post
      const currentIndex = response.items.findIndex(
        item => item.fields.slug === slug
      );

      if (currentIndex === -1) return { previous: null, next: null };

      // Get previous and next posts
      const previousPost = currentIndex < response.items.length - 1 
        ? createAdjacentPost(response.items[currentIndex + 1] as any) 
        : null;
        
      const nextPost = currentIndex > 0 
        ? createAdjacentPost(response.items[currentIndex - 1] as any) 
        : null;

      return { previous: previousPost, next: nextPost };
    },
    enabled: !!slug
  });
};

// Types needed for blog mutations
export interface BlogPostFormData {
  title: string;
  slug: string;
  summary?: string;
  content: any;
  image?: {
    url: string;
    alt: string;
  };
  author?: string;
  publishedDate?: string;
  category?: string;
  tags?: string[];
  status: 'published' | 'draft';
}

// Since we're not implementing admin functionality, these are just placeholders
// and will be replaced or removed in the future
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      console.warn('Admin functionality has been removed. Blog creation not available.');
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    }
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, postData }: { id: string; postData: BlogPostFormData }) => {
      console.warn('Admin functionality has been removed. Blog update not available.');
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    }
  });
};
