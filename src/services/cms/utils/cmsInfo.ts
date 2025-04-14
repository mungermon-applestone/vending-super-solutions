
import { supabase } from '@/integrations/supabase/client';

export const getContentfulConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('contentful_config')
      .select('*')
      .single();

    if (error) {
      console.error('[getContentfulConfig] Error fetching config:', error);
      return null;
    }

    console.log('[getContentfulConfig] Fetched configuration:', data);
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
