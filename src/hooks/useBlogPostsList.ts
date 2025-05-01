
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
 * Creates properly typed query parameters for Contentful
 * Ensures all values are strings as required by the API
 */
const createQueryParams = (options: BlogPostsQueryOptions): Record<string, string> => {
  const { limit = 10, skip = 0, tag } = options;
  
  // Build base params with explicit string conversions
  const params: Record<string, string> = {
    content_type: "blogPost",
    // Sort by publishDate in descending order (newest first)
    order: "-fields.publishDate",
    limit: String(limit),
    skip: String(skip)
  };
  
  // Add optional tag filter
  if (tag) {
    params["metadata.tags.sys.id[in]"] = tag;
  }
  
  return params;
};

/**
 * Formats a Contentful entry into our BlogPostItem interface
 */
const formatBlogPost = (item: any): BlogPostItem => {
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
  
  // Return formatted blog post
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
};

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
        
        // Use our adapter to get properly typed query params
        const queryParams = createQueryParams(options);
        
        // Execute the query with our typed params
        const response = await client.getEntries(queryParams);
        
        // Map the response to our interface
        return response.items.map(formatBlogPost);
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
