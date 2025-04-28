
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG, logContentfulConfig } from '@/config/cms';
import { toast } from 'sonner';

let contentfulClient: any = null;

export const getContentfulClient = async (forceRefresh = false) => {
  console.log('[contentfulClient] Getting Contentful client');
  
  if (!forceRefresh && contentfulClient) {
    console.log('[contentfulClient] Returning existing client');
    return contentfulClient;
  }

  try {
    console.log('[contentfulClient] Creating new client');
    logContentfulConfig();
    
    if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
      throw new Error('Contentful configuration missing. Please check your environment variables.');
    }

    contentfulClient = createClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
    });

    console.log('[contentfulClient] Client created successfully');
    return contentfulClient;
  } catch (error) {
    console.error('[contentfulClient] Error creating client:', error);
    throw error;
  }
};

export const refreshContentfulClient = async () => {
  console.log('[contentfulClient] Refreshing Contentful client');
  try {
    contentfulClient = null;
    return await getContentfulClient(true);
  } catch (error) {
    console.error('[contentfulClient] Error refreshing client:', error);
    throw error;
  }
};

export const resetContentfulClient = async () => {
  console.log('[contentfulClient] Resetting Contentful client');
  contentfulClient = null;
  return true;
};

export const testContentfulConnection = async () => {
  console.log('[contentfulClient] Testing Contentful connection');
  try {
    // Force a new client for the test
    contentfulClient = null;
    const client = await getContentfulClient(true);
    
    // Try fetching space information as a test
    const space = await client.getSpace();
    
    return {
      success: true,
      message: `Successfully connected to Contentful space: ${space.name}`,
      details: {
        spaceName: space.name,
        spaceId: space.sys.id
      }
    };
  } catch (error) {
    console.error('[contentfulClient] Connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
};

// Utility functions for Contentful entries
export async function fetchContentfulEntries<T>(contentType: string, query: Record<string, any> = {}) {
  console.log(`[contentfulClient] Fetching entries of type: ${contentType}`);
  try {
    const client = await getContentfulClient();
    const entries = await client.getEntries({
      content_type: contentType,
      include: 3, // Include nested entries up to 3 levels deep
      ...query
    });
    
    return entries.items as unknown as T[];
  } catch (error) {
    console.error(`[contentfulClient] Error fetching ${contentType} entries:`, error);
    throw error;
  }
}

export async function fetchContentfulEntry<T>(id: string) {
  console.log(`[contentfulClient] Fetching entry with ID: ${id}`);
  try {
    const client = await getContentfulClient();
    const entry = await client.getEntry(id, { include: 3 });
    return entry as unknown as T;
  } catch (error) {
    console.error(`[contentfulClient] Error fetching entry ${id}:`, error);
    throw error;
  }
}
