
/**
 * @deprecated COMPATIBILITY LAYER - Do not use in new development
 * This file provides mock configurations for Strapi CMS that were previously removed
 * as part of the migration to Contentful.
 * 
 * TODO: Update all imports to use Contentful configuration directly.
 * This file will be removed in a future release.
 */

import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Log deprecation warning when this module is imported
const warnOnImport = () => {
  logDeprecationWarning(
    "strapiCms.ts",
    "Strapi CMS configuration is deprecated and will be removed in a future release.",
    "Please use Contentful configuration instead."
  );
};

// Execute warning
warnOnImport();

// Mock Strapi configuration values
export const STRAPI_API_URL = '';
export const STRAPI_API_KEY = '';
export const STRAPI_ENDPOINTS = {
  PRODUCTS: '/products',
  TECHNOLOGIES: '/technologies',
  BUSINESS_GOALS: '/business-goals',
  MACHINES: '/machines'
};

