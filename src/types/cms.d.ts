
// Common CMS Types
// These types represent the internal format used throughout the application

// Base image type used across all CMS entities
export interface CMSImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

// Business Goal type
export interface CMSBusinessGoal {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  benefits: string[];
  image?: CMSImage;
  visible: boolean;
  featured: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

// Machine type
export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  type: "vending" | "locker";
  description?: string;
  shortDescription?: string;
  temperature?: string;
  features: string[];
  images: CMSImage[];
  specs?: {
    width?: number;
    height?: number;
    depth?: number;
    weight?: number;
    capacity?: number;
    power?: string;
  };
  visible: boolean;
  featured: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

// Technology type
export interface CMSTechnology {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: CMSImage;
  logo?: CMSImage;
  visible: boolean;
  featured: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

// Product type
export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: CMSImage;
  visible: boolean;
  featured: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

// Testimonial type
export interface CMSTestimonial {
  id: string;
  author: string;
  position?: string;
  company?: string;
  quote: string;
  rating?: number;
  image?: CMSImage;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// Blog Post types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  author?: string;
  publishedDate?: string;
  category?: string;
  tags?: string[];
  image?: CMSImage;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

// Adjacent post (simplified version of BlogPost for previous/next navigation)
export interface AdjacentPost {
  id: string;
  title: string;
  slug: string;
  image?: CMSImage;
}
