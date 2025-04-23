
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

// Type for a complete blog post entry with includes
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
        // Query entries with content_type 'blogPost' and matching slug
        // Include 2 levels of references to get embedded assets
        const response = await client.getEntries({
          content_type: "blogPost",
          "fields.slug": slug,
          include: 3,  // Increased to level 3 to ensure deeply nested references are resolved
          limit: 1,
        });
        
        console.log('Contentful Response for slug ' + slug + ':', response);
        
        if (!response.items.length) {
          console.error(`No blog post found with slug: ${slug}`);
          throw new Error(`Blog post not found for slug: ${slug}`);
        }
        
        // Get the first item and add the includes to it for easy access to referenced assets
        const post = response.items[0];
        const enhancedPost = {
          ...post,
          includes: response.includes
        };
        
        console.log('Enhanced post with includes:', enhancedPost);
        
        // Cast the response to our ContentfulBlogPost type
        return enhancedPost as unknown as ContentfulBlogPost;
      } catch (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
    }
  });
}
