
import { useContentful } from "@/hooks/useContentful";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";

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
  console.log("Creating blog query params with options:", options);
  
  const params: Record<string, string> = {
    content_type: "blogPost",
    order: options.order || "-fields.publishDate",
    limit: String(options.limit ?? 10),
    skip: String(options.skip ?? 0),
  };
  
  if (options.tag) {
    params["metadata.tags.sys.id[in]"] = options.tag;
  }
  
  console.log("Final query params:", params);
  return params;
}

function toContentfulBlogPost(item: any): ContentfulBlogPost {
  console.log("Processing blog post item:", item);
  
  const fields = item.fields || {};
  const imageField = fields.featuredImage?.fields?.file?.url;
  
  const post = {
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
  
  console.log("Transformed blog post:", post);
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
      console.log("Fetching blog posts with options:", options);
      
      try {
        const client = await getContentfulClient();
        const params = createBlogQueryParams(options);
        const response = await client.getEntries(params);
        
        console.log("Contentful response:", {
          total: response.total,
          itemCount: response.items.length,
          skip: response.skip,
          limit: response.limit,
        });
        
        if (!Array.isArray(response.items)) {
          console.error("Invalid response format - items is not an array:", response);
          return [];
        }
        
        const posts = response.items.map(toContentfulBlogPost);
        console.log(`Successfully processed ${posts.length} blog posts`);
        return posts;
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
    },
    fallbackData: [],
    enableToasts: true,
  });
}
