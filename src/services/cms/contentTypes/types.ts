
import { QueryOptions } from '@/types/cms';

/**
 * Generic operations interface for content types
 */
export interface ContentTypeOperations<T> {
  /**
   * Fetch all items
   */
  fetchAll: (options?: QueryOptions) => Promise<T[]>;
  
  /**
   * Fetch a single item by slug
   */
  fetchBySlug: (slug: string) => Promise<T | null>;
  
  /**
   * Fetch a single item by ID
   */
  fetchById: (id: string) => Promise<T | null>;
  
  /**
   * Create a new item
   */
  create: (data: any) => Promise<T>;
  
  /**
   * Update an existing item
   */
  update: (id: string, data: any) => Promise<T>;
  
  /**
   * Delete an item
   */
  delete: (id: string) => Promise<boolean>;
  
  /**
   * Clone an item (optional)
   */
  clone?: (id: string, newData?: any) => Promise<T>;
}

/**
 * Log a CMS operation for debugging and auditing purposes
 * @param operation The operation name
 * @param contentType The content type being operated on
 * @param message The log message
 */
export function logCMSOperation(operation: string, contentType: string, message: string): void {
  console.log(`[CMS:${contentType}] ${operation}: ${message}`);
}

/**
 * Handle and log CMS errors
 * @param operation The operation name
 * @param contentType The content type being operated on
 * @param error The error object
 */
export function handleCMSError(operation: string, contentType: string, error: any): void {
  console.error(`[CMS:${contentType}] Error in ${operation}:`, error);
  // Additional error handling logic can be added here
}
