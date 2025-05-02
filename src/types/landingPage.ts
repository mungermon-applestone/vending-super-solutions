
export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_alt: string;
  video_url?: string;
  video_thumbnail?: string;
  is_video?: boolean;
  cta_primary_text?: string;
  cta_primary_url?: string;
  cta_secondary_text?: string;
  cta_secondary_url?: string;
  background_class?: string;
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
    video_url?: string;
    video_thumbnail?: string;
    is_video?: boolean;
    cta_primary_text: string;
    cta_primary_url: string;
    cta_secondary_text: string;
    cta_secondary_url: string;
    background_class?: string;
  };
}
