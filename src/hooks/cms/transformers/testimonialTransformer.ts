
import { ContentfulEntry } from '@/types/cms';

export interface ContentfulTestimonial {
  sys: {
    id: string;
  };
  fields: {
    image?: any;
    quote?: string;
    author?: string;
    position?: string;
    company?: string;
    rating?: number;
  };
}

export interface ContentfulTestimonialSection {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    subtitle: string;
    testimonials: ContentfulTestimonial[];
    pageKey: string;
  };
}

export function transformContentfulTestimonial(entry: ContentfulEntry) {
  const fields = entry.fields || {};
  
  return {
    id: entry.sys?.id || 'unknown',
    image: fields.image || null,
    quote: fields.quote || '',
    author: fields.author || '',
    position: fields.position || '',
    company: fields.company || '',
    rating: fields.rating || 5
  };
}

export function transformTestimonials(testimonials: any[]) {
  if (!testimonials || !Array.isArray(testimonials)) {
    return [];
  }
  
  return testimonials.map(testimonial => ({
    id: testimonial.id || 'unknown',
    quote: testimonial.quote || '',
    author: testimonial.author || '',
    position: testimonial.position || '',
    company: testimonial.company || '',
    rating: testimonial.rating || 5,
    image: testimonial.image || null
  }));
}
