
import * as contentful from 'contentful';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';

// Module level variables
let contentfulClient: contentful.ContentfulClientApi | null = null;
let lastInitialized: number = 0;
let isClientRefreshing: boolean = false;
let lastClientRefreshTime: number = 0;

/**
 * Get a Contentful client instance
 * 
 * The client is created once and reused for subsequent calls
 */
export async function getContentfulClient(): Promise<contentful.ContentfulClientApi | null> {
  try {
    // If we already have a client, return it
    if (contentfulClient) {
      return contentfulClient;
    }
    
    // Check if Contentful is configured
    if (!isContentfulConfigured()) {
      console.error('[contentfulClient] Contentful is not configured');
      return null;
    }
    
    // Create a new client
    contentfulClient = contentful.createClient({
      space: CONTENTFUL_CONFIG.SPACE_ID,
      accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN,
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
      resolveLinks: true
    });
    
    // Log initialization
    lastInitialized = Date.now();
    console.log(`[contentfulClient] Client initialized at ${new Date(lastInitialized).toISOString()}`);
    
    if (typeof window !== 'undefined') {
      window._contentfulInitialized = true;
      window._contentfulInitializedSource = 'getContentfulClient';
    }
    
    return contentfulClient;
  } catch (error) {
    console.error('[contentfulClient] Error initializing client:', error);
    return null;
  }
}

/**
 * Force refresh of the Contentful client
 * 
 * This should be called when configuration changes
 */
export async function refreshContentfulClient(): Promise<contentful.ContentfulClientApi | null> {
  try {
    // Don't allow multiple simultaneous refreshes
    if (isClientRefreshing) {
      console.log('[contentfulClient] Client is already refreshing, waiting...');
      // Wait for refresh to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      return contentfulClient;
    }
    
    // Mark as refreshing
    isClientRefreshing = true;
    lastClientRefreshTime = Date.now();
    console.log(`[contentfulClient] Refreshing client at ${new Date(lastClientRefreshTime).toISOString()}`);
    
    // Reset the client
    contentfulClient = null;
    
    // Create a new client
    const newClient = await getContentfulClient();
    
    // Log completion
    console.log(`[contentfulClient] Client refreshed at ${new Date().toISOString()}`);
    isClientRefreshing = false;
    
    if (typeof window !== 'undefined' && window._refreshContentfulAfterConfig) {
      try {
        await window._refreshContentfulAfterConfig();
      } catch (refreshError) {
        console.error('[contentfulClient] Error executing refresh callback:', refreshError);
      }
    }
    
    return newClient;
  } catch (error) {
    console.error('[contentfulClient] Error refreshing client:', error);
    isClientRefreshing = false;
    return null;
  }
}

/**
 * Test the Contentful connection
 * 
 * Returns information about success/failure and details
 */
export async function testContentfulConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}> {
  try {
    console.log('[contentfulClient] Testing Contentful connection...');
    
    // We need to force a refresh to ensure we're using the latest credentials
    const client = await refreshContentfulClient();
    
    if (!client) {
      return {
        success: false,
        message: 'Failed to initialize Contentful client. Check your credentials.',
        timestamp: new Date().toISOString()
      };
    }
    
    // Try to get the content types to validate connection
    const contentTypes = await client.getContentTypes({ limit: 1 });
    
    return {
      success: true,
      message: 'Connected to Contentful successfully',
      details: {
        contentTypes: contentTypes.total,
        space: CONTENTFUL_CONFIG.SPACE_ID,
        environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[contentfulClient] Connection test failed:', error);
    
    let errorMessage = 'Unknown error testing connection';
    
    // Try to extract a meaningful message from the error
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: `Connection failed: ${errorMessage}`,
      details: { error },
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Validate that Contentful client is properly initialized
 * Shows error message if not and returns status
 */
export async function validateContentfulClient(showToast = true): Promise<boolean> {
  try {
    const client = await getContentfulClient();
    
    if (!client) {
      if (showToast) {
        toast.error('Contentful client initialization failed. Check console for details.');
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[contentfulClient] Error validating client:', error);
    
    if (showToast) {
      toast.error('Error validating Contentful client. Check console for details.');
    }
    
    return false;
  }
}

// Export the client info functions
export function getClientInfo() {
  return {
    isInitialized: !!contentfulClient,
    lastInitialized: lastInitialized > 0 ? new Date(lastInitialized).toISOString() : 'never',
    lastRefreshed: lastClientRefreshTime > 0 ? new Date(lastClientRefreshTime).toISOString() : 'never',
    config: {
      spaceId: CONTENTFUL_CONFIG.SPACE_ID ? `${CONTENTFUL_CONFIG.SPACE_ID.substring(0, 4)}...` : 'Not set',
      environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
    }
  };
}

// Perform auto-initialization 
setTimeout(() => {
  // Only in browser context
  if (typeof window !== 'undefined') {
    getContentfulClient().then(client => {
      if (client) {
        console.log('[contentfulClient] Auto-initialized client');
      }
    }).catch(err => {
      console.error('[contentfulClient] Auto-initialization error:', err);
    });
  }
}, 10);
