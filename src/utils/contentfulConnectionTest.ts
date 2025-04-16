
import { createClient } from 'contentful';

export const checkContentfulConfig = () => {
  // Check if the required environment variables are set
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
  
  const missingValues: string[] = [];
  
  if (!spaceId) missingValues.push('VITE_CONTENTFUL_SPACE_ID');
  if (!deliveryToken) missingValues.push('VITE_CONTENTFUL_DELIVERY_TOKEN');
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues,
    config: {
      spaceId,
      deliveryToken,
      environmentId
    }
  };
};

export const testContentfulConnection = async () => {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection...');
    
    const configCheck = checkContentfulConfig();
    
    if (!configCheck.isConfigured) {
      console.error('[testContentfulConnection] Missing Contentful configuration');
      return {
        success: false,
        message: `Missing Contentful configuration: ${configCheck.missingValues.join(', ')}`
      };
    }
    
    console.log('[testContentfulConnection] Creating test Contentful client');
    
    // Create a new client directly using environment variables
    const client = createClient({
      space: configCheck.config.spaceId,
      accessToken: configCheck.config.deliveryToken,
      environment: configCheck.config.environmentId
    });
    
    // Make a simple request to verify connection
    console.log('[testContentfulConnection] Making test request to Contentful API');
    const { total } = await client.getEntries({
      limit: 1
    });
    
    console.log(`[testContentfulConnection] Connection successful. Found ${total} total entries`);
    
    return {
      success: true,
      message: `Connection to Contentful successful! Found ${total} total entries.`
    };
  } catch (error) {
    console.error('[testContentfulConnection] Error testing connection:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      success: false,
      message: `Failed to connect to Contentful: ${errorMessage}`
    };
  }
};
