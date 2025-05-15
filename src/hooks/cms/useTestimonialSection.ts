
import { useQuery } from "@tanstack/react-query";
import { fetchContentfulEntries } from "@/services/contentful/client";
import { transformContentfulTestimonial } from "./transformers/testimonialTransformer";

export function useTestimonialSection(sectionId: string) {
  return useQuery({
    queryKey: ["contentful", "testimonial-section", sectionId],
    queryFn: async () => {
      try {
        const response = await fetchContentfulEntries("testimonialSection", {
          "sys.id": sectionId,
          include: 2,
        });

        if (response.items.length === 0) {
          console.warn(`No testimonial section found with ID: ${sectionId}`);
          return null;
        }

        const section = response.items[0];
        const testimonials = section.fields.testimonials?.map(
          transformContentfulTestimonial
        ) || [];

        return {
          id: section.sys.id,
          title: section.fields.title || "What Our Clients Say",
          subtitle: section.fields.subtitle || "",
          testimonials,
        };
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
