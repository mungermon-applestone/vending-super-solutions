import { setCMSProviderConfig } from './providerConfig';
import { ContentProviderType } from './adapters/types';
import { strapiConfig, supabaseConfig } from './adapters/contentConfig';
import { initMockLandingPagesData } from './initMockData';

/**
 * Initialize the CMS configuration
 * This should be called at application startup
 * @param options Configuration options
 */
export function initCMS(options: {
  providerType?: ContentProviderType;
  strapiApiUrl?: string;
  strapiApiKey?: string;
} = {}) {
  console.log('Initializing CMS configuration...');
  
  // Set default CMS provider - can be changed at runtime
  const selectedProvider = options.providerType || ContentProviderType.SUPABASE;
  
  if (selectedProvider === ContentProviderType.STRAPI) {
    // Configure Strapi
    setCMSProviderConfig(strapiConfig(options.strapiApiUrl, options.strapiApiKey));
    console.log(`CMS provider set to: ${selectedProvider} with API URL: ${options.strapiApiUrl || 'default'}`);
  } else {
    // Configure Supabase
    setCMSProviderConfig(supabaseConfig());
    console.log(`CMS provider set to: ${selectedProvider}`);
  }
  
  // Initialize any mock data needed
  initMockLandingPagesData();
  
  console.log('CMS initialization complete');
}

/**
 * Switch CMS provider at runtime
 * Useful for testing different provider implementations
 * @param options Configuration options for the new provider
 */
export function switchCMSProvider(options: {
  providerType: ContentProviderType;
  strapiApiUrl?: string;
  strapiApiKey?: string;
}): boolean {
  console.log(`Switching CMS provider to: ${options.providerType}`);
  
  try {
    if (options.providerType === ContentProviderType.STRAPI) {
      // Configure Strapi
      setCMSProviderConfig(strapiConfig(options.strapiApiUrl, options.strapiApiKey));
      console.log(`Switched to Strapi with API URL: ${options.strapiApiUrl || 'default'}`);
    } else {
      // Configure Supabase
      setCMSProviderConfig(supabaseConfig());
      console.log('Switched to Supabase provider');
    }
    
    console.log('CMS provider switched successfully');
    return true;
  } catch (error) {
    console.error('Error switching CMS provider:', error);
    return false;
  }
}

/**
 * Get the current CMS configuration as a string
 * Useful for debugging
 */
export function getCMSConfigInfo(): string {
  const { getCMSProviderConfig } = require('./providerConfig');
  const config = getCMSProviderConfig();
  
  let configInfo = `CMS Provider Type: ${config.type}\n`;
  
  if (config.type === ContentProviderType.STRAPI) {
    configInfo += `API URL: ${config.apiUrl || 'Not set'}\n`;
    configInfo += `API Key: ${config.apiKey ? '******' : 'Not set'}\n`;
    
    // Add connection status
    if (config.apiUrl) {
      configInfo += `Connection Status: ${config.apiKey ? 'Fully configured' : 'API URL configured, but key missing'}\n`;
      configInfo += `Admin URL: ${config.apiUrl.replace(/\/api\/?$/, '/admin')}\n`;
    } else {
      configInfo += `Connection Status: Not configured\n`;
    }
    
    // Add setup instructions
    configInfo += `\nTo configure Strapi, set these environment variables in your .env file:
VITE_CMS_PROVIDER=strapi
VITE_STRAPI_API_URL=http://your-strapi-instance:1337/api
VITE_STRAPI_API_KEY=your_strapi_api_key`;
  } else {
    configInfo += `Connection Status: Using default Supabase integration\n`;
    configInfo += `\nTo use Supabase explicitly, set this environment variable:
VITE_CMS_PROVIDER=supabase`;
  }
  
  return configInfo;
}
