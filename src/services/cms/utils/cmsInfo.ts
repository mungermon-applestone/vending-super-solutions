
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
      throw new Error(`Failed to check contentful_config table: ${countError.message}`);
    }
    
    console.log(`[getContentfulConfig] Found ${count} configurations in table`);
    
    if (count === 0) {
      console.error('[getContentfulConfig] No records found in contentful_config table');
      throw new Error('No Contentful configuration found. Please set up your Contentful credentials in Admin Settings.');
    }
    
    // Now fetch the actual data
    const { data, error } = await supabase
      .from('contentful_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[getContentfulConfig] Error fetching config:', error);
      throw new Error(`Failed to fetch Contentful config: ${error.message}`);
    }

    if (!data) {
      console.error('[getContentfulConfig] No data returned');
      throw new Error('No Contentful configuration found. Please set up your Contentful credentials in Admin Settings.');
    }

    // Log configuration status but not the actual tokens
    console.log('[getContentfulConfig] Configuration retrieved successfully:', {
      configId: data.id,
      spaceId: data.space_id,
      envId: data.environment_id,
      hasDeliveryToken: !!data.delivery_token,
      hasManagementToken: !!data.management_token,
      deliveryTokenLength: data.delivery_token?.length || 0,
      managementTokenLength: data.management_token?.length || 0,
      created: data.created_at
    });
    
    return data;
  } catch (error) {
    console.error('[getContentfulConfig] Error:', error);
    throw error;
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
  contentfulConfigured?: boolean;
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
  return {
    provider: 'Contentful',
    status: 'configured', 
    isConfigured: true,
    adminUrl: 'https://app.contentful.com/',
    contentfulConfigured: true
  };
};
