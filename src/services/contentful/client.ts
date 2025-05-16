
/**
 * This file handles the creation and management of the Contentful client
 */

import { createClient, ContentfulClientApi } from "contentful";
import { waitForEnvironmentVariables, getContentfulSpaceId, getContentfulAccessToken, getContentfulEnvironment, isContentfulConfigured } from './environment';
import { toast } from "sonner";

// Store the client instance for reuse
let contentfulClientInstance: ContentfulClientApi | null = null;

/**
 * Get or create a Contentful client instance using environment variables
 * This uses lazy initialization to only create the client when needed
 * and now waits for environment variables to be loaded
 */
export async function getContentfulClient(): Promise<ContentfulClientApi> {
  // Wait for environment variables to be fully loaded
  await waitForEnvironmentVariables();
  
  if (contentfulClientInstance) {
    return contentfulClientInstance;
  }

  // Get credentials from environment or window.env
  const spaceId = getContentfulSpaceId();
  const accessToken = getContentfulAccessToken();
  const environment = getContentfulEnvironment();

  if (!spaceId || !accessToken) {
    console.error('[getContentfulClient] Missing Contentful credentials');
    throw new Error('Contentful credentials are missing. Please check your configuration.');
  }

  try {
    console.log('[getContentfulClient] Creating new Contentful client instance with:', { 
      spaceId, 
      hasAccessToken: !!accessToken, 
      environment 
    });
    
    contentfulClientInstance = createClient({
      space: spaceId,
      accessToken,
      environment,
    });

    return contentfulClientInstance;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    throw new Error('Failed to initialize Contentful client');
  }
}

/**
 * Refresh the Contentful client instance (for example, after credentials change)
 */
export async function refreshContentfulClient(): Promise<ContentfulClientApi> {
  // Clear existing instance
  contentfulClientInstance = null;
  
  try {
    const newClient = await getContentfulClient();
    toast.success('Contentful client refreshed');
    return newClient;
  } catch (error) {
    toast.error('Failed to refresh Contentful client');
    throw error;
  }
}

// Export contentfulClient for backward compatibility
// This is now just an empty object that proxies to the real client
// It will be populated on first use via the proxy handler
export const contentfulClient = new Proxy({} as ContentfulClientApi, {
  get: (target, prop) => {
    // Create a function that gets the client and calls the requested method
    return async (...args: any[]) => {
      try {
        const client = await getContentfulClient();
        // @ts-ignore - we know the property exists on the client
        return client[prop](...args);
      } catch (error) {
        console.error(`[contentfulClient.${String(prop)}] Error:`, error);
        throw error;
      }
    };
  }
});

// Re-export environment functions for convenience
export { 
  waitForEnvironmentVariables,
  isContentfulConfigured,
  getContentfulSpaceId,
  getContentfulAccessToken,
  getContentfulEnvironment
};
