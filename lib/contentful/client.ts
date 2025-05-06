
import { createClient } from 'contentful';

// Create a cached client to avoid unnecessary re-instantiation
let contentfulClient: ReturnType<typeof createClient>;

export function getContentfulClient() {
  if (contentfulClient) {
    return contentfulClient;
  }
  
  // Support both Next.js and React environment variable naming conventions
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_DELIVERY_TOKEN;
  const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || process.env.CONTENTFUL_ENVIRONMENT || 'master';
  
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
