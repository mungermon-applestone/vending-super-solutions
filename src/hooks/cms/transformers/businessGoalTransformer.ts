
import { Asset, Entry } from "contentful";
import { CMSBusinessGoal, CMSImage } from "@/types/cms";
import { transformContentfulAsset } from "./testimonialTransformer";

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
    createdAt: entry.sys.createdAt || "",
    updatedAt: entry.sys.updatedAt || "",
  };
}
