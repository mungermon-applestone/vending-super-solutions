
import { CMSProductType } from "@/types/cms";
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from "./types";
import { supabaseProductAdapter } from "./supabaseProductAdapter";

/**
 * Strapi product adapter implementation
 * 
 * Currently this adapter falls back to the Supabase adapter as Strapi
 * functionality is not fully implemented. Each method is properly documented
 * and logs its fallback behavior for debugging purposes.
 */
export const strapiProductAdapter: ProductAdapter = {
  /**
   * Get all products from Strapi CMS
   * @param filters Optional filters to apply
   * @returns Array of product types
   */
  getAll: async (filters?: Record<string, any>): Promise<CMSProductType[]> => {
    try {
      console.log('[strapiProductAdapter] Falling back to Supabase adapter for getAll', 
        filters ? `with filters: ${JSON.stringify(filters)}` : '');
      return await supabaseProductAdapter.getAll(filters);
    } catch (error) {
      console.error('[strapiProductAdapter] Error in getAll:', error);
      throw error;
    }
  },
  
  /**
   * Get a product by slug from Strapi CMS
   * @param slug Product slug to look up
   * @returns Product if found, null otherwise
   */
  getBySlug: async (slug: string): Promise<CMSProductType | null> => {
    try {
      console.log(`[strapiProductAdapter] Falling back to Supabase adapter for getBySlug: ${slug}`);
      return await supabaseProductAdapter.getBySlug(slug);
    } catch (error) {
      console.error(`[strapiProductAdapter] Error in getBySlug for ${slug}:`, error);
      throw error;
    }
  },
  
  /**
   * Get a product by ID from Strapi CMS
   * @param id Product ID to look up
   * @returns Product if found, null otherwise
   */
  getById: async (id: string): Promise<CMSProductType | null> => {
    try {
      console.log(`[strapiProductAdapter] Falling back to Supabase adapter for getById: ${id}`);
      return await supabaseProductAdapter.getById(id);
    } catch (error) {
      console.error(`[strapiProductAdapter] Error in getById for ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new product in Strapi CMS
   * @param data Product data to create
   * @returns Created product
   */
  create: async (data: ProductCreateInput): Promise<CMSProductType> => {
    try {
      console.log('[strapiProductAdapter] Falling back to Supabase adapter for create');
      return await supabaseProductAdapter.create(data);
    } catch (error) {
      console.error('[strapiProductAdapter] Error in create:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing product in Strapi CMS
   * @param id Product ID to update
   * @param data Updated product data
   * @returns Updated product
   */
  update: async (id: string, data: ProductUpdateInput): Promise<CMSProductType> => {
    try {
      console.log(`[strapiProductAdapter] Falling back to Supabase adapter for update: ${id}`);
      return await supabaseProductAdapter.update(id, data);
    } catch (error) {
      console.error(`[strapiProductAdapter] Error in update for ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a product from Strapi CMS
   * @param id Product ID to delete
   * @returns True if successful
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      console.log(`[strapiProductAdapter] Falling back to Supabase adapter for delete: ${id}`);
      return await supabaseProductAdapter.delete(id);
    } catch (error) {
      console.error(`[strapiProductAdapter] Error in delete for ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Clone a product in Strapi CMS
   * @param id Product ID to clone
   * @returns Cloned product
   */
  clone: async (id: string): Promise<CMSProductType> => {
    try {
      console.log(`[strapiProductAdapter] Falling back to Supabase adapter for clone: ${id}`);
      return await supabaseProductAdapter.clone(id);
    } catch (error) {
      console.error(`[strapiProductAdapter] Error in clone for ${id}:`, error);
      throw error;
    }
  }
};
