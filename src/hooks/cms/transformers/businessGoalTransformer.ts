
import { Entry } from "contentful";
import { CMSBusinessGoal, CMSImage } from "@/types/cms";

// Interface for the structure of a Contentful Business Goal entry
export interface ContentfulBusinessGoal {
  fields: {
    title?: string;
    slug?: string;
    description?: string;
    icon?: string;
    benefits?: string[];
    image?: {
      sys?: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
          details?: {
            image?: {
              width?: number;
              height?: number;
            };
          };
        };
        title?: string;
      };
    };
    visible?: boolean;
    featured?: boolean;
    displayOrder?: number;
    sys?: {
      createdAt?: string;
      updatedAt?: string;
    };
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
  // Handle image transformation
  const image: CMSImage | undefined = entry.fields.image?.fields?.file?.url
    ? {
        id: entry.fields.image.sys?.id || "", // Ensure image has ID
        url: `https:${entry.fields.image.fields.file.url}`,
        alt: entry.fields.image.fields.title || "",
        width: entry.fields.image.fields.file.details?.image?.width || 0,
        height: entry.fields.image.fields.file.details?.image?.height || 0,
      }
    : undefined;

  // Return transformed business goal object
  return {
    id: entry.sys.id,
    title: entry.fields.title || "",
    slug: entry.fields.slug || "",
    description: entry.fields.description || "",
    icon: entry.fields.icon || "",
    benefits: entry.fields.benefits || [],
    image: image,
    visible: entry.fields.visible !== false, // Default to true if not specified
    featured: entry.fields.featured || false,
    displayOrder: entry.fields.displayOrder || 0,
    created_at: entry.sys.createdAt || "",
    updated_at: entry.sys.updatedAt || "",
  };
}
