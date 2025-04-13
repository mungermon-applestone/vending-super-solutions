
import { getCMSProviderConfig, setCMSProviderConfig, ContentProviderType } from './providerConfig';
import { strapiConfig, supabaseConfig } from './adapters/contentConfig';

// Re-export the CMS provider configuration utilities
export {
  getCMSProviderConfig,
  setCMSProviderConfig,
  ContentProviderType,
  strapiConfig,
  supabaseConfig
};

// Re-export all CMS services from the existing cms.ts file
export * from './cms';

/**
 * Configure the CMS to use Strapi
 * @param apiUrl Optional URL to the Strapi API (defaults to environment variable or config)
 * @param apiKey Optional API key for authentication (defaults to environment variable or config)
 */
export function useStrapi(apiUrl?: string, apiKey?: string): void {
  console.log('[CMS] Configuring to use Strapi CMS');
  setCMSProviderConfig(strapiConfig(apiUrl, apiKey));
}

/**
 * Configure the CMS to use Supabase
 */
export function useSupabase(): void {
  console.log('[CMS] Configuring to use Supabase CMS');
  setCMSProviderConfig(supabaseConfig());
}

/**
 * Initialize the CMS with the appropriate provider based on environment variables
 * This is called automatically when the application starts
 */
export function initializeCMS(): void {
  // Check for Strapi configuration first
  if (import.meta.env.VITE_CMS_PROVIDER === 'strapi' || import.meta.env.VITE_STRAPI_API_URL) {
    useStrapi();
    console.log('[CMS] Initialized with Strapi provider');
  } else {
    // Default to Supabase
    useSupabase();
    console.log('[CMS] Initialized with Supabase provider (default)');
  }
}

// Initialize the CMS when this module is imported
initializeCMS();
