
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { useContentful } from "@/hooks/useContentful";

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

interface UseBlogPostsOptions {
  limit?: number;
  skip?: number;
  tag?: string;
}

/**
 * Hook to fetch blog posts from Contentful CMS
 * @param options Configuration options for the query
 * @returns Query object with blog posts data and loading state
 */
export function useContentfulBlogPosts(options: UseBlogPostsOptions = {}) {
  const { limit = 10, skip = 0, tag } = options;

  return useContentful<ContentfulBlogPost[]>({
    queryKey: ["contentful-blog-posts", limit, skip, tag],
    queryFn: async () => {
      const client = await getContentfulClient();

      // Create query parameters object with explicit string type conversion
      const queryParams: Record<string, string> = {
        content_type: "blogPost",
        order: "-fields.publishDate",
        limit: String(limit),
        skip: String(skip)
      };
      
      // Only add tag filter if one is provided
      if (tag) {
        queryParams["metadata.tags.sys.id[in]"] = tag;
      }

      // Now pass the properly typed queryParams to getEntries
      const response = await client.getEntries(queryParams);

      return response.items.map(item => {
        const fields = item.fields as any;
        const featuredImage = fields.featuredImage
          ? {
              url: fields.featuredImage.fields?.file?.url
                ? `https:${fields.featuredImage.fields.file.url}`
                : undefined,
              title: fields.featuredImage.fields?.title || ""
            }
          : undefined;

        return {
          id: item.sys.id,
          title: fields.title || "Untitled",
          slug: fields.slug || "",
          content: fields.content || {},
          excerpt: fields.excerpt || "",
          publishDate: fields.publishDate || null,
          featuredImage,
          author: fields.author || "",
          tags: fields.tags || []
        };
      });
    },
    fallbackData: [],
    enableToasts: false
  });
}
