
import { getCMSProviderConfig } from '../providerConfig';
import { ContentProviderType } from '../adapters/types';
import { getStrapiApiKey, getStrapiBaseUrl } from './strapiConfig';
import { validateTechnologyAdapter } from '../adapters/technologies/technologyAdapterFactory';

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
  console.log('[testCMSConnection] Testing connection with config:', config);
  
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
  const config = getCMSProviderConfig();
  const baseUrl = config.apiUrl || getStrapiBaseUrl();
  const apiKey = config.apiKey || getStrapiApiKey();
  
  console.log(`[testStrapiConnection] Testing with URL: ${baseUrl}, API key configured: ${!!apiKey}`);
  
  if (!baseUrl) {
    return {
      success: false,
      message: 'Strapi API URL not configured',
      provider: 'Strapi'
    };
  }
  
  try {
    // Try multiple endpoints progressively to find one that works
    // 1. Try the root API endpoint
    // 2. Try /api endpoint if not already specified
    // 3. Try accessing a known content type endpoint
    
    let response = null;
    let endpoint = baseUrl;
    let endpointTried = 'API root';
    
    const headers = apiKey ? { 
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    } : { 
      'Content-Type': 'application/json' 
    };
    
    console.log(`[testStrapiConnection] Trying endpoint: ${endpoint}`);
    
    try {
      // First attempt - provided URL
      response = await fetch(endpoint, { headers });
      
      // If that fails, try adding /api if not already there
      if (!response.ok && !baseUrl.endsWith('/api')) {
        endpoint = `${baseUrl}/api`;
        endpointTried = 'API with /api suffix';
        console.log(`[testStrapiConnection] First attempt failed, trying: ${endpoint}`);
        response = await fetch(endpoint, { headers });
      }
      
      // If that fails too, try the technologies endpoint
      if (!response.ok) {
        endpoint = `${baseUrl}/technologies`;
        endpointTried = 'technologies endpoint';
        console.log(`[testStrapiConnection] Second attempt failed, trying: ${endpoint}`);
        response = await fetch(endpoint, { headers });
      }
    } catch (error) {
      console.error('[testStrapiConnection] Fetch error:', error);
      return {
        success: false,
        message: `Failed to connect to Strapi: Network error`,
        provider: 'Strapi',
        details: { 
          error: error instanceof Error ? error.message : String(error),
          apiUrl: baseUrl
        }
      };
    }
    
    if (!response.ok) {
      return {
        success: false,
        message: `Strapi returned status ${response.status} from ${endpointTried}`,
        provider: 'Strapi',
        details: { 
          status: response.status, 
          statusText: response.statusText,
          endpoint: endpoint,
          apiUrl: baseUrl,
          endpointTried
        }
      };
    }
    
    let responseData;
    try {
      responseData = await response.json();
      console.log('[testStrapiConnection] Response data:', responseData);
    } catch (e) {
      console.log('[testStrapiConnection] Unable to parse JSON response');
      // Non-JSON response is OK for some endpoints, we just want to check connectivity
    }
    
    // Next, validate that we can use the technology adapter
    try {
      const canAccessTechnologies = await validateTechnologyAdapter({
        type: ContentProviderType.STRAPI,
        apiUrl: baseUrl,
        apiKey: apiKey
      });
      
      if (!canAccessTechnologies) {
        return {
          success: false,
          message: 'Connected to Strapi, but could not access technologies content type',
          provider: 'Strapi',
          details: {
            apiUrl: baseUrl,
            apiKeyConfigured: !!apiKey,
            connectionSuccessful: true,
            contentTypesAccessible: false
          }
        };
      }
    } catch (error) {
      console.error('[testStrapiConnection] Error validating technology adapter:', error);
      return {
        success: false,
        message: 'Connected to Strapi API, but could not validate content type access',
        provider: 'Strapi',
        details: {
          apiUrl: baseUrl,
          apiKeyConfigured: !!apiKey,
          connectionSuccessful: true,
          contentTypesAccessible: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Strapi',
      provider: 'Strapi',
      details: {
        apiUrl: baseUrl,
        apiKeyConfigured: !!apiKey,
        version: responseData?.strapiVersion || 'Unknown',
        contentTypesAccessible: true,
        endpoint: endpoint,
        endpointTried
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to Strapi: ${error instanceof Error ? error.message : String(error)}`,
      provider: 'Strapi',
      details: { 
        error: error instanceof Error ? error.message : String(error),
        apiUrl: baseUrl
      }
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
    const { data: testData, error } = await supabase.from('technologies').select('count(*)');
    
    if (error) {
      return {
        success: false,
        message: `Failed to connect to Supabase: ${error.message}`,
        provider: 'Supabase',
        details: { error: error.message }
      };
    }
    
    // Also verify the technology adapter works
    const canAccessTechnologies = await validateTechnologyAdapter({
      type: ContentProviderType.SUPABASE
    });
    
    if (!canAccessTechnologies) {
      return {
        success: false,
        message: 'Connected to Supabase, but could not access technologies content type',
        provider: 'Supabase',
        details: {
          connectionSuccessful: true,
          contentTypesAccessible: false
        }
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Supabase',
      provider: 'Supabase',
      details: {
        url: 'Connected via Lovable integration',
        authenticated: true,
        contentTypesAccessible: true
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
