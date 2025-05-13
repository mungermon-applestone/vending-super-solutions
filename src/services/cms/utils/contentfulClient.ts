
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';
import { toast } from 'sonner';

// Cache for the Contentful client
let contentfulClientCache: any = null;

// Create and initialize Contentful client
export const getContentfulClient = () => {
  try {
    // If we have a cached client, return it
    if (contentfulClientCache) {
      return contentfulClientCache;
    }

    const { SPACE_ID, DELIVERY_TOKEN, ENVIRONMENT_ID } = CONTENTFUL_CONFIG;

    if (!SPACE_ID || !DELIVERY_TOKEN) {
      console.error('Contentful configuration missing. Please check your environment variables.');
      return null;
    }

    contentfulClientCache = createClient({
      space: SPACE_ID,
      accessToken: DELIVERY_TOKEN,
      environment: ENVIRONMENT_ID || 'master'
    });
    
    return contentfulClientCache;
  } catch (error) {
    console.error('Error creating Contentful client:', error);
    return null;
  }
};

/**
 * Refresh the Contentful client (clear cache and create a new instance)
 */
export const refreshContentfulClient = async () => {
  console.log('[contentfulClient] Refreshing Contentful client');
  contentfulClientCache = null; // Clear the cache
  
  try {
    const client = getContentfulClient();
    if (!client) {
      throw new Error('Failed to initialize Contentful client');
    }
    
    // Test the connection to make sure credentials are valid
    const testResult = await testContentfulConnection();
    if (!testResult.success) {
      console.warn('[contentfulClient] Refresh warning:', testResult.message);
    }
    
    return client;
  } catch (error) {
    console.error('[contentfulClient] Error refreshing Contentful client:', error);
    throw error;
  }
};

/**
 * Test the Contentful connection with proper error handling
 * @param silent If true, suppresses toast notifications
 */
export const testContentfulConnection = async (silent = false) => {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection...');
    
    const configCheck = checkContentfulConfig();
    
    if (!configCheck.isConfigured) {
      console.error('[testContentfulConnection] Missing Contentful configuration');
      return {
        success: false,
        message: `Missing Contentful configuration: ${configCheck.missingValues.join(', ')}`
      };
    }
    
    console.log('[testContentfulConnection] Creating test Contentful client');
    
    // Create a new client directly using the values from config
    const client = createClient({
      space: configCheck.config.spaceId,
      accessToken: configCheck.config.deliveryToken,
      environment: configCheck.config.environmentId
    });
    
    // Make a simple request to verify connection
    console.log('[testContentfulConnection] Making test request to Contentful API');
    const { total } = await client.getEntries({
      limit: 1
    });
    
    console.log(`[testContentfulConnection] Connection successful. Found ${total} total entries`);
    
    return {
      success: true,
      message: `Connection to Contentful successful! Found ${total} total entries.`
    };
  } catch (error) {
    console.error('[testContentfulConnection] Error testing connection:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (!silent) {
      toast.error(`Failed to connect to Contentful: ${errorMessage}`);
    }
    
    return {
      success: false,
      message: `Failed to connect to Contentful: ${errorMessage}`
    };
  }
};

/**
 * Check if Contentful configuration is valid
 */
export const checkContentfulConfig = () => {
  // Check if the required configuration values are set
  const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
  const deliveryToken = CONTENTFUL_CONFIG.DELIVERY_TOKEN;
  const environmentId = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
  
  const missingValues: string[] = [];
  
  if (!spaceId) missingValues.push('SPACE_ID');
  if (!deliveryToken) missingValues.push('DELIVERY_TOKEN');
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues,
    config: {
      spaceId,
      deliveryToken,
      environmentId
    }
  };
};

/**
 * Validate Contentful client (for backward compatibility)
 */
export const validateContentfulClient = async () => {
  return await testContentfulConnection(true);
};

/**
 * Fetch entries from Contentful with proper error handling
 */
export async function fetchContentfulEntries<T = any>(
  contentType: string,
  query: Record<string, any> = {}
): Promise<Array<T>> {
  try {
    console.log(`[Contentful] Fetching entries of type "${contentType}" with query:`, query);
    
    const client = getContentfulClient();
    if (!client) {
      console.error('Could not initialize Contentful client');
      return [];
    }

    const response = await client.getEntries({
      content_type: contentType,
      ...query
    });

    console.log(`[Contentful] Fetched ${response.items.length} items of type "${contentType}"`);
    return response.items as unknown as Array<T>;
  } catch (error) {
    console.error(`[Contentful] Error fetching entries of type "${contentType}":`, error);
    toast.error(`Error loading content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}

/**
 * Fetch a single entry from Contentful by ID
 */
export async function fetchContentfulEntry<T = any>(id: string): Promise<T | null> {
  try {
    console.log(`[Contentful] Fetching entry with ID "${id}"`);
    
    const client = getContentfulClient();
    if (!client) {
      console.error('Could not initialize Contentful client');
      return null;
    }

    const entry = await client.getEntry(id);
    console.log(`[Contentful] Fetched entry with ID "${id}"`, entry);
    
    return entry as unknown as T;
  } catch (error) {
    console.error(`[Contentful] Error fetching entry with ID "${id}":`, error);
    return null;
  }
}

/**
 * Fetch assets from Contentful
 */
export async function fetchContentfulAssets(query: Record<string, any> = {}): Promise<any[]> {
  try {
    console.log('[Contentful] Fetching assets with query:', query);
    
    const client = getContentfulClient();
    if (!client) {
      console.error('Could not initialize Contentful client');
      return [];
    }

    const response = await client.getAssets(query);
    console.log(`[Contentful] Fetched ${response.items.length} assets`);
    
    return response.items;
  } catch (error) {
    console.error('[Contentful] Error fetching assets:', error);
    return [];
  }
}
