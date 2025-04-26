
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { CMS_MODELS } from "@/config/cms";

export interface BlogPageContent {
  introTitle?: string;
  introDescription?: string;
  featuredPostsTitle?: string;
  latestArticlesTitle?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterButtonText?: string;
  newsletterPlaceholder?: string;
}

export function useContentfulBlogPageContent() {
  return useQuery({
    queryKey: ["contentful-blog-page-content"],
    queryFn: async () => {
      console.log("[useContentfulBlogPageContent] Fetching blog page content");
      const client = await getContentfulClient();
      
      try {
        // Fetch blog page content by content type
        const response = await client.getEntries({
          content_type: "blogPageContent",
          limit: 1
        });
        
        console.log("[useContentfulBlogPageContent] Raw response:", response);
        
        if (!response.items || response.items.length === 0) {
          console.error("[useContentfulBlogPageContent] No blog page content found");
          throw new Error("Blog page content not found");
        }
        
        return response.items[0].fields as BlogPageContent;
      } catch (error) {
        console.error("[useContentfulBlogPageContent] Error fetching blog page content:", error);
        throw error;
      }
    }
  });
}
