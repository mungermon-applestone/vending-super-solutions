
import { Entry } from 'contentful';
import { Testimonial } from '@/types/contentful';

/**
 * Transform a Contentful testimonial entry to our application's Testimonial type
 */
export function transformContentfulTestimonial(entry: Entry<any>): Testimonial {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: fields.author || 'Anonymous',
    title: fields.position || '',
    company: fields.company || '',
    testimonial: fields.quote || '',
    image_url: fields.image?.fields?.file?.url 
      ? `https:${fields.image.fields.file.url}` 
      : undefined,
    rating: fields.rating || 5,
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
