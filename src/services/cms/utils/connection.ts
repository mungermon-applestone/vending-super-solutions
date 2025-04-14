
import { getContentfulConfig } from './cmsInfo';
import { createClient } from 'contentful-management';

export const testContentfulConnection = async () => {
  try {
    const config = await getContentfulConfig();
    
    if (!config) {
      return {
        success: false,
        message: 'No Contentful configuration found'
      };
    }

    const client = createClient({
      accessToken: config.management_token
    });

    // Try to fetch the space to verify connection
    const space = await client.getSpace(config.space_id);

    return {
      success: true,
      message: 'Successfully connected to Contentful',
      spaceId: space.sys.id
    };
  } catch (error) {
    console.error('[testContentfulConnection] Connection error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
};
