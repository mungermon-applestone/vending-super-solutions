
import { CMSTestimonial, ContentfulTestimonialSection } from '@/types/cms';

// This is a compatibility interface to ensure existing code works with new types
export interface ContentfulTestimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  testimonial: string;
  rating?: number;
  image_url?: string;
}

// For backward compatibility - maps the array of testimonials to the section format
export function convertTestimonialsToSection(testimonials: Array<any>): ContentfulTestimonialSection {
  return {
    title: 'What Our Customers Say',
    subtitle: 'Read testimonials from our satisfied clients',
    testimonials: testimonials.map(t => ({
      id: t.id || '',
      name: t.name || '',
      title: t.title || '',
      company: t.company || '',
      testimonial: t.testimonial || '',
      rating: t.rating,
      image_url: t.image_url
    })),
    displayStyle: 'cards'
  };
}
