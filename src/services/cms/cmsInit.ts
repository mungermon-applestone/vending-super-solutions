
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { strapiConfig, supabaseConfig } from './adapters/contentConfig';

/**
 * Initialize the CMS configuration based on environment variables
 */
export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');

  // Check environment variable to determine which CMS provider to use
  const cmsProvider = import.meta.env.VITE_CMS_PROVIDER?.toLowerCase();
  
  // Get Strapi configuration from environment variables
  const strapiApiUrl = import.meta.env.VITE_STRAPI_API_URL || 'https://strong-balance-0789566afc.strapiapp.com/api';
  const strapiApiKey = import.meta.env.VITE_STRAPI_API_KEY || '';
  
  // Use Strapi by default in this application
  console.log(`[initCMS] Using Strapi CMS provider with URL: ${strapiApiUrl}`);
  setCMSProviderConfig(strapiConfig(strapiApiUrl, strapiApiKey));
  return true;
}

/**
 * Switch to a different CMS provider at runtime
 * @param config Configuration for the new CMS provider
 */
export function switchCMSProvider(config: {
  providerType: ContentProviderType;
  strapiApiUrl?: string;
  strapiApiKey?: string;
}): boolean {
  try {
    console.log(`[switchCMSProvider] Switching to ${ContentProviderType[config.providerType]} provider`);
    
    if (config.providerType === ContentProviderType.STRAPI) {
      // Ensure we have a valid URL
      const strapiApiUrl = config.strapiApiUrl || import.meta.env.VITE_STRAPI_API_URL || 'https://strong-balance-0789566afc.strapiapp.com/api';
      
      if (!strapiApiUrl) {
        console.error('[switchCMSProvider] Strapi API URL is required');
        return false;
      }
      
      console.log(`[switchCMSProvider] Setting Strapi config with URL: ${strapiApiUrl}`);
      
      setCMSProviderConfig(strapiConfig(
        strapiApiUrl,
        config.strapiApiKey || import.meta.env.VITE_STRAPI_API_KEY || ''
      ));
    } else {
      setCMSProviderConfig(supabaseConfig());
    }
    
    return true;
  } catch (error) {
    console.error('[switchCMSProvider] Error switching CMS provider:', error);
    return false;
  }
}
