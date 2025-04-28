
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { testContentfulConnection, getContentfulClient } from './utils/contentfulClient';
import { toast } from 'sonner';

export async function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  try {
    // Test Contentful connection
    const testResult = await testContentfulConnection();
    if (!testResult.success) {
      console.error('[initCMS] Contentful connection test failed:', testResult.message);
      setCMSProviderConfig({
        type: ContentProviderType.CONTENTFUL,
        initialized: false,
        error: testResult.message
      });
      throw new Error(testResult.message);
    }
    
    console.log('[initCMS] Using Contentful CMS provider');
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL,
      initialized: true,
      error: null
    });
    return true;
  } catch (error) {
    console.error('[initCMS] Error initializing CMS:', error);
    toast.error('Failed to initialize CMS. Please check your configuration.');
    throw error;
  }
}

export function forceContentfulProvider() {
  console.log('[forceContentfulProvider] Forcing use of Contentful provider');
  try {
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL,
      initialized: true,
      error: null
    });
    return true;
  } catch (error) {
    console.error('[forceContentfulProvider] Error forcing Contentful provider:', error);
    return false;
  }
}

export async function refreshCmsConnection() {
  console.log('[refreshCmsConnection] Refreshing CMS connection');
  try {
    // Reset client first
    await getContentfulClient(true); 
    return await initCMS();
  } catch (error) {
    console.error('[refreshCmsConnection] Error refreshing connection:', error);
    return false;
  }
}
