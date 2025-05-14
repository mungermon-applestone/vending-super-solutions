
import { getContentfulClient, refreshContentfulClient, testContentfulConnection } from './utils/contentfulClient';

/**
 * Force the CMS provider to be Contentful
 */
export function forceContentfulProvider(): void {
  console.log('[cmsInit] Forcing Contentful provider');
  // Nothing to do since we're always using Contentful
}

/**
 * Reset any CMS provider settings
 */
export function resetCmsProvider(): void {
  // Nothing to do in the simplified architecture
}

/**
 * Initialize the CMS connection
 */
export async function initializeCms(): Promise<boolean> {
  try {
    console.log('[cmsInit] Initializing Contentful CMS');
    const client = getContentfulClient();
    if (!client) {
      console.error('[cmsInit] Failed to initialize Contentful client');
      return false;
    }
    
    // Test the connection
    const test = await testContentfulConnection();
    return test.success;
  } catch (error) {
    console.error('[cmsInit] Error initializing CMS:', error);
    return false;
  }
}

/**
 * Refresh the CMS connection
 */
export async function refreshCmsConnection(): Promise<boolean> {
  try {
    console.log('[cmsInit] Refreshing CMS connection');
    await refreshContentfulClient();
    const test = await testContentfulConnection();
    return test.success;
  } catch (error) {
    console.error('[cmsInit] Error refreshing CMS connection:', error);
    return false;
  }
}
