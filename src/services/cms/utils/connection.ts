
import { getContentfulConfig } from './cmsInfo';
import { createClient } from 'contentful-management';

export const testContentfulConnection = async () => {
  try {
    console.log('[testContentfulConnection] Starting connection test...');
    const config = await getContentfulConfig();
    
    console.log('[testContentfulConnection] Fetched configuration:', 
      config ? { 
        spaceId: config.space_id, 
        environmentId: config.environment_id,
        hasToken: !!config.management_token,
        tokenLength: config.management_token?.length
      } : 'No config found');
    
    if (!config) {
      console.warn('[testContentfulConnection] No configuration found in the database');
      return {
        success: false,
        message: 'No Contentful configuration found in the database'
      };
    }

    if (!config.space_id) {
      console.error('[testContentfulConnection] Space ID missing from configuration');
      return {
        success: false,
        message: 'Space ID missing from Contentful configuration'
      };
    }

    if (!config.management_token) {
      console.error('[testContentfulConnection] Management token missing from configuration');
      return {
        success: false,
        message: 'Management token missing from Contentful configuration'
      };
    }

    console.log('[testContentfulConnection] Creating Contentful client with token...');
    const client = createClient({
      accessToken: config.management_token
    });

    // Try to fetch the space to verify connection
    try {
      console.log(`[testContentfulConnection] Attempting to get space with ID: ${config.space_id}`);
      const space = await client.getSpace(config.space_id);
      
      console.log('[testContentfulConnection] Successfully connected to space:', space.sys.id);
      return {
        success: true,
        message: 'Successfully connected to Contentful',
        spaceId: space.sys.id
      };
    } catch (apiError: any) {
      console.error('[testContentfulConnection] API Error:', apiError);
      
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
