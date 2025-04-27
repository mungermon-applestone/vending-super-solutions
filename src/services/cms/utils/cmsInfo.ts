
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

// Get Contentful configuration from environment variables
export const getContentfulConfig = async () => {
  const config = {
    space_id: import.meta.env.VITE_CONTENTFUL_SPACE_ID || import.meta.env.CONTENTFUL_SPACE_ID,
    environment_id: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
    delivery_token: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
    management_token: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN || import.meta.env.CONTENTFUL_MANAGEMENT_TOKEN,
  };
  
  console.log('[getContentfulConfig] Config retrieved from environment variables:', { 
    hasSpaceId: !!config.space_id,
    hasDeliveryToken: !!config.delivery_token,
    environment: config.environment_id
  });
  
  return config;
};

/**
 * Get information about the current CMS provider
 * @returns Information about the current CMS configuration
 */
export const getCMSInfo = (): CMSInfo => {
  // Check if Contentful environment variables are set
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID || import.meta.env.CONTENTFUL_SPACE_ID;
  const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || import.meta.env.CONTENTFUL_DELIVERY_TOKEN;
  const contentfulConfigured = !!spaceId && !!deliveryToken;
  
  return {
    provider: 'Contentful',
    status: contentfulConfigured ? 'configured' : 'not-configured', 
    isConfigured: contentfulConfigured,
    adminUrl: 'https://app.contentful.com/',
    contentfulConfigured
  };
};
