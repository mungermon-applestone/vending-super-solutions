
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
    author: string;
    position?: string;
    company?: string;
    quote: string;
    rating?: number;
    image?: ContentfulAsset;
    visible?: boolean;
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
 * Transform ContentfulTestimonial to CMSTestimonial format
 */
export function transformContentfulTestimonial(contentfulTestimonial: ContentfulTestimonial): CMSTestimonial {
  return {
    id: contentfulTestimonial.sys.id,
    name: contentfulTestimonial.fields.author,
    title: contentfulTestimonial.fields.position || '',
    company: contentfulTestimonial.fields.company || '',
    testimonial: contentfulTestimonial.fields.quote,
    rating: contentfulTestimonial.fields.rating || 5,
    image_url: contentfulTestimonial.fields.image?.fields?.file?.url 
      ? `https:${contentfulTestimonial.fields.image.fields.file.url}` 
      : undefined
  };
}

/**
 * Convert raw testimonials to a section format
 */
export function convertTestimonialsToSection(
  testimonials: CMSTestimonial[],
  title: string = "What Our Clients Say",
  subtitle?: string
): ContentfulTestimonialSection {
  return {
    title,
    subtitle,
    testimonials,
    background: "bg-gray-50",
    displayStyle: "carousel"
  };
}
