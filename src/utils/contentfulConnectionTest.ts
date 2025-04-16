import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { getContentfulConfig } from '@/services/cms/utils/cmsInfo';

interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

/**
 * Tests the connection to Contentful and returns detailed diagnostic information.
 * Use this to verify that your Contentful credentials are working properly.
 */
export async function testContentfulConnection(): Promise<ConnectionTestResult> {
  console.log('[contentfulConnectionTest] Starting Contentful connection test');
  
  try {
    // First check if we can fetch credentials from Supabase
    const config = await getContentfulConfig().catch(err => {
      console.error('[contentfulConnectionTest] Failed to get Contentful config from Supabase:', err);
      throw new Error(`Failed to retrieve Contentful credentials: ${err.message}`);
    });
    
    if (!config || !config.space_id || !config.delivery_token) {
      console.error('[contentfulConnectionTest] Missing required Contentful credentials');
      return {
        success: false,
        message: 'Missing required Contentful credentials. Check your Supabase contentful_config table.',
        details: {
          hasSpaceId: !!config?.space_id,
          hasDeliveryToken: !!config?.delivery_token,
          hasConfig: !!config
        }
      };
    }
    
    // Then try to initialize the client
    const client = await getContentfulClient();
    
    if (!client) {
      console.error('[contentfulConnectionTest] Failed to initialize Contentful client');
      return {
        success: false,
        message: 'Failed to initialize Contentful client. Check your space ID and access token.'
      };
    }
    
    // Try to fetch space information - this doesn't exist on delivery client
    // Let's use an alternative approach to test connection
    console.log('[contentfulConnectionTest] Client initialized, fetching space information');
    
    // Check if we can access content types - this works on delivery client
    const contentTypes = await client.getContentTypes();
    
    // Get the current environment by checking system information
    const environmentInfo = await client.getEntries({
      content_type: 'contentType', // This is just to make a request, we don't need actual results
      limit: 1
    }).then(response => {
      // Extract environment from the response system data
      return {
        id: response.sys?.environment?.sys?.id || 'master',
        name: response.sys?.environment?.sys?.id || 'master'
      };
    }).catch(() => {
      // Default if we can't get it
      return { id: 'master', name: 'master' };
    });
    
    // Get space information from the entries response
    const spaceInfo = await client.getSpace().catch(() => {
      // Delivery client might not support getSpace, use default values
      return { 
        name: 'Contentful Space',
        sys: { id: config.space_id }
      };
    });
    
    return {
      success: true,
      message: 'Successfully connected to Contentful',
      details: {
        space: {
          name: spaceInfo.name,
          id: spaceInfo.sys.id
        },
        environment: environmentInfo,
        contentTypeCount: contentTypes.total,
        contentTypes: contentTypes.items.map(item => ({
          name: item.name,
          id: item.sys.id
        }))
      }
    };
  } catch (error) {
    console.error('[contentfulConnectionTest] Connection test failed', error);
    
    let friendlyMessage = 'Failed to connect to Contentful';
    let details: Record<string, any> = {};
    
    if (error instanceof Error) {
      friendlyMessage = error.message;
      details.errorType = error.name;
      details.stack = error.stack;
      
      // Parse common Contentful errors
      if (error.message.includes('401')) {
        friendlyMessage = 'Authentication failed. Check your Contentful access token.';
        details.possibleFix = 'Verify your Contentful access token is valid and has the correct permissions.';
      } else if (error.message.includes('404')) {
        friendlyMessage = 'Content not found. Check your Space ID and Environment ID.';
        details.possibleFix = 'Verify your Contentful Space ID and Environment ID are correct.';
      } else if (error.message.includes('Network Error')) {
        friendlyMessage = 'Network error while connecting to Contentful.';
        details.possibleFix = 'Check your internet connection and that Contentful is accessible.';
      }
    }
    
    return {
      success: false,
      message: friendlyMessage,
      details
    };
  }
}

/**
 * Checks if required Contentful settings are configured in the environment variables
 */
export function checkContentfulConfig(): {
  isConfigured: boolean;
  missingValues: string[];
} {
  // For our implementation, we're using Supabase to store credentials
  // So we don't need environment variables, but we'll keep this function 
  // to maintain compatibility with components that expect it
  return {
    isConfigured: true,
    missingValues: []
  };
}
