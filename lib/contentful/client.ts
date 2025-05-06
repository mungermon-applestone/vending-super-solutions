
import { createClient } from 'contentful';

// Create a cached client to avoid unnecessary re-instantiation
let contentfulClient: ReturnType<typeof createClient>;

// Function to get environment variables with robust fallbacks
function getEnvironmentVariable(key: string): string | undefined {
  // Check browser environment variables first (for client-side)
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  
  // Then check process.env (for server-side)
  return process.env[key];
}

export function getContentfulClient() {
  if (contentfulClient) {
    return contentfulClient;
  }
  
  // Try all possible environment variable names for maximum compatibility
  const spaceId = 
    getEnvironmentVariable('NEXT_PUBLIC_CONTENTFUL_SPACE_ID') || 
    getEnvironmentVariable('CONTENTFUL_SPACE_ID') ||
    getEnvironmentVariable('VITE_CONTENTFUL_SPACE_ID');
  
  const accessToken = 
    getEnvironmentVariable('NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN') || 
    getEnvironmentVariable('CONTENTFUL_DELIVERY_TOKEN') ||
    getEnvironmentVariable('VITE_CONTENTFUL_DELIVERY_TOKEN');
  
  const environment = 
    getEnvironmentVariable('NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT') || 
    getEnvironmentVariable('CONTENTFUL_ENVIRONMENT') || 
    getEnvironmentVariable('VITE_CONTENTFUL_ENVIRONMENT') || 
    'master';
  
  // Check if environment variables are set
  if (!spaceId || !accessToken) {
    console.error('Contentful environment variables missing:', { 
      hasSpaceId: !!spaceId, 
      hasAccessToken: !!accessToken 
    });
    throw new Error('Contentful environment variables are not properly configured');
  }
  
  console.log('Initializing Contentful client with:', { 
    spaceId, 
    hasAccessToken: !!accessToken, 
    environment 
  });
  
  contentfulClient = createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
  });
  
  return contentfulClient;
}

// Function to test contentful connection
export async function testContentfulConnection() {
  try {
    const client = getContentfulClient();
    // Make a simple request to check connection
    const response = await client.getEntries({
      limit: 1
    });
    
    return { 
      success: true, 
      message: `Successfully connected to Contentful. Found ${response.total} entries.`
    };
  } catch (error) {
    console.error('Contentful connection test failed:', error);
    let message = 'Failed to connect to Contentful.';
    
    if (error instanceof Error) {
      message = `Connection failed: ${error.message}`;
    }
    
    return { 
      success: false, 
      message 
    };
  }
}
