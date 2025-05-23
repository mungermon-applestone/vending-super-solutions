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
  thumbnail?: CMSImage;
  created_at?: string;
  updated_at?: string;
  benefits?: string[];
  features?: CMSFeature[];
  examples?: CMSExample[];  // This is now explicitly optional
  video?: {
    title: string;
    description: string;
    thumbnailImage: CMSImage;
    url?: string;
    youtubeId?: string;
    orientation?: 'horizontal' | 'vertical';
  };
  visible?: boolean;
  displayOrder?: number;
  showOnHomepage?: boolean;
  homepageOrder?: number;
  recommendedMachines?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: {
      url: string;
      alt?: string;
    };
    thumbnail?: {
      url: string;
      alt?: string;
    };
    machineThumbnail?: {
      url: string;
      alt?: string;
    };
  }[];
}

export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  type: 'vending' | 'locker';
  description: string;
  features?: string[];
  images?: CMSImage[];
  thumbnail?: CMSImage;  // Added thumbnail property to CMSMachine
  product_types?: CMSProductType[];
  created_at?: string;
  updated_at?: string;
  temperature?: string;
  specs?: Record<string, string>;
  deploymentExamples?: CMSDeploymentExample[];
  visible?: boolean;
  displayOrder?: number;
  showOnHomepage?: boolean;
  homepageOrder?: number;
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
  image?: CMSImage;
  icon?: string;
  benefits?: string[];
  features?: CMSFeature[];
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
  video?: {
    id: string;
    url: string | null;
    title?: string;
  };
  recommendedMachines?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: {
      url: string;
      alt?: string;
    };
    thumbnail?: {
      url: string;
      alt?: string;
    };
    machineThumbnail?: {
      url: string;
      alt?: string;
    };
  }[];
  image_url?: string;
  image_alt?: string;
  caseStudies?: CMSExample[];
  displayOrder?: number;
  showOnHomepage?: boolean;
  homepageOrder?: number;
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
  title: string;
  description?: string;
  summary?: string;
  section_type: string;
  display_order: number;
  features?: CMSTechnologyFeature[];
  images?: CMSTechnologyImage[];
  bulletPoints?: string[];
  sectionImage?: {
    url: string;
    alt?: string;
  };
  image?: {
    url: string;
    alt?: string;
  };
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
