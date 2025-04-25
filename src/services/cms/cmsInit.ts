
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { isContentfulConfigured } from '@/config/cms';

/**
 * Initialize the CMS configuration
 */
export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // Check if Contentful is configured
  if (isContentfulConfigured()) {
    console.log('[initCMS] Using Contentful CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL
    });
  } else {
    console.log('[initCMS] Contentful not configured, falling back to Supabase CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.SUPABASE
    });
  }
  
  console.log('[initCMS] CMS initialization complete');
  return true;
}

/**
 * This function is kept for backward compatibility but now prioritizes Contentful
 */
export function switchCMSProvider(_options?: any) {
  if (isContentfulConfigured()) {
    console.log('[switchCMSProvider] Using Contentful provider');
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL
    });
  } else {
    console.log('[switchCMSProvider] Contentful not configured, using Supabase provider');
    setCMSProviderConfig({
      type: ContentProviderType.SUPABASE
    });
  }
  return true;
}
