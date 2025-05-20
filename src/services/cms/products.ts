
// This file has been updated as part of the migration to Contentful
import { toast } from 'sonner';
import { showDeprecationToast, throwDeprecatedOperationError } from './utils/deprecationToastUtils';

/**
 * @deprecated This module is deprecated and will be removed in future versions.
 * Use Contentful hooks directly instead.
 */

/**
 * Fetch all products from Contentful
 */
export const fetchProducts = async () => {
  console.warn('[fetchProducts] This function is deprecated. Use useContentfulProducts hook instead.');
  return [];
};

/**
 * Fetch product types from Contentful
 */
export const getProductTypes = async () => {
  showDeprecationToast(
    "Deprecated API Call", 
    "getProductTypes is deprecated. Use useContentfulProductTypes hook instead."
  );
  return [];
};

/**
 * Fetch product type by UUID
 */
export const getProductTypeByUUID = async (uuid: string) => {
  showDeprecationToast(
    "Deprecated API Call", 
    "getProductTypeByUUID is deprecated. Use useContentfulProductType hook instead."
  );
  return null;
};

/**
 * Fetch product type by slug
 */
export const getProductTypeBySlug = async (slug: string) => {
  showDeprecationToast(
    "Deprecated API Call", 
    "getProductTypeBySlug is deprecated. Use useContentfulProductType hook instead."
  );
  return null;
};

/**
 * Create a new product
 */
export const createProduct = async (data: any, toast: any) => {
  throwDeprecatedOperationError("createProduct");
  return null;
};

/**
 * Update an existing product
 */
export const updateProduct = async (data: any, slug: string, toast: any) => {
  throwDeprecatedOperationError("updateProduct");
  return null;
};

/**
 * Delete an existing product
 */
export const deleteProduct = async (slug: string) => {
  throwDeprecatedOperationError("deleteProduct");
  return { success: false, message: "Operation not supported" };
};

/**
 * Clone an existing product
 */
export const cloneProduct = async (id: string) => {
  throwDeprecatedOperationError("cloneProduct");
  return null;
};

export default fetchProducts;
