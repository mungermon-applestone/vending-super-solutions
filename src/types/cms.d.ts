
/**
 * CMS Types
 */

// Common CMS types
export interface CMSBase {
  id: string;
  title: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

// Product Types
export interface CMSProductType extends CMSBase {
  description: string;
  features?: ProductFeature[];
  image_url?: string;
  image_alt?: string;
  technical_details?: string;
  active: boolean;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon?: string;
}

// Business Goals
export interface CMSBusinessGoal extends CMSBase {
  description: string;
  icon?: string;
  image_url?: string;
  image_alt?: string;
  benefits?: string[];
  related_technologies?: CMSTechnology[];
  metadata?: Record<string, any>;
}

// Technology
export interface CMSTechnology extends CMSBase {
  description: string;
  image_url?: string;
  image_alt?: string;
  sections?: TechnologySection[];
  related_business_goals?: CMSBusinessGoal[];
  metadata?: Record<string, any>;
}

export interface TechnologySection {
  title: string;
  content?: string;
  features?: TechnologyFeature[];
  display_order?: number;
}

export interface TechnologyFeature {
  title: string;
  description?: string;
  icon?: string;
  items?: TechnologyFeatureItem[];
  display_order?: number;
}

export interface TechnologyFeatureItem {
  text: string;
  display_order?: number;
}

// Machine
export interface CMSMachine extends CMSBase {
  description: string;
  type: string;
  temperature: string;
  images?: MachineImage[];
  specs?: Record<string, any>;
  features?: MachineFeature[];
  deploymentExamples?: DeploymentExample[];
}

export interface MachineImage {
  url: string;
  alt?: string;
  is_primary?: boolean;
}

export interface MachineFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface DeploymentExample {
  title: string;
  description: string;
  image_url?: string;
}

// Testimonials
export interface CMSTestimonial {
  id: string;
  quote: string;
  author: string;
  company?: string;
  position?: string;
  avatar_url?: string;
  logo_url?: string;
}

// Case Studies
export interface CMSCaseStudy extends CMSBase {
  summary: string;
  content: string;
  solution?: string;
  industry?: string;
  image_url?: string;
  image_alt?: string;
  visible: boolean;
  results: CaseStudyResult[];
  testimonial?: CMSTestimonial;
}

export interface CaseStudyResult {
  text: string;
}

// Blog Posts
export interface BlogPost extends CMSBase {
  author: string;
  summary: string;
  content: string;
  status: 'draft' | 'published';
  featured_image?: string;
  published_date?: string;
  tags?: string[];
  category?: string;
  reading_time?: number;
}

export interface AdjacentPost {
  id: string;
  title: string;
  slug: string;
}
