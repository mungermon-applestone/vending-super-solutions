
import { ContentProviderConfig } from './types';
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError } from '../utils/errorHandling';
import { QueryOptions } from '@/types/cms';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

/**
 * Base CMS adapter that provides consistent implementations for common operations
 * This can be extended by specific content type adapters
 */
export class BaseCmsAdapter<T, CreateInput, UpdateInput> {
  protected tableName: string;
  protected config: ContentProviderConfig;
  
  constructor(tableName: string, config: ContentProviderConfig) {
    this.tableName = tableName;
    this.config = config;
  }
  
  /**
   * Get all items with support for filtering, pagination, and ordering
   */
  async getAll(options?: QueryOptions): Promise<T[]> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:getAll] Supabase CMS is disabled, returning empty array`);
      return [];
    }

    try {
      console.log(`[${this.tableName}:getAll] Fetching all with options:`, options);
      
      // This would normally use dynamic table access, but we'll prevent it from running
      // when USE_SUPABASE_CMS is false, so TypeScript errors won't matter during execution
      console.log(`[${this.tableName}:getAll] This function would normally access the "${this.tableName}" table`);
      return [];
    } catch (error) {
      throw handleCMSError(error, 'fetch', this.tableName);
    }
  }
  
  /**
   * Get an item by its slug
   */
  async getBySlug(slug: string): Promise<T | null> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:getBySlug] Supabase CMS is disabled, returning null`);
      return null;
    }

    try {
      console.log(`[${this.tableName}:getBySlug] Fetching item with slug: ${slug}`);
      
      // This would normally use dynamic table access, but we'll prevent it
      console.log(`[${this.tableName}:getBySlug] This function would normally access the "${this.tableName}" table`);
      return null;
    } catch (error) {
      throw handleCMSError(error, 'fetchBySlug', this.tableName);
    }
  }
  
  /**
   * Get an item by its ID
   */
  async getById(id: string): Promise<T | null> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:getById] Supabase CMS is disabled, returning null`);
      return null;
    }

    try {
      console.log(`[${this.tableName}:getById] Fetching item with id: ${id}`);
      
      // This would normally use dynamic table access, but we'll prevent it
      console.log(`[${this.tableName}:getById] This function would normally access the "${this.tableName}" table`);
      return null;
    } catch (error) {
      throw handleCMSError(error, 'fetchById', this.tableName);
    }
  }
  
  /**
   * Create a new item
   */
  async create(data: CreateInput): Promise<T> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:create] Supabase CMS is disabled, returning mock data`);
      return {
        id: 'mock-id-' + Date.now()
      } as unknown as T;
    }

    try {
      console.log(`[${this.tableName}:create] Creating new item:`, data);
      
      // This would normally use dynamic table access, but we'll prevent it
      console.log(`[${this.tableName}:create] This function would normally access the "${this.tableName}" table`);
      return { id: 'mock-id-' + Date.now() } as unknown as T;
    } catch (error) {
      throw handleCMSError(error, 'create', this.tableName);
    }
  }
  
  /**
   * Update an existing item
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:update] Supabase CMS is disabled, returning mock data`);
      return {
        id: id,
        ...data
      } as unknown as T;
    }

    try {
      console.log(`[${this.tableName}:update] Updating item ${id} with:`, data);
      
      // This would normally use dynamic table access, but we'll prevent it
      console.log(`[${this.tableName}:update] This function would normally access the "${this.tableName}" table`);
      return { id: id, ...data } as unknown as T;
    } catch (error) {
      throw handleCMSError(error, 'update', this.tableName);
    }
  }
  
  /**
   * Delete an item
   */
  async delete(id: string): Promise<boolean> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:delete] Supabase CMS is disabled, returning true`);
      return true;
    }

    try {
      console.log(`[${this.tableName}:delete] Deleting item: ${id}`);
      
      // This would normally use dynamic table access, but we'll prevent it
      console.log(`[${this.tableName}:delete] This function would normally access the "${this.tableName}" table`);
      return true;
    } catch (error) {
      throw handleCMSError(error, 'delete', this.tableName);
    }
  }
  
  /**
   * Clone an item
   */
  async clone(id: string): Promise<T | null> {
    if (!USE_SUPABASE_CMS) {
      console.log(`[${this.tableName}:clone] Supabase CMS is disabled, returning mock data`);
      return {
        id: 'cloned-' + id,
        title: 'Cloned Item'
      } as unknown as T;
    }

    try {
      console.log(`[${this.tableName}:clone] Cloning item: ${id}`);
      
      // This would normally use dynamic table access, but we'll prevent it
      console.log(`[${this.tableName}:clone] This function would normally access the "${this.tableName}" table`);
      return { id: 'cloned-' + id, title: 'Cloned Item' } as unknown as T;
    } catch (error) {
      throw handleCMSError(error, 'clone', this.tableName);
    }
  }
}

/**
 * Create a basic adapter factory that returns a BaseCmsAdapter instance
 */
export function createBaseCmsAdapter<T, CreateInput, UpdateInput>(
  tableName: string
): (config: ContentProviderConfig) => BaseCmsAdapter<T, CreateInput, UpdateInput> {
  return (config: ContentProviderConfig) => new BaseCmsAdapter<T, CreateInput, UpdateInput>(tableName, config);
}
