
export interface HomePageContent {
  // Product categories section
  productCategoriesTitle: string;
  productCategoriesDescription: string;
  
  // Business goals section
  businessGoalsTitle: string;
  businessGoalsDescription: string;
  
  // Available machines section
  availableMachines?: string;
  availableMachinesDescription?: string;
  
  // CTA section
  ctaSectionTitle: string;
  ctaSectionDescription: string;
  ctaPrimaryButtonText?: string;
  ctaPrimaryButtonUrl?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonUrl?: string;
  
  // Hero section
  heroHeadline?: string;
  heroSubheading?: string;
  heroCTAText?: string;
  heroCTALink?: string;
  heroImage?: string;
  
  // For backward compatibility with older components
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundClass?: string;
}
