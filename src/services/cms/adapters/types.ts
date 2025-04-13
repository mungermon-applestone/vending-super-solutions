
/**
 * Enum for content provider types
 */
export enum ContentProviderType {
  STRAPI = 'strapi',
  SUPABASE = 'supabase'
}

/**
 * Configuration interface for content providers
 */
export interface ContentProviderConfig {
  type: ContentProviderType;
  apiUrl?: string;  // Base URL for API (Strapi)
  apiKey?: string;  // API key for authentication (Strapi)
}

/**
 * Base CMS adapter interface
 */
export interface CmsAdapter<T, CreateInput, UpdateInput> {
  getAll: (options?: any) => Promise<T[]>;
  getBySlug: (slug: string) => Promise<T | null>;
  getById: (id: string) => Promise<T | null>;
  create: (data: CreateInput) => Promise<T>;
  update: (id: string, data: UpdateInput) => Promise<T>;
  delete: (id: string) => Promise<boolean>;
  clone?: (id: string) => Promise<T | null>;
}

/**
 * Generic function to create a CMS adapter factory
 */
export type CmsAdapterFactory<AdapterType> = (
  config: ContentProviderConfig
) => AdapterType;
