
export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

export interface HomePageContent {
  productCategoriesTitle: string;
  productCategoriesDescription: string;
  businessGoalsTitle: string;
  businessGoalsDescription: string;
  availableMachines?: string;
  availableMachinesDescription?: string;
  
  // New features section fields
  featuresSectionTitle: string;
  featuresSectionDescription?: string;
  feature1Title?: string;
  feature1Description?: string;
  feature1icon?: string; // Note: Using the exact field name from Contentful
  feature2Title?: string;
  feature2Description?: string;
  feature2Icon?: string;
  feature3Title?: string;
  feature3Description?: string;
  feature3Icon?: string;
  feature4Title?: string;
  feature4Description?: string;
  feature4Icon?: string;
  feature5Title?: string;
  feature5Description?: string;
  feature5Icon?: string;
  feature6Title?: string;
  feature6Description?: string;
  feature6Icon?: string; // Note: This is Text in Contentful rather than Symbol
  
  // CTA fields were removed from Contentful
}
