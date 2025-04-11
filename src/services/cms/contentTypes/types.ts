import { QueryOptions } from '@/types/cms';

/**
 * Standard interface for all content type operations
 * This ensures consistent API across all content types
 */
export interface ContentTypeOperations<T> {
  /**
   * Fetch all content items of this type
   */
  fetchAll: (options?: QueryOptions) => Promise<T[]>;
  
  /**
   * Fetch a content item by its slug
   */
  fetchBySlug: (slug: string) => Promise<T | null>;
  
  /**
   * Fetch a content item by its ID
   */
  fetchById: (id: string) => Promise<T | null>;
  
  /**
   * Create a new content item
   */
  create: (data: any) => Promise<T | string>;
  
  /**
   * Update an existing content item
   */
  update: (idOrSlug: string, data: any) => Promise<T | boolean>;
  
  /**
   * Delete a content item
   */
  delete: (idOrSlug: string) => Promise<boolean>;
  
  /**
   * Clone a content item
   */
  clone?: (id: string) => Promise<T | null>;
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
