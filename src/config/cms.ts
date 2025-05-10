
/**
 * CMS Configuration
 */

import { isContentfulConfigured } from './contentful';

/**
 * Current selected CMS provider
 */
export type CMSProvider = 'contentful';

export const CMS_PROVIDER: CMSProvider = 'contentful';

/**
 * Check if CMS is properly configured
 * @returns Boolean indicating if CMS is properly configured
 */
export function isCMSConfigured(): boolean {
  // We only support Contentful now
  return isContentfulConfigured();
}

/**
 * Check if the current environment is a preview environment
 * @returns Boolean indicating if this is a preview environment
 */
export function isPreviewEnvironment(): boolean {
  return !!import.meta.env.VITE_CONTENTFUL_PREVIEW === true || 
    import.meta.env.VITE_CONTENTFUL_PREVIEW === 'true';
}

/**
 * Check if the site is running in development mode
 * @returns Boolean indicating if the site is running in development mode
 */
export function isDevelopmentMode(): boolean {
  return import.meta.env.DEV === true;
}

/**
 * Get CMS provider name for display
 * @returns Human readable CMS provider name
 */
export function getCMSProviderName(): string {
  return 'Contentful';
}
