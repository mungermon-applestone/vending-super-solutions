
// Content types that will be stored in the CMS

export interface CMSImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CMSFeature {
  title: string;
  description: string;
  icon?: string;
  screenshot?: CMSImage;
}

export interface CMSExample {
  title: string;
  description: string;
  image: CMSImage;
}

export interface CMSSpecs {
  dimensions?: string;
  weight?: string;
  capacity?: string;
  powerRequirements?: string;
  temperature?: string;
  connectivity?: string;
  paymentOptions?: string;
  screen?: string;
  manufacturer?: string;
  priceRange?: string;
  [key: string]: string | undefined;
}

export interface CMSMachine {
  id: string;
  slug: string;
  title: string;
  type: string;
  temperature: "ambient" | "refrigerated" | "frozen";
  description: string;
  images: CMSImage[];
  specs: CMSSpecs;
  features: string[];
  deploymentExamples: CMSExample[];
}

export interface CMSProductType {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: CMSImage;
  benefits: string[];
  features: CMSFeature[];
  examples: CMSExample[];
  video?: {
    title: string;
    description: string;
    thumbnailImage: CMSImage;
    videoUrl?: string;
  };
}

export interface CMSTestimonial {
  id: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  image?: CMSImage;
}

export interface CMSBusinessGoal {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  image: CMSImage;
  benefits: string[];
  features: CMSFeature[];
  caseStudies: CMSExample[];
}
