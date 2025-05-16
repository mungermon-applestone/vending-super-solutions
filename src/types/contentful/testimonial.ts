
import { Asset, Entry } from 'contentful';

export interface ContentfulTestimonialFields {
  author: string;
  quote: string;
  company?: string;
  position?: string;
  rating?: number;
  image?: Asset;
}

export interface ContentfulTestimonial extends Entry<ContentfulTestimonialFields> {}

export interface ContentfulTestimonialSectionFields {
  title: string;
  subtitle?: string;
  testimonials: ContentfulTestimonial[];
  pageKey?: string;
}

export interface ContentfulTestimonialSection extends Entry<ContentfulTestimonialSectionFields> {}
