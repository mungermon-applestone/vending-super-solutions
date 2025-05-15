import { useQuery } from "@tanstack/react-query";
import { createClient } from "contentful";
import { BlogPost, AdjacentPost } from "@/types/cms";
import { transformBlogPost, createAdjacentPost, ContentfulBlogPost } from "./cms/transformers/blogPostTransformer";
import { logDeprecation } from "@/services/cms/utils/deprecation";

// Create Contentful client using environment variables
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || "",
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
});

/**
 * Hook to fetch all blog posts from Contentful
 * @param limit Optional limit on number of posts to retrieve
 */
export function useBlogPosts(limit?: number) {
  logDeprecation("useBlogPosts", "Will be replaced with useContentfulBlogPosts in the future");
  
  return useQuery({
    queryKey: ["blog", "posts", limit],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: "blogPost",
          order: "-fields.publishedDate",
          limit: limit || 100,
          "fields.status": "published",
        });

        return response.items.map((entry) => 
          transformBlogPost(entry as unknown as ContentfulBlogPost)
        );
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }
    },
  });
}

/**
 * Hook to fetch a single blog post by slug
 * @param slug The slug of the blog post to fetch
 */
export function useBlogPostBySlug(slug: string | undefined) {
  logDeprecation("useBlogPostBySlug", "Will be replaced with useContentfulBlogPostBySlug in the future");
  
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;

      try {
        const response = await contentfulClient.getEntries({
          content_type: "blogPost",
          "fields.slug": slug,
          limit: 1,
        });

        if (response.items.length === 0) {
          return null;
        }

        return transformBlogPost(response.items[0] as unknown as ContentfulBlogPost);
      } catch (error) {
        console.error(`Error fetching blog post with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}

/**
 * Get adjacent posts (previous and next) for a given post slug
 * @param slug Current post slug
 */
export function useAdjacentPosts(slug: string | undefined) {
  logDeprecation("useAdjacentPosts", "Will be replaced with useContentfulAdjacentPosts in the future");
  
  return useQuery({
    queryKey: ["blog", "adjacent", slug],
    queryFn: async (): Promise<{ previous: AdjacentPost | null; next: AdjacentPost | null }> => {
      if (!slug) {
        return { previous: null, next: null };
      }

      try {
        // Get all published posts sorted by date
        const response = await contentfulClient.getEntries({
          content_type: "blogPost",
          order: "fields.publishedDate",
          "fields.status": "published",
        });

        const posts = response.items.map((entry) => entry as unknown as ContentfulBlogPost);
        
        // Find the current post index
        const currentIndex = posts.findIndex((post) => post.fields.slug === slug);
        
        if (currentIndex === -1) {
          return { previous: null, next: null };
        }

        // Get previous and next posts
        const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        return {
          previous: previousPost ? createAdjacentPost(previousPost) : null,
          next: nextPost ? createAdjacentPost(nextPost) : null,
        };
      } catch (error) {
        console.error(`Error fetching adjacent posts for ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}

// Other blog-related hooks will be added here as needed
