
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { getStrapiApiKey, getStrapiBaseUrl } from './strapiConfig';

/**
 * Test connection to the currently configured CMS provider
 * @returns Object with success flag and connection details
 */
export async function testCMSConnection(): Promise<{
  success: boolean;
  message: string;
  provider: string;
  details?: any;
}> {
  const config = getCMSProviderConfig();
  
  // Test Strapi connection
  if (config.type === ContentProviderType.STRAPI) {
    return await testStrapiConnection();
  }
  
  // Test Supabase connection (default)
  return await testSupabaseConnection();
}

/**
 * Test connection to the Strapi CMS
 */
async function testStrapiConnection(): Promise<{
  success: boolean;
  message: string;
  provider: 'Strapi';
  details?: any;
}> {
  const baseUrl = getStrapiBaseUrl();
  const apiKey = getStrapiApiKey();
  
  if (!baseUrl) {
    return {
      success: false,
      message: 'Strapi API URL not configured',
      provider: 'Strapi'
    };
  }
  
  try {
    // Attempt to connect to Strapi
    const response = await fetch(`${baseUrl}`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Strapi returned status ${response.status}: ${response.statusText}`,
        provider: 'Strapi',
        details: { status: response.status, statusText: response.statusText }
      };
    }
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.log('[testStrapiConnection] Unable to parse JSON response');
      // Non-JSON response is OK, we just want to check connectivity
    }
    
    return {
      success: true,
      message: 'Successfully connected to Strapi',
      provider: 'Strapi',
      details: {
        apiUrl: baseUrl,
        apiKeyConfigured: !!apiKey,
        version: responseData?.strapiVersion || 'Unknown'
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to Strapi: ${error instanceof Error ? error.message : String(error)}`,
      provider: 'Strapi',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}

/**
 * Test connection to the Supabase CMS
 */
async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  provider: 'Supabase';
  details?: any;
}> {
  try {
    // Import the supabase client
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Test a simple query
    const { data: testData, error } = await supabase.from('machines').select('count(*)');
    
    if (error) {
      return {
        success: false,
        message: `Failed to connect to Supabase: ${error.message}`,
        provider: 'Supabase',
        details: { error: error.message }
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Supabase',
      provider: 'Supabase',
      details: {
        url: 'Connected via Lovable integration',
        authenticated: true
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to Supabase: ${error instanceof Error ? error.message : String(error)}`,
      provider: 'Supabase',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}
