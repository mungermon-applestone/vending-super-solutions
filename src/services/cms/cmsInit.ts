
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { isContentfulConfigured } from '@/config/cms';

export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // Always use Contentful if it's configured
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

export function forceContentfulProvider() {
  console.log('[forceContentfulProvider] Forcing use of Contentful provider');
  setCMSProviderConfig({
    type: ContentProviderType.CONTENTFUL
  });
  return true;
}
