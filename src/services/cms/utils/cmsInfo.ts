
/**
 * Provides information about the current CMS configuration
 */
import { getCMSProviderConfig, ContentProviderType } from '../providerConfig';

/**
 * Get information about the currently configured CMS
 */
export function getCMSInfo() {
  const config = getCMSProviderConfig();
  const isStrapi = config.type === ContentProviderType.STRAPI;
  
  return {
    provider: isStrapi ? 'Strapi' : 'Supabase',
    apiUrl: isStrapi ? config.apiUrl : undefined,
    apiKeyConfigured: isStrapi && !!config.apiKey,
    isConfigured: isStrapi ? (!!config.apiUrl && !!config.apiKey) : true,
    status: isStrapi 
      ? (!!config.apiUrl && !!config.apiKey) 
        ? 'configured' 
        : (!!config.apiUrl || !!config.apiKey) 
          ? 'partial' 
          : 'unconfigured'
      : 'configured',
    adminUrl: isStrapi ? getStrapiAdminUrl(config.apiUrl) : undefined
  };
}

/**
 * Get the admin URL for a Strapi instance
 */
function getStrapiAdminUrl(apiUrl?: string): string | undefined {
  if (!apiUrl) return undefined;
  
  // If the URL ends with /api, remove it to get the base URL
  const baseUrl = apiUrl.endsWith('/api')
    ? apiUrl.slice(0, -4)
    : apiUrl;
  
  return `${baseUrl}/admin`;
}
