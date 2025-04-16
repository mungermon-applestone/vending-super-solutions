
import { getContentfulClient, refreshContentfulClient } from './contentfulClient';

/**
 * Tests the connection to Contentful
 * @returns Object with success status and message
 */
export const testContentfulConnection = async () => {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection...');
    
    // First try to get the client
    let client;
    try {
      client = await getContentfulClient();
    } catch (error) {
      console.error('[testContentfulConnection] Error getting client:', error);
      
      // Try refreshing the client
      try {
        console.log('[testContentfulConnection] Attempting to refresh client...');
        client = await refreshContentfulClient();
      } catch (refreshError) {
        console.error('[testContentfulConnection] Failed to refresh client:', refreshError);
        
        // Detailed error data for debugging
        const errorData = refreshError instanceof Error ? {
          message: refreshError.message,
          stack: refreshError.stack,
          ...((refreshError as any).response?.data || {})
        } : { message: 'Unknown error' };
        
        return {
          success: false,
          message: `Failed to initialize Contentful client: ${errorData.message}`,
          errorData
        };
      }
    }
    
    if (!client) {
      return {
        success: false,
        message: 'Failed to initialize Contentful client - client is null'
      };
    }
    
    // Test the connection by making a simple request
    console.log('[testContentfulConnection] Making test request to Contentful API');
    const { total } = await client.getEntries({
      limit: 1
    });
    
    console.log(`[testContentfulConnection] Connection successful. Found ${total} total entries`);
    
    return {
      success: true,
      message: `Successfully connected to Contentful. Found ${total} entries.`
    };
  } catch (error) {
    console.error('[testContentfulConnection] Error testing connection:', error);
    
    // Extract useful error information
    let errorMessage = 'Unknown error occurred';
    let errorData = null;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorData = {
        message: error.message,
        stack: error.stack
      };
      
      // Extract more details from Contentful API errors if available
      if ((error as any).response) {
        const response = (error as any).response;
        errorData = {
          ...errorData,
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          request: {
            method: response.config?.method,
            url: response.config?.url
          }
        };
        
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Check your Contentful delivery token.';
        } else if (response.status === 404) {
          errorMessage = 'Space not found. Check your Contentful Space ID.';
        }
      }
    }
    
    return {
      success: false,
      message: `Contentful connection error: ${errorMessage}`,
      errorData
    };
  }
};

// Add the alias for testCMSConnection to make existing code work
export const testCMSConnection = testContentfulConnection;
