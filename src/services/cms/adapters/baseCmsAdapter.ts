
import { Entry } from 'contentful';

/**
 * Base interface for CMS adapters
 * This interface has been simplified to remove Supabase dependencies
 * and will be further refactored in the next phase
 */
export interface BaseCmsAdapter<T, CreatePayload, UpdatePayload = Partial<CreatePayload>> {
  /**
   * Fetches all entities of a given type
   */
  fetchAll: () => Promise<T[]>;
  
  /**
   * Fetches a single entity by slug
   */
  fetchBySlug: (slug: string) => Promise<T | null>;
  
  /**
   * Fetches a single entity by ID
   */
  fetchById: (id: string) => Promise<T | null>;
}

/**
 * Generic error handler for CMS operations
 * @param error - The error that was caught
 * @param operation - The operation that failed
 * @returns A rejected promise with an error message
 */
export const handleCmsError = (error: unknown, operation: "fetch" | "create" | "update" | "delete" | "initialize"): Promise<never> => {
  console.error(`CMS ${operation} operation failed:`, error);
  return Promise.reject(new Error(`Failed to ${operation} content: ${error instanceof Error ? error.message : "Unknown error"}`));
};

/**
 * This adapter has been kept as a stub to prevent build errors
 * It will be removed in the next phase of the migration
 * @deprecated - This adapter is being phased out in favor of direct Contentful usage
 */
export const createBaseCmsAdapter = <T, CreatePayload, UpdatePayload = Partial<CreatePayload>>(
  contentType: string
): BaseCmsAdapter<T, CreatePayload, UpdatePayload> => {
  console.warn(`Using deprecated CMS adapter for ${contentType}`);
  
  return {
    fetchAll: async () => {
      console.warn(`fetchAll for ${contentType} using deprecated adapter`);
      return [];
    },
    
    fetchBySlug: async (slug: string) => {
      console.warn(`fetchBySlug for ${contentType} using deprecated adapter`);
      return null;
    },
    
    fetchById: async (id: string) => {
      console.warn(`fetchById for ${contentType} using deprecated adapter`);
      return null;
    }
  };
};

/**
 * Helper function to handle checking if a Contentful entry is valid
 */
export const isValidContentfulEntry = (entry: any): entry is Entry<any> => {
  return entry && entry.sys && entry.fields;
};
