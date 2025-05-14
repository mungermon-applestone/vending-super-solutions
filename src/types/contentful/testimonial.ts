
import { ContentfulAsset } from "@/types/contentful";
import { CMSTestimonial } from "@/types/cms";

/**
 * Interface for Contentful testimonial data
 */
export interface ContentfulTestimonial {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    title?: string;
    company?: string;
    testimonial: string;
    rating?: number;
    image?: ContentfulAsset;
  };
}

/**
 * Interface for a testimonial section with multiple testimonials
 */
export interface ContentfulTestimonialSection {
  sys?: {
    id: string;
  };
  fields?: {
    title?: string;
    subtitle?: string;
    testimonials: ContentfulTestimonial[];
    background?: string;
    displayStyle?: string;
  };
  title?: string;
  subtitle?: string;
  testimonials: CMSTestimonial[];
  background?: string;
  displayStyle?: string;
}

/**
 * Convert raw testimonials to a section format
 */
export function convertTestimonialsToSection(
  testimonials: any[],
  title: string = "What Our Clients Say",
  subtitle?: string
): ContentfulTestimonialSection {
  return {
    title,
    subtitle,
    testimonials: testimonials.map(item => ({
      id: item.id || item._id || `testimonial-${Math.random().toString(36).substring(7)}`,
      name: item.name || item.author || "Customer",
      title: item.title || item.position || "",
      company: item.company || item.organization || "",
      testimonial: item.testimonial || item.content || item.text || "",
      rating: item.rating || 5,
      image_url: item.image_url || item.imageUrl || (
        item.image?.url || 
        (item.image?.fields?.file?.url && `https:${item.image.fields.file.url}`) || 
        ""
      )
    })),
    background: "bg-gray-50",
    displayStyle: "carousel"
  };
}
