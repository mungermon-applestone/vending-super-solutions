
export interface TechFeature {
  icon: string;
  title: string;
  description: string;
  items?: string[];
}

export interface CMSTechnologyImage {
  url: string;
  alt?: string;
}

export interface TechnologySection {
  id: string;
  title: string;
  description: string;
  features: TechFeature[];
  image: CMSTechnologyImage;
  technology_id: string;
  section_type: string;
  display_order: number;
  bulletPoints?: string[];
}
