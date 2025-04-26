import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { Document } from "@contentful/rich-text-types";
import { Asset, Entry } from "contentful";
import { CMS_MODELS } from "@/config/cms";

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
      if (!slug) throw new Error("No slug provided");
      const client = await getContentfulClient();
      
      try {
        const response = await client.getEntries({
          content_type: CMS_MODELS.BLOG_POST,
          "fields.slug": slug,
          include: 3,
          limit: 1,
        });
        
        console.log('Contentful Response for slug ' + slug + ':', response);
        
        if (!response.items.length) {
          console.error(`No blog post found with slug: ${slug}`);
          throw new Error(`Blog post not found for slug: ${slug}`);
        }
        
        const post = response.items[0];
        const enhancedPost = {
          ...post,
          includes: response.includes
        };
        
        console.log('Enhanced post with includes:', enhancedPost);
        
        return enhancedPost as unknown as ContentfulBlogPost;
      } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
    }
  });
}
