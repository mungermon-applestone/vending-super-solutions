
/**
 * CMS Initialization Module
 */
import * as contentful from 'contentful';
import { CONTENTFUL_CONFIG, isContentfulConfigured, logContentfulConfig } from '@/config/cms';
import { toast } from 'sonner';

// Store the client instance
let contentfulClient: contentful.ContentfulClientApi | null = null;

/**
 * Force the CMS provider to be Contentful
 */
export function forceContentfulProvider(): void {
  // This is now a no-op since we're only supporting Contentful
  console.log('[CMS] Using Contentful as the CMS provider');
}

/**
 * Initialize the CMS
 */
export async function initCMS(): Promise<void> {
  console.log('[CMS] Initializing CMS...');
  
  if (!isContentfulConfigured()) {
    console.error('[CMS] Contentful is not configured');
    throw new Error('Contentful is not configured');
  }
  
  logContentfulConfig();
  
  try {
    // Initialize Contentful client
    contentfulClient = contentful.createClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
    });
    
    // Test the connection
    await contentfulClient.getEntries({
      limit: 1,
      content_type: 'blogPost' // Using blogPost as a test content type
    });
    
    console.log('[CMS] CMS initialized successfully');
  } catch (error) {
    console.error('[CMS] Failed to initialize CMS:', error);
    toast.error('Failed to connect to Contentful');
    throw error;
  }
}

/**
 * Refresh the CMS connection
 */
export async function refreshCmsConnection(): Promise<void> {
  console.log('[CMS] Refreshing CMS connection...');
  
  // Reset the client
  contentfulClient = null;
  
  // Re-initialize
  await initCMS();
}

/**
 * Get the Contentful client
 */
export function getContentfulClient(): contentful.ContentfulClientApi {
  if (!contentfulClient) {
    throw new Error('Contentful client not initialized. Call initCMS() first.');
  }
  return contentfulClient;
}

/**
 * Refresh the Contentful client
 */
export function refreshContentfulClient(): contentful.ContentfulClientApi {
  // Re-create the client
  contentfulClient = contentful.createClient({
    space: CONTENTFUL_CONFIG.SPACE_ID,
    accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
  });
  
  return contentfulClient;
}

/**
 * Check if the CMS is initialized
 */
export function isCMSInitialized(): boolean {
  return contentfulClient !== null;
}
