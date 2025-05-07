import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG, logContentfulConfig } from '@/config/cms';
import { toast } from 'sonner';

let contentfulClient: any = null;
let lastClientCreationTime = 0;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

// Client creation with retry logic
export const getContentfulClient = async (forceRefresh = false) => {
  console.log('[contentfulClient] Getting Contentful client');
  
  // If we have a client and no refresh is requested, return it
  if (!forceRefresh && contentfulClient) {
    // If the client was created more than 30 minutes ago, force a refresh anyway
    const now = Date.now();
    if (now - lastClientCreationTime > 30 * 60 * 1000) { // 30 minutes
      console.log('[contentfulClient] Client is stale, forcing refresh');
      forceRefresh = true;
    } else {
      console.log('[contentfulClient] Returning existing client');
      return contentfulClient;
    }
  }

  try {
    console.log('[contentfulClient] Creating new client');
    logContentfulConfig();
    
    // Extra check to ensure we have credentials
    if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
      console.error('[contentfulClient] Missing Contentful configuration');
      
      // Check if we have window.env credentials
      if (typeof window !== 'undefined' && window.env) {
        console.log('[contentfulClient] Trying window.env credentials');
        if (!window.env.VITE_CONTENTFUL_SPACE_ID || !window.env.VITE_CONTENTFUL_DELIVERY_TOKEN) {
          throw new Error('Contentful is not configured. Please set your Space ID and Delivery Token in the environment variables.');
        }
        
        // Create client with window.env credentials
        contentfulClient = createClient({
          space: window.env.VITE_CONTENTFUL_SPACE_ID,
          accessToken: window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
          environment: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
          retryOnError: true,
        });
      } else {
        throw new Error('Contentful is not configured. Please set your Space ID and Delivery Token in the environment variables.');
      }
    } else {
      // Create client with CONTENTFUL_CONFIG
      contentfulClient = createClient({
        space: CONTENTFUL_CONFIG.SPACE_ID,
        accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
        environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
        retryOnError: true,
      });
    }

    // Reset connection attempts on successful creation
    connectionAttempts = 0;
    lastClientCreationTime = Date.now();
    
    console.log('[contentfulClient] Client created successfully');
    
    // Save working credentials to localStorage
    if (typeof window !== 'undefined') {
      try {
        const credentialsToSave = {
          VITE_CONTENTFUL_SPACE_ID: CONTENTFUL_CONFIG.SPACE_ID || window.env?.VITE_CONTENTFUL_SPACE_ID,
          VITE_CONTENTFUL_DELIVERY_TOKEN: CONTENTFUL_CONFIG.DELIVERY_TOKEN || window.env?.VITE_CONTENTFUL_DELIVERY_TOKEN,
          VITE_CONTENTFUL_ENVIRONMENT_ID: CONTENTFUL_CONFIG.ENVIRONMENT_ID || window.env?.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
        };
        
        if (credentialsToSave.VITE_CONTENTFUL_SPACE_ID && credentialsToSave.VITE_CONTENTFUL_DELIVERY_TOKEN) {
          localStorage.setItem('contentful_credentials', JSON.stringify(credentialsToSave));
          console.log('[contentfulClient] Saved working credentials to localStorage');
        }
      } catch (storageError) {
        console.warn('[contentfulClient] Could not save credentials to localStorage:', storageError);
      }
    }
    
    return contentfulClient;
  } catch (error) {
    console.error('[contentfulClient] Error creating client:', error);
    
    // Increment attempts counter
    connectionAttempts++;
    
    // Only show toast if we've tried multiple times and not in development mode
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS && process.env.NODE_ENV !== 'development') {
      toast.error('Failed to initialize Contentful client', {
        description: error instanceof Error ? error.message : 'Check your Contentful configuration',
        id: 'contentful-client-error'
      });
    }
    
    // Throw a clearer error
    if (error instanceof Error) {
      throw new Error(`Failed to initialize Contentful client: ${error.message}`);
    }
    
    throw error;
  }
};

// Test the Contentful connection with the current client
export const testContentfulConnection = async (silent = false) => {
  try {
    if (!silent) {
      console.log('[testContentfulConnection] Testing Contentful connection');
    }
    
    if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
      console.error('[testContentfulConnection] Missing Contentful configuration');
      return { 
        success: false, 
        message: 'Contentful is not configured. Please set your Space ID and Delivery Token.'
      };
    }
    
    // Always get a fresh client for the test
    const client = await getContentfulClient(false);
    
    // Make a simple request to verify the connection works
    const response = await client.getEntries({
      limit: 1
    });
    
    if (!silent) {
      console.log('[testContentfulConnection] Connection test successful');
    }
    
    return { 
      success: true, 
      message: `Successfully connected to Contentful. Found ${response.total} entries.`,
      details: { totalEntries: response.total }
    };
  } catch (error) {
    console.error('[testContentfulConnection] Connection test failed:', error);
    
    let message = 'Failed to connect to Contentful.';
    let status = null;
    let responseInfo = null;
    
    if (error instanceof Error) {
      message = `Connection failed: ${error.message}`;
      
      // Get more details from Contentful API errors
      if ('sys' in (error as any)) {
        status = (error as any).sys.id;
        message = `Contentful error: ${status}`;
      }
      
      // Check for response data in axios errors
      if ('response' in (error as any)) {
        status = (error as any).response?.status;
        responseInfo = {
          status,
          statusText: (error as any).response?.statusText,
          data: (error as any).response?.data
        };
        
        if (status === 401) {
          message = 'Authentication failed. Please check your Contentful Delivery Token.';
        } else if (status === 404) {
          message = 'Space not found. Please check your Contentful Space ID.';
        }
      }
    }
    
    return { 
      success: false, 
      message,
      error: JSON.stringify(error, null, 2),
      status,
      responseInfo
    };
  }
};

// Reset the client to force a refresh on next use
export const resetContentfulClient = () => {
  console.log('[contentfulClient] Resetting client');
  contentfulClient = null;
  lastClientCreationTime = 0; // Reset creation time
};

// Refresh the client by resetting it and then getting a new instance
export const refreshContentfulClient = async () => {
  resetContentfulClient();
  return await getContentfulClient(true);
};

// Validate if the current client is still working
export const validateContentfulClient = async () => {
  try {
    if (!contentfulClient) {
      return false;
    }
    
    // Make a simple query to check if the client is still valid
    const result = await testContentfulConnection(true); // silent mode
    return result.success;
  } catch (error) {
    console.error('[validateContentfulClient] Client validation failed:', error);
    return false;
  }
};

/**
 * Fetch Contentful entries based on content type and query parameters
 * @param contentType The Contentful content type ID
 * @param query Additional query parameters (optional)
 * @returns Array of entries matching the query
 */
export const fetchContentfulEntries = async <T>(contentType: string, query: Record<string, any> = {}): Promise<T[]> => {
  try {
    console.log(`[fetchContentfulEntries] Fetching entries of type: ${contentType}`, query);
    
    const client = await getContentfulClient();
    
    const entries = await client.getEntries({
      content_type: contentType,
      ...query,
    });
    
    console.log(`[fetchContentfulEntries] Found ${entries.items.length} entries for type: ${contentType}`);
    
    if (!entries.items.length) {
      return [];
    }
    
    return entries.items as T[];
  } catch (error) {
    console.error(`[fetchContentfulEntries] Error fetching entries of type ${contentType}:`, error);
    
    if (process.env.NODE_ENV !== 'development') {
      toast.error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: `contentful-fetch-error-${contentType}`
      });
    }
    
    throw error;
  }
};

/**
 * Fetch a single Contentful entry by ID
 * @param entryId The Contentful entry ID
 * @param query Additional query parameters (optional)
 * @returns The requested entry or null if not found
 */
export const fetchContentfulEntry = async <T>(entryId: string, query: Record<string, any> = {}): Promise<T> => {
  try {
    console.log(`[fetchContentfulEntry] Fetching entry with ID: ${entryId}`);
    
    const client = await getContentfulClient();
    
    const entry = await client.getEntry(entryId, query);
    
    console.log(`[fetchContentfulEntry] Successfully fetched entry ID: ${entryId}`);
    
    return entry as T;
  } catch (error) {
    console.error(`[fetchContentfulEntry] Error fetching entry ID ${entryId}:`, error);
    
    if (process.env.NODE_ENV !== 'development') {
      toast.error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: `contentful-entry-error-${entryId}`
      });
    }
    
    if ((error as any)?.sys?.id === 'NotFound') {
      console.warn(`[fetchContentfulEntry] Entry not found with ID: ${entryId}`);
      throw new Error(`Entry not found with ID: ${entryId}`);
    }
    
    throw error;
  }
};
