
import { ReactNode } from 'react';

// Product form types
export interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  benefits: string[];
  features: ProductFeature[];
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
  screenshotUrl: string;
  screenshotAlt: string;
}

// Business Goal form types
export interface BusinessGoalFormData {
  title: string;
  slug: string;
  description: string;
  icon?: string;
  image?: {
    url: string;
    alt: string;
  };
  benefits: string[];
  features: BusinessGoalFeature[];
}

export interface BusinessGoalFeature {
  title: string;
  description: string;
  icon: string;
  screenshotUrl: string;
  screenshotAlt: string;
}
