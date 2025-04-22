
/**
 * Basic CMS information utility
 * This simplified version replaces the previous Supabase-based implementation
 */

interface CMSInfo {
  provider: string;
  status: 'configured' | 'partial' | 'not-configured';
  isConfigured: boolean;
  apiUrl?: string;
  apiKeyConfigured: boolean;
  adminUrl?: string;
}

export const getCMSInfo = (): CMSInfo => {
  return {
    provider: 'Contentful',
    status: 'configured',
    isConfigured: true,
    apiKeyConfigured: true,
    adminUrl: 'https://app.contentful.com'
  };
};
