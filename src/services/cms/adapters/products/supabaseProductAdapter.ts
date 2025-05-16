
/**
 * @deprecated ARCHIVED ADAPTER - Do not use in new development
 * 
 * This adapter is deprecated as we are transitioning to Contentful.
 * This file provides a minimal implementation that logs operations 
 * and returns empty results.
 */

import { ProductAdapter } from './types';
import { contentfulProductAdapter } from './contentfulProductAdapter';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Log deprecation warning when this module is imported
const warnDeprecation = () => {
  logDeprecationWarning(
    "supabaseProductAdapter", 
    "This adapter is deprecated and will be removed in a future release.",
    "Please use contentfulProductAdapter directly."
  );
};

// Create a proxy that logs deprecation warnings and delegates to Contentful
export const supabaseProductAdapter: ProductAdapter = {
  getAll: async (filters) => {
    warnDeprecation();
    return await contentfulProductAdapter.getAll(filters);
  },
  
  getBySlug: async (slug) => {
    warnDeprecation();
    return await contentfulProductAdapter.getBySlug(slug);
  },
  
  getById: async (id) => {
    warnDeprecation();
    return await contentfulProductAdapter.getById(id);
  },
  
  create: async (product) => {
    warnDeprecation();
    return await contentfulProductAdapter.create(product);
  },
  
  update: async (id, product) => {
    warnDeprecation();
    return await contentfulProductAdapter.update(id, product);
  },
  
  delete: async (id) => {
    warnDeprecation();
    return await contentfulProductAdapter.delete(id);
  },
  
  clone: async (id) => {
    warnDeprecation();
    return await contentfulProductAdapter.clone(id);
  }
};
