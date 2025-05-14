
import { getContentfulClient } from './contentfulClient';
import { CONTENTFUL_CONFIG } from '@/config/cms';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Test the Contentful connection with current configuration
 * @returns Promise containing test results
 */
export async function testContentfulConnection(): Promise<TestResult> {
  console.log('[testContentfulConnection] Starting test with config:', {
    hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
    spaceIdLength: CONTENTFUL_CONFIG.SPACE_ID?.length || 0,
    hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    tokenLength: CONTENTFUL_CONFIG.DELIVERY_TOKEN?.length || 0,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
  });
  
  try {
    const client = getContentfulClient();
    
    if (!client) {
      return {
        success: false,
        message: 'Failed to initialize Contentful client'
      };
    }
    
    // Test a simple query to validate the connection
    const testEntry = await client.getEntries({
      limit: 1
    });
    
    console.log('[testContentfulConnection] Test query successful, found entries:', testEntry.total);
    
    return {
      success: true,
      message: `Connection successful. Space contains ${testEntry.total} entries.`,
      details: {
        entryCount: testEntry.total,
        contentTypes: testEntry.includes?.Entry?.map(entry => entry.sys.contentType?.sys?.id).filter(Boolean) || []
      }
    };
    
  } catch (error) {
    console.error('[testContentfulConnection] Connection test failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for common error patterns
    let friendlyMessage = 'Unknown connection error';
    if (errorMessage.includes('space') && errorMessage.includes('access token')) {
      friendlyMessage = 'Invalid Space ID or Access Token';
    } else if (errorMessage.includes('401')) {
      friendlyMessage = 'Authentication failed - check your delivery token';
    } else if (errorMessage.includes('404')) {
      friendlyMessage = 'Space not found - check your space ID';
    } else if (errorMessage.includes('Network Error')) {
      friendlyMessage = 'Network error - check your internet connection';
    }
    
    return {
      success: false,
      message: friendlyMessage,
      details: {
        error: errorMessage,
        config: {
          hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
          hasToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN
        }
      }
    };
  }
}
