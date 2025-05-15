
/**
 * Utility functions for Strapi configuration
 */

/**
 * Get the base URL for the Strapi API from environment variables
 */
export function getStrapiBaseUrl(): string | undefined {
  return import.meta.env.VITE_STRAPI_API_URL || undefined;
}

/**
 * Get the API key for authenticating with Strapi from environment variables
 */
export function getStrapiApiKey(): string | undefined {
  return import.meta.env.VITE_STRAPI_API_KEY || undefined;
}

/**
 * Build headers for Strapi API requests including authorization if API key is available
 */
export function getStrapiHeaders(includeAuth: boolean = true): HeadersInit {
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
 */
export function isStrapiConfigured(): boolean {
  return !!getStrapiBaseUrl() && !!getStrapiApiKey();
}

/**
 * Validate Strapi configuration and throw an error if not properly configured
 */
export function validateStrapiConfig(): void {
  const baseUrl = getStrapiBaseUrl();
  const apiKey = getStrapiApiKey();
  
  if (!baseUrl) {
    throw new Error('Strapi API URL not configured. Set VITE_STRAPI_API_URL environment variable.');
  }
  
  if (!apiKey) {
    throw new Error('Strapi API key not configured. Set VITE_STRAPI_API_KEY environment variable.');
  }
}
