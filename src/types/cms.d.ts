
// Common CMS types used throughout the application

/**
 * Shared image type used across all content types
 */
export interface CMSImage {
  id?: string;
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
  title: string;
  name?: string; // Some components use name, some use title
  slug: string;
  description: string;
  shortDescription?: string;
  type: string;
  mainImage?: CMSImage;
  thumbnail?: CMSImage;
  images?: CMSImage[];
  features?: string[];
  specs?: Record<string, string>;
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
  icon?: string;
  benefits?: string[];
  features?: {
    id?: string;
    title: string;
    description: string;
    icon?: string;
    screenshot?: CMSImage;
  }[];
  visible?: boolean;
  video?: {
    id?: string;
    url: string | null;
    title?: string;
  };
  recommendedMachines?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: {
      url: string;
      alt?: string;
    };
  }[];
  displayOrder?: number;
  showOnHomepage?: boolean;
  homepageOrder?: number;
}

/**
 * Product type used across the application
 */
export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  thumbnail?: CMSImage;
  benefits?: string[];
  features?: {
    id?: string;
    title: string;
    description: string;
    icon?: string;
    screenshot?: CMSImage;
  }[];
  examples?: {
    id?: string;
    title: string;
    description: string;
    image: CMSImage;
    results?: string[];
  }[];
  video?: {
    title: string;
    description: string;
    thumbnailImage: CMSImage;
    url?: string;
    youtubeId?: string;
  };
  visible?: boolean;
  displayOrder?: number;
  showOnHomepage?: boolean;
  homepageOrder?: number;
  recommendedMachines?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: {
      url: string;
      alt?: string;
    };
    thumbnail?: {
      url: string;
      alt?: string;
    };
  }[];
}

/**
 * Standard query options interface for CMS operations
 */
export interface QueryOptions {
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
  exactMatch?: boolean;
}
