
import { STRAPI_CONFIG } from '@/config/cms';
import { ContentProviderConfig, ContentProviderType } from '../adapters/types';

/**
 * Gets the Strapi base URL, checking environment variables and configuration
 */
export function getStrapiBaseUrl(): string {
  // First check environment variables
  const envUrl = import.meta.env.VITE_STRAPI_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Then check config
  return STRAPI_CONFIG.API_URL;
}

/**
 * Gets the Strapi API key, checking environment variables and configuration
 */
export function getStrapiApiKey(): string | undefined {
  // First check environment variables
  const envKey = import.meta.env.VITE_STRAPI_API_KEY;
  if (envKey) {
    return envKey;
  }
  
  // Then check config
  return STRAPI_CONFIG.API_KEY;
}

/**
 * Build a complete Strapi API URL for an endpoint
 * @param endpoint API endpoint (e.g., "/api/technologies")
 * @returns Full URL to the Strapi API endpoint
 */
export function buildStrapiUrl(endpoint: string): string {
  const baseUrl = getStrapiBaseUrl();
  // Ensure we don't have double slashes
  if (baseUrl.endsWith('/') && endpoint.startsWith('/')) {
    return `${baseUrl}${endpoint.substring(1)}`;
  }
  
  // Ensure we have a slash between base URL and endpoint
  if (!baseUrl.endsWith('/') && !endpoint.startsWith('/')) {
    return `${baseUrl}/${endpoint}`;
  }
  
  return `${baseUrl}${endpoint}`;
}

/**
 * Create headers for Strapi API requests
 * @returns Headers object with authorization if API key is available
 */
export function createStrapiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const apiKey = getStrapiApiKey();
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  return headers;
}

/**
 * Check if we have the minimum required Strapi configuration
 */
export function hasStrapiConfig(): boolean {
  return !!getStrapiBaseUrl();
}

/**
 * Create a complete Strapi configuration object
 */
export function createStrapiConfig(): ContentProviderConfig {
  return {
    type: ContentProviderType.STRAPI,
    apiUrl: getStrapiBaseUrl(),
    apiKey: getStrapiApiKey()
  };
}
