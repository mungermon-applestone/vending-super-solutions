
import { QueryOptions } from '@/types/cms';

/**
 * Standard interface for all content type operations
 * This ensures consistent API across all content types
 */
export interface ContentTypeOperations<T> {
  /**
   * Fetches all items of a specific content type
   * @param options Optional query parameters
   */
  fetchAll: (options?: QueryOptions) => Promise<T[]>;
  
  /**
   * Fetches a single item by its slug
   * @param slug The slug identifier
   */
  fetchBySlug: (slug: string) => Promise<T | null>;
  
  /**
   * Fetches a single item by its ID
   * @param id The unique identifier
   */
  fetchById: (id: string) => Promise<T | null>;
  
  /**
   * Creates a new item
   * @param data The data for the new item
   * @returns Promise resolving to the created item
   */
  create: (data: any) => Promise<T>;
  
  /**
   * Updates an existing item
   * @param idOrSlug The ID or slug of the item to update
   * @param data The updated data
   * @returns Promise resolving to the updated item
   */
  update: (idOrSlug: string, data: any) => Promise<T>;
  
  /**
   * Deletes an item
   * @param idOrSlug The ID or slug of the item to delete
   * @returns Promise resolving to a boolean indicating success
   */
  delete: (idOrSlug: string) => Promise<boolean>;
}

/**
 * Utility function to log CMS operations for debugging
 * @param operation Name of the operation
 * @param contentType Type of content being operated on
 * @param message Log message
 */
export function logCMSOperation(operation: string, contentType: string, message: string): void {
  console.log(`[${contentType}:${operation}] ${message}`);
}

/**
 * Utility function to handle CMS errors consistently
 * @param operation Name of the operation
 * @param contentType Type of content being operated on
 * @param error Error that occurred
 */
export function handleCMSError(operation: string, contentType: string, error: any): void {
  console.error(`[${contentType}:${operation}] Error:`, error);
}
