
/**
 * Available CMS provider types
 */
export enum ContentProviderType {
  CONTENTFUL = 'contentful',
}

/**
 * Base interface for CMS provider configuration
 */
export interface ProviderConfig {
  type: ContentProviderType;
}

/**
 * Base interface for all CMS adapters
 */
export interface CmsAdapter<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  getBySlug?(slug: string): Promise<T | null>;
}
