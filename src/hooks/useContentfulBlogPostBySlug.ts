
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { Document } from "@contentful/rich-text-types";
import { Asset, Entry, EntrySkeletonType } from "contentful";

// Define the blog post content type for Contentful
export interface ContentfulBlogPostFields {
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
export type ContentfulBlogPost = Entry<ContentfulBlogPostFields>;

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
      
      // Query entries with content_type 'blogPost' and matching slug
      const response = await client.getEntries({
        content_type: "blogPost",
        "fields.slug": slug,
        include: 2,
        limit: 1,
      });
      
      if (!response.items.length) throw new Error("Blog post not found");
      return response.items[0] as ContentfulBlogPost;
    }
  });
}
