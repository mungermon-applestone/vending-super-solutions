
/**
 * Main Machine interface for CMS integration
 */
export interface CMSMachine {
  id: string;
  contentType: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  type: string;
  mainImage: MachineImage;
  gallery: MachineImage[];
  features: MachineFeature[];
  specifications: MachineSpecification[];
  featured: boolean;
  displayOrder: number;
  temperature: 'ambient' | 'refrigerated' | 'frozen' | string;
  deploymentExamples?: DeploymentExample[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Machine image interface
 */
export interface MachineImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Machine feature interface
 */
export interface MachineFeature {
  name: string;
  description: string;
  icon?: string;
}

/**
 * Machine specification interface
 */
export interface MachineSpecification {
  name: string;
  value: string | number;
  unit?: string;
  category?: string;
}

/**
 * Deployment example interface
 */
export interface DeploymentExample {
  title: string;
  description?: string;
  image?: MachineImage;
}

/**
 * Interface for machine filter options
 */
export interface MachineFilterOptions {
  type?: string;
  featured?: boolean;
  temperature?: string;
  limit?: number;
  includeDetails?: boolean;
}

/**
 * Interface for machine creation payload
 */
export interface CreateMachinePayload {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  type: string;
  mainImage?: MachineImage;
  featured?: boolean;
  displayOrder?: number;
  temperature?: string;
}
