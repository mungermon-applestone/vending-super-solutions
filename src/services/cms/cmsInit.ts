
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { supabaseConfig } from './adapters/contentConfig';

/**
 * Initialize the CMS configuration
 */
export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // We're only using Supabase as the CMS provider
  console.log('[initCMS] Using Supabase CMS provider');
  setCMSProviderConfig(supabaseConfig());
  
  console.log('[initCMS] CMS initialization complete');
  return true;
}

/**
 * This function is kept for backward compatibility but now only supports Supabase
 */
export function switchCMSProvider(_options?: any) {
  console.log('[switchCMSProvider] Using Supabase provider');
  setCMSProviderConfig(supabaseConfig());
  return true;
}
