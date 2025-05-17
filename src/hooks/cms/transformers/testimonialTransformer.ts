
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
  const name = typeof fields.author === 'string' ? fields.author : 'Unknown';
  const quote = typeof fields.quote === 'string' ? fields.quote : '';
  const company = typeof fields.company === 'string' ? fields.company : '';
  const position = typeof fields.position === 'string' ? fields.position : '';
  const rating = typeof fields.rating === 'number' ? fields.rating : 5;
  
  // Handle avatar more carefully
  let avatar = '';
  
  // Check if image exists and has the expected structure
  if (fields.image && typeof fields.image === 'object') {
    // Handle Asset with sys and fields structure
    if ('fields' in fields.image && fields.image.fields) {
      const imageFields = fields.image.fields;
      
      // Check if file exists and has url
      if (imageFields.file && typeof imageFields.file === 'object' && 
          'url' in imageFields.file && typeof imageFields.file.url === 'string') {
        avatar = `https:${imageFields.file.url}`;
      }
    }
    // Handle direct url field (simplified structure)
    else if ('url' in fields.image && typeof fields.image.url === 'string') {
      avatar = fields.image.url.startsWith('http') 
        ? fields.image.url 
        : `https:${fields.image.url}`;
    }
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
