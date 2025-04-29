
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
      console.error('[contentfulClient] Missing Contentful configuration', {
        spaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
        deliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN
      });
      throw new Error('Contentful configuration missing. Please navigate to Admin > Environment Variables to set up your Contentful credentials.');
    }

    contentfulClient = createClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
    });

    // Test immediate functionality
    try {
      await contentfulClient.getSpace();
      console.log('[contentfulClient] Test connection successful');
    } catch (testError) {
      console.error('[contentfulClient] Test connection failed:', testError);
      // Don't throw here, let subsequent requests handle errors instead
    }

    console.log('[contentfulClient] Client created successfully', {
      spaceId: CONTENTFUL_CONFIG.SPACE_ID,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
    });
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
    // Check if configuration is available first
    if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
      console.warn('[contentfulClient] Missing Contentful configuration', {
        hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
        hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN
      });
      return {
        success: false,
        message: 'Contentful configuration missing. Please navigate to Admin > Environment Variables to set up your Contentful credentials.',
        details: {
          missingConfig: true,
          spaceName: null,
          spaceId: null,
          configuredIn: typeof window !== 'undefined' ? localStorage.getItem('vending-cms-env-variables') ? 'localStorage' : 'none' : 'server'
        }
      };
    }
    
    try {
      // Force a new client for the test
      contentfulClient = null;
      const client = await getContentfulClient(true);
      
      // Try fetching space information as a test
      const space = await client.getSpace();
      
      toast.success(`Connected to Contentful space: ${space.name}`);
      
      return {
        success: true,
        message: `Successfully connected to Contentful space: ${space.name}`,
        details: {
          spaceName: space.name,
          spaceId: space.sys.id
        }
      };
    } catch (error: any) {
      console.error('[contentfulClient] Connection test failed:', error);
      
      // Provide more specific error messages based on error codes
      let message = error instanceof Error ? error.message : 'Unknown error';
      
      if (error.sys?.id === 'NotFound') {
        message = `Space not found. Check your Space ID (${CONTENTFUL_CONFIG.SPACE_ID}).`;
      } else if (error.sys?.id === 'AccessTokenInvalid') {
        message = 'Invalid access token. Check your Delivery Token.';
      } else if (error.name === 'TypeError' && message.includes('getSpace')) {
        message = 'Unable to connect to Contentful API. Check if your tokens are correct.';
      }
      
      toast.error(`Contentful connection failed: ${message}`);
      
      return {
        success: false,
        message,
        details: error
      };
    }
  } catch (error) {
    console.error('[contentfulClient] Error in connection test:', error);
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
