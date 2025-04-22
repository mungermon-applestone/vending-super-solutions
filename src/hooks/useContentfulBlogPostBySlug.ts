
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { Document } from "@contentful/rich-text-types";
import { Asset, Entry } from "contentful";

// Define the blog post content type for Contentful
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

// Type for a complete blog post entry
export type ContentfulBlogPost = Entry<BlogPostFields>;

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
        // Query entries with content_type 'blogPost' and matching slug
        const response = await client.getEntries({
          content_type: "blogPost",
          "fields.slug": slug,
          include: 2,
          limit: 1,
        });
        
        console.log('Contentful Response:', response);
        
        if (!response.items.length) {
          console.error(`No blog post found with slug: ${slug}`);
          throw new Error(`Blog post not found for slug: ${slug}`);
        }
        
        return response.items[0] as ContentfulBlogPost;
      } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
    }
  });
}
