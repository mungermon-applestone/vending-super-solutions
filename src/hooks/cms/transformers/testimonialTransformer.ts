
import { ContentfulTestimonial } from '@/types/contentful/testimonial';

export interface TransformedTestimonial {
  id: string;
  quote: string;
  author: string;
  position?: string;
  company?: string;
  rating?: number;
  imageUrl?: string;
}

export function transformContentfulTestimonial(testimonial: ContentfulTestimonial): TransformedTestimonial {
  const fields = testimonial.fields || {};
  const image = fields.image?.fields?.file?.url;
  
  return {
    id: testimonial.sys?.id || 'unknown-id',
    quote: fields.quote || 'No quote provided',
    author: fields.author || 'Anonymous',
    position: fields.position,
    company: fields.company,
    rating: fields.rating || 5,
    imageUrl: image ? `https:${image}` : undefined,
  };
}
