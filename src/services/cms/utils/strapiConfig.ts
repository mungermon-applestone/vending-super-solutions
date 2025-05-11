
/**
 * @deprecated COMPATIBILITY LAYER - Do not use in new development
 * This file provides mock implementations for Strapi configuration functions
 * that were previously removed as part of the migration to Contentful.
 * 
 * TODO: Remove all dependencies on these functions and then remove this file.
 */

import { logDeprecationWarning } from './deprecationLogger';

/**
 * Mock implementation of previously removed function that returned Strapi base URL
 * @returns undefined to prevent actual API calls
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiBaseUrl(): string | undefined {
  logDeprecationWarning('getStrapiBaseUrl', 'Please use Contentful configuration instead.');
  return undefined;
}

/**
 * Mock implementation of previously removed function that returned Strapi API key
 * @returns undefined to prevent actual API calls
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiApiKey(): string | undefined {
  logDeprecationWarning('getStrapiApiKey', 'Please use Contentful configuration instead.');
  return undefined;
}

/**
 * Mock implementation of previously removed function that built headers for Strapi
 * @returns Empty headers object
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiHeaders(includeAuth: boolean = true): HeadersInit {
  logDeprecationWarning('getStrapiHeaders', 'Please use Contentful configuration instead.');
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Mock implementation of previously removed function that checked if Strapi was configured
 * @returns false to prevent actual API calls
 * @deprecated Use Contentful configuration validation instead
 */
export function isStrapiConfigured(): boolean {
  logDeprecationWarning('isStrapiConfigured', 'Please use Contentful configuration check instead.');
  return false;
}

/**
 * Mock implementation of previously removed function that validated Strapi configuration
 * @throws Error to prevent actual API calls
 * @deprecated Use Contentful configuration validation instead
 */
export function validateStrapiConfig(): void {
  logDeprecationWarning('validateStrapiConfig', 'Please use Contentful configuration validation instead.');
  throw new Error('Strapi integration has been deprecated. Please use Contentful instead.');
}

/**
 * Mock implementation of previously removed function that built query parameters for Strapi
 * @returns Empty URLSearchParams object
 * @deprecated Use Contentful query builders instead
 */
export function buildStrapiQueryParams(options: any): URLSearchParams {
  logDeprecationWarning('buildStrapiQueryParams', 'Please use Contentful query builders instead.');
  return new URLSearchParams();
}

