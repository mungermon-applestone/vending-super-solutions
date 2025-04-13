
import { setCMSProviderConfig } from './providerConfig';
import { ContentProviderType } from './adapters/types';
import { initMockLandingPagesData } from './initMockData';

/**
 * Initialize the CMS configuration
 * This should be called at application startup
 */
export function initCMS() {
  console.log('Initializing CMS configuration...');
  
  // Set default CMS provider - can be changed at runtime
  setCMSProviderConfig({
    type: ContentProviderType.SUPABASE
  });
  
  // Initialize any mock data needed
  initMockLandingPagesData();
  
  console.log('CMS initialization complete');
}
