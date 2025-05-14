
import { CMSTestimonial } from '@/types/cms';

export interface ContentfulTestimonial {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    author: string;
    position?: string;
    company?: string;
    quote: string;
    rating?: number;
    image?: any;
    visible?: boolean;
  };
}

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
}

// Utility function to convert ContentfulTestimonial to CMSTestimonial
export function convertToTestimonial(contentfulTestimonial: ContentfulTestimonial): CMSTestimonial {
  return {
    id: contentfulTestimonial.sys?.id || '',
    name: contentfulTestimonial.fields.author,
    title: contentfulTestimonial.fields.position || '',
    company: contentfulTestimonial.fields.company || '',
    testimonial: contentfulTestimonial.fields.quote,
    rating: contentfulTestimonial.fields.rating,
    image_url: contentfulTestimonial.fields.image?.fields?.file?.url 
      ? `https:${contentfulTestimonial.fields.image.fields.file.url}` 
      : undefined
  };
}

// Convert ContentfulTestimonialSection to the format expected by our components
export function convertTestimonialsToSection(testimonials: CMSTestimonial[]): ContentfulTestimonialSection {
  return {
    fields: {
      title: "What Our Clients Say",
      subtitle: "Don't just take our word for it",
      testimonials: testimonials.map(t => ({
        sys: { id: t.id },
        fields: {
          author: t.name,
          position: t.title,
          company: t.company,
          quote: t.testimonial,
          rating: t.rating,
          image: t.image_url ? {
            fields: {
              file: {
                url: t.image_url.replace('https:', ''),
              },
              title: t.name
            }
          } : undefined,
          visible: true
        }
      }))
    }
  };
}
