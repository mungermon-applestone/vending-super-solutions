
import { createClient } from 'contentful';
import { getContentfulConfig } from './cmsInfo';

// Cache the client to avoid creating a new one on every request
let contentfulClient: ReturnType<typeof createClient> | null = null;

/**
 * Gets or creates a Contentful delivery client for content fetching
 */
export const getContentfulClient = async () => {
  // Return cached client if available
  if (contentfulClient) {
    return contentfulClient;
  }
  
  try {
    console.log('[getContentfulClient] Creating new Contentful client');
    const config = await getContentfulConfig();
    
    if (!config || !config.space_id || !config.delivery_token) {
      console.error('[getContentfulClient] Missing Contentful configuration - ensure both Space ID and Delivery Token are set');
      return null;
    }
    
    contentfulClient = createClient({
      space: config.space_id,
      accessToken: config.delivery_token,
      environment: config.environment_id || 'master',
    });
    
    return contentfulClient;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    return null;
  }
};

/**
 * Fetches entries from Contentful by content type
 */
export const fetchContentfulEntries = async <T>(contentType: string, options: any = {}): Promise<T[]> => {
  try {
    console.log(`[fetchContentfulEntries] Fetching entries for content type: ${contentType}`);
    const client = await getContentfulClient();
    
    const query = {
      content_type: contentType,
      ...options
    };
    
    const response = await client.getEntries(query);
    console.log(`[fetchContentfulEntries] Fetched ${response.items.length} entries`);
    
    return response.items.map((item: any) => ({
      id: item.sys.id,
      ...item.fields
    })) as T[];
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching ${contentType}:`, error);
    return [];
  }
};

/**
 * Fetches a single entry from Contentful by ID
 */
export const fetchContentfulEntry = async <T>(entryId: string): Promise<T | null> => {
  try {
    console.log(`[fetchContentfulEntry] Fetching entry with ID: ${entryId}`);
    const client = await getContentfulClient();
    
    const entry = await client.getEntry(entryId);
    
    return {
      id: entry.sys.id,
      ...entry.fields
    } as T;
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching entry ${entryId}:`, error);
    return null;
  }
};
