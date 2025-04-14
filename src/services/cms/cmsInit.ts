
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { supabaseConfig } from './adapters/contentConfig';

/**
 * Initialize the CMS configuration
 */
export function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // Always use Supabase as the CMS provider
  console.log('[initCMS] Using Supabase CMS provider');
  setCMSProviderConfig(supabaseConfig());
  return true;
}

/**
 * This function is kept for backwards compatibility but now only supports Supabase
 */
export function switchCMSProvider() {
  console.log('[switchCMSProvider] Switching to Supabase provider');
  setCMSProviderConfig(supabaseConfig());
  return true;
}
