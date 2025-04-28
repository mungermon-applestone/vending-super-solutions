
import { ContentProviderType } from './adapters/types';
import { setCMSProviderConfig } from './providerConfig';
import { testContentfulConnection, getContentfulClient, refreshContentfulClient } from './utils/contentfulClient';
import { toast } from 'sonner';
import { isContentfulConfigured } from '@/config/cms';

export async function initCMS() {
  console.log('[initCMS] Initializing CMS configuration...');
  
  // Check if Contentful is configured
  if (!isContentfulConfigured()) {
    console.error('[initCMS] Contentful is not configured');
    setCMSProviderConfig({
      type: ContentProviderType.CONTENTFUL,
      initialized: false,
      error: 'Contentful credentials not configured'
    });
    throw new Error('Contentful credentials not configured. Please set up your Space ID and Delivery Token in Admin > Environment Variables.');
  }
  
  try {
    // Refresh the client to ensure we have the latest configuration
    await refreshContentfulClient();
    
    // Test Contentful connection
    const testResult = await testContentfulConnection();
    if (!testResult.success) {
      console.error('[initCMS] Contentful connection test failed:', testResult.message);
      setCMSProviderConfig({
        type: ContentProviderType.CONTENTFUL,
        initialized: false,
        error: testResult.message
      });
      throw new Error(`Contentful connection failed: ${testResult.message}`);
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
    await refreshContentfulClient(); 
    return await initCMS();
  } catch (error) {
    console.error('[refreshCmsConnection] Error refreshing connection:', error);
    throw error;
  }
}
