
export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_alt: string;
  image?: {
    url: string;
    alt: string;
  };
  cta_primary_text?: string;
  cta_primary_url?: string;
  cta_secondary_text?: string;
  cta_secondary_url?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  background_class?: string;
  backgroundColor?: string;
  backgroundClass?: string;
  created_at: string;
  updated_at: string;
}

export interface LandingPage {
  id: string;
  page_key: string;
  page_name: string;
  hero_content_id: string;
  hero_content: HeroContent;
  created_at: string;
  updated_at: string;
}

export interface LandingPageFormData {
  page_key: string;
  page_name: string;
  hero: {
    title: string;
    subtitle: string;
    image_url: string;
    image_alt: string;
    cta_primary_text?: string;
    cta_primary_url?: string;
    cta_secondary_text?: string;
    cta_secondary_url?: string;
    background_class?: string;
  };
}
