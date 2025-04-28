
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient, refreshContentfulClient } from "@/services/cms/utils/contentfulClient";
import { Document } from "@contentful/rich-text-types";
import { Asset, Entry } from "contentful";
import { CMS_MODELS } from "@/config/cms";
import { toast } from "sonner";

export interface BlogPostFields {
  title: string;
  slug: string;
  content?: Document;
  excerpt?: string;
  publishDate?: string;
  featuredImage?: Asset;
  author?: string;
  tags?: string[];
}

export interface ContentfulBlogPost {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      }
    }
  };
  fields: BlogPostFields;
  includes?: {
    Asset?: Asset[];
    Entry?: Entry<any>[];
  };
}

interface UseContentfulBlogPostBySlugOptions {
  slug: string | undefined;
}

export function useContentfulBlogPostBySlug({ slug }: UseContentfulBlogPostBySlugOptions) {
  return useQuery({
    queryKey: ["contentful-blog-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      console.log('[useContentfulBlogPostBySlug] Fetching post with slug:', slug);
      
      if (!slug) throw new Error("No slug provided");
      
      try {
        // Try to get a fresh client first
        await refreshContentfulClient();
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: CMS_MODELS.BLOG_POST,
          "fields.slug": slug,
          include: 3,
          limit: 1,
        });
        
        console.log('[useContentfulBlogPostBySlug] Raw response:', response);
        console.log('[useContentfulBlogPostBySlug] Response items:', response.items);
        
        if (!response.items.length) {
          console.error(`[useContentfulBlogPostBySlug] No blog post found with slug: ${slug}`);
          throw new Error(`Blog post not found for slug: ${slug}`);
        }
        
        const post = response.items[0];
        const enhancedPost = {
          ...post,
          includes: response.includes
        };
        
        console.log('[useContentfulBlogPostBySlug] Enhanced post:', enhancedPost);
        
        return enhancedPost as unknown as ContentfulBlogPost;
      } catch (error) {
        console.error('[useContentfulBlogPostBySlug] Error fetching blog post:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading blog post: ${error.message}`);
        console.error('[useContentfulBlogPostBySlug] Error:', error);
      }
    }
  });
}
