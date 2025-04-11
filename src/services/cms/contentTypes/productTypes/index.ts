
import { ContentTypeOperations } from '../types';
import { CMSProductType, QueryOptions } from '@/types/cms';
import { fetchProductTypes } from './fetchProductTypes';
import { fetchProductTypeBySlug } from './fetchProductTypeBySlug';
import { fetchProductTypeByUUID } from './fetchProductTypeByUUID';
import { createProductType } from './createProductType';
import { updateProductType } from './updateProductType';
import { deleteProductType } from './deleteProductType';

/**
 * Standardized API for product type operations
 */
export const productTypeOperations: ContentTypeOperations<CMSProductType> = {
  fetchAll: (options?: QueryOptions) => fetchProductTypes(options?.filters),
  fetchBySlug: fetchProductTypeBySlug,
  fetchById: fetchProductTypeByUUID,
  create: async (data: any) => {
    // Create returns the full product type
    return await createProductType(data);
  },
  update: async (idOrSlug: string, data: any) => {
    // Update returns the updated product type
    return await updateProductType(idOrSlug, data);
  },
  delete: deleteProductType
};

// Export individual operations for backward compatibility
export {
  fetchProductTypes,
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  createProductType,
  updateProductType,
  deleteProductType
};
