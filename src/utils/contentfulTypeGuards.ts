
import { Entry, Asset, EntrySkeletonType } from 'contentful';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPostBySlug';

// Type guard to check if a value is a Contentful Entry
export function isContentfulEntry(value: any): value is Entry<EntrySkeletonType, undefined, string> {
  return value && typeof value === 'object' && value.sys && value.fields;
}

// Type guard to check if a value is a Contentful Asset
export function isContentfulAsset(value: any): value is Asset<undefined, string> {
  return value && typeof value === 'object' && value.sys && value.fields && value.fields.file;
}

// Helper to safely convert Contentful entry to BlogPost format
export function convertToBlogPost(entry: Entry<EntrySkeletonType, undefined, string>): ContentfulBlogPost {
  const blogPost: ContentfulBlogPost = {
    sys: {
      id: entry.sys.id
    },
    fields: {
      title: String(entry.fields.title || 'Untitled'),
      slug: String(entry.fields.slug || ''),
      publishDate: entry.fields.publishDate ? String(entry.fields.publishDate) : undefined,
      content: entry.fields.content,
      excerpt: entry.fields.excerpt ? String(entry.fields.excerpt) : undefined
    }
  };
  
  // Handle featured image if present
  if (entry.fields.featuredImage && isContentfulAsset(entry.fields.featuredImage)) {
    blogPost.fields.featuredImage = {
      sys: { id: entry.fields.featuredImage.sys.id },
      fields: {
        title: entry.fields.featuredImage.fields.title || '',
        file: {
          url: entry.fields.featuredImage.fields.file.url,
          details: entry.fields.featuredImage.fields.file.details,
          fileName: entry.fields.featuredImage.fields.file.fileName,
          contentType: entry.fields.featuredImage.fields.file.contentType
        }
      }
    };
  }
  
  // Handle author if present
  if (entry.fields.author) {
    blogPost.fields.author = String(entry.fields.author);
  }
  
  // Handle tags if present
  if (Array.isArray(entry.fields.tags)) {
    blogPost.fields.tags = entry.fields.tags.map(tag => String(tag));
  }
  
  // Handle includes if present in the original entry
  if (entry.includes) {
    blogPost.includes = entry.includes;
  }
  
  return blogPost;
}
