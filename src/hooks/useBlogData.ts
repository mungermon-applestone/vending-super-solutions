
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries, fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { isContentfulEntry } from '@/utils/contentfulTypeGuards';

/**
 * Hook to fetch all blog posts
 */
export function useBlogPosts(options = { limit: 10, skip: 0 }) {
  return useQuery({
    queryKey: ['blog', 'posts', options],
    queryFn: async () => {
      try {
        const entries = await fetchContentfulEntries('blogPost', {
          order: '-fields.publishDate',
          limit: options.limit,
          skip: options.skip
        });
        
        if (!entries || entries.length === 0) {
          return [];
        }
        
        return entries
          .filter(entry => entry && isContentfulEntry(entry) && entry.fields.visible !== false)
          .map(entry => {
            const featuredImage = entry.fields.featuredImage ? {
              url: `https:${entry.fields.featuredImage.fields?.file?.url || ''}`,
              title: entry.fields.featuredImage.fields?.title || '',
              width: entry.fields.featuredImage.fields?.file?.details?.image?.width,
              height: entry.fields.featuredImage.fields?.file?.details?.image?.height
            } : undefined;
            
            return {
              id: entry.sys.id,
              title: entry.fields.title,
              slug: entry.fields.slug,
              excerpt: entry.fields.excerpt,
              content: entry.fields.content,
              status: entry.fields.status || 'published',
              published_at: entry.fields.publishDate,
              created_at: entry.sys.createdAt,
              updated_at: entry.sys.updatedAt,
              featuredImage,
              author: entry.fields.author,
              tags: entry.fields.tags,
              sys: entry.sys,
              fields: entry.fields,
              includes: entry.includes
            } as BlogPost;
          });
      } catch (error) {
        console.error('[useBlogPosts] Error fetching blog posts:', error);
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
    queryKey: ['blog', 'post', slug],
    queryFn: async () => {
      if (!slug) {
        return null;
      }
      
      try {
        const entries = await fetchContentfulEntries('blogPost', {
          'fields.slug': slug,
          limit: 1,
          include: 10 // Include asset references for rich text
        });
        
        if (!entries || entries.length === 0) {
          return null;
        }
        
        const post = entries[0];
        
        const featuredImage = post.fields.featuredImage ? {
          url: `https:${post.fields.featuredImage.fields?.file?.url || ''}`,
          title: post.fields.featuredImage.fields?.title || '',
          width: post.fields.featuredImage.fields?.file?.details?.image?.width,
          height: post.fields.featuredImage.fields?.file?.details?.image?.height
        } : undefined;
        
        return {
          id: post.sys.id,
          title: post.fields.title,
          slug: post.fields.slug,
          excerpt: post.fields.excerpt,
          content: post.fields.content,
          status: post.fields.status || 'published',
          published_at: post.fields.publishDate,
          created_at: post.sys.createdAt,
          updated_at: post.sys.updatedAt,
          featuredImage,
          author: post.fields.author,
          tags: post.fields.tags,
          sys: post.sys,
          fields: post.fields,
          includes: post.includes
        };
      } catch (error) {
        console.error(`[useBlogPostBySlug] Error fetching blog post with slug: ${slug}`, error);
        throw error;
      }
    },
    enabled: !!slug
  });
}

/**
 * Hook to fetch adjacent blog posts
 */
export function useAdjacentPosts(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog', 'adjacent', slug],
    queryFn: async () => {
      if (!slug) {
        return { previous: null, next: null };
      }
      
      try {
        const allPosts = await fetchContentfulEntries('blogPost', {
          order: 'fields.publishDate',
          select: 'fields.title,fields.slug,fields.publishDate',
          'fields.status': 'published'
        });
        
        if (!allPosts || allPosts.length === 0) {
          return { previous: null, next: null };
        }
        
        const visiblePosts = allPosts.filter(post => post && isContentfulEntry(post) && post.fields.visible !== false);
        const currentPostIndex = visiblePosts.findIndex(post => post.fields.slug === slug);
        
        if (currentPostIndex === -1) {
          return { previous: null, next: null };
        }
        
        const previousPost = currentPostIndex > 0 ? visiblePosts[currentPostIndex - 1] : null;
        const nextPost = currentPostIndex < visiblePosts.length - 1 ? visiblePosts[currentPostIndex + 1] : null;
        
        return {
          previous: previousPost ? {
            slug: previousPost.fields.slug,
            title: previousPost.fields.title
          } as AdjacentPost : null,
          next: nextPost ? {
            slug: nextPost.fields.slug,
            title: nextPost.fields.title
          } as AdjacentPost : null
        };
      } catch (error) {
        console.error(`[useAdjacentPosts] Error fetching adjacent posts for: ${slug}`, error);
        return { previous: null, next: null };
      }
    },
    enabled: !!slug
  });
}
