
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { isContentfulConfigured } from '@/config/cms';

/**
 * Initialize the CMS configuration
 */
export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // Check if Contentful is configured - ALWAYS prioritize Contentful
  if (isContentfulConfigured()) {
    console.log('[initCMS] Using Contentful CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL
    });
    return true;
  } else {
    console.warn('[initCMS] Contentful not configured, falling back to Supabase CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.SUPABASE
    });
    return false;
  }
}

/**
 * This function forces the use of Contentful, ignoring Supabase
 */
export function forceContentfulProvider() {
  console.log('[forceContentfulProvider] Forcing use of Contentful provider');
  setCMSProviderConfig({
    type: ContentProviderType.CONTENTFUL
  });
  return true;
}
