
import { Entry, Asset } from 'contentful';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPostBySlug';
import { BlogPost } from '@/types/blog';
import { safeString } from '@/services/cms/utils/safeTypeUtilities';

/**
 * Type guard to check if a value is a Contentful entry
 */
export function isContentfulEntry(value: any): value is Entry<any, undefined, string> {
  return value && typeof value === 'object' && value.sys && value.fields;
}

/**
 * Type guard to check if a value is a Contentful asset
 */
export function isContentfulAsset(value: any): value is Asset<undefined, string> {
  return value && typeof value === 'object' && value.sys && value.fields && value.fields.file;
}

/**
 * Convert a Contentful blog post to our application's BlogPost format
 */
export function convertToBlogPost(entry: Entry<any, undefined, string>): BlogPost {
  if (!isContentfulEntry(entry)) {
    throw new Error('Invalid Contentful entry provided');
  }
  
  const fields = entry.fields;
  
  // Handle featured image conversion
  let featuredImage = undefined;
  if (fields.featuredImage && isContentfulAsset(fields.featuredImage)) {
    featuredImage = {
      url: `https:${fields.featuredImage.fields.file.url}`,
      title: safeString(fields.featuredImage.fields.title || fields.title || '')
    };
  }
  
  // Convert to our application's blog post format
  return {
    id: entry.sys.id,
    title: safeString(fields.title || 'Untitled'),
    slug: safeString(fields.slug || ''),
    content: fields.content || '',
    excerpt: fields.excerpt ? safeString(fields.excerpt) : undefined,
    publishDate: fields.publishDate,
    status: 'published', // Assume published if coming from Contentful
    featuredImage,
    author: fields.author ? safeString(fields.author) : undefined,
    tags: Array.isArray(fields.tags) ? fields.tags.map(tag => safeString(tag)) : [],
    created_at: entry.sys.createdAt,
    updated_at: entry.sys.updatedAt
  };
}

/**
 * Convert the Contentful blog post type to our app's BlogPost type
 */
export function convertContentfulBlogPostToBlogPost(post: ContentfulBlogPost): BlogPost {
  if (!post) {
    return {
      id: '',
      title: '',
      slug: '',
      content: '',
      status: 'draft'
    };
  }
  
  return {
    id: post.sys?.id || '',
    title: post.fields?.title || 'Untitled',
    slug: post.fields?.slug || '',
    content: post.fields?.content || '',
    excerpt: post.fields?.excerpt,
    publishDate: post.fields?.publishDate,
    featuredImage: post.fields?.featuredImage ? {
      url: `https:${post.fields.featuredImage.fields.file.url}`,
      title: post.fields.featuredImage.fields.title || post.fields.title || ''
    } : undefined,
    author: post.fields?.author,
    tags: post.fields?.tags || [],
    status: 'published',
    created_at: post.sys?.createdAt,
    updated_at: post.sys?.updatedAt
  };
}
