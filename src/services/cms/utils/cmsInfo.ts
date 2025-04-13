
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';

/**
 * Get information about the current CMS configuration
 * Useful for debugging and displaying in admin panels
 */
export function getCMSInfo(): {
  provider: string;
  apiUrl?: string;
  isConfigured: boolean;
} {
  const config = getCMSProviderConfig();
  
  return {
    provider: config.type === ContentProviderType.STRAPI ? 'Strapi' : 'Supabase',
    apiUrl: config.apiUrl,
    isConfigured: config.type === ContentProviderType.STRAPI ? !!config.apiUrl : true
  };
}

/**
 * Check if the CMS is properly configured
 */
export function isCMSConfigured(): boolean {
  const config = getCMSProviderConfig();
  
  // Strapi requires an API URL to be configured
  if (config.type === ContentProviderType.STRAPI) {
    return !!config.apiUrl;
  }
  
  // Supabase is always considered configured since it uses the built-in client
  return true;
}
