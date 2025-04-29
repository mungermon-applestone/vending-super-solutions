// CMS Configuration
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

// Environment variable priority:
// 1. import.meta.env (build-time environment variables)
// 2. window.env (runtime environment variables from env-config.js)
// 3. localStorage (fallback for development only)
function getEnvVariable(key: string): string {
  console.log(`[getEnvVariable] Looking for ${key}`);
  
  // Check import.meta.env first (highest priority)
  if (import.meta.env && import.meta.env[key]) {
    console.log(`[getEnvVariable] Found value in import.meta.env for ${key}`);
    return import.meta.env[key];
  }
  
  // Then check window.env (second priority)
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    console.log(`[getEnvVariable] Found value in window.env for ${key}`);
    return window.env[key];
  }
  
  // Detect if we're in a preview environment
  const isPreviewEnv = typeof window !== 'undefined' && 
    (window.location.hostname.includes('preview') || 
     window.location.hostname.includes('lovable.app') ||
     window.location.hostname.includes('vercel.app') ||
     window.location.hostname.includes('netlify.app'));
  
  // In preview environments, we already tried window.env, so log a warning
  if (isPreviewEnv) {
    console.warn(`[getEnvVariable] No value for ${key} in preview environment. Please configure environment variables.`);
  }
  
  // Finally check localStorage (lowest priority, development only)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedVars = window.localStorage.getItem(ENV_STORAGE_KEY);
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        
        // First check direct key mapping
        if (parsedVars[key]) {
          console.log(`[getEnvVariable] Found direct value for ${key} in localStorage`);
          return parsedVars[key];
        }
        
        // Then check key names mapping
        if (parsedVars.keyNames && parsedVars.keyNames[key]) {
          const mappedValue = parsedVars[parsedVars.keyNames[key]] || '';
          if (mappedValue) {
            console.log(`[getEnvVariable] Found mapped value for ${key} in localStorage`);
            return mappedValue;
          }
        }
        
        // Finally check for legacy keys without VITE_ prefix
        const legacyKey = key.replace('VITE_', '');
        if (parsedVars[legacyKey]) {
          console.log(`[getEnvVariable] Found legacy value for ${key} in localStorage`);
          return parsedVars[legacyKey];
        }
      }
    } catch (e) {
      console.error('[getEnvVariable] Error parsing stored variables:', e);
    }
  }
  
  console.warn(`[getEnvVariable] No value found for ${key} in any source`);
  return '';
}

// Initialize window.env from localStorage
function initializeWindowEnv() {
  console.log('[initializeWindowEnv] Starting initialization');
  
  if (typeof window === 'undefined') {
    console.log('[initializeWindowEnv] Window not available, skipping');
    return;
  }
  
  try {
    const storedVars = window.localStorage.getItem(ENV_STORAGE_KEY);
    if (storedVars) {
      const parsedVars = JSON.parse(storedVars);
      if (!window.env) {
        window.env = {};
      }
      
      // Set values with VITE_ prefix
      window.env.VITE_CONTENTFUL_SPACE_ID = parsedVars.spaceId;
      window.env.VITE_CONTENTFUL_DELIVERY_TOKEN = parsedVars.deliveryToken;
      window.env.VITE_CONTENTFUL_ENVIRONMENT_ID = parsedVars.environmentId || 'master';
      
      // Also set legacy values for compatibility
      window.env.spaceId = parsedVars.spaceId;
      window.env.deliveryToken = parsedVars.deliveryToken;
      window.env.environmentId = parsedVars.environmentId || 'master';
      
      console.log('[initializeWindowEnv] Window.env initialized:', {
        hasSpaceId: !!window.env.VITE_CONTENTFUL_SPACE_ID,
        hasDeliveryToken: !!window.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
        hasEnvironmentId: !!window.env.VITE_CONTENTFUL_ENVIRONMENT_ID
      });
    } else {
      console.warn('[initializeWindowEnv] No stored variables found');
    }
  } catch (e) {
    console.error('[initializeWindowEnv] Error initializing window.env:', e);
  }
}

// Initialize window.env on load
initializeWindowEnv();

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
  
  // Log the current configuration for debugging
  console.log('[checkContentfulConfig] Current config:', {
    hasSpaceId: !!SPACE_ID,
    spaceIdValue: SPACE_ID,
    hasDeliveryToken: !!DELIVERY_TOKEN,
    // Show first few characters of token for debugging, but not the full token
    deliveryTokenPreview: DELIVERY_TOKEN ? `${DELIVERY_TOKEN.substring(0, 4)}...` : 'not set',
    environmentId: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
    isPreview: isPreviewEnvironment(),
    windowEnvExists: typeof window !== 'undefined' && !!window.env,
    localStorageVarsExist: typeof window !== 'undefined' && !!window.localStorage.getItem('vending-cms-env-variables'),
  });
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}

// Add the isContentfulConfigured function
export function isContentfulConfigured() {
  const config = checkContentfulConfig();
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
    storedVarsExist: typeof window !== 'undefined' && 
      !!window.localStorage.getItem(ENV_STORAGE_KEY)
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
