// CMS Configuration

// Storage key for environment variables
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

// Helper to get environment variables from different sources
function getEnvVariable(key: string): string {
  // First check localStorage using env storage key
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storedVars = window.localStorage.getItem(ENV_STORAGE_KEY);
      if (storedVars) {
        const parsedVars = JSON.parse(storedVars);
        
        // First check if the exact key exists
        if (parsedVars[key]) {
          return parsedVars[key];
        }
        
        // Check if the key exists in keyNames mapping
        if (parsedVars.keyNames) {
          const mappedValue = parsedVars[parsedVars.keyNames[key]] || '';
          if (mappedValue) return mappedValue;
        }
      }
    } catch (e) {
      console.error('Error parsing environment variables from localStorage:', e);
    }
  }
  
  // Then check window.env
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  
  // Finally check import.meta.env
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  console.warn(`Environment variable ${key} not found in any source`);
  return '';
}

// Initialize window.env from localStorage if needed
function initializeWindowEnv() {
  if (typeof window === 'undefined') return;
  
  try {
    const storedVars = window.localStorage.getItem(ENV_STORAGE_KEY);
    if (storedVars) {
      const parsedVars = JSON.parse(storedVars);
      if (!window.env) {
        window.env = {};
      }
      
      // Map stored values to window.env
      if (parsedVars.keyNames) {
        const keyMappings = parsedVars.keyNames;
        Object.entries(keyMappings).forEach(([key, value]) => {
          if (typeof value === 'string' && parsedVars[key]) {
            window.env[value] = parsedVars[key];
          }
        });
      }
      
      // Also set direct values for compatibility
      window.env.spaceId = parsedVars.spaceId;
      window.env.deliveryToken = parsedVars.deliveryToken;
      window.env.environmentId = parsedVars.environmentId;
    }
  } catch (e) {
    console.error('Error initializing window.env:', e);
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
    localStorageVarsExist: typeof window !== 'undefined' && !!window.localStorage.getItem('vending-cms-env-variables'),
  });
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}

// Add the isContentfulConfigured function that was missing
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
