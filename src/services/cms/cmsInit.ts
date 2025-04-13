
import { setCMSProviderConfig } from './providerConfig';
import { ContentProviderType } from './adapters/types';
import { initMockLandingPagesData } from './initMockData';

/**
 * Initialize the CMS configuration
 * This should be called at application startup
 */
export function initCMS(providerType?: ContentProviderType) {
  console.log('Initializing CMS configuration...');
  
  // Set default CMS provider - can be changed at runtime
  const selectedProvider = providerType || ContentProviderType.SUPABASE;
  setCMSProviderConfig({
    type: selectedProvider
  });
  
  console.log(`CMS provider set to: ${selectedProvider}`);
  
  // Initialize any mock data needed
  initMockLandingPagesData();
  
  console.log('CMS initialization complete');
}

/**
 * Switch CMS provider at runtime
 * Useful for testing different provider implementations
 */
export function switchCMSProvider(providerType: ContentProviderType) {
  console.log(`Switching CMS provider to: ${providerType}`);
  
  setCMSProviderConfig({
    type: providerType
  });
  
  console.log('CMS provider switched successfully');
  return true;
}
