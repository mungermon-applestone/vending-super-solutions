
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
