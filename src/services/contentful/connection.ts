
/**
 * This file handles connection testing and validation for Contentful
 */

import { isContentfulConfigured } from './environment';
import { getContentfulClient } from './client';

/**
 * Test the Contentful connection
 */
export async function testContentfulConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection...');
    
    if (!isContentfulConfigured()) {
      return {
        success: false,
        message: 'Contentful is not configured. Missing Space ID or Delivery Token.'
      };
    }

    const client = await getContentfulClient();
    
    // Make a simple request to verify the client works
    const response = await client.getEntries({
      limit: 1,
    });
    
    // Set a global flag so other parts of the app know Contentful is working
    if (typeof window !== 'undefined') {
      window._contentfulInitialized = true;
      window._contentfulInitializedSource = 'successful-connection';
    }

    return {
      success: true,
      message: 'Connection to Contentful successful',
      details: {
        total: response.total,
        limit: response.limit,
        skip: response.skip
      }
    };
  } catch (error) {
    console.error('[testContentfulConnection] Connection test failed:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Detect common error types
      if (errorMessage.includes('401')) {
        errorMessage = 'Authentication failed. Check your Contentful delivery token.';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Space not found. Check your Contentful Space ID.';
      }
    }

    return {
      success: false,
      message: `Contentful connection error: ${errorMessage}`,
      details: { error }
    };
  }
}

/**
 * Validate that the Contentful client is working correctly
 */
export async function validateContentfulClient(): Promise<boolean> {
  try {
    const result = await testContentfulConnection();
    return result.success;
  } catch (error) {
    console.error('[validateContentfulClient] Client validation failed:', error);
    return false;
  }
}
