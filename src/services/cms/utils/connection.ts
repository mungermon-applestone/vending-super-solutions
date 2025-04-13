
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { buildStrapiUrl, createStrapiHeaders } from './strapiConfig';

/**
 * Test connection to Strapi CMS
 * @returns Connection status and details
 */
export async function testStrapiConnection(): Promise<{
  success: boolean;
  statusCode?: number;
  message: string;
  details?: any;
}> {
  const config = getCMSProviderConfig();
  
  if (config.type !== ContentProviderType.STRAPI) {
    return {
      success: false,
      message: 'Current CMS provider is not Strapi'
    };
  }
  
  if (!config.apiUrl) {
    return {
      success: false,
      message: 'Strapi API URL is not configured'
    };
  }
  
  try {
    // Test connection to Strapi API
    console.log(`[testStrapiConnection] Testing connection to ${config.apiUrl}`);
    const url = buildStrapiUrl('/api');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createStrapiHeaders()
    });
    
    const statusCode = response.status;
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        statusCode,
        message: `Failed to connect to Strapi API: ${response.statusText} (${statusCode})`,
        details: errorText
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      statusCode,
      message: 'Successfully connected to Strapi API',
      details: data
    };
  } catch (error) {
    console.error('[testStrapiConnection] Connection error:', error);
    return {
      success: false,
      message: `Error connecting to Strapi API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Test connection to the current CMS provider
 * @returns Connection status and details
 */
export async function testCMSConnection(): Promise<{
  success: boolean;
  statusCode?: number;
  message: string;
  provider: string;
  details?: any;
}> {
  const config = getCMSProviderConfig();
  
  if (config.type === ContentProviderType.STRAPI) {
    const result = await testStrapiConnection();
    return {
      ...result,
      provider: 'Strapi'
    };
  }
  
  // Default to Supabase
  return {
    success: true,
    message: 'Using Supabase as CMS provider (no connection test needed)',
    provider: 'Supabase'
  };
}
