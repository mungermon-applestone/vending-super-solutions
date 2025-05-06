
import { createClient } from 'contentful';

// Create a cached client to avoid unnecessary re-instantiation
let contentfulClient: ReturnType<typeof createClient>;

// HARDCODED CREDENTIALS - These will be used directly
const SPACE_ID = "p8y13tvmv0uj";
const DELIVERY_TOKEN = "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU";
const ENVIRONMENT = "master";

// Simplified client creation function
export function getContentfulClient() {
  // If we already have a client, return it
  if (contentfulClient) {
    console.log('[contentful] Using existing Contentful client');
    return contentfulClient;
  }
  
  console.log('[contentful] Creating new Contentful client with hardcoded credentials');
  
  try {
    // Create a new client with our hardcoded credentials
    contentfulClient = createClient({
      space: SPACE_ID,
      accessToken: DELIVERY_TOKEN,
      environment: ENVIRONMENT,
    });
    
    return contentfulClient;
  } catch (error) {
    console.error('[contentful] Error creating Contentful client:', error);
    throw error;
  }
}

// Function to test contentful connection
export async function testContentfulConnection() {
  try {
    console.log('[contentful] Testing Contentful connection');
    const client = getContentfulClient();
    
    // Make a simple request to check connection
    const response = await client.getEntries({
      limit: 1
    });
    
    console.log('[contentful] Connection test successful:', {
      total: response.total,
      items: response.items.length
    });
    
    return { 
      success: true, 
      message: `Successfully connected to Contentful. Found ${response.total} entries.`
    };
  } catch (error) {
    console.error('[contentful] Contentful connection test failed:', error);
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
