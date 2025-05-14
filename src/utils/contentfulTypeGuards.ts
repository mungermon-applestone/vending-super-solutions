
import { Entry, Asset } from 'contentful';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { BlogPost, AdjacentPost } from '@/types/blog';

/**
 * Check if an object is a Contentful Entry
 */
export function isContentfulEntry(obj: any): obj is Entry<any> {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.sys &&
    obj.sys.id &&
    obj.fields &&
    typeof obj.fields === 'object'
  );
}

/**
 * Check if an object is a Contentful Asset
 */
export function isContentfulAsset(obj: any): obj is Asset {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.sys &&
    obj.sys.id &&
    obj.fields &&
    obj.fields.file &&
    obj.fields.file.url
  );
}

/**
 * Convert a ContentfulBlogPost to a regular BlogPost
 */
export function convertContentfulBlogPostToBlogPost(post: ContentfulBlogPost | null): BlogPost | null {
  if (!post) return null;
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    status: 'published' as 'published' | 'draft', // Cast to satisfy TypeScript
    published_at: post.publishDate || post.published_at || '',
    created_at: post.created_at || post.sys?.createdAt || '',
    updated_at: post.updated_at || post.sys?.updatedAt || '',
    featuredImage: post.featuredImage,
    author: post.author,
    tags: post.tags || [],
    sys: post.sys
  };
}

/**
 * Convert an AdjacentPost to the format needed for ContentfulBlogPostContent
 */
export function convertAdjacentPostToContentful(post: AdjacentPost | null) {
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title
  };
}

/**
 * Safe type checking for content types
 */
export function safeContentfulFieldAccess<T>(obj: any, field: string, defaultValue: T): T {
  if (!obj || !obj.fields) return defaultValue;
  return obj.fields[field] !== undefined ? obj.fields[field] : defaultValue;
}
