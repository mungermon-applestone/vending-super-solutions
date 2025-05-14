
import { ContentfulAsset } from '@/types/contentful';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { BlogPost } from '@/types/cms';

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
 * Convert ContentfulBlogPost to standard BlogPost format
 */
export function convertContentfulBlogPostToBlogPost(contentfulPost: ContentfulBlogPost): BlogPost {
  return {
    id: contentfulPost.id,
    title: contentfulPost.title,
    slug: contentfulPost.slug,
    content: contentfulPost.content || '',
    excerpt: contentfulPost.excerpt,
    status: contentfulPost.status || 'published',
    published_at: contentfulPost.publishDate || contentfulPost.published_at,
    created_at: contentfulPost.sys?.createdAt || contentfulPost.created_at || new Date().toISOString(),
    updated_at: contentfulPost.sys?.updatedAt || contentfulPost.updated_at || new Date().toISOString(),
    featuredImage: contentfulPost.featuredImage,
    author: contentfulPost.author,
    tags: contentfulPost.tags,
    sys: contentfulPost.sys,
    fields: contentfulPost.fields,
    includes: contentfulPost.includes
  };
}
