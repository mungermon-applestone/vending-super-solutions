
import { Entry, Asset } from 'contentful';
import { CMSTestimonial } from '@/types/cms';

/**
 * Transform a Contentful testimonial entry to our application's Testimonial type
 */
export function transformContentfulTestimonial(entry: Entry<any>): CMSTestimonial {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: fields.author?.toString() || 'Anonymous',
    title: fields.position?.toString() || '',
    company: fields.company?.toString() || '',
    testimonial: fields.quote?.toString() || '',
    image_url: fields.image?.fields?.file?.url 
      ? `https:${fields.image.fields.file.url}` 
      : undefined,
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
