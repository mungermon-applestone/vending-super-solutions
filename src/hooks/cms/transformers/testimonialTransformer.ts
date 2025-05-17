
import { Entry } from 'contentful';
import { Testimonial } from '@/types/testimonial';
import { ContentfulTestimonial } from '@/types/contentful/testimonial';
import { 
  getStringField, 
  getNumberField,
  getEntryId,
  getAssetUrl
} from '@/utils/contentful/dataExtractors';

/**
 * Transforms a Contentful Testimonial entry into the application's Testimonial format
 * 
 * @param entry - The Contentful entry containing testimonial data
 * @returns A Testimonial object
 */
export const transformTestimonial = (entry: Entry<any> | ContentfulTestimonial): Testimonial => {
  if (!entry) {
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

  // Use our helper functions to safely extract values
  const name = getStringField(entry, 'author', 'Unknown');
  const quote = getStringField(entry, 'quote', '');
  const company = getStringField(entry, 'company', '');
  const position = getStringField(entry, 'position', '');
  const rating = getNumberField(entry, 'rating', 5);
  
  // Handle avatar with our asset helper
  let avatar = '';
  const image = entry.fields?.image;
  if (image) {
    avatar = getAssetUrl(image, '');
  }

  return {
    id: getEntryId(entry, 'unknown-id'),
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
