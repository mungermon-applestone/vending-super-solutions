
import { Asset, Entry, EntrySkeletonType } from 'contentful';
import { Document } from '@contentful/rich-text-types';

// Basic types
export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  testimonial: string;
  image_url?: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  author?: string;
  published_date?: string;
  featured_image?: string;
  status?: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
}

export interface AdjacentPost {
  id: string;
  title: string;
  slug: string;
}

// Contentful specific types
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

export interface ContentfulRichTextDocument {
  nodeType: string;
  data: object;
  content: any[];
}

// Page content types
export interface PrivacyPolicyFields {
  title: string;
  content: Document;
}

export interface TermsOfServiceFields {
  title: string;
  content: Document;
}

// Contact FAQ types
export interface ContentfulContactPageFields {
  title: string;
  faqs: Entry<ContentfulFAQFields>[];
}

export interface ContentfulFAQFields {
  question: string;
  answer: Document;
}

// Export the Document type from @contentful/rich-text-types for convenience
export { Document } from '@contentful/rich-text-types';
