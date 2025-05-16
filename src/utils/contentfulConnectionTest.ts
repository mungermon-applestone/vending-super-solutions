
import { createClient } from 'contentful';
import { CONTENTFUL_CONFIG } from '@/config/cms';

export const checkContentfulConfig = () => {
  // Check if the required configuration values are set
  const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
  const deliveryToken = CONTENTFUL_CONFIG.DELIVERY_TOKEN;
  const environmentId = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
  
  const missingValues: string[] = [];
  
  if (!spaceId) missingValues.push('SPACE_ID');
  if (!deliveryToken) missingValues.push('DELIVERY_TOKEN');
  
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
    
    // Create a new client directly using the values from config
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
