
export interface TechFeature {
  icon: string;
  title: string;
  description: string;
}

export interface TechnologySection {
  id: string;
  title: string;
  description: string;
  features: TechFeature[];
  image: string;
}
