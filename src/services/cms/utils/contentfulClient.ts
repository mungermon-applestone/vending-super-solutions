
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
      console.error('[contentfulClient] Missing Contentful configuration');
      throw new Error('Contentful is not configured. Please set your Space ID and Delivery Token in the environment variables.');
    }

    contentfulClient = createClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
    });

    console.log('[contentfulClient] Client created successfully');
    
    return contentfulClient;
  } catch (error) {
    console.error('[contentfulClient] Error creating client:', error);
    
    // Don't show toast when running in development to avoid spamming
    if (process.env.NODE_ENV !== 'development') {
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
export const testContentfulConnection = async () => {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection');
    
    if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
      console.error('[testContentfulConnection] Missing Contentful configuration');
      return { 
        success: false, 
        message: 'Contentful is not configured. Please set your Space ID and Delivery Token.'
      };
    }
    
    const client = await getContentfulClient(true);
    
    // Make a simple request to verify the connection works
    const response = await client.getEntries({
      limit: 1
    });
    
    console.log('[testContentfulConnection] Connection test successful');
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
};

// Refresh the client by resetting it and then getting a new instance
export const refreshContentfulClient = async () => {
  resetContentfulClient();
  return await getContentfulClient(true);
};
