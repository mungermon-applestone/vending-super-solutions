
import { createClient } from 'contentful';

// Cache the client to avoid creating a new one on every request
let contentfulClient: ReturnType<typeof createClient> | null = null;
let lastConfigCheck = 0;
const CONFIG_CACHE_TTL = 30 * 1000; // 30 second cache TTL
let lastConfigError: Error | null = null;
let configRetryCount = 0;
const MAX_RETRIES = 3;

/**
 * Gets or creates a Contentful delivery client for content fetching
 */
export const getContentfulClient = async () => {
  const now = Date.now();
  
  // If we had an error recently, but have a client, use it
  if (contentfulClient && lastConfigError && (now - lastConfigCheck) < CONFIG_CACHE_TTL) {
    console.log('[getContentfulClient] Using cached client despite recent error');
    return contentfulClient;
  }
  
  // Return cached client if available and not expired
  if (contentfulClient && !lastConfigError && (now - lastConfigCheck) < CONFIG_CACHE_TTL) {
    console.log('[getContentfulClient] Using cached Contentful client');
    return contentfulClient;
  }
  
  try {
    console.log('[getContentfulClient] Creating new Contentful client');
    
    // Get credentials from environment variables - IMPORTANT FIX: Access env vars correctly
    const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
    const deliveryToken = import.meta.env.CONTENTFUL_DELIVERY_TOKEN || import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN; // Try both formats
    const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
    
    lastConfigCheck = now;
    lastConfigError = null;
    configRetryCount = 0;
    
    // Add more detailed logging for configuration
    console.log('[getContentfulClient] Configuration:', {
      hasSpaceId: !!spaceId,
      spaceIdLength: spaceId?.length || 0,
      hasDeliveryToken: !!deliveryToken, 
      deliveryTokenLength: deliveryToken?.length || 0,
      environmentId: environmentId,
      envVarFormat: {
        spaceIdFormat: typeof import.meta.env.VITE_CONTENTFUL_SPACE_ID,
        deliveryTokenFormat: typeof import.meta.env.CONTENTFUL_DELIVERY_TOKEN || typeof import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
      }
    });
    
    if (!spaceId) {
      console.error('[getContentfulClient] Missing Space ID');
      throw new Error('Missing required Contentful credentials - Space ID not found');
    }
    
    if (!deliveryToken) {
      console.error('[getContentfulClient] Missing Delivery Token (CDA)');
      throw new Error('Missing required Contentful credentials - Delivery Token not found');
    }
    
    contentfulClient = createClient({
      space: spaceId,
      accessToken: deliveryToken,
      environment: environmentId,
    });
    
    // Verify the client works by making a test request
    const testEntry = await contentfulClient.getEntries({
      limit: 1
    });
    
    console.log('[getContentfulClient] Successfully created and tested Contentful client');
    console.log(`[getContentfulClient] Test query returned ${testEntry.total} total entries`);
    
    return contentfulClient;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    
    // Track the error
    lastConfigError = error instanceof Error ? error : new Error(String(error));
    configRetryCount++;
    
    // If we have a client and haven't exceeded retry count, keep using it
    if (contentfulClient && configRetryCount < MAX_RETRIES) {
      console.warn(`[getContentfulClient] Using existing client despite error (retry ${configRetryCount}/${MAX_RETRIES})`);
      return contentfulClient;
    }
    
    // Clear the client on critical error to force recreation on next attempt
    if (configRetryCount >= MAX_RETRIES) {
      console.error('[getContentfulClient] Max retries exceeded, clearing client');
      contentfulClient = null;
    }
    throw error;
  }
};

// Add a function to reset the client - useful when config changes
export const resetContentfulClient = () => {
  console.log('[contentfulClient] Resetting Contentful client');
  contentfulClient = null;
  lastConfigError = null;
  configRetryCount = 0;
  lastConfigCheck = 0;
};

/**
 * Force a refresh of the contentful client - useful for debugging
 */
export const refreshContentfulClient = async () => {
  resetContentfulClient();
  return await getContentfulClient();
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
