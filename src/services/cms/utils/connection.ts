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
      console.warn('[testContentfulConnection] No Contentful configuration found in the database');
      return {
        success: false,
        message: 'No Contentful configuration found in the database'
      };
    }

    if (!config.management_token?.startsWith('CFPAT-')) {
      console.error('[testContentfulConnection] Invalid token type detected. Ensure you are using a Contentful Management API (CMA) token.');
      return {
        success: false,
        message: 'Invalid token type. Please use a Contentful Management API (CMA) token that starts with CFPAT-'
      };
    }

    console.log('[testContentfulConnection] Creating Contentful client with token...');
    const client = createClient({
      accessToken: config.management_token
    });

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
      
      const errorDetails = apiError.details || {};
      const requestDetails = apiError.request || {};
      
      let userMessage = apiError.message || 'Connection to Contentful failed';
      
      if (apiError.status === 403) {
        userMessage = 'Authentication failed: The provided token is invalid or does not have sufficient permissions. Please check your Contentful Management Token.';
      } else if (apiError.status === 404) {
        userMessage = `Space not found: Could not find a Contentful space with ID "${config.space_id}". Please verify your Space ID.`;
      } else if (apiError.status === 401) {
        userMessage = 'Unauthorized: The provided Management Token is invalid or expired. Please generate a new token in Contentful.';
      }
      
      return {
        success: false,
        message: userMessage,
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

export const testCMSConnection = testContentfulConnection;
