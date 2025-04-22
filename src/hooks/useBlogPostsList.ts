
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";

export interface BlogPostItem {
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
}

/**
 * Hook specifically designed for the Blog page to fetch posts from Contentful
 */
export const useBlogPostsList = (options: BlogPostsQueryOptions = {}) => {
  const { limit = 10, skip = 0, tag } = options;
  
  return useQuery({
    queryKey: ["blog-posts-list", limit, skip, tag],
    queryFn: async () => {
      try {
        const client = await getContentfulClient();
        
        // Build query parameters manually as an object with string values
        const queryParams: Record<string, string> = {
          content_type: "blogPost",
          order: "-fields.publishDate"
        };
        
        // Convert number values to strings explicitly
        queryParams.limit = String(limit);
        queryParams.skip = String(skip);
        
        if (tag) {
          queryParams["metadata.tags.sys.id[in]"] = tag;
        }
        
        const response = await client.getEntries(queryParams);
        
        return response.items.map(item => {
          const fields = item.fields as any;
          
          // Process featured image if it exists
          const featuredImage = fields.featuredImage
            ? {
                url: fields.featuredImage.fields?.file?.url
                  ? `https:${fields.featuredImage.fields.file.url}`
                  : undefined,
                title: fields.featuredImage.fields?.title || ""
              }
            : undefined;
          
          // Map Contentful entry to our BlogPostItem interface
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
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast.error("Failed to load blog posts. Please try again later.");
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
