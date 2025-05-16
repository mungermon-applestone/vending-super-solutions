
import { Entry } from 'contentful';
import { CMSTestimonial } from '@/types/cms';

/**
 * Transform a Contentful testimonial entry to our internal format
 */
export function transformContentfulTestimonial(entry: Entry<any>): any {
  if (!entry || !entry.fields) {
    console.warn('[transformContentfulTestimonial] Invalid testimonial entry:', entry);
    return null;
  }

  const { fields, sys } = entry;

  return {
    id: sys.id,
    quote: fields.quote || fields.testimonial || '',
    author: fields.author || fields.name || '',
    position: fields.position || fields.title || '',
    company: fields.company || '',
    rating: fields.rating || 5,
    image: fields.image?.fields?.file?.url ? `https:${fields.image.fields.file.url}` : null
  };
}

/**
 * Apply additional transformations to testimonials if needed
 * (e.g., sorting, filtering, etc.)
 */
export function transformTestimonials(testimonials: any[]): any[] {
  // Filter out any null entries
  const validTestimonials = testimonials.filter(t => t !== null);
  
  // Sort by author name if available
  return validTestimonials.sort((a, b) => {
    if (!a.author) return 1;
    if (!b.author) return -1;
    return a.author.localeCompare(b.author);
  });
}
