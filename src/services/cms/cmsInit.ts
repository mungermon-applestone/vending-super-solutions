
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
  const strapiApiKey = import.meta.env.VITE_STRAPI_API_KEY || 'f849f3a6a6e44f303bcc5c97da0ebc887738bcc2dd403380c4bd7a156cfaaef63b2ae711ad1b38ea09b2802055402ee37d1396357ddc280c7e5c1fb758ea82d721f83e052d625bedaa3ba92834f14fe488d85a3a9f28ec4415a6d269d2db9c6944a3d9746827f729f9ea85bfb11543b8e02187ba43f1d3d3857a39a0bc5c0ed6';
  
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
      if (!config.strapiApiUrl) {
        console.error('[switchCMSProvider] Strapi API URL is required');
        return false;
      }
      
      setCMSProviderConfig(strapiConfig(
        config.strapiApiUrl,
        config.strapiApiKey
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
