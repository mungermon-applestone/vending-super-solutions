
export interface HomePageContent {
  // Product categories section
  productCategoriesTitle?: string;
  productCategoriesDescription?: string;
  
  // Business goals section
  businessGoalsTitle?: string;
  businessGoalsDescription?: string;
  
  // Available machines section
  availableMachines?: string;
  availableMachinesDescription?: string;
  
  // CTA section
  ctaSectionTitle?: string;
  ctaSectionDescription?: string;
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
  headline?: string;
  subheading?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCTAText?: string;
  secondaryCTALink?: string;
  
  // Background styling
  backgroundClass?: string;
  
  // Image properties
  backgroundImage?: string;
  backgroundImageAlt?: string;
  image?: {
    url: string;
    alt: string;
  };
}
