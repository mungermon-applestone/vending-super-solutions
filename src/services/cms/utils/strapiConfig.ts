
/**
 * Utility functions for Strapi configuration
 * 
 * @deprecated This module is deprecated as we are transitioning from Strapi to Contentful.
 * It will be removed in a future release. Please use Contentful utilities instead.
 */

/**
 * Get the base URL for the Strapi API from environment variables
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiBaseUrl(): string | undefined {
  console.warn('getStrapiBaseUrl is deprecated. Please use Contentful configuration instead.');
  return import.meta.env.VITE_STRAPI_API_URL || undefined;
}

/**
 * Get the API key for authenticating with Strapi from environment variables
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiApiKey(): string | undefined {
  console.warn('getStrapiApiKey is deprecated. Please use Contentful configuration instead.');
  return import.meta.env.VITE_STRAPI_API_KEY || undefined;
}

/**
 * Build headers for Strapi API requests including authorization if API key is available
 * @deprecated Use Contentful configuration instead
 */
export function getStrapiHeaders(includeAuth: boolean = true): HeadersInit {
  console.warn('getStrapiHeaders is deprecated. Please use Contentful configuration instead.');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const apiKey = getStrapiApiKey();
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
  }
  
  return headers;
}

/**
 * Check if Strapi is properly configured
 * @deprecated Use Contentful configuration check instead
 */
export function isStrapiConfigured(): boolean {
  console.warn('isStrapiConfigured is deprecated. Please use Contentful configuration check instead.');
  return false; // Always return false since we're deprecating Strapi
}

/**
 * Validate Strapi configuration and throw an error if not properly configured
 * @deprecated Use Contentful configuration validation instead
 */
export function validateStrapiConfig(): void {
  console.warn('validateStrapiConfig is deprecated. Please use Contentful configuration validation instead.');
  throw new Error('Strapi integration has been deprecated. Please use Contentful instead.');
}
