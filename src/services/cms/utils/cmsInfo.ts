
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
  version?: string;
  adminUrl?: string;
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
    
    // Calculate admin URL by removing /api from the end if present
    let adminUrl = baseUrl ? baseUrl.replace(/\/api\/?$/, '/admin') : null;
    
    return {
      provider: 'Strapi',
      apiUrl: baseUrl,
      isConfigured,
      apiKeyConfigured,
      status,
      adminUrl: adminUrl || undefined
    };
  }
  
  // Default to Supabase
  return {
    provider: 'Supabase',
    apiUrl: null,
    isConfigured: true,  // Supabase is always configured through the Lovable integration
    apiKeyConfigured: true, // No separate API key needed for Supabase
    status: 'configured',
    version: 'Supabase'
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
    if (info.adminUrl) {
      lines.push(`Admin URL: ${info.adminUrl}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Check if the CMS provider is fully configured
 */
export function isCMSProviderConfigured(): boolean {
  const info = getCMSInfo();
  return info.status === 'configured';
}

/**
 * Get environment variables needed for CMS configuration
 * Useful for documentation and setup instructions
 */
export function getCMSEnvVariables(): string[] {
  const config = getCMSProviderConfig();
  
  if (config.type === ContentProviderType.STRAPI) {
    return [
      'VITE_CMS_PROVIDER=strapi',
      'VITE_STRAPI_API_URL=http://your-strapi-server:1337/api',
      'VITE_STRAPI_API_KEY=your_strapi_api_key'
    ];
  }
  
  // Default to Supabase
  return [
    'VITE_CMS_PROVIDER=supabase'
  ];
}
