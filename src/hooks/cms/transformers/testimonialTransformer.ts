
import { Entry, Asset } from 'contentful';
import { CMSTestimonial } from '@/types/cms';

interface AssetDetails {
  url: string;
  fileName?: string;
  contentType?: string;
  details?: {
    size?: number;
    image?: {
      width?: number;
      height?: number;
    };
  };
}

interface AssetFile {
  url: string;
  details?: {
    size?: number;
    image?: {
      width?: number;
      height?: number;
    };
  };
  fileName?: string;
  contentType?: string;
}

/**
 * Transform Contentful asset to URL
 */
export function transformContentfulAsset(asset: Asset | undefined): string {
  if (!asset || !asset.fields || !asset.fields.file) {
    return '';
  }
  
  const file = asset.fields.file;
  let fileUrl = '';
  
  if (typeof file === 'string') {
    fileUrl = file;
  } else if (typeof file.url === 'string') {
    fileUrl = file.url;
  }
  
  // Make sure URLs are absolute
  if (fileUrl && typeof fileUrl === 'string' && fileUrl.startsWith('//')) {
    return `https:${fileUrl}`;
  }
  
  return fileUrl;
}

/**
 * Transform a Contentful testimonial entry to our application's CMSTestimonial type
 */
export function transformContentfulTestimonial(entry: Entry<any>): CMSTestimonial {
  const fields = entry.fields;
  
  const testimonial: CMSTestimonial = {
    id: entry.sys.id,
    quote: fields.quote || '',
    author: fields.author || 'Anonymous',
    company: fields.company || undefined,
    position: fields.position || undefined,
    avatar_url: fields.avatar ? transformContentfulAsset(fields.avatar) : undefined,
    logo_url: fields.companyLogo ? transformContentfulAsset(fields.companyLogo) : undefined,
  };
  
  return testimonial;
}
