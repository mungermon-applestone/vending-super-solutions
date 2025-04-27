
// CMS Configuration

// Contentful Configuration
export const CONTENTFUL_CONFIG = {
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || import.meta.env.CONTENTFUL_SPACE_ID,
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  PREVIEW_TOKEN: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || import.meta.env.CONTENTFUL_PREVIEW_TOKEN,
  MANAGEMENT_TOKEN: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN || import.meta.env.CONTENTFUL_MANAGEMENT_TOKEN,
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
};

export const IS_DEVELOPMENT = import.meta.env.DEV || false;

export function checkContentfulConfig() {
  const { SPACE_ID, DELIVERY_TOKEN, ENVIRONMENT_ID } = CONTENTFUL_CONFIG;
  const missingValues = [];
  
  if (!SPACE_ID) missingValues.push('CONTENTFUL_SPACE_ID');
  if (!DELIVERY_TOKEN) missingValues.push('CONTENTFUL_DELIVERY_TOKEN');
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}
