
import { getContentfulConfig } from './cmsInfo';
import { createClient } from 'contentful-management';

export const testContentfulConnection = async () => {
  try {
    const config = await getContentfulConfig();
    
    if (!config) {
      return {
        success: false,
        message: 'No Contentful configuration found'
      };
    }

    const client = createClient({
      accessToken: config.management_token
    });

    // Try to fetch the space to verify connection
    try {
      const space = await client.getSpace(config.space_id);
      
      return {
        success: true,
        message: 'Successfully connected to Contentful',
        spaceId: space.sys.id
      };
    } catch (apiError: any) {
      // Extract detailed error information from Contentful's error response
      const errorDetails = apiError.details || {};
      const requestDetails = apiError.request || {};
      
      return {
        success: false,
        message: apiError.message || 'Connection to Contentful failed',
        errorData: {
          status: apiError.status,
          statusText: apiError.statusText,
          details: errorDetails,
          request: {
            url: requestDetails.url,
            method: requestDetails.method,
            // Don't include sensitive headers in the response
          }
        }
      };
    }
  } catch (error) {
    console.error('[testContentfulConnection] Connection error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
};

// Export the function with the expected name for backward compatibility
export const testCMSConnection = testContentfulConnection;
