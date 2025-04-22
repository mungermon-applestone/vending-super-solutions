
import { useContentful } from "@/hooks/useContentful";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { EntryCollection } from "contentful";

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

// Define a strongly typed interface for Contentful API params
interface ContentfulQueryParams {
  content_type: string;
  order: string;
  limit: string;
  skip: string;
  [key: string]: string; // Allow for dynamic fields like tag filters
}

/**
 * Creates properly formatted Contentful query parameters
 * This adapter ensures all params are strings as required by Contentful
 */
const createBlogQueryParams = (options: UseBlogPostsOptions): ContentfulQueryParams => {
  const { limit = 10, skip = 0, tag } = options;
  
  // Create base params with explicit string conversions
  const params: ContentfulQueryParams = {
    content_type: "blogPost",
    order: "-fields.publishDate",
    limit: `${limit}`, // Template literal conversion to string
    skip: `${skip}`,   // Template literal conversion to string
  };
  
  // Add tag filter if provided
  if (tag) {
    params["metadata.tags.sys.id[in]"] = tag;
  }
  
  return params;
};

/**
 * Maps Contentful entry data to our ContentfulBlogPost interface
 */
const mapContentfulEntryToBlogPost = (item: any): ContentfulBlogPost => {
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
      
      // Use our adapter to create properly typed query params
      const queryParams = createBlogQueryParams(options);
      
      // Execute the query with our typed params
      const response = await client.getEntries(queryParams);
      
      // Map the response to our interface
      return response.items.map(mapContentfulEntryToBlogPost);
    },
    fallbackData: [],
    enableToasts: false
  });
}
