
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { getStrapiBaseUrl, getStrapiApiKey } from './strapiConfig';

/**
 * Result of a connection test
 */
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Test the connection to the configured CMS provider
 * @returns Promise resolving to connection test result
 */
export async function testCMSConnection(): Promise<ConnectionTestResult> {
  const config = getCMSProviderConfig();
  
  console.log(`[testCMSConnection] Testing connection to ${config.type} CMS`);
  
  try {
    // Test connection based on provider type
    if (config.type === ContentProviderType.STRAPI) {
      return await testStrapiConnection();
    }
    
    // Supabase is always connected if we got this far
    return {
      success: true,
      message: 'Connection to Supabase established'
    };
  } catch (error) {
    console.error('[testCMSConnection] Error testing connection:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test the connection to Strapi CMS
 */
async function testStrapiConnection(): Promise<ConnectionTestResult> {
  const baseUrl = getStrapiBaseUrl();
  const apiKey = getStrapiApiKey();
  
  if (!baseUrl) {
    return {
      success: false,
      message: 'Strapi API URL not configured'
    };
  }
  
  try {
    // Try to fetch the Strapi server info
    const url = `${baseUrl}`;
    
    // Build headers if API key is available
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    
    // Make the request
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Strapi: ${response.statusText}`);
    }
    
    // Check API key if provided
    if (apiKey) {
      try {
        // Try to fetch a protected endpoint to verify API key
        const authCheckResponse = await fetch(`${baseUrl}/users/me`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        
        if (!authCheckResponse.ok) {
          return {
            success: false,
            message: 'Connected to Strapi, but API key validation failed'
          };
        }
        
        return {
          success: true,
          message: 'Successfully connected to Strapi with valid API key'
        };
      } catch (authError) {
        return {
          success: false,
          message: 'Connected to Strapi, but failed to validate API key',
          details: authError
        };
      }
    }
    
    return {
      success: true,
      message: 'Successfully connected to Strapi (no API key validation)'
    };
  } catch (error) {
    console.error('[testStrapiConnection] Error connecting to Strapi:', error);
    return {
      success: false,
      message: error instanceof Error 
        ? `Failed to connect to Strapi: ${error.message}`
        : 'Unknown error connecting to Strapi'
    };
  }
}
