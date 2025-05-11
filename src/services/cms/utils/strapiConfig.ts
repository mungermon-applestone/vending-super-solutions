
/**
 * @deprecated COMPATIBILITY LAYER - Do not use in new development
 * This file provides mock implementations for Strapi configuration functions
 * that were previously removed as part of the migration to Contentful.
 * 
 * TODO: Remove all dependencies on these functions and then remove this file.
 */

import { strapiUtils } from '@/legacy/utils/legacyUtils';
import { logDeprecationWarning } from './deprecationLogger';

// Log deprecation when this module is imported
(() => {
  logDeprecationWarning(
    "strapiConfig.ts",
    "This module is deprecated and will be removed in a future release",
    "Please use Contentful configuration utilities instead"
  );
})();

// Re-export all functions from strapiUtils
export const getStrapiBaseUrl = strapiUtils.getStrapiBaseUrl;
export const getStrapiApiKey = strapiUtils.getStrapiApiKey;
export const getStrapiHeaders = strapiUtils.getStrapiHeaders;
export const isStrapiConfigured = strapiUtils.isStrapiConfigured;
export const validateStrapiConfig = strapiUtils.validateStrapiConfig;
export const buildStrapiQueryParams = strapiUtils.buildStrapiQueryParams;

