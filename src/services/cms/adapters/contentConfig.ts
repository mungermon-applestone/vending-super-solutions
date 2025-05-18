
/**
 * This file is now deprecated as we only support Contentful.
 * Kept for backwards compatibility.
 */

import { ProviderConfig, ContentProviderType } from './types';

/**
 * @deprecated - This is maintained for backwards compatibility only.
 * We now exclusively use Contentful.
 */
export function supabaseConfig(): ProviderConfig {
  console.warn('[contentConfig] Using supabaseConfig() is deprecated. We now exclusively support Contentful.');
  return {
    type: ContentProviderType.CONTENTFUL
  };
}
