
// CMS Configuration
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

// Environment variable priority:
// 1. import.meta.env (build-time environment variables)
// 2. window.env (runtime environment variables from env-config.js)
// 3. localStorage (fallback for development only)
function getEnvVariable(key: string): string {
  console.log(`[getEnvVariable] Looking for ${key}`);
  
  // First check for runtime environment variables from window.env
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    console.log(`[getEnvVariable] Found ${key} in window.env`);
    return window.env[key];
  }
  
  // Then check import.meta.env
  if (import.meta.env && import.meta.env[key]) {
    console.log(`[getEnvVariable] Found ${key} in import.meta.env`);
    return import.meta.env[key];
  }
  
  // Check for publicly available runtime config
  if (typeof window !== 'undefined') {
    try {
      if (window._runtimeConfig && window._runtimeConfig[key]) {
        console.log(`[getEnvVariable] Found ${key} in window._runtimeConfig`);
        return window._runtimeConfig[key];
      }
    } catch (e) {
      console.warn('[getEnvVariable] Error accessing runtime config:', e);
    }
  }
  
  // Finally check localStorage in development mode
  if (typeof window !== 'undefined' && window.localStorage && import.meta.env.DEV) {
    try {
      const storedVars = window.localStorage.getItem(ENV_STORAGE_KEY);
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        
        // Check direct key match
        if (parsedVars[key]) {
          console.log(`[getEnvVariable] Found ${key} in localStorage`);
          return parsedVars[key];
        }
        
        // Check key names mapping
        if (parsedVars.keyNames && parsedVars.keyNames[key]) {
          const mappedKey = parsedVars.keyNames[key];
          if (parsedVars[mappedKey]) {
            console.log(`[getEnvVariable] Found ${key} via mapping in localStorage`);
            return parsedVars[mappedKey];
          }
        }
        
        // Check for legacy keys without VITE_ prefix
        const legacyKey = key.replace('VITE_', '');
        if (parsedVars[legacyKey]) {
          console.log(`[getEnvVariable] Found ${key} via legacy key in localStorage`);
          return parsedVars[legacyKey];
        }
      }
    } catch (e) {
      console.error('[getEnvVariable] Error parsing stored variables:', e);
    }
  }
  
  console.log(`[getEnvVariable] Could not find ${key} in any source`);
  return '';
}

// Try to load runtime config from /api/runtime-config on component mount
if (typeof window !== 'undefined' && !window._runtimeConfigLoaded) {
  try {
    console.log('[cms.ts] Attempting to load runtime config from /api/runtime-config');
    window._runtimeConfigLoaded = true;
    
    fetch('/api/runtime-config')
      .then(response => response.json())
      .then(config => {
        console.log('[cms.ts] Successfully loaded runtime config:', config);
        window._runtimeConfig = config;
        
        // Force refresh of Contentful if we just loaded new config
        if (typeof window._refreshContentfulAfterConfig === 'function') {
          window._refreshContentfulAfterConfig();
        }
      })
      .catch(err => {
        console.warn('[cms.ts] Failed to load runtime config:', err);
      });
  } catch (e) {
    console.warn('[cms.ts] Error setting up runtime config loader:', e);
  }
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
    'www.applestonesolutions.com'
    // removed localhost and 127.0.0.1 from production domains
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
    hostname.includes('netlify.app') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
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
