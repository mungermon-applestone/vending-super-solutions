
import { CMSProductType } from '@/types/cms';
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from './types';

/**
 * Implementation of the Product Adapter for Strapi CMS
 * This will be implemented when we integrate with Strapi
 */
export const strapiProductAdapter: ProductAdapter = {
  getAll: async (): Promise<CMSProductType[]> => {
    console.log('[strapiProductAdapter] getAll method called, but not implemented');
    throw new Error('Strapi adapter not yet implemented');
  },
  
  getBySlug: async (slug: string): Promise<CMSProductType | null> => {
    console.log(`[strapiProductAdapter] getBySlug method called with slug "${slug}", but not implemented`);
    throw new Error('Strapi adapter not yet implemented');
  },
  
  getById: async (id: string): Promise<CMSProductType | null> => {
    console.log(`[strapiProductAdapter] getById method called with id "${id}", but not implemented`);
    throw new Error('Strapi adapter not yet implemented');
  },
  
  create: async (data: ProductCreateInput): Promise<CMSProductType> => {
    console.log('[strapiProductAdapter] create method called, but not implemented', data);
    throw new Error('Strapi adapter not yet implemented');
  },
  
  update: async (id: string, data: ProductUpdateInput): Promise<CMSProductType> => {
    console.log(`[strapiProductAdapter] update method called for id "${id}", but not implemented`, data);
    throw new Error('Strapi adapter not yet implemented');
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[strapiProductAdapter] delete method called for id "${id}", but not implemented`);
    throw new Error('Strapi adapter not yet implemented');
  },
  
  clone: async (id: string): Promise<CMSProductType> => {
    console.log(`[strapiProductAdapter] clone method called for id "${id}", but not implemented`);
    throw new Error('Strapi adapter not yet implemented');
  }
};
