
export interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  benefits: string[];
  features: {
    title: string;
    description: string;
    icon: string;
    screenshotUrl?: string;
    screenshotAlt?: string;
  }[];
}
