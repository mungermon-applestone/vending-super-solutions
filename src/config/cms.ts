// CMS Configuration
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

// Environment variable priority:
// 1. import.meta.env (build-time environment variables)
// 2. window.env (runtime environment variables from env-config.js)
// 3. localStorage (fallback for development only)
function getEnvVariable(key: string): string {
  // Check import.meta.env first (highest priority)
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Then check window.env (second priority)
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  
  // Only check localStorage in development mode (lowest priority and only for development)
  if (typeof window !== 'undefined' && window.localStorage && import.meta.env.DEV) {
    try {
      const storedVars = window.localStorage.getItem(ENV_STORAGE_KEY);
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        
        if (parsedVars[key]) {
          return parsedVars[key];
        }
        
        // Also check key names mapping
        if (parsedVars.keyNames && parsedVars.keyNames[key]) {
          const mappedKey = parsedVars.keyNames[key];
          return parsedVars[mappedKey] || '';
        }
        
        // Finally check for legacy keys without VITE_ prefix
        const legacyKey = key.replace('VITE_', '');
        if (parsedVars[legacyKey]) {
          return parsedVars[legacyKey];
        }
      }
    } catch (e) {
      console.error('[getEnvVariable] Error parsing stored variables:', e);
    }
  }
  
  return '';
}

// Contentful Configuration
export const CONTENTFUL_CONFIG = {
  SPACE_ID: getEnvVariable('VITE_CONTENTFUL_SPACE_ID'),
  DELIVERY_TOKEN: getEnvVariable('VITE_CONTENTFUL_DELIVERY_TOKEN'),
  PREVIEW_TOKEN: getEnvVariable('VITE_CONTENTFUL_PREVIEW_TOKEN'),
  MANAGEMENT_TOKEN: getEnvVariable('VITE_CONTENTFUL_MANAGEMENT_TOKEN'),
  ENVIRONMENT_ID: getEnvVariable('VITE_CONTENTFUL_ENVIRONMENT_ID') || 'master'
};

export const IS_DEVELOPMENT = import.meta.env.DEV || false;

// Helper function to detect preview environments
export function isPreviewEnvironment() {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // List of production domains
  const productionDomains = [
    'applestonesolutions.com',
    'www.applestonesolutions.com',
    'localhost', // Remove this for production
    '127.0.0.1' // Remove this for production
  ];
  
  // Check if current hostname matches a production domain
  for (const domain of productionDomains) {
    if (hostname === domain || hostname.endsWith('.' + domain)) {
      return false; // Not a preview environment
    }
  }
  
  // Otherwise treat as preview if it matches known patterns
  return (
    hostname.includes('preview') || 
    hostname.includes('staging') || 
    hostname.includes('lovable.app') ||
    hostname.includes('vercel.app') ||
    hostname.includes('netlify.app')
  );
}

export function checkContentfulConfig() {
  const { SPACE_ID, DELIVERY_TOKEN } = CONTENTFUL_CONFIG;
  const missingValues = [];
  
  if (!SPACE_ID) missingValues.push('CONTENTFUL_SPACE_ID');
  if (!DELIVERY_TOKEN) missingValues.push('CONTENTFUL_DELIVERY_TOKEN');
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}

// Function to check if Contentful is configured
export function isContentfulConfigured() {
  // Special case for preview environments - always assume configured
  if (isPreviewEnvironment()) {
    return true;
  }
  
  const config = checkContentfulConfig();
  
  // Additional check for placeholder values
  const hasPlaceholders = 
    CONTENTFUL_CONFIG.SPACE_ID?.includes('{{') || 
    CONTENTFUL_CONFIG.DELIVERY_TOKEN?.includes('{{') ||
    CONTENTFUL_CONFIG.ENVIRONMENT_ID?.includes('{{');
  
  if (hasPlaceholders) {
    console.warn('[isContentfulConfigured] Found placeholder values in configuration');
    return false;
  }
  
  return config.isConfigured;
}

// Enhanced logging function for debugging configuration
export function logContentfulConfig() {
  console.log('[cms.ts] Current Contentful configuration:', {
    spaceId: CONTENTFUL_CONFIG.SPACE_ID,
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    deliveryTokenPreview: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? 
      `${CONTENTFUL_CONFIG.DELIVERY_TOKEN.substring(0, 4)}...` : 'not set',
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
    isConfigured: isContentfulConfigured(),
    isPreview: isPreviewEnvironment(),
    windowEnvExists: typeof window !== 'undefined' && !!window.env,
    source: typeof window !== 'undefined' ? window._contentfulInitializedSource : undefined
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
