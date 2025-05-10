
/**
 * @deprecated These types are part of legacy implementation that will be removed in future versions.
 * Use Contentful CMS integration for machine content management.
 */

export interface MachinePlaceholder {
  title: string;
  slug: string;
  type: 'vending' | 'locker';
  temperature: string;
  description: string;
  features: string[];
  images: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
  specs: Record<string, string>;
  deploymentExamples: {
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
  }[];
}

export interface MigrationResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: string[];
  machinesInDb?: any[];
  error?: string;
}
