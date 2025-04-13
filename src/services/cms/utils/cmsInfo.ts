
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
  status: 'configured' | 'partial' | 'unconfigured';
} {
  const config = getCMSProviderConfig();
  
  if (config.type === ContentProviderType.STRAPI) {
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    const isConfigured = !!baseUrl;
    const apiKeyConfigured = !!apiKey;
    
    let status: 'configured' | 'partial' | 'unconfigured' = 'unconfigured';
    if (isConfigured && apiKeyConfigured) {
      status = 'configured';
    } else if (isConfigured) {
      status = 'partial';
    }
    
    return {
      provider: 'Strapi',
      apiUrl: baseUrl,
      isConfigured,
      apiKeyConfigured,
      status
    };
  }
  
  // Default to Supabase
  return {
    provider: 'Supabase',
    apiUrl: null,
    isConfigured: true,  // Supabase is always configured through the Lovable integration
    apiKeyConfigured: true, // No separate API key needed for Supabase
    status: 'configured'
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
    lines.push(`Status: ${info.status}`);
  }
  
  return lines.join('\n');
}
