
import { isContentfulConfigured, testContentfulConnection as testConnection } from '@/services/contentful/client';

export const checkContentfulConfig = () => {
  // Get values using the new helper functions
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
  
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
    
    // Use our unified test connection function
    return await testConnection();
  } catch (error) {
    console.error('[testContentfulConnection] Error testing connection:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      success: false,
      message: `Failed to connect to Contentful: ${errorMessage}`
    };
  }
};
