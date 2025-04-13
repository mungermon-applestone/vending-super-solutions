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
  benefits?: string[];
  features?: CMSFeature[];
  examples?: CMSExample[];
  video?: {
    title: string;
    description: string;
    thumbnailImage: CMSImage;
    url?: string;
  };
  visible?: boolean;
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
  temperature?: string;
  specs?: Record<string, string>;
  deploymentExamples?: CMSDeploymentExample[];
  visible?: boolean;
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
  icon?: string;
  image?: CMSImage;
  benefits?: string[];
  features?: CMSFeature[];
  caseStudies?: CMSExample[];
}

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
  features?: CMSTechnologyFeature[];
  image?: CMSImage | string;
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

export interface CMSFeature {
  id?: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  screenshot?: CMSImage;
  screenshotUrl?: string;
  screenshotAlt?: string;
  display_order?: number;
}

export interface CMSExample {
  id?: string;
  title: string;
  description: string;
  image: CMSImage;
  slug?: string;
  results?: string[];
  display_order?: number;
}

export interface CMSDeploymentExample {
  id?: string;
  title: string;
  description: string;
  image: CMSImage;
  display_order?: number;
}

export interface CMSCaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  industry?: string;
  image_url?: string;
  image_alt?: string;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
  results?: CMSCaseStudyResult[];
  testimonial?: CMSCaseStudyTestimonial;
}

export interface CMSCaseStudyResult {
  id: string;
  case_study_id: string;
  text: string;
  display_order: number;
}

export interface CMSCaseStudyTestimonial {
  id: string;
  case_study_id: string;
  quote: string;
  author: string;
  company?: string;
  position?: string;
}

export interface MockImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
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
