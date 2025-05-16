
import { Entry } from 'contentful';
import { CMSTestimonial } from '@/types/cms';

/**
 * Transform a Contentful testimonial entry to our internal format
 * with improved type handling and error checks
 */
export function transformContentfulTestimonial(entry: Entry<any>): CMSTestimonial | null {
  if (!entry || !entry.fields) {
    console.warn('[transformContentfulTestimonial] Invalid testimonial entry:', entry);
    return null;
  }

  const { fields, sys } = entry;
  
  // Debug the entry structure
  console.log('[transformContentfulTestimonial] Processing entry:', {
    id: sys?.id,
    fieldKeys: Object.keys(fields),
    quoteExists: 'quote' in fields,
    testimonialExists: 'testimonial' in fields,
    imageType: fields.image ? typeof fields.image : 'none'
  });
  
  // Ensure image data is properly structured
  let imageUrl = null;
  if (fields.image && 
      typeof fields.image === 'object' && 
      fields.image.fields && 
      fields.image.fields.file && 
      fields.image.fields.file.url) {
    imageUrl = `https:${fields.image.fields.file.url}`;
  }

  // Extract values with proper type handling
  const quote = typeof fields.quote === 'string' 
    ? fields.quote 
    : (typeof fields.testimonial === 'string' ? fields.testimonial : '');
    
  const author = typeof fields.author === 'string' 
    ? fields.author 
    : (typeof fields.name === 'string' ? fields.name : '');
    
  const position = typeof fields.position === 'string' 
    ? fields.position 
    : (typeof fields.title === 'string' ? fields.title : '');
    
  const company = typeof fields.company === 'string' ? fields.company : '';
  
  const rating = typeof fields.rating === 'number' 
    ? fields.rating 
    : (typeof fields.rating === 'string' ? parseInt(fields.rating, 10) : 5);

  return {
    id: sys.id,
    quote,
    author,
    position,
    company,
    rating: isNaN(rating) ? 5 : rating,
    image_url: imageUrl
  };
}

/**
 * Apply additional transformations to testimonials if needed
 * (e.g., sorting, filtering, etc.)
 */
export function transformTestimonials(testimonials: CMSTestimonial[]): CMSTestimonial[] {
  // Filter out any null entries
  const validTestimonials = testimonials.filter(t => t !== null);
  
  console.log(`[transformTestimonials] Processing ${validTestimonials.length} testimonials`);
  
  // Sort by author name if available
  return validTestimonials.sort((a, b) => {
    if (!a.author) return 1;
    if (!b.author) return -1;
    return a.author.localeCompare(b.author);
  });
}
