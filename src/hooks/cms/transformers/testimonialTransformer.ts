
import { Asset } from "contentful";
import { CMSTestimonial, CMSImage } from "@/types/cms";

// Interface for the structure of a Contentful Testimonial entry
export interface ContentfulTestimonial {
  fields: {
    name: string;
    position?: string;
    company?: string;
    quote: string;
    rating?: number;
    image?: Asset;
    visible?: boolean;
  };
  sys: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Transform a contentful asset to our internal CMSImage format
 * @param asset Contentful asset
 * @returns Standardized CMSImage object
 */
export function transformContentfulAsset(asset?: Asset): CMSImage | undefined {
  if (!asset?.fields?.file?.url) return undefined;

  return {
    id: asset.sys?.id || "",
    url: asset.fields.file.url.startsWith('//') ? `https:${asset.fields.file.url}` : asset.fields.file.url,
    alt: asset.fields.title || "",
    width: asset.fields.file.details?.image?.width || 0,
    height: asset.fields.file.details?.image?.height || 0,
  };
}

/**
 * Transform a Contentful Testimonial entry to our internal CMSTestimonial format
 * @param entry Contentful Testimonial entry
 * @returns Standardized CMSTestimonial object
 */
export function transformTestimonial(entry: ContentfulTestimonial): CMSTestimonial {
  return {
    id: entry.sys.id,
    name: entry.fields.name || "",
    position: entry.fields.position,
    company: entry.fields.company,
    quote: entry.fields.quote || "",
    rating: entry.fields.rating,
    image: transformContentfulAsset(entry.fields.image),
    visible: entry.fields.visible !== false,
    createdAt: entry.sys.createdAt || "",
    updatedAt: entry.sys.updatedAt || "",
  };
}
