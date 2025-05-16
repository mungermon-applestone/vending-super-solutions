
/**
 * @deprecated COMPATIBILITY LAYER - Will be removed in v3.0
 * 
 * This file provides compatibility for legacy code that depended on Strapi configurations.
 * All new development should use Contentful directly.
 * 
 * REMOVAL PLAN:
 * 1. Phase out imports of this file (in progress)
 * 2. Track usage with deprecation logger (in progress)
 * 3. Complete removal in v3.0
 */

import { logDeprecation } from '@/services/cms/utils/deprecationUtils';

// Empty constants to maintain interface compatibility
export const STRAPI_API_URL = '';
export const STRAPI_API_KEY = '';
export const STRAPI_ENDPOINTS = {
  PRODUCTS: '/products',
  TECHNOLOGIES: '/technologies',
  BUSINESS_GOALS: '/business-goals',
  MACHINES: '/machines'
};

// Log deprecation warning when this module is imported
logDeprecation(
  "strapiCms.ts",
  "Importing deprecated Strapi CMS configuration",
  "Use Contentful configuration directly"
);

// Add a console warning on import
console.warn(
  "⚠️ DEPRECATION WARNING: strapiCms.ts is deprecated and will be removed in v3.0. " +
  "Use Contentful configuration directly."
);
