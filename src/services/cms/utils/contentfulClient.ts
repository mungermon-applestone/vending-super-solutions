
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG, logContentfulConfig } from '@/config/cms';
import { toast } from 'sonner';

// Cache the client to avoid creating a new one on every request
let contentfulClient: ReturnType<typeof createClient> | null = null;
let lastConfigCheck = 0;
const CONFIG_CACHE_TTL = 30 * 1000; // 30 second cache TTL
let lastConfigError: Error | null = null;
let configRetryCount = 0;
const MAX_RETRIES = 3;

// Helper function to check if environment variables are available in window.env
const checkWindowEnv = () => {
  if (typeof window === 'undefined' || !window.env) {
    return false;
  }
  
  // Get stored environment variables
  try {
    const ENV_STORAGE_KEY = 'vending-cms-env-variables';
    const storedVars = localStorage.getItem(ENV_STORAGE_KEY);
    
    if (storedVars) {
      const parsedVars = JSON.parse(storedVars);
      
      // Initialize window.env if needed
      if (!window.env) {
        window.env = {};
      }
      
      // Set the values in window.env
      const keyNames = parsedVars.keyNames || {
        spaceId: 'VITE_CONTENTFUL_SPACE_ID',
        deliveryToken: 'VITE_CONTENTFUL_DELIVERY_TOKEN',
        environmentId: 'VITE_CONTENTFUL_ENVIRONMENT_ID'
      };
      
      window.env[keyNames.spaceId] = parsedVars.spaceId;
      window.env[keyNames.deliveryToken] = parsedVars.deliveryToken;
      window.env[keyNames.environmentId] = parsedVars.environmentId || 'master';
      
      // Also set direct values for backwards compatibility
      window.env.spaceId = parsedVars.spaceId;
      window.env.deliveryToken = parsedVars.deliveryToken;
      window.env.environmentId = parsedVars.environmentId || 'master';
      
      console.log('[checkWindowEnv] Initialized window.env with values from localStorage');
      return true;
    }
  } catch (e) {
    console.error('[checkWindowEnv] Error parsing environment variables from localStorage:', e);
  }
  
  return false;
}

/**
 * Gets or creates a Contentful delivery client for content fetching
 */
export const getContentfulClient = async () => {
  const now = Date.now();
  
  // Check if window.env needs to be initialized
  checkWindowEnv();
  
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
    logContentfulConfig(); // Log current configuration
    
    const { SPACE_ID, DELIVERY_TOKEN, ENVIRONMENT_ID } = CONTENTFUL_CONFIG;
    
    // Print environment variables debugging info
    console.log('[getContentfulClient] Environment variables check:', {
      VITE_CONTENTFUL_SPACE_ID_EXISTS: !!import.meta.env.VITE_CONTENTFUL_SPACE_ID,
      CONTENTFUL_SPACE_ID_EXISTS: !!import.meta.env.CONTENTFUL_SPACE_ID,
      VITE_CONTENTFUL_DELIVERY_TOKEN_EXISTS: !!import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
      CONTENTFUL_DELIVERY_TOKEN_EXISTS: !!import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
      WINDOW_ENV_EXISTS: typeof window !== 'undefined' && !!window.env,
      LOCAL_STORAGE_VARS_EXIST: typeof window !== 'undefined' && !!localStorage.getItem('vending-cms-env-variables'),
    });
    
    if (!SPACE_ID || SPACE_ID.trim() === '') {
      console.error('[getContentfulClient] Invalid Space ID:', SPACE_ID);
      throw new Error('Invalid Contentful Space ID configuration');
    }
    
    if (!DELIVERY_TOKEN || DELIVERY_TOKEN.trim() === '') {
      console.error('[getContentfulClient] Missing Delivery Token');
      throw new Error('Missing Contentful Delivery Token');
    }

    contentfulClient = createClient({
      space: SPACE_ID,
      accessToken: DELIVERY_TOKEN,
      environment: ENVIRONMENT_ID,
    });

    // Verify the client works with a test request
    console.log('[getContentfulClient] Testing connection with Space ID:', SPACE_ID);
    const testEntry = await contentfulClient.getEntries({
      limit: 1
    });
    
    console.log('[getContentfulClient] Successfully connected to Contentful space');
    console.log(`[getContentfulClient] Test query returned ${testEntry.total} total entries`);
    
    // Clear any previous error
    lastConfigError = null;
    lastConfigCheck = now;
    
    return contentfulClient;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    
    // Store the error for cache decision making
    lastConfigError = error instanceof Error ? error : new Error(String(error));
    lastConfigCheck = now;
    
    // Clear the client on critical error
    contentfulClient = null;
    
    // Add specific error handling for common cases
    if (error instanceof Error) {
      if (error.message.includes('access token')) {
        throw new Error('Invalid Contentful access token for space. Please check your delivery token.');
      }
      if (error.message.includes('space')) {
        throw new Error('Invalid Contentful space configuration. Please check your Space ID.');
      }
    }
    
    // Show a toast notification with debugging info
    toast.error(`Contentful connection failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
    
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
    
    // Log first entry if available
    if (response.items.length > 0) {
      console.log(`[fetchContentfulEntries] First entry sys:`, response.items[0].sys);
      console.log(`[fetchContentfulEntries] First entry fields:`, response.items[0].fields);
    }
    
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

// Add a function to test contentful connection and report detailed information
export const testContentfulConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection');
    
    // Force fresh client
    await refreshContentfulClient();
    const client = await getContentfulClient();
    
    if (!client) {
      return {
        success: false,
        message: 'Failed to initialize Contentful client'
      };
    }
    
    // Make a test query
    const testQuery = await client.getEntries({
      limit: 1
    });
    
    // Get space information
    const space = await client.getSpace();
    
    return {
      success: true,
      message: `Successfully connected to Contentful space: ${space.name}`,
      details: {
        space: {
          name: space.name,
          id: space.sys.id
        },
        totalEntries: testQuery.total,
        environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
        availableContentTypes: Array.isArray(testQuery.items) && testQuery.items.length > 0 
          ? [...new Set(testQuery.items.map(item => item.sys.contentType?.sys.id).filter(Boolean))]
          : []
      }
    };
  } catch (error) {
    console.error('[testContentfulConnection] Error testing connection:', error);
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error: String(error) }
    };
  }
};
