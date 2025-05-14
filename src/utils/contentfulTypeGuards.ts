
import { Entry, Asset } from 'contentful';
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPosts';
import { BlogPost, AdjacentPost } from '@/types/cms';
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
export function convertToBlogPost(entry: Entry<any, undefined, string>): ContentfulBlogPost {
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
  
  // Return in ContentfulBlogPost format (with sys and fields)
  return {
    sys: {
      id: entry.sys.id,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt
    },
    fields: {
      title: safeString(fields.title || 'Untitled'),
      slug: safeString(fields.slug || ''),
      content: fields.content || '',
      excerpt: safeString(fields.excerpt || ''),
      publishDate: fields.publishDate,
      featuredImage: fields.featuredImage,
      author: safeString(fields.author || ''),
      tags: Array.isArray(fields.tags) ? fields.tags.map(tag => safeString(tag)) : []
    },
    includes: entry.includes,
    id: entry.sys.id,
    title: safeString(fields.title || 'Untitled'),
    slug: safeString(fields.slug || ''),
    content: fields.content || '',
    excerpt: safeString(fields.excerpt || ''),
    publishDate: fields.publishDate,
    published_at: fields.publishDate,
    featuredImage: featuredImage,
    author: safeString(fields.author || ''),
    tags: Array.isArray(fields.tags) ? fields.tags.map(tag => safeString(tag)) : [],
    status: 'published',
    created_at: entry.sys.createdAt || '',
    updated_at: entry.sys.updatedAt || ''
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
      status: 'draft',
      created_at: '',
      updated_at: ''
    };
  }
  
  return {
    id: post.id || post.sys?.id || '',
    title: post.title || post.fields?.title || 'Untitled',
    slug: post.slug || post.fields?.slug || '',
    content: post.content || post.fields?.content || '',
    excerpt: post.excerpt || post.fields?.excerpt,
    status: post.status || 'published',
    published_at: post.publishDate || post.published_at || post.fields?.publishDate,
    created_at: post.created_at || post.sys?.createdAt || '',
    updated_at: post.updated_at || post.sys?.updatedAt || '',
    featuredImage: post.featuredImage || (post.fields?.featuredImage ? {
      url: `https:${post.fields.featuredImage.fields?.file?.url || ''}`,
      title: post.fields.featuredImage.fields?.title || post.title || ''
    } : undefined),
    author: post.author || post.fields?.author,
    tags: post.tags || post.fields?.tags || [],
    sys: post.sys,
    fields: post.fields
  };
}

/**
 * Convert our app's BlogPost to Contentful format
 * This is needed for components expecting Contentful structure
 */
export function convertBlogPostToContentful(post: BlogPost | AdjacentPost): ContentfulBlogPost {
  if (!post) {
    return {
      id: '',
      sys: { id: '' },
      fields: {
        title: '',
        slug: '',
      },
      title: '',
      slug: ''
    };
  }
  
  // Create a fields object that matches the Contentful structure
  const fields: any = {
    title: post.title || 'Untitled',
    slug: post.slug || '',
  };
  
  // Add additional fields if this is a full BlogPost
  if ('content' in post) {
    fields.content = post.content || '';
    fields.excerpt = post.excerpt || '';
    fields.publishDate = post.published_at || post.created_at || '';
    
    // Add featured image if available
    if (post.featuredImage && post.featuredImage.url) {
      fields.featuredImage = {
        fields: {
          title: post.featuredImage.title || post.title,
          file: {
            url: post.featuredImage.url.replace(/^https:/, ''),
            details: {
              image: {
                width: post.featuredImage.width || 800,
                height: post.featuredImage.height || 600,
              }
            }
          }
        }
      };
    }
    
    // Add author and tags if available
    if (post.author) fields.author = post.author;
    if (Array.isArray(post.tags)) fields.tags = post.tags;
  }
  
  return {
    sys: { 
      id: ('id' in post) ? post.id : '',
      createdAt: ('created_at' in post) ? post.created_at : '',
      updatedAt: ('updated_at' in post) ? post.updated_at : ''
    },
    fields,
    id: ('id' in post) ? post.id : '',
    title: post.title || 'Untitled',
    slug: post.slug || '',
    content: ('content' in post) ? post.content : '',
    status: ('status' in post) ? post.status : 'published',
    excerpt: ('excerpt' in post) ? post.excerpt : undefined,
    publishDate: ('published_at' in post) ? post.published_at : undefined,
    published_at: ('published_at' in post) ? post.published_at : undefined,
    created_at: ('created_at' in post) ? post.created_at : '',
    updated_at: ('updated_at' in post) ? post.updated_at : '',
    featuredImage: ('featuredImage' in post) ? post.featuredImage : undefined,
    author: ('author' in post) ? post.author : undefined,
    tags: ('tags' in post) ? post.tags : []
  };
}

/**
 * Convert an AdjacentPost (minimal blog post reference) to ContentfulBlogPost
 */
export function convertAdjacentPostToContentful(post: AdjacentPost): ContentfulBlogPost {
  return {
    sys: { id: '' },
    fields: {
      title: post.title,
      slug: post.slug
    },
    id: '',
    title: post.title,
    slug: post.slug,
    status: 'published'
  };
}
