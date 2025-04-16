
import { createClient } from 'contentful';
import { getContentfulConfig } from './cmsInfo';
import { toast } from 'sonner';

// Cache the client to avoid creating a new one on every request
let contentfulClient: ReturnType<typeof createClient> | null = null;
let lastConfigCheck = 0;
const CONFIG_CACHE_TTL = 60 * 1000; // 1 minute cache TTL

/**
 * Gets or creates a Contentful delivery client for content fetching
 */
export const getContentfulClient = async () => {
  const now = Date.now();
  
  // Return cached client if available and not expired
  if (contentfulClient && (now - lastConfigCheck) < CONFIG_CACHE_TTL) {
    console.log('[getContentfulClient] Using cached Contentful client');
    return contentfulClient;
  }
  
  try {
    console.log('[getContentfulClient] Creating new Contentful client');
    const config = await getContentfulConfig();
    lastConfigCheck = now;
    
    // Add more detailed logging for configuration
    console.log('[getContentfulClient] Configuration received:', {
      hasConfig: !!config,
      hasSpaceId: config?.space_id ? 'Yes' : 'No',
      hasDeliveryToken: config?.delivery_token ? 'Yes' : 'No',
      hasManagementToken: config?.management_token ? 'Yes' : 'No',
      environmentId: config?.environment_id || 'master'
    });
    
    if (!config || !config.space_id) {
      console.error('[getContentfulClient] Missing Space ID');
      throw new Error('Missing required Contentful credentials - Space ID not found');
    }
    
    if (!config.delivery_token) {
      console.error('[getContentfulClient] Missing Delivery Token (CDA)');
      throw new Error('Missing required Contentful credentials - Delivery Token not found');
    }
    
    contentfulClient = createClient({
      space: config.space_id,
      accessToken: config.delivery_token,
      environment: config.environment_id || 'master',
    });
    
    console.log('[getContentfulClient] Successfully created Contentful client');
    return contentfulClient;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    
    // Clear the client on error to force recreation on next attempt
    contentfulClient = null;
    throw error;
  }
};

// Add a function to reset the client - useful when config changes
export const resetContentfulClient = () => {
  console.log('[contentfulClient] Resetting Contentful client');
  contentfulClient = null;
  lastConfigCheck = 0;
};

/**
 * Fetches entries from Contentful by content type
 */
export const fetchContentfulEntries = async <T>(contentType: string, options: any = {}): Promise<T[]> => {
  try {
    console.log(`[fetchContentfulEntries] Fetching entries for content type: ${contentType}`);
    const client = await getContentfulClient();
    
    if (!client) {
      console.error('[fetchContentfulEntries] Failed to get Contentful client');
      throw new Error('Failed to initialize Contentful client');
    }
    
    const query = {
      content_type: contentType,
      ...options
    };
    
    console.log(`[fetchContentfulEntries] Query params:`, JSON.stringify(query));
    const response = await client.getEntries(query);
    console.log(`[fetchContentfulEntries] Fetched ${response.items.length} entries for ${contentType}`);
    
    return response.items as T[];
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching ${contentType}:`, error);
    throw error;
  }
};

/**
 * Fetches a single entry from Contentful by ID
 */
export const fetchContentfulEntry = async <T>(entryId: string): Promise<T | null> => {
  try {
    console.log(`[fetchContentfulEntry] Fetching entry with ID: ${entryId}`);
    const client = await getContentfulClient();
    
    if (!client) {
      console.error('[fetchContentfulEntry] Failed to get Contentful client');
      throw new Error('Failed to initialize Contentful client');
    }
    
    const entry = await client.getEntry(entryId);
    
    return {
      id: entry.sys.id,
      ...entry.fields
    } as T;
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching entry ${entryId}:`, error);
    throw error;
  }
};
