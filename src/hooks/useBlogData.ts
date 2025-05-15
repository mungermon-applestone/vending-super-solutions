
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { BlogPost, AdjacentPost } from '@/types/contentful';

/**
 * Hook to fetch all blog posts 
 */
export function useContentfulBlogPosts() {
  return useQuery({
    queryKey: ['contentful', 'blog-posts'],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['-fields.publishDate'], // Most recent first
          select: ['fields.title', 'fields.slug', 'fields.summary', 'fields.publishDate', 'fields.featuredImage', 'fields.category', 'fields.tags']
        });

        return response.items.map(item => {
          const fields = item.fields;
          return {
            id: item.sys.id,
            title: fields.title as string,
            slug: fields.slug as string,
            summary: fields.summary as string || '',
            content: '', // Not fetched in this query for performance
            published_date: fields.publishDate as string || '',
            featured_image: fields.featuredImage ? 
              `https:${(fields.featuredImage as any).fields.file.url}` : undefined,
            category: fields.category as string || '',
            tags: fields.tags as string[] || [],
          };
        });
      } catch (error) {
        console.error('Error fetching blog posts from Contentful:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a single blog post by slug
 */
export function useContentfulBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'blog-post', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;

      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
          limit: 1,
          include: 2 // Include linked assets and entries
        });

        if (response.items.length === 0) {
          return null;
        }

        const item = response.items[0];
        const fields = item.fields;

        return {
          id: item.sys.id,
          title: fields.title as string,
          slug: fields.slug as string,
          summary: fields.summary as string || '',
          content: fields.content as string,
          published_date: fields.publishDate as string || '',
          featured_image: fields.featuredImage ? 
            `https:${(fields.featuredImage as any).fields.file.url}` : undefined,
          category: fields.category as string || '',
          tags: fields.tags as string[] || [],
          author: fields.author as string || '',
          reading_time: fields.readingTime as number || 0,
        };
      } catch (error) {
        console.error(`Error fetching blog post with slug "${slug}":`, error);
        throw error;
      }
    },
    enabled: !!slug
  });
}

/**
 * Hook to fetch featured blog posts
 */
export function useContentfulFeaturedBlogPosts(limit = 3) {
  return useQuery({
    queryKey: ['contentful', 'featured-blog-posts', limit],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          'fields.featured': true,
          order: ['-fields.publishDate'], // Most recent first
          limit: limit
        });

        return response.items.map(item => {
          const fields = item.fields;
          return {
            id: item.sys.id,
            title: fields.title as string,
            slug: fields.slug as string,
            summary: fields.summary as string || '',
            content: '', // Not fetched in this query for performance
            published_date: fields.publishDate as string || '',
            featured_image: fields.featuredImage ? 
              `https:${(fields.featuredImage as any).fields.file.url}` : undefined,
            category: fields.category as string || '',
            tags: fields.tags as string[] || [],
          };
        });
      } catch (error) {
        console.error('Error fetching featured blog posts from Contentful:', error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch adjacent blog posts (next and previous)
 */
export function useContentfulAdjacentBlogPosts(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'adjacent-blog-posts', slug],
    queryFn: async (): Promise<{ previous: AdjacentPost | null, next: AdjacentPost | null }> => {
      if (!slug) {
        return { previous: null, next: null };
      }

      try {
        // Fetch all blog posts to determine ordering
        const response = await contentfulClient.getEntries({
          content_type: 'blogPost',
          order: ['fields.publishDate'], // Chronological order
          select: ['fields.title', 'fields.slug', 'fields.publishDate']
        });

        const posts = response.items;
        let previousPost = null;
        let nextPost = null;
        
        // Find the current post index
        const currentIndex = posts.findIndex(post => post.fields.slug === slug);
        
        if (currentIndex > 0) {
          const prev = posts[currentIndex - 1];
          previousPost = {
            id: prev.sys.id,
            title: prev.fields.title as string,
            slug: prev.fields.slug as string,
          };
        }
        
        if (currentIndex < posts.length - 1 && currentIndex !== -1) {
          const next = posts[currentIndex + 1];
          nextPost = {
            id: next.sys.id,
            title: next.fields.title as string,
            slug: next.fields.slug as string,
          };
        }
        
        return { previous: previousPost, next: nextPost };
      } catch (error) {
        console.error(`Error fetching adjacent blog posts for "${slug}":`, error);
        return { previous: null, next: null };
      }
    },
    enabled: !!slug
  });
}
