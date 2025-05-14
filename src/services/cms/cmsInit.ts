
import { CMSProvider, forceCMSProvider } from '@/config/cms';
import { refreshContentfulClient } from './utils/contentfulClient';

/**
 * Force Contentful as the CMS provider and refresh the client
 * 
 * @returns Promise resolved when initialization is complete
 */
export async function forceContentfulProvider(): Promise<boolean> {
  console.log('[cmsInit] Forcing Contentful provider');
  
  try {
    // Set Contentful as the provider
    forceCMSProvider(CMSProvider.CONTENTFUL);
    
    // Refresh the client to ensure it's using the latest config
    const client = await refreshContentfulClient();
    
    // Mark as initialized in window for other components to check
    if (typeof window !== 'undefined') {
      window._contentfulInitialized = true;
    }
    
    return !!client;
  } catch (error) {
    console.error('[cmsInit] Error initializing Contentful:', error);
    return false;
  }
}

/**
 * Initialize the CMS with the default provider
 * Currently always uses Contentful
 * 
 * @returns Promise resolved when initialization is complete
 */
export async function initCMS(): Promise<boolean> {
  try {
    return await forceContentfulProvider();
  } catch (error) {
    console.error('[cmsInit] Error initializing CMS:', error);
    return false;
  }
}

/**
 * Get CMS initialization status
 */
export function getCMSInitializationStatus(): {
  initialized: boolean;
  provider: CMSProvider;
  source: string;
} {
  const initialized = typeof window !== 'undefined' ? !!window._contentfulInitialized : false;
  const source = typeof window !== 'undefined' && window._contentfulInitializedSource 
    ? window._contentfulInitializedSource 
    : 'unknown';
    
  return {
    initialized,
    provider: CMSProvider.CONTENTFUL,
    source
  };
}
