
import { Entry } from 'contentful';
import { BlogPost, AdjacentPost } from '@/types/cms';
import { Asset } from 'contentful';

/**
 * Transform a Contentful blog post entry to our application's BlogPost type
 */
export function transformContentfulBlogPost(entry: Entry<any>): BlogPost {
  const fields = entry.fields;
  
  return {
    id: entry.sys.id,
    title: fields.title || 'Untitled Post',
    slug: fields.slug || '',
    author: fields.author || 'Anonymous',
    summary: fields.summary || '',
    content: fields.content || '',
    status: fields.status || 'draft',
    featured_image: fields.featuredImage?.fields?.file?.url 
      ? `https:${fields.featuredImage.fields.file.url}` 
      : undefined,
    published_date: fields.publishedDate 
      ? new Date(fields.publishedDate).toISOString()
      : undefined,
    tags: fields.tags || [],
    category: fields.category || '',
    reading_time: fields.readingTime || calculateReadingTime(fields.content),
  };
}

/**
 * Transform a Contentful entry to an AdjacentPost type (used for prev/next navigation)
 */
export function transformToAdjacentPost(entry: Entry<any>): AdjacentPost {
  return {
    id: entry.sys.id,
    title: entry.fields.title || 'Untitled Post',
    slug: entry.fields.slug || '',
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
