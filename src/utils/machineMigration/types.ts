
// Type definitions for machine migration
export interface MachinePlaceholder {
  id: string;
  slug: string;
  title: string;
  type: "vending" | "locker";
  temperature: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  specs: {
    dimensions?: string;
    weight?: string;
    capacity?: string;
    powerRequirements?: string;
    temperature?: string;
    connectivity?: string;
    paymentOptions?: string;
    screen?: string;
    manufacturer?: string;
    priceRange?: string;
    [key: string]: string | undefined;
  };
  features: string[];
  deploymentExamples: Array<{
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
  }>;
}

export interface MigrationResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: string[];
  machinesInDb?: any[];
  error?: string;
}
