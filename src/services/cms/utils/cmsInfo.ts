import { supabase } from '@/integrations/supabase/client';

export const getContentfulConfig = async () => {
  try {
    console.log('[getContentfulConfig] Fetching Contentful config from Supabase...');
    
    // First, check if the table exists and has any rows
    const { count, error: countError } = await supabase
      .from('contentful_config')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('[getContentfulConfig] Error checking table:', countError);
      return null;
    }
    
    console.log(`[getContentfulConfig] Found ${count} configurations in table`);
    
    if (count === 0) {
      console.warn('[getContentfulConfig] No records found in contentful_config table');
      return null;
    }
    
    // Now fetch the actual data
    const { data, error } = await supabase
      .from('contentful_config')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('[getContentfulConfig] Error fetching config:', error);
      // Try alternative approach if single() fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('contentful_config')
        .select('*')
        .limit(1);
        
      if (fallbackError || !fallbackData || fallbackData.length === 0) {
        console.error('[getContentfulConfig] Fallback also failed:', fallbackError);
        return null;
      }
      
      console.log('[getContentfulConfig] Fallback succeeded, using first row');
      return fallbackData[0];
    }

    // Log configuration status but not the actual tokens
    console.log('[getContentfulConfig] Configuration status:', {
      spaceId: data?.space_id,
      envId: data?.environment_id,
      hasDeliveryToken: !!data?.delivery_token,
      hasManagementToken: !!data?.management_token,
      deliveryTokenLength: data?.delivery_token?.length,
      managementTokenLength: data?.management_token?.length
    });
    
    return data;
  } catch (error) {
    console.error('[getContentfulConfig] Unexpected error:', error);
    return null;
  }
};

// Define types
export interface CMSInfo {
  provider: string;
  status: 'configured' | 'partial' | 'not-configured';
  isConfigured: boolean;
  adminUrl?: string;
  apiUrl?: string;
  apiKeyConfigured?: boolean;
}

// Content provider type enum
export enum ContentProviderType {
  SUPABASE = 'supabase',
  STRAPI = 'strapi',
  CONTENTFUL = 'contentful'
}

/**
 * Get information about the current CMS provider
 * @returns Information about the current CMS configuration
 */
export const getCMSInfo = (): CMSInfo => {
  // For now we're using Contentful as the primary CMS
  // In the future this can be expanded to support multiple providers
  
  // Check if we're using Strapi by looking at environment variables
  const strapiUrl = process.env.VITE_STRAPI_API_URL;
  const strapiKey = process.env.VITE_STRAPI_API_KEY;
  const cmsProvider = process.env.VITE_CMS_PROVIDER || 'supabase';
  
  if (cmsProvider === 'strapi' && strapiUrl) {
    const isApiUrlConfigured = !!strapiUrl && strapiUrl.trim() !== '';
    const isApiKeyConfigured = !!strapiKey && strapiKey.trim() !== '';
    
    const isConfigured = isApiUrlConfigured;
    const strapiBaseUrl = strapiUrl.replace('/api', '');
    
    return {
      provider: 'Strapi',
      status: isConfigured ? 'configured' : 'not-configured',
      isConfigured: isConfigured,
      adminUrl: isApiUrlConfigured ? `${strapiBaseUrl}/admin` : undefined,
      apiUrl: strapiUrl,
      apiKeyConfigured: isApiKeyConfigured
    };
  }
  
  // Default to Contentful
  return {
    provider: 'Contentful',
    status: 'configured', // Assuming Contentful is always configured via Supabase
    isConfigured: true,
    adminUrl: 'https://app.contentful.com/'
  };
};
