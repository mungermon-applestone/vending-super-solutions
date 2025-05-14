
import { ContentfulBlogPost } from '@/hooks/useContentfulBlogPostBySlug';

// Define blog post interface for consistency
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  publishDate?: string;
  featuredImage?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  author?: string;
  tags?: string[];
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

// Form data interface for blog post editor
export interface BlogPostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'published' | 'draft';
  featuredImage?: {
    url: string;
    title: string;
  };
  tags?: string[];
}

// Convert from ContentfulBlogPost to BlogPost for compatibility
export function convertToCompatibleBlogPost(post: ContentfulBlogPost): BlogPost {
  // Handle case where post is null or undefined
  if (!post || !post.fields) {
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
  
  // Map from Contentful format to our app format
  return {
    id: post.sys?.id || '',
    title: post.fields.title || 'Untitled',
    slug: post.fields.slug || '',
    content: post.fields.content || '',
    excerpt: post.fields.excerpt,
    publishDate: post.fields.publishDate,
    status: 'published', // Assume published if it's coming from Contentful
    featuredImage: post.fields.featuredImage ? {
      url: `https:${post.fields.featuredImage.fields.file.url}`,
      title: post.fields.featuredImage.fields.title || post.fields.title || ''
    } : undefined,
    author: post.fields.author,
    tags: post.fields.tags || [],
    created_at: post.sys.createdAt || '',
    updated_at: post.sys.updatedAt || ''
  };
}
