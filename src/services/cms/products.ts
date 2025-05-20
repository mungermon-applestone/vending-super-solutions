
// This file has been updated as part of the migration to Contentful
import { ContentfulProduct } from '@/types/contentful';

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

export default fetchProducts;
