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

    return data;
  } catch (error) {
    console.error('[getContentfulConfig] Unexpected error:', error);
    return null;
  }
};

import { getCMSProviderConfig, ContentProviderType } from '../providerConfig';

interface CMSInfo {
  provider: string;
  status: 'configured' | 'partial' | 'not-configured';
  isConfigured: boolean;
  adminUrl?: string;
  apiUrl?: string;
  apiKeyConfigured?: boolean;
}

export const getCMSInfo = (): CMSInfo => {
  const config = getCMSProviderConfig();
  
  if (config.type === ContentProviderType.STRAPI) {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_STRAPI_API_KEY;
    
    const isApiUrlConfigured = !!apiUrl && apiUrl.trim() !== '';
    const isApiKeyConfigured = !!apiKey && apiKey.trim() !== '';
    
    const isConfigured = isApiUrlConfigured;
    
    return {
      provider: 'Strapi',
      status: isConfigured ? 'configured' : 'not-configured',
      isConfigured: isConfigured,
      adminUrl: apiUrl ? `${apiUrl}/admin` : undefined,
      apiUrl: apiUrl,
      apiKeyConfigured: isApiKeyConfigured
    };
  }
  
  return {
    provider: 'Supabase',
    status: 'configured',
    isConfigured: true,
    adminUrl: 'https://supabase.com/dashboard'
  };
};
