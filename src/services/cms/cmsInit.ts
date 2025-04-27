
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { isContentfulConfigured } from '@/config/cms';

export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // Always use Contentful as the CMS provider since we're no longer using Supabase
  console.log('[initCMS] Using Contentful CMS provider');
  setCMSProviderConfig({
    type: ContentProviderType.CONTENTFUL
  });
  return true;
}

export function forceContentfulProvider() {
  console.log('[forceContentfulProvider] Forcing use of Contentful provider');
  setCMSProviderConfig({
    type: ContentProviderType.CONTENTFUL
  });
  return true;
}
