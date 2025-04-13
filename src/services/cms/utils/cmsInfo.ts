
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { getStrapiBaseUrl, getStrapiApiKey } from './strapiConfig';

/**
 * Get information about the current CMS configuration
 * Useful for displaying in the admin UI
 */
export function getCMSInfo(): {
  provider: string;
  apiUrl: string | null;
  isConfigured: boolean;
  apiKeyConfigured: boolean;
} {
  const config = getCMSProviderConfig();
  
  if (config.type === ContentProviderType.STRAPI) {
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    return {
      provider: 'Strapi',
      apiUrl: baseUrl,
      isConfigured: !!baseUrl,
      apiKeyConfigured: !!apiKey
    };
  }
  
  // Default to Supabase
  return {
    provider: 'Supabase',
    apiUrl: null,
    isConfigured: true,  // Supabase is always configured through the Lovable integration
    apiKeyConfigured: true
  };
}

/**
 * Get a formatted string with CMS configuration info
 */
export function getCMSConfigInfoString(): string {
  const info = getCMSInfo();
  
  const lines = [
    `CMS Provider: ${info.provider}`,
  ];
  
  if (info.provider === 'Strapi') {
    lines.push(`API URL: ${info.apiUrl || 'Not configured'}`);
    lines.push(`API Key: ${info.apiKeyConfigured ? 'Configured' : 'Not configured'}`);
  }
  
  return lines.join('\n');
}
