
import { useQuery } from "@tanstack/react-query";
import { createClient } from "contentful";
import { transformBusinessGoal, ContentfulBusinessGoal } from "./transformers/businessGoalTransformer";
import { CMSBusinessGoal } from "@/types/cms";

// Create Contentful client using environment variables
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || "",
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
});

/**
 * Hook to fetch all business goals from Contentful
 */
export function useContentfulBusinessGoals() {
  return useQuery({
    queryKey: ["contentful", "businessGoals"],
    queryFn: async (): Promise<CMSBusinessGoal[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: "businessGoal",
          order: ["fields.displayOrder"]
        });

        // Transform Contentful entries to our internal format
        return response.items.map((entry) => 
          transformBusinessGoal(entry as unknown as ContentfulBusinessGoal)
        );
      } catch (error) {
        console.error("Error fetching business goals from Contentful:", error);
        throw error;
      }
    }
  });
}

/**
 * Hook to fetch a single business goal by slug from Contentful
 * @param slug The slug of the business goal to fetch
 */
export function useContentfulBusinessGoalBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["contentful", "businessGoal", slug],
    queryFn: async (): Promise<CMSBusinessGoal | null> => {
      if (!slug) return null;

      try {
        const response = await contentfulClient.getEntries({
          content_type: "businessGoal",
          "fields.slug": slug,
          limit: 1,
        });

        if (response.items.length === 0) {
          return null;
        }

        // Transform the entry to our internal format
        return transformBusinessGoal(
          response.items[0] as unknown as ContentfulBusinessGoal
        );
      } catch (error) {
        console.error(`Error fetching business goal with slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}
