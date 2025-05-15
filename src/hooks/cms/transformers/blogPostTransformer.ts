
import { Entry, Asset } from 'contentful';
import { BlogPost, AdjacentPost } from '@/types/contentful';

/**
 * Safely access nested Contentful fields
 */
const getField = <T>(entry: any, fieldPath: string, defaultValue: T): T => {
  try {
    const paths = fieldPath.split('.');
    let value = entry?.fields;
    
    for (const path of paths) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path];
      } else {
        return defaultValue;
      }
    }
    
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (e) {
    console.error(`Error accessing field ${fieldPath}:`, e);
    return defaultValue;
  }
};

/**
 * Transform a Contentful blog post entry to our application's BlogPost type
 */
export function transformContentfulBlogPost(entry: Entry<any>): BlogPost {
  return {
    id: entry.sys.id,
    title: getField(entry, 'title', 'Untitled Post'),
    slug: getField(entry, 'slug', ''),
    author: getField(entry, 'author', 'Anonymous'),
    summary: getField(entry, 'summary', ''),
    content: getField(entry, 'content', ''),
    status: getField(entry, 'status', 'draft'),
    featured_image: getField<any>(entry, 'featuredImage', null)?.fields?.file?.url 
      ? `https:${getField<any>(entry, 'featuredImage', null).fields.file.url}` 
      : undefined,
    published_date: getField(entry, 'publishedDate', null) 
      ? new Date(getField(entry, 'publishedDate', '')).toISOString()
      : undefined,
    tags: getField(entry, 'tags', []),
    category: getField(entry, 'category', ''),
    reading_time: getField(entry, 'readingTime', 0) || calculateReadingTime(getField(entry, 'content', '')),
  };
}

/**
 * Transform a Contentful entry to an AdjacentPost type (used for prev/next navigation)
 */
export function transformToAdjacentPost(entry: Entry<any>): AdjacentPost {
  return {
    id: entry.sys.id,
    title: getField(entry, 'title', 'Untitled Post'),
    slug: getField(entry, 'slug', ''),
  };
}

/**
 * Calculate estimated reading time based on word count
 */
function calculateReadingTime(content: string): number {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Transform a Contentful asset to a URL string
 */
export function transformContentfulAsset(asset: Asset<any> | undefined): string | undefined {
  if (!asset || !asset.fields || !asset.fields.file || !asset.fields.file.url) {
    return undefined;
  }
  
  return `https:${asset.fields.file.url}`;
}
