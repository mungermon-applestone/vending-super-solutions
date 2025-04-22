
import { useQuery } from "@tanstack/react-query";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";

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
      const client = await getContentfulClient();
      
      try {
        // Fetch the blog page content by content type and ID
        const response = await client.getEntry("422CQhlcLuzs2LygKkiiHO");
        
        if (!response || !response.fields) {
          throw new Error("Blog page content not found");
        }
        
        return response.fields as BlogPageContent;
      } catch (error) {
        console.error("Error fetching blog page content:", error);
        throw error;
      }
    }
  });
}
