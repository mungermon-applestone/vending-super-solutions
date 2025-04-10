
import { ReactNode } from 'react';

export interface TechFeature {
  icon: ReactNode;
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
