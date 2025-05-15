
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
  created_at: string;
  updated_at: string;
}

// Testimonial type
export interface CMSTestimonial {
  id: string;
  name: string;
  role?: string; 
  company?: string;
  quote: string;
  rating?: number;
  image?: CMSImage;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// Query options type for consistent filtering
export interface QueryOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Blog Post related types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: any; // Rich text content
  author?: string;
  publishedDate?: string;
  published_at?: string;
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
