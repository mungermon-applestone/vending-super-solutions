
import { ContentProviderConfig, ContentProviderType } from './types';

/**
 * Configure Strapi as the CMS provider
 * @param apiUrl The base URL for the Strapi API
 * @param apiKey Optional API key for authentication with Strapi
 */
export function strapiConfig(apiUrl: string, apiKey?: string): ContentProviderConfig {
  return {
    type: ContentProviderType.STRAPI,
    apiUrl: apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl,
    apiKey
  };
}

/**
 * Configure Supabase as the CMS provider
 */
export function supabaseConfig(): ContentProviderConfig {
  return {
    type: ContentProviderType.SUPABASE
  };
}
