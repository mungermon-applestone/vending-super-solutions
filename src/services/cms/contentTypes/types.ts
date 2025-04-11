
import { QueryOptions } from '@/types/cms';

/**
 * Standard interface for CMS content type operations
 * This provides a consistent API across all content types
 */
export interface ContentTypeOperations<T> {
  // Basic CRUD operations
  fetchAll: (options?: QueryOptions) => Promise<T[]>;
  fetchBySlug: (slug: string) => Promise<T | null>;
  fetchById: (id: string) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
}

/**
 * Standard error handling function
 */
export function handleCMSError(operation: string, contentType: string, error: any): void {
  console.error(`[${contentType}] Error in ${operation}:`, error);
}

/**
 * Standard logging function
 */
export function logCMSOperation(operation: string, contentType: string, message: string): void {
  console.log(`[${contentType}] ${operation}: ${message}`);
}
