
import { Entry } from 'contentful';
import { Testimonial } from '@/types/testimonial';

/**
 * Transforms a Contentful Testimonial entry into the application's Testimonial format
 * 
 * @param entry - The Contentful entry containing testimonial data
 * @returns A Testimonial object
 */
export const transformTestimonial = (entry: Entry<any>): Testimonial => {
  if (!entry || !entry.fields) {
    console.warn('Received invalid testimonial entry:', entry);
    return {
      id: 'invalid-entry',
      name: 'Unknown',
      quote: 'No testimonial content available',
      company: '',
      position: '',
      avatar: ''
    };
  }

  return {
    id: entry.sys?.id || 'unknown-id',
    name: entry.fields.name || 'Unknown',
    quote: entry.fields.quote || '',
    company: entry.fields.company || '',
    position: entry.fields.position || '',
    avatar: entry.fields.avatar?.fields?.file?.url ? `https:${entry.fields.avatar.fields.file.url}` : '',
  };
};

/**
 * Transforms an array of Contentful Testimonial entries into an array of Testimonials
 * 
 * @param entries - Array of Contentful entries
 * @returns Array of Testimonial objects
 */
export const transformTestimonials = (entries: Entry<any>[]): Testimonial[] => {
  if (!entries || !Array.isArray(entries)) {
    return [];
  }
  
  return entries
    .filter(entry => entry && entry.fields)
    .map(transformTestimonial);
};
