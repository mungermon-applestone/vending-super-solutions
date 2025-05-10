
/**
 * Contentful CMS Configuration
 */

// Contentful space ID
export const CONTENTFUL_SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';

// Contentful environment ID (typically 'master' for production)
export const CONTENTFUL_ENVIRONMENT_ID = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';

// Contentful Content Delivery API access token (for published content)
export const CONTENTFUL_ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '';

// Contentful Preview API token (for draft content)
export const CONTENTFUL_PREVIEW_TOKEN = import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || '';

// Whether to use the Preview API (for draft content) instead of the Content Delivery API
export const USE_CONTENTFUL_PREVIEW = import.meta.env.VITE_CONTENTFUL_PREVIEW === 'true';

/**
 * Check if Contentful is properly configured
 * @returns Boolean indicating if required Contentful variables are set
 */
export function isContentfulConfigured(): boolean {
  return (
    !!CONTENTFUL_SPACE_ID && 
    !!CONTENTFUL_ACCESS_TOKEN
  );
}

/**
 * Get the Contentful API base URL (either preview or delivery)
 * @returns The Contentful API base URL
 */
export function getContentfulApiBaseUrl(): string {
  if (USE_CONTENTFUL_PREVIEW) {
    return `https://preview.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}`;
  }
  return `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}`;
}

/**
 * Get the appropriate Contentful access token based on whether preview is enabled
 * @returns The Contentful access token
 */
export function getContentfulAccessToken(): string {
  return USE_CONTENTFUL_PREVIEW && CONTENTFUL_PREVIEW_TOKEN 
    ? CONTENTFUL_PREVIEW_TOKEN 
    : CONTENTFUL_ACCESS_TOKEN;
}

/**
 * Build headers for Contentful API requests
 * @returns Headers for Contentful API requests
 */
export function getContentfulHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getContentfulAccessToken()}`
  };
}

/**
 * Get the Contentful Management API token for admin operations
 * @returns The Contentful Management API token
 */
export function getContentfulManagementToken(): string | undefined {
  return import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN || undefined;
}
