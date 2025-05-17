
import { Entry } from 'contentful';
import { Testimonial } from '@/types/testimonial';
import { ContentfulTestimonial } from '@/types/contentful/testimonial';

/**
 * Transforms a Contentful Testimonial entry into the application's Testimonial format
 * 
 * @param entry - The Contentful entry containing testimonial data
 * @returns A Testimonial object
 */
export const transformTestimonial = (entry: Entry<any> | ContentfulTestimonial): Testimonial => {
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

  const fields = entry.fields;

  // Convert all field values to strings to satisfy TypeScript
  const name = String(fields.author || fields.name || 'Unknown');
  const quote = String(fields.quote || '');
  const company = String(fields.company || '');
  const position = String(fields.position || '');
  const rating = typeof fields.rating === 'number' ? fields.rating : 5;
  
  // Handle avatar more carefully
  let avatar = '';
  if (fields.image && 
      typeof fields.image === 'object' && 
      fields.image.fields && 
      typeof fields.image.fields === 'object' &&
      fields.image.fields.file && 
      typeof fields.image.fields.file === 'object' &&
      typeof fields.image.fields.file.url === 'string') {
    avatar = `https:${fields.image.fields.file.url}`;
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
export const transformTestimonials = (entries: Array<Entry<any> | ContentfulTestimonial>): Testimonial[] => {
  if (!entries || !Array.isArray(entries)) {
    return [];
  }
  
  return entries
    .filter(entry => entry && entry.fields)
    .map(transformTestimonial);
};
