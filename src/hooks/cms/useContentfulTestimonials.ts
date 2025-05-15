
import { useQuery } from "@tanstack/react-query";
import { createClient } from "contentful";
import { transformTestimonial, ContentfulTestimonial } from "./transformers/testimonialTransformer";
import { CMSTestimonial } from "@/types/cms";

// Create Contentful client using environment variables
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || "",
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
});

/**
 * Hook to fetch all testimonials from Contentful
 */
export function useContentfulTestimonials() {
  return useQuery({
    queryKey: ["contentful", "testimonials"],
    queryFn: async (): Promise<CMSTestimonial[]> => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: "testimonial",
          "fields.visible": true,
        });

        // Transform Contentful entries to our internal format
        return response.items.map((entry) => 
          transformTestimonial(entry as unknown as ContentfulTestimonial)
        );
      } catch (error) {
        console.error("Error fetching testimonials from Contentful:", error);
        throw error;
      }
    },
  });
}
