
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

  // Use TypeScript type guards to ensure properties exist
  const name = typeof fields.author === 'string' ? fields.author : 
               (typeof fields.name === 'string' ? fields.name : 'Unknown');
  
  const quote = typeof fields.quote === 'string' ? fields.quote : '';
  const company = typeof fields.company === 'string' ? fields.company : '';
  const position = typeof fields.position === 'string' ? fields.position : '';
  const rating = typeof fields.rating === 'number' ? fields.rating : 5;
  
  // Handle avatar more carefully with proper type guards
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
    console.warn('Received invalid testimonials entries:', entries);
    return [];
  }
  
  return entries
    .filter(entry => entry && entry.fields)
    .map(transformTestimonial);
};
