
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { getStrapiBaseUrl, getStrapiApiKey } from './strapiConfig';

export interface CMSInfo {
  provider: string;
  status: 'configured' | 'partial' | 'not-configured';
  isConfigured: boolean;
  apiUrl?: string;
  apiKeyConfigured: boolean;
  adminUrl?: string;
}

/**
 * Get information about the current CMS configuration
 * @returns CMSInfo object with provider and configuration status
 */
export function getCMSInfo(): CMSInfo {
  const config = getCMSProviderConfig();
  
  // Handle Strapi provider
  if (config.type === ContentProviderType.STRAPI) {
    const baseUrl = getStrapiBaseUrl();
    const apiKey = getStrapiApiKey();
    
    const isConfigured = !!baseUrl && !!apiKey;
    const status = isConfigured ? 'configured' : (baseUrl ? 'partial' : 'not-configured');
    
    // Derive admin URL from the API URL (removing /api if present)
    let adminUrl;
    if (baseUrl) {
      adminUrl = baseUrl.replace(/\/api$/, '').replace(/\/$/, '') + '/admin';
    }
    
    return {
      provider: 'Strapi',
      status,
      isConfigured,
      apiUrl: baseUrl,
      apiKeyConfigured: !!apiKey,
      adminUrl
    };
  }
  
  // Default to Supabase
  return {
    provider: 'Supabase',
    status: 'configured',
    isConfigured: true,
    apiKeyConfigured: true
  };
}
