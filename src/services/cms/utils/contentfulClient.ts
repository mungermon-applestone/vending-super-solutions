
import { createClient, ContentfulClientApi } from 'contentful';
import { toast } from 'sonner';

// Store the client instance for reuse
let contentfulClientInstance: ContentfulClientApi | null = null;

/**
 * Get a Contentful client instance, creating a new one if needed
 */
export async function getContentfulClient(): Promise<ContentfulClientApi> {
  if (contentfulClientInstance) {
    return contentfulClientInstance;
  }

  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  const environment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

  if (!spaceId || !accessToken) {
    console.error('[getContentfulClient] Missing Contentful credentials');
    throw new Error('Contentful credentials are missing');
  }

  try {
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

/**
 * Validate that the Contentful client is working correctly
 */
export async function validateContentfulClient(): Promise<boolean> {
  try {
    const client = await getContentfulClient();
    
    // Make a simple request to verify the client works
    const response = await client.getEntries({
      limit: 1,
    });
    
    return true;
  } catch (error) {
    console.error('[validateContentfulClient] Client validation failed:', error);
    return false;
  }
}
