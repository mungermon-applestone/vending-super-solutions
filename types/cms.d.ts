
export interface CMSImage {
  url: string;
  alt?: string;
  id?: string;
}

export interface CMSFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
  screenshot?: CMSImage;
}

export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  visible?: boolean;
  benefits: string[];
  features: CMSFeature[];
  image?: CMSImage;
  thumbnail?: CMSImage;
}

export interface CMSMachine {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  temperature?: string;
  specs?: {
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    paymentOptions?: string;
    connectivity?: string;
    manufacturer?: string;
    warranty?: string;
    [key: string]: string | undefined;
  };
  features?: string[];
  deploymentExamples?: string[];
  images?: CMSImage[];
  thumbnail?: CMSImage;
}
