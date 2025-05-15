
import { ContentfulAsset } from '@/types/contentful';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { BlogPost, AdjacentPost } from '@/types/cms';

/**
 * Type guard for Contentful entries
 */
export function isContentfulEntry(obj: any): boolean {
  return obj && typeof obj === 'object' && obj.sys && obj.sys.id && obj.fields;
}

/**
 * Type guard for Contentful assets
 */
export function isContentfulAsset(obj: any): obj is ContentfulAsset {
  return (
    obj && 
    typeof obj === 'object' && 
    obj.sys && 
    obj.fields && 
    obj.fields.file && 
    typeof obj.fields.file === 'object'
  );
}

/**
 * Type guard for rich text document
 */
export function isRichTextDocument(obj: any): boolean {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.nodeType === 'document' &&
    Array.isArray(obj.content)
  );
}

/**
 * Type guard for ContentfulTestimonial
 */
export function isContentfulTestimonial(obj: any): boolean {
  return (
    obj && 
    typeof obj === 'object' && 
    obj.sys && 
    obj.fields && 
    typeof obj.fields.author === 'string' &&
    typeof obj.fields.quote === 'string'
  );
}

/**
 * Type guard for CMSTestimonial
 */
export function isCMSTestimonial(obj: any): boolean {
  return (
    obj && 
    typeof obj === 'object' && 
    typeof obj.name === 'string' &&
    typeof obj.testimonial === 'string'
  );
}

/**
 * Convert ContentfulBlogPost to standard BlogPost format
 */
export function convertContentfulBlogPostToBlogPost(contentfulPost: ContentfulBlogPost): BlogPost {
  return {
    id: contentfulPost.id || contentfulPost.sys?.id || '',
    title: typeof contentfulPost.title === 'string' ? contentfulPost.title : 
      (contentfulPost.fields?.title || ''),
    slug: contentfulPost.slug || contentfulPost.fields?.slug || '',
    content: contentfulPost.content || contentfulPost.fields?.content || '',
    excerpt: contentfulPost.excerpt || contentfulPost.fields?.excerpt || '',
    status: contentfulPost.status || 'published',
    published_at: contentfulPost.publishDate || contentfulPost.published_at || contentfulPost.fields?.publishDate || '',
    created_at: contentfulPost.sys?.createdAt || contentfulPost.created_at || new Date().toISOString(),
    updated_at: contentfulPost.sys?.updatedAt || contentfulPost.updated_at || new Date().toISOString(),
    featuredImage: contentfulPost.featuredImage,
    author: contentfulPost.author || contentfulPost.fields?.author || '',
    tags: contentfulPost.tags || contentfulPost.fields?.tags || [],
    sys: contentfulPost.sys,
    fields: contentfulPost.fields,
    includes: contentfulPost.includes
  };
}

/**
 * Convert adjacent post to Contentful format
 */
export function convertAdjacentPostToContentful(adjacentPost: AdjacentPost): {
  slug: string;
  title: string;
} {
  return {
    slug: adjacentPost.slug,
    title: adjacentPost.title
  };
}
