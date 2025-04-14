
import { CMSProductType } from "@/types/cms";
import { ProductAdapter } from "./types";
import { supabaseProductAdapter } from "./supabaseProductAdapter";

/**
 * Temporary implementation of the Strapi product adapter
 * This adapter currently falls back to the Supabase adapter
 * as we have not fully implemented Strapi functionality
 */
export const strapiProductAdapter: ProductAdapter = {
  getAll: async (filters?: Record<string, any>): Promise<CMSProductType[]> => {
    console.log('[strapiProductAdapter] Falling back to Supabase adapter for getAll');
    return await supabaseProductAdapter.getAll(filters);
  },
  
  getBySlug: async (slug: string): Promise<CMSProductType | null> => {
    console.log(`[strapiProductAdapter] Falling back to Supabase adapter for getBySlug: ${slug}`);
    return await supabaseProductAdapter.getBySlug(slug);
  },
  
  getById: async (id: string): Promise<CMSProductType | null> => {
    console.log(`[strapiProductAdapter] Falling back to Supabase adapter for getById: ${id}`);
    return await supabaseProductAdapter.getById(id);
  },
  
  create: async (data: any): Promise<CMSProductType> => {
    console.log('[strapiProductAdapter] Falling back to Supabase adapter for create');
    return await supabaseProductAdapter.create(data);
  },
  
  update: async (id: string, data: any): Promise<CMSProductType> => {
    console.log(`[strapiProductAdapter] Falling back to Supabase adapter for update: ${id}`);
    return await supabaseProductAdapter.update(id, data);
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[strapiProductAdapter] Falling back to Supabase adapter for delete: ${id}`);
    return await supabaseProductAdapter.delete(id);
  },
  
  clone: async (id: string): Promise<CMSProductType> => {
    console.log(`[strapiProductAdapter] Falling back to Supabase adapter for clone: ${id}`);
    return await supabaseProductAdapter.clone(id);
  }
};
