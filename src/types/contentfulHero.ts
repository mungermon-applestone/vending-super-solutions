
import { ContentfulAsset } from './contentful';

export interface ContentfulHeroContent {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    subtitle: string;
    pageKey: string;
    image: ContentfulAsset;
    imageAlt: string;
    primaryButtonText?: string;
    primaryButtonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    backgroundClass?: string;
  };
}

export interface HeroContentData {
  id: string;
  title: string;
  subtitle: string;
  pageKey: string;
  image: {
    url: string;
    alt: string;
  };
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
}
