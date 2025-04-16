
import { getContentfulConfig, resetContentfulConfig } from '@/services/cms/utils/cmsInfo';
import { resetContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { createClient } from 'contentful';

export const checkContentfulConfig = () => {
  // Check if the required environment variables are set
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN;
  
  const missingValues: string[] = [];
  
  if (!spaceId) missingValues.push('VITE_CONTENTFUL_SPACE_ID');
  if (!deliveryToken) missingValues.push('VITE_CONTENTFUL_DELIVERY_TOKEN');
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
};

export const testContentfulConnection = async () => {
  try {
    console.log('[testContentfulConnection] Testing Contentful connection...');
    
    // Reset caches to ensure a fresh connection
    resetContentfulConfig();
    resetContentfulClient();
    
    // Get configuration from Supabase
    const config = await getContentfulConfig();
    
    if (!config || !config.space_id || !config.delivery_token) {
      console.error('[testContentfulConnection] Missing Contentful configuration');
      return {
        success: false,
        message: 'Contentful configuration is incomplete. Please check your settings.'
      };
    }
    
    console.log('[testContentfulConnection] Creating test Contentful client');
    
    // Create a new client
    const client = createClient({
      space: config.space_id,
      accessToken: config.delivery_token,
      environment: config.environment_id || 'master'
    });
    
    // Make a simple request to verify connection
    console.log('[testContentfulConnection] Making test request to Contentful API');
    const { total } = await client.getEntries({
      limit: 1
    });
    
    console.log(`[testContentfulConnection] Connection successful. Found ${total} total entries`);
    
    // Also try to refresh our singleton client
    await refreshContentfulClient();
    
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
