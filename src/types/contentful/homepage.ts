
import { Asset, Entry } from 'contentful';

export interface ContentfulHomepageFields {
  headline?: string;
  subheading?: string;
  heroImage?: Asset;
  ctaTitle?: string;
  ctaText?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  businessGoalsTitle?: string;
  businessGoalsDescription?: string;
  productCategoriesTitle?: string;
  productCategoriesDescription?: string;
  availableMachines?: string;
  availableMachinesDescription?: string;
  ctaSectionTitle?: string;
  ctaSectionDescription?: string;
  ctaPrimaryButtonText?: string;
  ctaPrimaryButtonUrl?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonUrl?: string;
}

export interface ContentfulHomepage extends Entry<ContentfulHomepageFields> {}
