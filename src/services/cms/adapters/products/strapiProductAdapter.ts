
/**
 * Placeholder for Strapi adapter implementation
 * This will be implemented during the Strapi integration phase
 */
import { CMSProductType } from '@/types/cms';
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from './types';

// Placeholder for Strapi adapter - to be implemented
export const strapiProductAdapter: ProductAdapter = {
  getAll: async () => {
    throw new Error('Strapi adapter not yet implemented');
  },
  getBySlug: async () => {
    throw new Error('Strapi adapter not yet implemented');
  },
  getById: async () => {
    throw new Error('Strapi adapter not yet implemented');
  },
  create: async () => {
    throw new Error('Strapi adapter not yet implemented');
  },
  update: async () => {
    throw new Error('Strapi adapter not yet implemented');
  },
  delete: async () => {
    throw new Error('Strapi adapter not yet implemented');
  },
  clone: async () => {
    throw new Error('Strapi adapter not yet implemented');
  }
};
