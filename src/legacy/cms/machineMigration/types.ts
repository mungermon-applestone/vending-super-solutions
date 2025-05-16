
/**
 * @deprecated These types are part of legacy implementation that will be removed in future versions.
 * Use Contentful CMS integration for machine content management.
 */

export interface MachinePlaceholder {
  id?: string; // Adding optional ID field to fix machineData.ts errors
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

/**
 * @deprecated Interface for machine form data used in admin editor
 * Will be removed in future versions once admin UI is migrated to Contentful
 */
export interface MachineFormValues {
  title: string;
  slug: string;
  type: string;
  temperature: string;
  description: string;
  images?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
  specs?: {
    key: string;
    value: string;
  }[];
  features?: {
    text: string;
  }[];
  deploymentExamples?: {
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
  }[];
}

/**
 * @deprecated Interface for machine data used in admin editor
 * Will be removed in future versions once admin UI is migrated to Contentful
 */
export interface MachineData {
  id: string;
  title: string;
  slug: string;
  type: string;
  temperature: string;
  description: string;
  images: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
  specs: Record<string, string>;
  features: string[];
  deploymentExamples: {
    title: string;
    description: string;
    image: {
      url: string;
      alt: string;
    };
  }[];
}
