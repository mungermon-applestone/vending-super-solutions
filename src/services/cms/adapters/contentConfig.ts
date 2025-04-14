
import { ContentProviderConfig, ContentProviderType } from './types';

/**
 * Get the configuration for Supabase CMS provider
 */
export function supabaseConfig(): ContentProviderConfig {
  return {
    type: ContentProviderType.SUPABASE
  };
}
