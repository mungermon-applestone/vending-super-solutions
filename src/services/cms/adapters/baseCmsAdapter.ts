
import { Entry } from 'contentful';

/**
 * Base interface for CMS adapters
 * Simplified to focus on Contentful integration
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
 * Helper function to handle checking if a Contentful entry is valid
 */
export const isValidContentfulEntry = (entry: any): entry is Entry<any> => {
  return entry && entry.sys && entry.fields;
};
