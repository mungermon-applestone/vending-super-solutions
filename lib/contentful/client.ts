
import { createClient } from 'contentful';

// Create a cached client to avoid unnecessary re-instantiation
let contentfulClient: ReturnType<typeof createClient>;

// Function to get environment variables with robust fallbacks
function getEnvironmentVariable(key: string): string | undefined {
  // Check browser environment variables first (for client-side)
  if (typeof window !== 'undefined') {
    // Check window.env (runtime configuration)
    if (window.env && window.env[key]) {
      return window.env[key];
    }
    
    // Try accessing Next.js exposed environment variables
    const nextPublicKey = `NEXT_PUBLIC_${key}`;
    if (process.env[nextPublicKey]) {
      return process.env[nextPublicKey];
    }
  }
  
  // Then check process.env (for server-side)
  if (process.env[key]) {
    return process.env[key];
  }
  
  return undefined;
}

export function getContentfulClient() {
  if (contentfulClient) {
    return contentfulClient;
  }
  
  // Try all possible environment variable names for maximum compatibility
  const spaceId = 
    getEnvironmentVariable('NEXT_PUBLIC_CONTENTFUL_SPACE_ID') || 
    getEnvironmentVariable('CONTENTFUL_SPACE_ID') ||
    getEnvironmentVariable('VITE_CONTENTFUL_SPACE_ID') ||
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ||
    process.env.CONTENTFUL_SPACE_ID;
  
  const accessToken = 
    getEnvironmentVariable('NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN') || 
    getEnvironmentVariable('CONTENTFUL_DELIVERY_TOKEN') ||
    getEnvironmentVariable('VITE_CONTENTFUL_DELIVERY_TOKEN') ||
    process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ||
    process.env.CONTENTFUL_DELIVERY_TOKEN;
  
  const environment = 
    getEnvironmentVariable('NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT') || 
    getEnvironmentVariable('CONTENTFUL_ENVIRONMENT') || 
    getEnvironmentVariable('VITE_CONTENTFUL_ENVIRONMENT') || 
    process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ||
    process.env.CONTENTFUL_ENVIRONMENT ||
    'master';
  
  // Log all environment variables for debugging
  console.log('Environment variables check:', {
    processEnvSpaceId: process.env.CONTENTFUL_SPACE_ID,
    processEnvNextPublicSpaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    processEnvAccessToken: process.env.CONTENTFUL_DELIVERY_TOKEN ? 'Set (hidden)' : 'Not set',
    processEnvNextPublicAccessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ? 'Set (hidden)' : 'Not set',
    processEnvEnvironment: process.env.CONTENTFUL_ENVIRONMENT,
    processEnvNextPublicEnvironment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
    hasWindowEnv: typeof window !== 'undefined' && !!window.env,
    resolvedSpaceId: spaceId,
    resolvedAccessToken: accessToken ? 'Set (hidden)' : 'Not set',
    resolvedEnvironment: environment
  });
  
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
  
  // Create the Contentful client
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
    let details = '';
    
    if (error instanceof Error) {
      message = `Connection failed: ${error.message}`;
      
      // Add more specific error messages for common issues
      if (error.message.includes('401')) {
        details = 'This usually means your Access Token is invalid.';
      } else if (error.message.includes('404')) {
        details = 'This usually means your Space ID is invalid.';
      }
    }
    
    return { 
      success: false, 
      message,
      details
    };
  }
}

// Add global type for window.env
declare global {
  interface Window {
    env?: Record<string, string>;
  }
}
