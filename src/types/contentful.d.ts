import { Asset, Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import { Document, BLOCKS } from '@contentful/rich-text-types';

export interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    file: {
      url: string;
      details?: {
        size?: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName?: string;
      contentType?: string;
    };
  };
}

export interface ContentfulFeature {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    icon?: string;
    screenshot?: ContentfulAsset;
  };
}

export interface ContentfulBusinessGoal {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    icon?: string;
    image?: ContentfulAsset;
    benefits?: string[];
    features?: ContentfulFeature[];
    visible?: boolean;
  };
}

export interface ContentfulTechnologyFeature {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    icon?: string;
    displayOrder?: number;
    items?: string[];
  };
}

export interface ContentfulTechnologySection {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    sectionType: string;
    displayOrder?: number;
    features?: ContentfulTechnologyFeature[];
  };
}

export interface ContentfulTechnology {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    description: string;
    visible?: boolean;
    image?: ContentfulAsset;
    sections?: ContentfulTechnologySection[];
  };
}

// Contentful API response interfaces
// Modified to better match actual Contentful rich text structure
export interface ContentfulRichTextDocument {
  nodeType: string;
  data: object;
  content: any[];
}

// Enhanced ContentfulResponse with explicit includes for Entry and Asset
export interface ContentfulResponse<T = any> extends Entry<T> {
  includes?: {
    Asset?: ContentfulAsset[];
    Entry?: Array<Entry<any>>;
  };
}

// Define the AboutPageFields interface for the About page
export interface AboutPageFields {
  bodyContent?: Document | ContentfulRichTextDocument;
}

// Define FAQ item interface - updated to handle both string and rich text answers
export interface ContentfulFAQItem {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    question: string;
    answer: string | ContentfulRichTextDocument;
  };
}

// Define Contact Page Content interface
export interface ContentfulContactPageFields {
  introTitle?: string;
  introDescription?: string;
  phoneCardTitle?: string;
  phoneNumber?: string;
  phoneAvailability?: string;
  emailCardTitle?: string;
  emailAddress?: string;
  emailResponseTime?: string;
  addressCardTitle?: string;
  address?: string;
  addressType?: string;
  formSectionTitle?: string;
  faqSectionTitle?: string;
  faqItems?: ContentfulFAQItem[];
  immediateAssistanceTitle?: string;
  immediateAssistanceDescription?: string;
  immediateAssistanceButtonText?: string;
}
