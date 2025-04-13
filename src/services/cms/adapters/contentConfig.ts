
import { ContentProviderConfig, ContentProviderType } from './types';

/**
 * Default configuration values for content providers
 */
export const defaultContentConfig: ContentProviderConfig = {
  type: ContentProviderType.SUPABASE
};

/**
 * Get configuration for Strapi content provider
 * @param apiUrl URL of the Strapi API
 * @param apiKey Optional API key for authentication
 */
export const strapiConfig = (apiUrl?: string, apiKey?: string): ContentProviderConfig => {
  return {
    type: ContentProviderType.STRAPI,
    apiUrl: apiUrl || process.env.STRAPI_API_URL || 'http://localhost:1337',
    apiKey: apiKey || process.env.STRAPI_API_KEY
  };
};

/**
 * Get configuration for Supabase content provider
 */
export const supabaseConfig = (): ContentProviderConfig => {
  return {
    type: ContentProviderType.SUPABASE
  };
};
