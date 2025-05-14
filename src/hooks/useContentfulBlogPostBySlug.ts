
import { useQuery } from '@tanstack/react-query';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CMS_MODELS } from '@/config/cms';

export interface ContentfulBlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    content: any;
    excerpt?: string;
    publishDate?: string;
    featuredImage?: any;
  };
  includes?: {
    Asset?: any[];
  };
}

export function useContentfulBlogPostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['contentful', 'blogPost', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      try {
        const entries = await fetchContentfulEntries(CMS_MODELS.BLOG_POST, {
          'fields.slug': slug,
          include: 3
        });
        
        if (!entries || entries.length === 0) return null;
        
        return entries[0] as ContentfulBlogPost;
      } catch (error) {
        console.error('[useContentfulBlogPostBySlug] Error fetching blog post:', error);
        return null;
      }
    },
    enabled: !!slug
  });
}
