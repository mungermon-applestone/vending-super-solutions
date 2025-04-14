
import { ContentProviderConfig, ContentProviderType } from './types';
import { supabase } from '@/integrations/supabase/client';
import { handleCMSError } from '../utils/errorHandling';
import { QueryOptions } from '@/types/cms';

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
    try {
      console.log(`[${this.tableName}:getAll] Fetching all with options:`, options);
      
      let query = supabase
        .from(this.tableName)
        .select('*');
      
      // Apply filters if provided
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      // Apply pagination if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      // Apply ordering if provided
      if (options?.orderBy) {
        const direction = options.orderDirection || 'asc';
        query = query.order(options.orderBy, { ascending: direction === 'asc' });
      }
      
      // Apply search if provided
      if (options?.search && options.search.trim() !== '') {
        if (options.exactMatch) {
          // Exact match search
          query = query.eq('title', options.search);
        } else {
          // Fuzzy search (ILIKE)
          query = query.ilike('title', `%${options.search}%`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`[${this.tableName}:getAll] Error:`, error);
        throw error;
      }
      
      console.log(`[${this.tableName}:getAll] Found ${data?.length || 0} items`);
      return data as T[];
    } catch (error) {
      throw handleCMSError(error, 'fetch', this.tableName);
    }
  }
  
  /**
   * Get an item by its slug
   */
  async getBySlug(slug: string): Promise<T | null> {
    try {
      console.log(`[${this.tableName}:getBySlug] Fetching item with slug: ${slug}`);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) {
        console.error(`[${this.tableName}:getBySlug] Error:`, error);
        throw error;
      }
      
      return data as T | null;
    } catch (error) {
      throw handleCMSError(error, 'fetchBySlug', this.tableName);
    }
  }
  
  /**
   * Get an item by its ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      console.log(`[${this.tableName}:getById] Fetching item with id: ${id}`);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error(`[${this.tableName}:getById] Error:`, error);
        throw error;
      }
      
      return data as T | null;
    } catch (error) {
      throw handleCMSError(error, 'fetchById', this.tableName);
    }
  }
  
  /**
   * Create a new item
   */
  async create(data: CreateInput): Promise<T> {
    try {
      console.log(`[${this.tableName}:create] Creating new item:`, data);
      
      const { data: createdItem, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
      
      if (error) {
        console.error(`[${this.tableName}:create] Error:`, error);
        throw error;
      }
      
      console.log(`[${this.tableName}:create] Created item:`, createdItem);
      return createdItem as T;
    } catch (error) {
      throw handleCMSError(error, 'create', this.tableName);
    }
  }
  
  /**
   * Update an existing item
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      console.log(`[${this.tableName}:update] Updating item ${id} with:`, data);
      
      const { data: updatedItem, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`[${this.tableName}:update] Error:`, error);
        throw error;
      }
      
      console.log(`[${this.tableName}:update] Updated item:`, updatedItem);
      return updatedItem as T;
    } catch (error) {
      throw handleCMSError(error, 'update', this.tableName);
    }
  }
  
  /**
   * Delete an item
   */
  async delete(id: string): Promise<boolean> {
    try {
      console.log(`[${this.tableName}:delete] Deleting item: ${id}`);
      
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`[${this.tableName}:delete] Error:`, error);
        throw error;
      }
      
      console.log(`[${this.tableName}:delete] Successfully deleted item: ${id}`);
      return true;
    } catch (error) {
      throw handleCMSError(error, 'delete', this.tableName);
    }
  }
  
  /**
   * Clone an item
   */
  async clone(id: string): Promise<T | null> {
    try {
      console.log(`[${this.tableName}:clone] Cloning item: ${id}`);
      
      // First, get the original item
      const original = await this.getById(id);
      
      if (!original) {
        console.error(`[${this.tableName}:clone] Item not found: ${id}`);
        return null;
      }
      
      // Remove the ID from the original item to create a new one
      const { id: _, created_at, updated_at, ...cloneData } = original as any;
      
      // Modify the title/slug to indicate it's a clone
      if ('title' in cloneData && 'slug' in cloneData) {
        cloneData.title = `${cloneData.title} (Copy)`;
        cloneData.slug = `${cloneData.slug}-copy-${Date.now().toString().slice(-6)}`;
      }
      
      // Create the clone
      const clone = await this.create(cloneData as unknown as CreateInput);
      console.log(`[${this.tableName}:clone] Successfully cloned item: ${id}`);
      
      return clone;
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
