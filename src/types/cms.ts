
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
  // Add missing properties being used in the codebase
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
  // Add missing properties being used in the codebase
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
  // Add missing properties being used in the codebase
  icon?: string;
  image?: CMSImage;
  benefits?: string[];
  features?: CMSFeature[];
  caseStudies?: CMSExample[];
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

// Add missing interfaces referenced in the codebase
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

// Helper type for mock data
export interface MockImage {
  url: string;
  alt: string;
  id?: string;
}
