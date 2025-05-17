
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

  // Convert all field values to strings to satisfy TypeScript
  const name = String(entry.fields.author || 'Unknown');
  const quote = String(entry.fields.quote || '');
  const company = String(entry.fields.company || '');
  const position = String(entry.fields.position || '');
  const rating = typeof entry.fields.rating === 'number' ? entry.fields.rating : 5;
  
  // Handle avatar more carefully
  let avatar = '';
  if (entry.fields.image && 
      typeof entry.fields.image === 'object' && 
      entry.fields.image.fields && 
      typeof entry.fields.image.fields === 'object' &&
      entry.fields.image.fields.file && 
      typeof entry.fields.image.fields.file === 'object' &&
      typeof entry.fields.image.fields.file.url === 'string') {
    avatar = `https:${entry.fields.image.fields.file.url}`;
  }

  return {
    id: entry.sys?.id || 'unknown-id',
    name,
    quote,
    company,
    position,
    avatar,
    rating
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
