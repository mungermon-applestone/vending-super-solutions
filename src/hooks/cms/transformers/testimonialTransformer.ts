
import { Entry, Asset } from 'contentful';
import { Testimonial } from '@/types/cms';

/**
 * Safely access nested Contentful fields
 */
const getField = <T>(entry: any, fieldPath: string, defaultValue: T): T => {
  try {
    const paths = fieldPath.split('.');
    let value = entry?.fields;
    
    for (const path of paths) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path];
      } else {
        return defaultValue;
      }
    }
    
    return value !== undefined && value !== null ? value : defaultValue;
  } catch (e) {
    console.error(`Error accessing field ${fieldPath}:`, e);
    return defaultValue;
  }
};

/**
 * Transform a Contentful testimonial entry to our application's Testimonial type
 */
export function transformContentfulTestimonial(entry: Entry<any>): Testimonial {
  // Get image URL if present
  let imageUrl: string | undefined = undefined;
  const image = getField<any>(entry, 'image', null);
  
  if (image && image.fields && image.fields.file && image.fields.file.url) {
    imageUrl = `https:${image.fields.file.url}`;
  }
  
  return {
    id: entry.sys.id,
    quote: getField(entry, 'quote', ''),
    author: getField(entry, 'author', ''),
    company: getField(entry, 'company', ''),
    position: getField(entry, 'position', ''),
    image_url: imageUrl,
    visible: getField(entry, 'visible', true),
  };
}
