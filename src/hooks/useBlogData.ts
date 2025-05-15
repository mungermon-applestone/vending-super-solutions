
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { isContentfulEntry } from '@/utils/contentfulTypeGuards';
import { safeString } from '@/services/cms/utils/safeTypeUtilities';

// Helper to safely extract string fields from Contentful entries
function getEntryField(entry: any, fieldName: string, defaultValue: string = ''): string {
  if (!entry || !entry.fields || typeof entry.fields !== 'object') {
    return defaultValue;
  }
  
  const field = entry.fields[fieldName];
  if (field === null || field === undefined) {
    return defaultValue;
  }
  
  return safeString(field);
}

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
          .filter(entry => isContentfulEntry(entry) && entry.fields.visible !== false)
          .map(entry => {
            if (!isContentfulEntry(entry)) {
              console.error("[useBlogPosts] Invalid entry format:", entry);
              return null;
            }
            
            // Process featured image safely
            let featuredImage = undefined;
            if (entry.fields.featuredImage && typeof entry.fields.featuredImage === 'object') {
              const image = entry.fields.featuredImage;
              if (image.fields && image.fields.file) {
                featuredImage = {
                  url: `https:${image.fields.file.url || ''}`,
                  title: image.fields.title || '',
                  width: image.fields.file.details?.image?.width,
                  height: image.fields.file.details?.image?.height
                };
              }
            }
            
            return {
              id: entry.sys.id,
              title: getEntryField(entry, 'title'),
              slug: getEntryField(entry, 'slug'),
              excerpt: getEntryField(entry, 'excerpt'),
              content: entry.fields.content,
              status: getEntryField(entry, 'status', 'published') as 'draft' | 'published' | 'archived',
              published_at: getEntryField(entry, 'publishDate'),
              created_at: entry.sys.createdAt || new Date().toISOString(),
              updated_at: entry.sys.updatedAt || new Date().toISOString(),
              featuredImage,
              author: getEntryField(entry, 'author'),
              tags: Array.isArray(entry.fields.tags) ? entry.fields.tags.map(tag => typeof tag === 'string' ? tag : '') : [],
              sys: entry.sys,
              fields: entry.fields
            } as BlogPost;
          })
          .filter(Boolean) as BlogPost[];
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
        if (!isContentfulEntry(post)) {
          console.error("[useBlogPostBySlug] Invalid post format:", post);
          return null;
        }
        
        // Process featured image safely
        let featuredImage = undefined;
        if (post.fields.featuredImage && typeof post.fields.featuredImage === 'object') {
          const image = post.fields.featuredImage;
          if (image.fields && image.fields.file) {
            featuredImage = {
              url: `https:${image.fields.file.url || ''}`,
              title: image.fields.title || '',
              width: image.fields.file.details?.image?.width,
              height: image.fields.file.details?.image?.height
            };
          }
        }
        
        return {
          id: post.sys.id,
          title: getEntryField(post, 'title'),
          slug: getEntryField(post, 'slug'),
          excerpt: getEntryField(post, 'excerpt'),
          content: post.fields.content,
          status: getEntryField(post, 'status', 'published') as 'draft' | 'published' | 'archived',
          published_at: getEntryField(post, 'publishDate'),
          created_at: post.sys.createdAt || new Date().toISOString(),
          updated_at: post.sys.updatedAt || new Date().toISOString(),
          featuredImage,
          author: getEntryField(post, 'author'),
          tags: Array.isArray(post.fields.tags) ? post.fields.tags.map(tag => typeof tag === 'string' ? tag : '') : [],
          sys: post.sys,
          fields: post.fields,
          includes: (post as any).includes
        } as BlogPost;
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
        
        const visiblePosts = allPosts.filter(post => 
          isContentfulEntry(post) && post.fields.visible !== false
        );
        
        const currentPostIndex = visiblePosts.findIndex(post => 
          isContentfulEntry(post) && getEntryField(post, 'slug') === slug
        );
        
        if (currentPostIndex === -1) {
          return { previous: null, next: null };
        }
        
        const previousPost = currentPostIndex > 0 ? visiblePosts[currentPostIndex - 1] : null;
        const nextPost = currentPostIndex < visiblePosts.length - 1 ? visiblePosts[currentPostIndex + 1] : null;
        
        return {
          previous: previousPost && isContentfulEntry(previousPost) ? {
            slug: getEntryField(previousPost, 'slug'),
            title: getEntryField(previousPost, 'title')
          } as AdjacentPost : null,
          next: nextPost && isContentfulEntry(nextPost) ? {
            slug: getEntryField(nextPost, 'slug'),
            title: getEntryField(nextPost, 'title')
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

/**
 * Hook for creating a blog post
 */
export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postData: any) => {
      console.log("[useCreateBlogPost] This is a stub implementation while migrating to Contentful");
      console.warn("[useCreateBlogPost] Blog post creation is now handled through Contentful UI");
      
      // Return a mock response for compatibility
      return {
        id: `temp-${Date.now()}`,
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    }
  });
}

/**
 * Hook for updating a blog post
 */
export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, postData }: { id: string, postData: any }) => {
      console.log("[useUpdateBlogPost] This is a stub implementation while migrating to Contentful");
      console.warn("[useUpdateBlogPost] Blog post updates are now handled through Contentful UI");
      
      // Return a mock response for compatibility
      return {
        id,
        ...postData,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    }
  });
}
