
/**
 * Utility functions to provide information about the CMS configuration
 */

import { isContentfulConfigured } from '@/config/contentful';

interface CMSInfo {
  provider: 'contentful';
  isConfigured: boolean;
  version: string;
}

/**
 * Get information about the current CMS configuration
 * @returns Object with CMS information
 */
export function getCMSInfo(): CMSInfo {
  return {
    provider: 'contentful',
    isConfigured: isContentfulConfigured(),
    version: '1.0.0',
  };
}

/**
 * Check if CMS is properly configured
 * @returns Boolean indicating if CMS is properly configured
 */
export function isCMSConfigured(): boolean {
  return isContentfulConfigured();
}
