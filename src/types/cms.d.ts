export interface CMSImage {
  id: string;
  url: string;
  alt?: string;
}

export interface CMSTechnologyFeature {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  icon?: string;
  display_order: number;
  image?: CMSImage;
}

export interface CMSTechnologySection {
  id: string;
  technology_id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  section_type?: string;
  display_order: number;
  features: CMSTechnologyFeature[];
  images?: CMSImage[];
  bulletPoints?: string[];
  image?: CMSImage;
  sectionImage?: CMSImage;
}

export interface CMSTechnology {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  sections?: CMSTechnologySection[];
  visible?: boolean;
  image?: CMSImage;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface BusinessGoal {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  icon?: string;
  visible: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  visible: boolean;
  image?: CMSImage;
}

export interface LandingPage {
  id: string;
  key: string;
  content: string;
}

export interface Machine {
  id: string;
  title: string;
  slug: string;
  description: string;
  product_types: string[];
  business_goals: string[];
  visible: boolean;
  image?: CMSImage;
}

export interface ProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  visible: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: CMSImage;
}

export interface QueryOptions {
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  pageSize?: number;
}
