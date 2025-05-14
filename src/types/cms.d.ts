
// Only adding the missing type
export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  type: "vending" | "locker";  // Fixed to only allow specific values
  description?: string;
  shortDescription?: string;
  temperature?: 'ambient' | 'refrigerated' | 'frozen' | 'heated';
  mainImage?: CMSImage; 
  thumbnail?: CMSImage;
  images?: CMSImage[];
  features?: string[];
  specs?: Record<string, string>;
  visible?: boolean;
  featured?: boolean;
  displayOrder?: number;
  // Support both naming conventions
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string; // For backwards compatibility with some components
  showOnHomepage?: boolean;
  homepageOrder?: number | null;
}

export interface CMSImage {
  id?: string;
  url: string;
  alt?: string;
  filename?: string;
  width?: number;
  height?: number;
}

export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: CMSImage;
  displayOrder?: number;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSFeature {
  title: string;
  description: string;
  icon?: string;
  screenshot?: CMSImage;
}

export interface CMSBusinessGoal {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: CMSImage;
  benefits?: string[];
  features?: CMSFeature[];
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSTechnology {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: CMSImage;
  sections?: any[];
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryOptions {
  limit?: number;
  skip?: number;
  order?: string;
  filters?: Record<string, any>;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  testimonial: string;
  rating?: number;
  image_url?: string;
}

// Interface for a blog post
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  featuredImage?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  author?: string;
  tags?: string[];
  sys?: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  };
  fields?: any;
}

// Type for adjacent blog posts (prev/next)
export interface AdjacentPost {
  slug: string; 
  title: string;
}
