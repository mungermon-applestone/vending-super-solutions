
// Common CMS Types - Contentful-only implementation
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
  features?: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

// Testimonial type
export interface CMSTestimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  quote: string;
  rating?: number;
  image?: CMSImage;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog Post types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: any; // Rich text content
  author?: string;
  publishedDate?: string;
  category?: string;
  tags?: string[];
  image?: CMSImage;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// Adjacent post (simplified version of BlogPost for previous/next navigation)
export interface AdjacentPost {
  id: string;
  title: string;
  slug: string;
  image?: CMSImage;
}

// Query options type for consistent filtering
export interface QueryOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
