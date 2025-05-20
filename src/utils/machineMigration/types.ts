
export interface MachinePlaceholder {
  id: string;
  slug: string;
  title: string;
  type: string;
  temperature: string;
  description: string;
  images: Array<{ url: string; alt?: string; width?: number; height?: number; }>;
  specs?: Record<string, any>;
  features?: string[];
  deploymentExamples?: Array<{
    title: string;
    description: string;
    image: { url: string; alt?: string; };
  }>;
}

export interface MachineData extends MachinePlaceholder {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MachineFormValues {
  title: string;
  slug: string;
  type?: string;
  temperature?: string;
  description?: string;
  thumbnailUrl?: string;
  images?: Array<{ url: string; alt?: string; }>;
  specs?: Record<string, any>;
  features?: string[];
}

export interface MigrationResult {
  success: boolean;
  message: string;
  count?: number;
  errors?: string[];
  error?: string;
  machinesInDb?: any[];
}
