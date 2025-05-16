
import { createClient, ContentfulClientApi } from "contentful";
import { toast } from "sonner";

// Store the client instance for reuse
let contentfulClientInstance: ContentfulClientApi | null = null;

/**
 * Get or create a Contentful client instance using environment variables
 * This uses lazy initialization to only create the client when needed
 */
export async function getContentfulClient(): Promise<ContentfulClientApi> {
  if (contentfulClientInstance) {
    return contentfulClientInstance;
  }

  // Get credentials from environment or window.env
  const spaceId = getContentfulSpaceId();
  const accessToken = getContentfulAccessToken();
  const environment = getContentfulEnvironment();

  if (!spaceId || !accessToken) {
    console.error('[getContentfulClient] Missing Contentful credentials');
    throw new Error('Contentful credentials are missing. Please check your configuration.');
  }

  try {
    console.log('[getContentfulClient] Creating new Contentful client instance');
    contentfulClientInstance = createClient({
      space: spaceId,
      accessToken,
      environment,
    });

    return contentfulClientInstance;
  } catch (error) {
    console.error('[getContentfulClient] Error creating Contentful client:', error);
    throw new Error('Failed to initialize Contentful client');
  }
}

/**
 * Get Contentful Space ID from environment variables or window.env
 */
export function getContentfulSpaceId(): string {
  // Try to get from import.meta.env first
  const envSpaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  
  // Then try window.env if available
  const windowEnvSpaceId = typeof window !== 'undefined' && 
    window.env && 
    window.env.VITE_CONTENTFUL_SPACE_ID;
  
  // Return the first available value
  return envSpaceId || windowEnvSpaceId || "";
}

/**
 * Get Contentful Access Token from environment variables or window.env
 */
export function getContentfulAccessToken(): string {
  // Try to get from import.meta.env first
  const envToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  
  // Then try window.env if available
  const windowEnvToken = typeof window !== 'undefined' && 
    window.env && 
    window.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  
  // Return the first available value
  return envToken || windowEnvToken || "";
}

/**
 * Get Contentful Environment ID from environment variables or window.env
 */
export function getContentfulEnvironment(): string {
  // Try to get from import.meta.env first
  const envEnvironment = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT;
  
  // Then try window.env if available
  const windowEnvEnvironment = typeof window !== 'undefined' && 
    window.env && 
    (window.env.VITE_CONTENTFUL_ENVIRONMENT || window.env.VITE_CONTENTFUL_ENVIRONMENT_ID);
  
  // Default to 'master' if not specified
  return envEnvironment || windowEnvEnvironment || "master";
}

/**
 * Refresh the Contentful client instance (for example, after credentials change)
 */
export async function refreshContentfulClient(): Promise<ContentfulClientApi> {
  // Clear existing instance
  contentfulClientInstance = null;
  
  try {
    const newClient = await getContentfulClient();
    toast.success('Contentful client refreshed');
    return newClient;
  } catch (error) {
    toast.error('Failed to refresh Contentful client');
    throw error;
  }
}

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
 * Check if Contentful is properly configured
 */
export function isContentfulConfigured(): boolean {
  const spaceId = getContentfulSpaceId();
  const accessToken = getContentfulAccessToken();
  
  console.log('[isContentfulConfigured] Configuration check:', {
    hasSpaceId: !!spaceId,
    hasAccessToken: !!accessToken
  });
  
  return !!spaceId && !!accessToken;
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

// Export contentfulClient for backward compatibility
// This is now just an empty object that proxies to the real client
// It will be populated on first use via the proxy handler
export const contentfulClient = new Proxy({} as ContentfulClientApi, {
  get: (target, prop) => {
    // Create a function that gets the client and calls the requested method
    return async (...args: any[]) => {
      try {
        const client = await getContentfulClient();
        // @ts-ignore - we know the property exists on the client
        return client[prop](...args);
      } catch (error) {
        console.error(`[contentfulClient.${String(prop)}] Error:`, error);
        throw error;
      }
    };
  }
});
