
import { createClient } from 'contentful';

// Create a cached client to avoid unnecessary re-instantiation
let contentfulClient: ReturnType<typeof createClient>;

export function getContentfulClient() {
  if (contentfulClient) {
    return contentfulClient;
  }
  
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN) {
    throw new Error('Contentful environment variables are not properly configured');
  }
  
  contentfulClient = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
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
