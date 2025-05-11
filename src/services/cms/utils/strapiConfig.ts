
/**
 * @deprecated COMPATIBILITY LAYER - All functionality in this file will be removed in v3.0
 * 
 * This module provides compatibility functions for legacy code that depended on Strapi.
 * All new development should use Contentful APIs and configuration directly.
 */

import { logDeprecation } from './deprecationUtils';

// Log warning when this module is imported
const warnOnImport = () => {
  logDeprecation(
    "strapiConfig.ts",
    "Importing deprecated Strapi configuration utilities.",
    "Use Contentful configuration utilities from src/services/cms/utils/contentfulConfig.ts"
  );
};

// Execute warning
warnOnImport();

/**
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiBaseUrl(): string {
  logDeprecation('getStrapiBaseUrl', 'Use contentful client instead');
  return 'DEPRECATED';
}

/**
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiApiKey(): string {
  logDeprecation('getStrapiApiKey', 'Use contentful client instead');
  return 'DEPRECATED';
}

/**
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiHeaders(): Record<string, string> {
  logDeprecation('getStrapiHeaders', 'Use contentful client instead');
  return { 'Content-Type': 'application/json' };
}

/**
 * @deprecated Use isContentfulConfigured instead
 */
export function isStrapiConfigured(): boolean {
  logDeprecation('isStrapiConfigured', 'Use isContentfulConfigured instead');
  return false;
}

/**
 * @deprecated Use contentful validation instead
 */
export function validateStrapiConfig(): void {
  logDeprecation('validateStrapiConfig', 'Use contentful validation instead');
  throw new Error("Strapi configuration no longer supported. Use Contentful instead.");
}

/**
 * @deprecated Use contentful query parameters instead
 */
export function buildStrapiQueryParams(options: any): URLSearchParams {
  logDeprecation('buildStrapiQueryParams', 'Use contentful query parameters instead');
  return new URLSearchParams();
}
