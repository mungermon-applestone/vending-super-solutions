
import { ReactNode } from 'react';

export interface CMSImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CMSFeature {
  id?: string;
  title: string;
  description: string;
  icon?: string | ReactNode;
  screenshot?: CMSImage;
  display_order?: number;
}

export interface CMSProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: CMSImage;
  thumbnail?: CMSImage;
  benefits?: string[];
  features?: CMSFeature[];
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
  }[];
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
  }[];
}
