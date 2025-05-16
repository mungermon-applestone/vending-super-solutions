
import { Entry } from 'contentful';
import { CMSTestimonial } from '@/types/cms';

/**
 * Transform a Contentful testimonial entry to our internal format
 */
export function transformContentfulTestimonial(entry: Entry<any>): CMSTestimonial | null {
  if (!entry || !entry.fields) {
    console.warn('[transformContentfulTestimonial] Invalid testimonial entry:', entry);
    return null;
  }

  const { fields, sys } = entry;
  
  // Ensure image data is properly structured
  let imageUrl = null;
  if (fields.image && typeof fields.image === 'object' && fields.image.fields && 
      fields.image.fields.file && fields.image.fields.file.url) {
    imageUrl = `https:${fields.image.fields.file.url}`;
  }

  return {
    id: sys.id,
    quote: fields.quote || fields.testimonial || '',
    author: fields.author || fields.name || '',
    position: fields.position || fields.title || '',
    company: fields.company || '',
    rating: fields.rating || 5,
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
  
  // Sort by author name if available
  return validTestimonials.sort((a, b) => {
    if (!a.author) return 1;
    if (!b.author) return -1;
    return a.author.localeCompare(b.author);
  });
}
