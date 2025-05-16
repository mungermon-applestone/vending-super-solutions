
/**
 * @deprecated ARCHIVED CODE - Do not use in new development
 * 
 * Utility functions for Strapi configuration
 * 
 * This file has been moved to the archive as part of our migration from
 * legacy CMS implementations to Contentful.
 */

import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

/**
 * Get the base URL for the Strapi API from environment variables
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiBaseUrl(): string | undefined {
  logDeprecationWarning('getStrapiBaseUrl', 'Please use Contentful configuration instead.');
  return undefined;
}

/**
 * Get the API key for authenticating with Strapi from environment variables
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiApiKey(): string | undefined {
  logDeprecationWarning('getStrapiApiKey', 'Please use Contentful configuration instead.');
  return undefined;
}

/**
 * Build headers for Strapi API requests including authorization if API key is available
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiHeaders(includeAuth: boolean = true): HeadersInit {
  logDeprecationWarning('getStrapiHeaders', 'Please use Contentful configuration instead.');
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Check if Strapi is properly configured
 * @deprecated Use Contentful configuration check instead
 */
export function isStrapiConfigured(): boolean {
  logDeprecationWarning('isStrapiConfigured', 'Please use Contentful configuration check instead.');
  return false;
}

/**
 * Validate Strapi configuration and throw an error if not properly configured
 * @deprecated Use Contentful configuration validation instead
 */
export function validateStrapiConfig(): void {
  logDeprecationWarning('validateStrapiConfig', 'Please use Contentful configuration validation instead.');
  throw new Error('Strapi integration has been deprecated. Please use Contentful instead.');
}

/**
 * Helper to build Strapi query parameters for API requests
 * @deprecated Use Contentful query builders instead
 */
export function buildStrapiQueryParams(options: any): URLSearchParams {
  logDeprecationWarning('buildStrapiQueryParams', 'Please use Contentful query builders instead.');
  return new URLSearchParams();
}
