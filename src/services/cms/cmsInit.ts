
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { testContentfulConnection } from './utils/contentfulClient';

export async function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  try {
    // Test Contentful connection
    const testResult = await testContentfulConnection();
    if (!testResult.success) {
      console.error('[initCMS] Contentful connection test failed:', testResult.message);
      throw new Error(testResult.message);
    }
    
    console.log('[initCMS] Using Contentful CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL
    });
    return true;
  } catch (error) {
    console.error('[initCMS] Error initializing CMS:', error);
    throw error;
  }
}

export function forceContentfulProvider() {
  console.log('[forceContentfulProvider] Forcing use of Contentful provider');
  setCMSProviderConfig({
    type: ContentProviderType.CONTENTFUL
  });
  return true;
}
