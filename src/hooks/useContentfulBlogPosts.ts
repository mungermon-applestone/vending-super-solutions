
import { useContentful } from '@/hooks/useContentful';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';

export interface ContentfulBlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  publishDate?: string;
  featuredImage?: {
    url: string;
    title: string;
  };
  author?: string;
  tags?: string[];
}

interface BlogPostsQueryOptions {
  limit?: number;
  skip?: number;
  tag?: string;
  order?: string;
}

const formatBlogPost = (item: any): ContentfulBlogPost => {
  console.log('[formatBlogPost] Processing item:', { 
    id: item.sys?.id,
    title: item.fields?.title 
  });

  const fields = item.fields || {};
  const featuredImage = fields.featuredImage?.fields
    ? {
        url: `https:${fields.featuredImage.fields.file.url}`,
        title: fields.featuredImage.fields.title || ''
      }
    : undefined;

  return {
    id: item.sys?.id || '',
    title: fields.title || 'Untitled',
    slug: fields.slug || '',
    content: fields.content || {},
    excerpt: fields.excerpt || '',
    publishDate: fields.publishDate || null,
    featuredImage,
    author: fields.author || '',
    tags: fields.tags || []
  };
};

export function useContentfulBlogPosts(options: BlogPostsQueryOptions = {}) {
  const { limit = 10, skip = 0, tag, order = '-sys.createdAt' } = options;

  return useContentful<ContentfulBlogPost[]>({
    queryKey: ['contentful-blog-posts', limit, skip, tag, order],
    queryFn: async () => {
      console.log('[useContentfulBlogPosts] Fetching posts with options:', options);
      
      const client = await getContentfulClient();
      
      const queryParams = {
        content_type: CMS_MODELS.BLOG_POST,
        order,
        limit: String(limit),
        skip: String(skip),
        ...(tag && { 'metadata.tags.sys.id[in]': tag })
      };

      console.log('[useContentfulBlogPosts] Query params:', queryParams);
      
      const response = await client.getEntries(queryParams);
      
      console.log('[useContentfulBlogPosts] Raw response:', {
        total: response.total,
        items: response.items?.length
      });

      if (!Array.isArray(response.items)) {
        console.error('[useContentfulBlogPosts] Invalid response format');
        return [];
      }

      const posts = response.items.map(formatBlogPost);
      console.log('[useContentfulBlogPosts] Processed posts:', posts.length);
      
      return posts;
    },
    enableToasts: true
  });
}
