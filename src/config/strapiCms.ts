
// This file is kept for backward compatibility
// All new code should use Contentful directly

import { logDeprecation } from '@/services/cms/utils/deprecation';

export const STRAPI_CONFIG = {
  API_URL: import.meta.env.VITE_STRAPI_API_URL || '',
  API_TOKEN: import.meta.env.VITE_STRAPI_TOKEN || '',
};

// Check if Strapi is properly configured (it isn't anymore, since we use Contentful now)
export function isStrapiConfigured(): boolean {
  // Log deprecation for anyone still checking this
  logDeprecation(
    'isStrapiConfigured',
    'Strapi CMS is no longer supported',
    'Use Contentful for all CMS operations'
  );
  
  return false;
}

// This function is kept only for backward compatibility
export function getMediaUrl(mediaId: string): string {
  logDeprecation(
    'getMediaUrl',
    'Strapi media URLs are no longer supported',
    'Use Contentful assets instead'
  );
  
  return '';
}

export function logStrapiConfig(): void {
  logDeprecation(
    'logStrapiConfig',
    'Strapi configuration logging is deprecated',
    'Use logContentfulConfig instead'
  );
}
