
/**
 * Legacy utilities for backwards compatibility
 * This file centralizes compatibility functions that were previously scattered across the codebase
 * 
 * @deprecated - All functions in this file will be removed in a future release
 */

import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

/**
 * Legacy Strapi configuration utilities - non-functional stubs that log deprecation warnings
 */
export const strapiUtils = {
  /**
   * @deprecated Use Contentful configuration instead
   */
  getStrapiBaseUrl: (): string | undefined => {
    logDeprecationWarning('getStrapiBaseUrl', 'Please use Contentful configuration instead.');
    return undefined;
  },

  /**
   * @deprecated Use Contentful configuration instead
   */
  getStrapiApiKey: (): string | undefined => {
    logDeprecationWarning('getStrapiApiKey', 'Please use Contentful configuration instead.');
    return undefined;
  },

  /**
   * @deprecated Use Contentful configuration instead
   */
  getStrapiHeaders: (includeAuth: boolean = true): HeadersInit => {
    logDeprecationWarning('getStrapiHeaders', 'Please use Contentful configuration instead.');
    return { 'Content-Type': 'application/json' };
  },

  /**
   * @deprecated Use Contentful configuration check instead
   */
  isStrapiConfigured: (): boolean => {
    logDeprecationWarning('isStrapiConfigured', 'Please use Contentful configuration check instead.');
    return false;
  },

  /**
   * @deprecated Use Contentful configuration validation instead
   */
  validateStrapiConfig: (): void => {
    logDeprecationWarning('validateStrapiConfig', 'Please use Contentful configuration validation instead.');
    throw new Error('Strapi integration has been deprecated. Please use Contentful instead.');
  },

  /**
   * @deprecated Use Contentful query builders instead
   */
  buildStrapiQueryParams: (options: any): URLSearchParams => {
    logDeprecationWarning('buildStrapiQueryParams', 'Please use Contentful query builders instead.');
    return new URLSearchParams();
  }
};

/**
 * @deprecated This function is maintained for backward compatibility only
 */
export function trackLegacyFeatureUsage(feature: string, details?: string): void {
  logDeprecationWarning(feature, `Legacy feature "${feature}" used`, "Use Contentful directly");
}

/**
 * @deprecated Use Contentful environment variables directly
 */
export const STRAPI_API_URL = '';

/**
 * @deprecated Use Contentful environment variables directly
 */
export const STRAPI_API_KEY = '';

/**
 * @deprecated Use Contentful content types directly
 */
export const STRAPI_ENDPOINTS = {
  PRODUCTS: '/products',
  TECHNOLOGIES: '/technologies',
  BUSINESS_GOALS: '/business-goals',
  MACHINES: '/machines'
};
