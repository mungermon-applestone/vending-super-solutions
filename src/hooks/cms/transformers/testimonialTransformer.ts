
import { ContentfulTestimonial } from '@/types/contentful/testimonial';
import { CMSTestimonial } from '@/types/cms';

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
  if (!testimonial || !testimonial.sys || !testimonial.fields) {
    console.warn('Invalid testimonial data received', testimonial);
    return {
      id: 'invalid-testimonial',
      quote: 'Missing testimonial data',
      author: 'Unknown',
      rating: 0
    };
  }

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

// Convert TransformedTestimonial to CMSTestimonial format
export function transformToCMSTestimonial(testimonial: TransformedTestimonial): CMSTestimonial {
  return {
    id: testimonial.id,
    name: testimonial.author,
    title: testimonial.position || '',
    company: testimonial.company || '',
    testimonial: testimonial.quote,
    image_url: testimonial.imageUrl,
    rating: testimonial.rating || 5
  };
}

// Helper function to transform an array of testimonials
export function transformTestimonials(testimonials: TransformedTestimonial[]): CMSTestimonial[] {
  if (!testimonials || !Array.isArray(testimonials)) {
    console.warn('Invalid testimonials array', testimonials);
    return [];
  }
  
  return testimonials.map(transformToCMSTestimonial);
}
