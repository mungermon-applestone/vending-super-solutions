
// Type definitions for machine migration and machine data
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

// Shared machine data types
export interface MachineImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface MachineSpec {
  key: string;
  value: string;
}

export interface MachineFeature {
  text: string;
}

export interface MachineDeploymentExample {
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
}

export interface MachineFormValues {
  title: string;
  slug: string;
  type: "vending" | "locker";  // Explicitly typed as union type
  temperature: string;
  description: string;
  images: MachineImage[];
  specs: MachineSpec[];
  features: MachineFeature[];
}

export interface MachineData {
  id: string;
  slug: string;
  title: string;
  type: "vending" | "locker";  // Explicitly typed as union type
  temperature: string;
  description: string;
  images: MachineImage[];
  specs: Record<string, string>;
  features: string[];
  deploymentExamples: MachineDeploymentExample[];
}
