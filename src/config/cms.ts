
// CMS Configuration

// Helper to get environment variables from different sources
function getEnvVariable(key: string): string {
  // Check window.env first (set by our environment variable manager)
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  
  // Then check import.meta.env
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  return '';
}

// Contentful Configuration
export const CONTENTFUL_CONFIG = {
  // Space ID can come from environment variable or use the hardcoded fallback
  SPACE_ID: getEnvVariable('VITE_CONTENTFUL_SPACE_ID') || 'al01e4yh2wq4',
  // Delivery token can come from different environment variable formats
  DELIVERY_TOKEN: getEnvVariable('VITE_CONTENTFUL_DELIVERY_TOKEN') || 
                  getEnvVariable('CONTENTFUL_DELIVERY_TOKEN') || 
                  '',
  PREVIEW_TOKEN: getEnvVariable('VITE_CONTENTFUL_PREVIEW_TOKEN') || 
                getEnvVariable('CONTENTFUL_PREVIEW_TOKEN') || 
                '',
  MANAGEMENT_TOKEN: getEnvVariable('VITE_CONTENTFUL_MANAGEMENT_TOKEN') || 
                    getEnvVariable('CONTENTFUL_MANAGEMENT_TOKEN') || 
                    '',
  ENVIRONMENT_ID: getEnvVariable('VITE_CONTENTFUL_ENVIRONMENT_ID') || 'master',
};

export const IS_DEVELOPMENT = import.meta.env.DEV || false;

export function checkContentfulConfig() {
  const { SPACE_ID, DELIVERY_TOKEN, ENVIRONMENT_ID } = CONTENTFUL_CONFIG;
  const missingValues = [];
  
  if (!SPACE_ID) missingValues.push('CONTENTFUL_SPACE_ID');
  if (!DELIVERY_TOKEN) missingValues.push('CONTENTFUL_DELIVERY_TOKEN');
  
  // Log the current configuration for debugging
  console.log('[checkContentfulConfig] Current config:', {
    hasSpaceId: !!SPACE_ID,
    spaceIdValue: SPACE_ID,
    hasDeliveryToken: !!DELIVERY_TOKEN,
    // Show first few characters of token for debugging, but not the full token
    deliveryTokenPreview: DELIVERY_TOKEN ? `${DELIVERY_TOKEN.substring(0, 4)}...` : 'not set',
    environmentId: ENVIRONMENT_ID,
    windowEnvExists: typeof window !== 'undefined' && !!window.env,
  });
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}

// Add the isContentfulConfigured function that was missing
export function isContentfulConfigured() {
  return checkContentfulConfig().isConfigured;
}

// Enhanced logging function for debugging configuration
export function logContentfulConfig() {
  const config = checkContentfulConfig();
  console.log('[cms.ts] Current Contentful configuration:', {
    hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
    spaceId: CONTENTFUL_CONFIG.SPACE_ID,
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    deliveryTokenPreview: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? `${CONTENTFUL_CONFIG.DELIVERY_TOKEN.substring(0, 4)}...` : 'not set',
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
    isConfigured: config.isConfigured,
    missingValues: config.missingValues,
    windowEnv: typeof window !== 'undefined' ? window.env : undefined
  });
}

// Define CMS models constants for blog-related functionality
export const CMS_MODELS = {
  BLOG_POST: 'blogPost',
  BLOG_CATEGORY: 'blogCategory',
  BLOG_TAG: 'blogTag',
  BLOG_AUTHOR: 'blogAuthor',
  BLOG_PAGE_CONTENT: 'blogPageContent'
};
