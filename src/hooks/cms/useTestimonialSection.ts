
import { useQuery } from "@tanstack/react-query";
import { fetchContentfulEntries } from "@/services/contentful/client";
import { transformContentfulTestimonial, transformTestimonials } from "./transformers/testimonialTransformer";
import { ContentfulTestimonial, ContentfulTestimonialSection } from "@/types/contentful/testimonial";

export function useTestimonialSection(sectionId: string) {
  return useQuery({
    queryKey: ["contentful", "testimonial-section", sectionId],
    queryFn: async () => {
      try {
        const response = await fetchContentfulEntries("testimonialSection", {
          "sys.id": sectionId,
          include: 2,
        });

        if (!response.items || response.items.length === 0) {
          console.warn(`No testimonial section found with ID: ${sectionId}`);
          return null;
        }

        const section = response.items[0];
        const sectionFields = section.fields || {};
        const testimonials = sectionFields.testimonials?.map?.(
          transformContentfulTestimonial
        ) || [];

        // Return in ContentfulTestimonialSection format for compatibility
        return {
          sys: { id: section.sys.id },
          fields: {
            title: sectionFields.title || "What Our Clients Say",
            subtitle: sectionFields.subtitle || "",
            testimonials: (sectionFields.testimonials || []) as ContentfulTestimonial[],
            pageKey: sectionFields.pageKey
          }
        } as ContentfulTestimonialSection;
      } catch (error) {
        console.error(
          `Error fetching testimonial section with ID ${sectionId}:`,
          error
        );
        return null;
      }
    },
  });
}
