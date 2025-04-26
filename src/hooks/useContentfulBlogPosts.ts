import { useContentful } from "@/hooks/useContentful";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { CMS_MODELS } from "@/config/cms";

function toStringParam(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

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
  order?: string;
}

function createBlogQueryParams(options: UseBlogPostsOptions): Record<string, string> {
  console.log("[createBlogQueryParams] Creating query with options:", options);
  
  const params: Record<string, string> = {
    content_type: CMS_MODELS.BLOG_POST,
    order: options.order || "-sys.createdAt",
    limit: String(options.limit ?? 10),
    skip: String(options.skip ?? 0),
  };
  
  if (options.tag) {
    params["metadata.tags.sys.id[in]"] = options.tag;
  }
  
  console.log("[createBlogQueryParams] Final query params:", params);
  return params;
}

function toContentfulBlogPost(item: any): ContentfulBlogPost {
  console.log("[toContentfulBlogPost] Processing blog post item:", {
    id: item.sys?.id,
    title: item.fields?.title,
    slug: item.fields?.slug
  });
  
  const fields = item.fields || {};
  const imageField = fields.featuredImage?.fields?.file;
  
  const post = {
    id: item.sys?.id || "",
    title: fields.title || "Untitled",
    slug: fields.slug || "",
    content: fields.content ?? {},
    excerpt: fields.excerpt || "",
    publishDate: fields.publishDate ?? null,
    featuredImage: imageField
      ? {
          url: `https:${imageField.url}`,
          title: fields.featuredImage.fields.title || "",
        }
      : undefined,
    author: fields.author || "",
    tags: fields.tags || [],
  };
  
  console.log("[toContentfulBlogPost] Transformed post:", post);
  return post;
}

export function useContentfulBlogPosts(options: UseBlogPostsOptions = {}) {
  return useContentful<ContentfulBlogPost[]>({
    queryKey: [
      "contentful-blog-posts",
      toStringParam(options.limit),
      toStringParam(options.skip),
      toStringParam(options.tag),
      toStringParam(options.order),
    ],
    queryFn: async () => {
      console.log("[useContentfulBlogPosts] Starting blog posts fetch with options:", options);
      
      try {
        const client = await getContentfulClient();
        const params = createBlogQueryParams(options);
        console.log("[useContentfulBlogPosts] Fetching with params:", params);
        
        const response = await client.getEntries(params);
        console.log("[useContentfulBlogPosts] Raw response:", {
          total: response.total,
          items: response.items?.length,
          includes: response.includes,
          firstPost: response.items?.[0]?.fields,
        });
        
        if (!Array.isArray(response.items)) {
          console.error("[useContentfulBlogPosts] Invalid response - items is not an array:", response);
          return [];
        }
        
        const posts = response.items.map(toContentfulBlogPost);
        console.log(`[useContentfulBlogPosts] Successfully processed ${posts.length} blog posts`);
        return posts;
      } catch (error) {
        console.error("[useContentfulBlogPosts] Error fetching blog posts:", error);
        throw error;
      }
    },
    fallbackData: [],
    enableToasts: true,
  });
}
