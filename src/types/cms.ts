export interface CMSImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  created_at?: string;
  updated_at?: string;
}

export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  features?: string[];
  images?: CMSImage[];
  product_types?: CMSProductType[];
  created_at?: string;
  updated_at?: string;
}

export interface CMSTestimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  testimonial: string;
  image_url?: string;
  rating: number;
  created_at?: string;
  updated_at?: string;
}

export interface CMSBusinessGoal {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

// Technology types
export interface CMSTechnology {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
  sections?: CMSTechnologySection[];
}

export interface CMSTechnologySection {
  id: string;
  technology_id: string;
  section_type: string;
  title: string;
  description?: string;
  display_order: number;
  features?: CMSTechnologyFeature[];
  images?: CMSTechnologyImage[];
}

export interface CMSTechnologyFeature {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  icon?: string;
  display_order: number;
  items?: CMSTechnologyFeatureItem[];
}

export interface CMSTechnologyFeatureItem {
  id: string;
  feature_id: string;
  text: string;
  display_order: number;
}

export interface CMSTechnologyImage {
  id: string;
  technology_id: string;
  section_id?: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  display_order: number;
}
