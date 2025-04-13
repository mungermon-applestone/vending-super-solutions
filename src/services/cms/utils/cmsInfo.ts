
import { getCMSProviderConfig, ContentProviderType } from '../providerConfig';

/**
 * Get information about the current CMS provider
 */
export function getCMSInfo() {
  const config = getCMSProviderConfig();
  
  if (config.type === ContentProviderType.STRAPI) {
    return {
      provider: 'Strapi',
      apiUrl: config.apiUrl,
      apiKeyConfigured: !!config.apiKey,
      adminUrl: config.apiUrl ? config.apiUrl.replace('/api', '/admin') : undefined,
      isConfigured: !!config.apiUrl && !!config.apiKey,
      status: !!config.apiUrl && !!config.apiKey ? 'configured' : (!!config.apiUrl ? 'partial' : 'none')
    };
  } else {
    return {
      provider: 'Supabase',
      isConfigured: true,
      status: 'configured'
    };
  }
}
