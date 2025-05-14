
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulAsset } from '@/types/contentful';
import { isContentfulEntry } from '@/utils/contentfulTypeGuards';
import { ContentfulBlogPost } from './useContentfulBlogPosts';

export interface ContentfulBlogPostBySlugOptions {
  preview?: boolean;
}

// Re-export ContentfulBlogPost interface to ensure it's available
export type { ContentfulBlogPost };

export function useContentfulBlogPostBySlug(slug?: string, options?: ContentfulBlogPostBySlugOptions) {
  return useQuery({
    queryKey: ['contentful', 'blogPost', slug, options?.preview],
    queryFn: async () => {
      if (!slug) {
        return null;
      }
      
      try {
        const query = {
          'fields.slug': slug,
          include: 2, // Include linked assets
          limit: 1,
          preview: options?.preview
        };
        
        const entries = await fetchContentfulEntries('blogPost', query);
        
        if (!entries || entries.length === 0) {
          console.log(`[useContentfulBlogPostBySlug] No blog post found with slug: ${slug}`);
          return null;
        }
        
        // Process the first entry
        const entry = entries[0];
        
        // Validate entry format
        if (!isContentfulEntry(entry)) {
          console.error('[useContentfulBlogPostBySlug] Invalid entry format:', entry);
          return null;
        }

        // Featured image handling
        let featuredImage = undefined;
        if (entry.fields.featuredImage) {
          const image = entry.fields.featuredImage;
          if (image && typeof image === 'object' && 'fields' in image && image.fields && image.fields.file) {
            featuredImage = {
              url: `https:${image.fields.file.url}`,
              title: image.fields.title || '',
              width: image.fields.file.details?.image?.width,
              height: image.fields.file.details?.image?.height
            };
          }
        }
        
        const publishDate = entry.fields.publishDate ? String(entry.fields.publishDate) : '';
        
        // Return in ContentfulBlogPost format to match useContentfulBlogPosts
        const blogPost: ContentfulBlogPost = {
          id: entry.sys.id,
          title: String(entry.fields.title || 'Untitled'),
          slug: String(entry.fields.slug),
          content: entry.fields.content,
          excerpt: entry.fields.excerpt ? String(entry.fields.excerpt) : undefined,
          publishDate: publishDate,
          published_at: publishDate,
          featuredImage,
          author: entry.fields.author ? String(entry.fields.author) : undefined,
          tags: Array.isArray(entry.fields.tags) ? entry.fields.tags.map(tag => String(tag)) : [],
          sys: {
            id: entry.sys.id,
            createdAt: entry.sys.createdAt,
            updatedAt: entry.sys.updatedAt
          },
          fields: entry.fields,
          status: 'published',
          created_at: entry.sys.createdAt,
          updated_at: entry.sys.updatedAt,
          includes: entry.includes
        };
        
        return blogPost;
      } catch (error) {
        console.error(`[useContentfulBlogPostBySlug] Error fetching blog post: ${slug}`, error);
        return null;
      }
    },
    enabled: !!slug
  });
}
