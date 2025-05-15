
import { Asset, Entry } from "contentful";
import { CMSBusinessGoal, CMSImage } from "@/types/cms";

// Interface for the structure of a Contentful Business Goal entry
export interface ContentfulBusinessGoal {
  fields: {
    title?: string;
    slug?: string;
    description?: string;
    icon?: string;
    benefits?: string[];
    image?: Asset;
    visible?: boolean;
    displayOrder?: number;
  };
  sys: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Transform a Contentful asset to a CMSImage
 */
export function transformContentfulAsset(asset: any | undefined): CMSImage | undefined {
  if (!asset || !asset.fields || !asset.fields.file || !asset.fields.file.url) {
    return undefined;
  }
  
  return {
    id: asset.sys?.id || '',
    url: `https:${asset.fields.file.url}`,
    alt: asset.fields.title || '',
    width: asset.fields.file.details?.image?.width,
    height: asset.fields.file.details?.image?.height
  };
}

/**
 * Transform a Contentful Business Goal entry to our internal CMSBusinessGoal format
 * @param entry Contentful Business Goal entry
 * @returns Standardized CMSBusinessGoal object
 */
export function transformBusinessGoal(entry: ContentfulBusinessGoal): CMSBusinessGoal {
  return {
    id: entry.sys.id,
    title: entry.fields.title || "",
    slug: entry.fields.slug || "",
    description: entry.fields.description || "",
    icon: entry.fields.icon || "",
    benefits: entry.fields.benefits || [],
    image: transformContentfulAsset(entry.fields.image),
    visible: entry.fields.visible !== false, // Default to true if not specified
    displayOrder: entry.fields.displayOrder || 0,
    features: [],
    created_at: entry.sys.createdAt || "",
    updated_at: entry.sys.updatedAt || "",
  };
}
