
import { Asset, Entry } from 'contentful';

// Basic CMS types
export interface CMSItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  author?: string;
  published_date?: string;
  featured_image?: string;
  status?: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
}

export interface AdjacentPost {
  id: string;
  title: string;
  slug: string;
}

// Image type for consistent image handling
export interface CMSImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// Technology types
export interface CMSTechnology extends CMSItem {
  image_url?: string;
  image_alt?: string;
  content?: string;
  visible: boolean;
}

// Testimonial types
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company?: string;
  position?: string;
  image_url?: string;
  visible?: boolean;
}

// Business Goal types
export interface CMSBusinessGoal extends CMSItem {
  icon?: string;
  benefits?: CMSBusinessGoalBenefit[];
  features?: CMSBusinessGoalFeature[];
}

export interface CMSBusinessGoalBenefit {
  id: string;
  text: string;
}

export interface CMSBusinessGoalFeature {
  id: string;
  title: string;
  description?: string;
  images?: CMSImage[];
}

// Contentful specific types for transformers
export interface ContentfulAsset {
  fields: {
    file?: {
      url?: string;
      details?: {
        image?: {
          width?: number;
          height?: number;
        }
      }
    };
    title?: string;
    description?: string;
  };
}
