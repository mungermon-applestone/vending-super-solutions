
import { createClient } from 'contentful';

// Create a cached client to avoid unnecessary re-instantiation
let contentfulClient: ReturnType<typeof createClient>;

// Force logging on client creation to help debug
console.log('Contentful client module initialized');

// HARDCODED CREDENTIALS - These will always be used as a fallback
const HARDCODED_CREDENTIALS = {
  SPACE_ID: "p8y13tvmv0uj",
  DELIVERY_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
  ENVIRONMENT: "master"
};

// Function to get environment variables with robust fallbacks
function getEnvironmentVariable(key: string): string | undefined {
  console.log(`[contentful/client] Looking for ${key}`);
  
  // IMPORTANT: Check browser window.env FIRST (highest priority)
  if (typeof window !== 'undefined' && window.env) {
    // Direct key lookup
    if (window.env[key]) {
      console.log(`[contentful/client] Found ${key} in window.env`);
      return window.env[key];
    }
    
    // Try NEXT_PUBLIC_ prefix variations
    const nextPublicKey = `NEXT_PUBLIC_${key.replace('CONTENTFUL_', '')}`;
    if (window.env[nextPublicKey]) {
      console.log(`[contentful/client] Found ${nextPublicKey} in window.env`);
      return window.env[nextPublicKey];
    }
    
    // Try NEXT_PUBLIC_CONTENTFUL_ prefix
    const legacyKey = `NEXT_PUBLIC_CONTENTFUL_${key.replace('CONTENTFUL_', '')}`;
    if (window.env[legacyKey]) {
      console.log(`[contentful/client] Found ${legacyKey} in window.env`);
      return window.env[legacyKey];
    }

    // Try alternative key patterns (for ACCESS_TOKEN vs DELIVERY_TOKEN)
    if (key === 'CONTENTFUL_DELIVERY_TOKEN' && window.env['NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN']) {
      console.log(`[contentful/client] Found NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as alternative for ${key}`);
      return window.env['NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN'];
    }
  }
  
  // Then check process.env with various naming conventions
  // NEXT_PUBLIC_ prefix (for client-side)
  if (process.env[`NEXT_PUBLIC_${key}`]) {
    console.log(`[contentful/client] Found ${key} in process.env with NEXT_PUBLIC_ prefix`);
    return process.env[`NEXT_PUBLIC_${key}`];
  }
  
  // Special case for ACCESS_TOKEN vs DELIVERY_TOKEN
  if (key === 'CONTENTFUL_DELIVERY_TOKEN' && process.env['NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN']) {
    console.log(`[contentful/client] Found NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN in process.env`);
    return process.env['NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN'];
  }
  
  // Direct environment variable
  if (process.env[key]) {
    console.log(`[contentful/client] Found ${key} in process.env direct lookup`);
    return process.env[key];
  }
  
  // If nothing found, return hardcoded credentials
  console.log(`[contentful/client] Using hardcoded ${key}`);
  if (key === 'CONTENTFUL_SPACE_ID') return HARDCODED_CREDENTIALS.SPACE_ID;
  if (key === 'CONTENTFUL_DELIVERY_TOKEN') return HARDCODED_CREDENTIALS.DELIVERY_TOKEN;
  if (key === 'CONTENTFUL_ENVIRONMENT') return HARDCODED_CREDENTIALS.ENVIRONMENT;
  
  console.log(`[contentful/client] Could not find ${key} in any environment location`);
  return undefined;
}

export function getContentfulClient() {
  if (contentfulClient) {
    return contentfulClient;
  }
  
  console.log('[contentful/client] Creating new Contentful client');
  
  // ALWAYS use hardcoded credentials for maximum compatibility
  const spaceId = HARDCODED_CREDENTIALS.SPACE_ID;
  const accessToken = HARDCODED_CREDENTIALS.DELIVERY_TOKEN;
  const environment = HARDCODED_CREDENTIALS.ENVIRONMENT;
  
  // Log what we're using
  console.log('[contentful/client] Using Contentful credentials:', {
    spaceId: spaceId.substring(0, 3) + '...',
    hasToken: !!accessToken,
    environment: environment
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
    console.log('[contentful/client] Testing Contentful connection');
    const client = getContentfulClient();
    
    // Make a simple request to check connection
    const response = await client.getEntries({
      limit: 1
    });
    
    console.log('[contentful/client] Connection test successful:', {
      total: response.total,
      items: response.items.length
    });
    
    return { 
      success: true, 
      message: `Successfully connected to Contentful. Found ${response.total} entries.`
    };
  } catch (error) {
    console.error('[contentful/client] Contentful connection test failed:', error);
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
