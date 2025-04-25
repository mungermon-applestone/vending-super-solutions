
export interface CMSImage {
  id: string;
  url: string;
  alt: string;
}

export interface CMSBusinessGoal {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  content?: string;
  icon?: string;
  benefits?: string[];
  features?: CMSFeature[];
  visible?: boolean;
  video?: {
    id: string;
    url: string;
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
  }[];
}

export interface CMSTechnology {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  visible?: boolean;
}

export interface CMSCaseStudy {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: CMSImage;
}

export interface CMSLandingPage {
  id: string;
  key: string;
  content: string;
}

export interface CMSTestimonial {
  id: string;
  author: string;
  title: string;
  company: string;
  testimonial: string;
  image?: CMSImage;
}

export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  type: 'vending' | 'locker';
  temperature: string;
  description: string;
  images: CMSImage[];
  specs: {
    [key: string]: string | undefined;
  };
  features: string[];
  deploymentExamples: {
    title: string;
    description: string;
    image: CMSImage;
  }[];
}

export interface QueryOptions {
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  benefits?: string[];
  image?: {
    id: string;
    url: string;
    alt: string;
  };
  features?: {
    id: string;
    title: string;
    description: string;
    icon?: string;
  }[];
  recommendedMachines?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image?: {
      url: string;
      alt?: string;
    };
  }[];
}
