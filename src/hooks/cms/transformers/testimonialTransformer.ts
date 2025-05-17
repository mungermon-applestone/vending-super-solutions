
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
  const name = String(entry.fields.name || 'Unknown');
  const quote = String(entry.fields.quote || '');
  const company = String(entry.fields.company || '');
  const position = String(entry.fields.position || '');
  
  // Handle avatar more carefully
  let avatar = '';
  if (entry.fields.avatar && 
      typeof entry.fields.avatar === 'object' && 
      entry.fields.avatar.fields && 
      typeof entry.fields.avatar.fields === 'object' &&
      entry.fields.avatar.fields.file && 
      typeof entry.fields.avatar.fields.file === 'object' &&
      typeof entry.fields.avatar.fields.file.url === 'string') {
    avatar = `https:${entry.fields.avatar.fields.file.url}`;
  }

  return {
    id: entry.sys?.id || 'unknown-id',
    name,
    quote,
    company,
    position,
    avatar
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
