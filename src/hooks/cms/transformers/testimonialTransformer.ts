
import { Entry, Asset } from 'contentful';
import { CMSTestimonial } from '@/types/cms';

/**
 * Transform a Contentful testimonial entry to our application's Testimonial type
 */
export function transformContentfulTestimonial(entry: Entry<any>): CMSTestimonial {
  const fields = entry.fields;
  
  // Handle potential type issues with fields
  const getFieldValue = (field: any): string => {
    if (field === undefined || field === null) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field.toString) return field.toString();
    return '';
  };

  // Get image URL with proper type checking
  const getImageUrl = (image: any): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'object' && image.fields && image.fields.file && image.fields.file.url) {
      return `https:${image.fields.file.url}`;
    }
    return undefined;
  };

  return {
    id: entry.sys.id,
    name: getFieldValue(fields.author) || 'Anonymous',
    title: getFieldValue(fields.position) || '',
    company: getFieldValue(fields.company) || '',
    testimonial: getFieldValue(fields.quote) || '',
    image_url: getImageUrl(fields.image),
    rating: typeof fields.rating === 'number' ? fields.rating : 5,
  };
}

/**
 * Transform a Contentful asset to a URL string
 */
export function transformContentfulAsset(asset: any | undefined): string | undefined {
  if (!asset || !asset.fields || !asset.fields.file || !asset.fields.file.url) {
    return undefined;
  }
  
  return `https:${asset.fields.file.url}`;
}
