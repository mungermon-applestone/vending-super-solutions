
// Common CMS types used throughout the application

/**
 * Shared image type used across all content types
 */
export interface CMSImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Machine type used across the application
 * This serves as our unified interface regardless of CMS source
 */
export interface CMSMachine {
  id: string;
  contentType: string;
  title: string;
  name?: string; // Some places use name, others use title
  slug: string;
  description: string;
  shortDescription?: string;
  type: string;
  mainImage?: CMSImage;
  thumbnail?: CMSImage;
  images: CMSImage[];
  features: string[];
  featureObjects?: Array<{
    name: string;
    description: string;
    icon?: string;
  }>;
  specs: Record<string, string>;
  specifications?: Array<{
    name: string;
    value: string | number;
    unit?: string;
    category?: string;
  }>;
  featured?: boolean;
  displayOrder?: number;
  temperature?: string;
  deploymentExamples?: Array<{
    title: string;
    description?: string;
    image?: CMSImage;
  }>;
  createdAt?: string;
  updatedAt?: string;
  visible?: boolean;
}

/**
 * Technology type used across the application
 */
export interface CMSTechnology {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  features?: string[];
}

/**
 * Business Goal type used across the application
 */
export interface CMSBusinessGoal {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  benefits?: string[];
}

/**
 * Product type used across the application
 */
export interface CMSProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  features?: string[];
}
