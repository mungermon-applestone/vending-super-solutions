
export interface TechFeature {
  icon: string;
  title: string;
  description: string;
  items?: string[]; // Add support for bullet point items
}

export interface TechnologySection {
  id: string;
  title: string;
  description: string;
  features: TechFeature[];
  image: string;
}
