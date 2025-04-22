
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { Document } from "@contentful/rich-text-types";

// Minimal Contentful blog post fields shape. Adjust as needed.
export interface ContentfulBlogPost {
  sys: { id: string };
  fields: {
    title: string;
    slug: string;
    content?: Document;
    excerpt?: string;
    publishDate?: string;
    featuredImage?: { fields: { file: { url: string }; title: string } };
    author?: string;
    tags?: string[];
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
      // Query entries with content_type 'blogPost' and matching slug
      const response = await client.getEntries<ContentfulBlogPost>({
        content_type: "blogPost",
        "fields.slug": slug,
        include: 2,
        limit: 1,
      });
      if (!response.items.length) throw new Error("Blog post not found");
      return response.items[0];
    }
  });
}
