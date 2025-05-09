
import { CMSProductType } from '@/types/cms';
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from './types';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

/**
 * Mock implementation of the Supabase Product adapter
 * This adapter returns empty/mock data since Supabase CMS is disabled
 */
export const supabaseProductAdapter: ProductAdapter = {
  getAll: async (filters?: Record<string, any>): Promise<CMSProductType[]> => {
    console.log('[supabaseProductAdapter] Supabase CMS is disabled, returning empty array');
    return [];
  },
  
  getBySlug: async (slug: string): Promise<CMSProductType | null> => {
    console.log(`[supabaseProductAdapter] Supabase CMS is disabled, returning null`);
    return null;
  },
  
  getById: async (id: string): Promise<CMSProductType | null> => {
    console.log(`[supabaseProductAdapter] Supabase CMS is disabled, returning null`);
    return null;
  },
  
  create: async (product: ProductCreateInput): Promise<CMSProductType> => {
    console.log(`[supabaseProductAdapter] Supabase CMS is disabled, returning mock data`);
    return {
      id: 'mock-id-' + Date.now(),
      title: product.title,
      slug: product.slug || 'mock-slug',
      description: product.description || '',
      visible: true,
      benefits: product.benefits || [],
      features: []
    };
  },
  
  update: async (id: string, product: ProductUpdateInput): Promise<CMSProductType> => {
    console.log(`[supabaseProductAdapter] Supabase CMS is disabled, returning mock data`);
    return {
      id: id,
      title: product.title,
      slug: product.slug || 'mock-slug',
      description: product.description || '',
      visible: true,
      benefits: product.benefits || [],
      features: []
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabaseProductAdapter] Supabase CMS is disabled, returning true`);
    return true;
  },
  
  clone: async (id: string): Promise<CMSProductType> => {
    console.log(`[supabaseProductAdapter] Supabase CMS is disabled, returning mock data`);
    return {
      id: 'cloned-' + id,
      title: 'Cloned Product',
      slug: 'cloned-product-' + Date.now(),
      description: '',
      visible: true,
      benefits: [],
      features: []
    };
  }
};
