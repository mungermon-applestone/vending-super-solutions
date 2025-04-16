
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

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
    // First try to initialize the client
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
        sys: { id: 'space-id-not-available' }
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
  const missingValues: string[] = [];
  
  // Check for Contentful environment variables
  const requiredVars = [
    'VITE_CONTENTFUL_SPACE_ID', 
    'VITE_CONTENTFUL_DELIVERY_TOKEN'
  ];
  
  for (const envVar of requiredVars) {
    if (!import.meta.env[envVar]) {
      missingValues.push(envVar);
    }
  }
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}
