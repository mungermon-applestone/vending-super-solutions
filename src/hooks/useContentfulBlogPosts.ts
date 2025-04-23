
import { useContentful } from "@/hooks/useContentful";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";

// === Helper utility for safe query key stringification ===
/**
 * Ensures React Query keys are always strings (avoid TS2322 errors!)
 * Allows numbers, undefined, null, etc to safely be used.
 * Always use when passing variables into queryKey arrays!
 */
function toStringParam(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

/**
 * Type for a single Contentful blog post.
 * All fields are optional where possible to allow for incomplete data.
 */
export interface ContentfulBlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt?: string;
  publishDate?: string | null;
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
 * Prepare Contentful API query params, always as strings.
 */
function createBlogQueryParams(options: UseBlogPostsOptions): Record<string, string> {
  const params: Record<string, string> = {
    content_type: "blogPost",
    order: "-fields.publishDate",
    limit: String(options.limit ?? 10),
    skip: String(options.skip ?? 0),
  };
  if (options.tag) {
    params["metadata.tags.sys.id[in]"] = options.tag;
  }
  return params;
}

/**
 * Map raw Contentful entry to a strongly typed JS object for UI consumption.
 */
function toContentfulBlogPost(item: any): ContentfulBlogPost {
  const fields = item.fields || {};
  const imageField = fields.featuredImage?.fields?.file?.url;
  return {
    id: item.sys?.id || "",
    title: fields.title || "Untitled",
    slug: fields.slug || "",
    content: fields.content ?? {},
    excerpt: fields.excerpt || "",
    publishDate: fields.publishDate ?? null,
    featuredImage: imageField
      ? {
          url: `https:${fields.featuredImage.fields.file.url}`,
          title: fields.featuredImage.fields.title || "",
        }
      : undefined,
    author: fields.author || "",
    tags: fields.tags || [],
  };
}

/**
 * Hook to fetch Contentful blog posts.
 * Keeps the API and returned data shape the same for drop-in UI compatibility.
 * 
 * Always ensure ALL dynamic queryKey params are strings by using `toStringParam`.
 * This will avoid type errors if options are left as numbers or undefined.
 */
export function useContentfulBlogPosts(options: UseBlogPostsOptions = {}) {
  const limit = options.limit ?? 10;
  const skip = options.skip ?? 0;
  const tag = options.tag ?? "";
  
  return useContentful<ContentfulBlogPost[]>({
    queryKey: [
      "contentful-blog-posts",
      toStringParam(limit),
      toStringParam(skip),
      toStringParam(tag),
    ],
    queryFn: async () => {
      const client = await getContentfulClient();
      const params = createBlogQueryParams(options);
      const response = await client.getEntries(params);
      if (!Array.isArray(response.items)) return [];
      return response.items.map(toContentfulBlogPost);
    },
    fallbackData: [],
    enableToasts: false,
  });
}

