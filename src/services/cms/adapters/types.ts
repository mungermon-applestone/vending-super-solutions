
/**
 * Generic type for CMS content adapters
 */
export interface ContentAdapter<T, CreateInput, UpdateInput> {
  /**
   * Fetch all items of this content type
   */
  getAll: (filters?: Record<string, any>) => Promise<T[]>;
  
  /**
   * Fetch a single item by slug
   */
  getBySlug: (slug: string) => Promise<T | null>;
  
  /**
   * Fetch a single item by ID
   */
  getById: (id: string) => Promise<T | null>;
  
  /**
   * Create a new item
   */
  create: (data: CreateInput) => Promise<T>;
  
  /**
   * Update an existing item
   */
  update: (id: string, data: UpdateInput) => Promise<T>;
  
  /**
   * Delete an item by ID
   */
  delete: (id: string) => Promise<boolean>;
  
  /**
   * Clone an existing item
   */
  clone?: (id: string) => Promise<T>;
}

/**
 * Content Provider types for different CMS systems
 */
export enum ContentProviderType {
  SUPABASE = 'supabase',
  STRAPI = 'strapi',
}

/**
 * Configuration for a content provider
 */
export interface ContentProviderConfig {
  type: ContentProviderType;
  apiUrl?: string; // For external CMS APIs
  apiKey?: string; // For external CMS APIs
}
