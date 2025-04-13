
import { setCMSProviderConfig } from './providerConfig';
import { ContentProviderType } from './adapters/types';
import { strapiConfig } from './adapters/contentConfig';

/**
 * Initialize the CMS configuration based on environment variables
 * This should be called at application startup
 */
export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');

  // Check environment variable to determine which CMS provider to use
  const cmsProvider = import.meta.env.VITE_CMS_PROVIDER?.toLowerCase();
  
  // Get Strapi configuration from environment variables
  const strapiApiUrl = import.meta.env.VITE_STRAPI_API_URL;
  const strapiApiKey = import.meta.env.VITE_STRAPI_API_KEY;
  
  if (cmsProvider === 'strapi' && strapiApiUrl) {
    // Configure Strapi as the CMS provider
    console.log(`[initCMS] Using Strapi CMS provider with URL: ${strapiApiUrl}`);
    setCMSProviderConfig(strapiConfig(strapiApiUrl, strapiApiKey));
  } else {
    // Default to Supabase if no valid configuration is found
    console.log('[initCMS] Using default Supabase CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.SUPABASE
    });
  }
  
  console.log('[initCMS] CMS initialization complete');
}
