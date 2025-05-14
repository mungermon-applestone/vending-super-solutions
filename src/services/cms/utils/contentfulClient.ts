
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';
import { toast } from 'sonner';

// Define client at module level for singleton-like behavior
let contentfulClient: ReturnType<typeof createClient> | null = null;

/**
 * Get the configured Contentful client
 * @returns A Promise that resolves to the Contentful client
 */
export async function getContentfulClient() {
  if (!contentfulClient) {
    if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
      console.error('[contentfulClient] Missing required Contentful configuration');
      throw new Error('CONTENTFUL_CONFIG_MISSING');
    }

    try {
      contentfulClient = createClient({
        space: CONTENTFUL_CONFIG.SPACE_ID,
        accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
        environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
      });
      console.log('[contentfulClient] Contentful client initialized');
    } catch (error) {
      console.error('[contentfulClient] Failed to initialize Contentful client:', error);
      throw error;
    }
  }

  return contentfulClient;
}

/**
 * Fetch entries from Contentful
 */
export async function fetchContentfulEntries(contentType: string, query: Record<string, any> = {}) {
  try {
    const client = await getContentfulClient();
    
    const response = await client.getEntries({
      content_type: contentType,
      ...query
    });
    
    if (!response.items || response.items.length === 0) {
      console.log(`[fetchContentfulEntries] No entries found for content type: ${contentType}`);
      return [];
    }
    
    return response.items;
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching entries for ${contentType}:`, error);
    throw error;
  }
}

/**
 * Fetch a single entry by ID
 */
export async function fetchContentfulEntry(entryId: string) {
  try {
    const client = await getContentfulClient();
    return await client.getEntry(entryId);
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching entry ${entryId}:`, error);
    throw error;
  }
}

/**
 * Validate the Contentful client connection
 */
export async function validateContentfulClient() {
  try {
    const client = await getContentfulClient();
    await client.getSpace(CONTENTFUL_CONFIG.SPACE_ID);
    return true;
  } catch (error) {
    console.error('[validateContentfulClient] Validation failed:', error);
    return false;
  }
}

/**
 * Test the Contentful connection and return the result
 */
export async function testContentfulConnection() {
  try {
    const client = await getContentfulClient();
    const space = await client.getSpace();
    return {
      success: true,
      message: `Connected to Contentful space: ${space.name}`,
      space
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error connecting to Contentful',
      error
    };
  }
}

/**
 * Force refresh the Contentful client
 */
export async function refreshContentfulClient() {
  try {
    console.log('[contentfulClient] Refreshing Contentful client');
    contentfulClient = null;
    await getContentfulClient();
    return true;
  } catch (error) {
    console.error('[contentfulClient] Failed to refresh client:', error);
    toast.error('Failed to refresh Contentful connection');
    return false;
  }
}

/**
 * Reset the Contentful client (for testing or cleanup)
 */
export function resetContentfulClient() {
  contentfulClient = null;
}
