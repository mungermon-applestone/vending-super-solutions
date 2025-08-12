// CMS Configuration
const ENV_STORAGE_KEY = 'vending-cms-env-variables';

// Environment variable priority:
// 1. import.meta.env (build-time environment variables)
// 2. window.env (runtime environment variables from env-config.js)
// 3. localStorage (fallback for development only)

// Promise to track runtime config loading
let runtimeConfigPromise: Promise<void> | null = null;

// Function to wait for runtime config to be loaded
function waitForRuntimeConfig(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  // If already loaded, return immediately
  if (window._runtimeConfigLoaded) {
    return Promise.resolve();
  }

  // If we already have a promise, return it
  if (runtimeConfigPromise) {
    return runtimeConfigPromise;
  }

  // Create new promise to load runtime config
  runtimeConfigPromise = new Promise((resolve) => {
    // Check if it's already loaded
    if (window._runtimeConfigLoaded) {
      resolve();
      return;
    }

    // Listen for config loaded event
    const handleConfigLoaded = () => {
      window.removeEventListener('runtime-config-loaded', handleConfigLoaded);
      resolve();
    };
    window.addEventListener('runtime-config-loaded', handleConfigLoaded);

    // Also resolve after a timeout to prevent hanging
    setTimeout(() => {
      window.removeEventListener('runtime-config-loaded', handleConfigLoaded);
      resolve();
    }, 5000); // 5 second timeout
  });

  return runtimeConfigPromise;
}

async function getEnvVariable(key: string): Promise<string> {
  console.log(`[getEnvVariable] Looking for ${key}`);
  
  // Wait for runtime config to be loaded
  await waitForRuntimeConfig();
  
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
    
    fetch('/api/runtime-config')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return response.json();
      })
      .then(config => {
        console.log('[cms.ts] Successfully loaded runtime config:', config);
        window._runtimeConfig = config;
        window._runtimeConfigLoaded = true;
        
        // Update the synchronous CONTENTFUL_CONFIG object
        if (config.VITE_CONTENTFUL_SPACE_ID) {
          CONTENTFUL_CONFIG.SPACE_ID = config.VITE_CONTENTFUL_SPACE_ID;
        }
        if (config.VITE_CONTENTFUL_DELIVERY_TOKEN) {
          CONTENTFUL_CONFIG.DELIVERY_TOKEN = config.VITE_CONTENTFUL_DELIVERY_TOKEN;
        }
        if (config.VITE_CONTENTFUL_PREVIEW_TOKEN) {
          CONTENTFUL_CONFIG.PREVIEW_TOKEN = config.VITE_CONTENTFUL_PREVIEW_TOKEN;
        }
        if (config.VITE_CONTENTFUL_MANAGEMENT_TOKEN) {
          CONTENTFUL_CONFIG.MANAGEMENT_TOKEN = config.VITE_CONTENTFUL_MANAGEMENT_TOKEN;
        }
        if (config.VITE_CONTENTFUL_ENVIRONMENT_ID) {
          CONTENTFUL_CONFIG.ENVIRONMENT_ID = config.VITE_CONTENTFUL_ENVIRONMENT_ID;
        }
        
        console.log('[cms.ts] Updated synchronous CONTENTFUL_CONFIG:', {
          hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
          hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
          environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
        });
        
        // Dispatch event to notify waiting promises
        window.dispatchEvent(new CustomEvent('runtime-config-loaded'));
        
        // Force refresh of Contentful if we just loaded new config
        if (typeof window._refreshContentfulAfterConfig === 'function') {
          window._refreshContentfulAfterConfig()
            .catch(err => console.warn('[cms.ts] Error refreshing Contentful after config update:', err));
        }
      })
      .catch(err => {
        console.warn('[cms.ts] Failed to load runtime config:', err);
      });
  } catch (e) {
    console.warn('[cms.ts] Error setting up runtime config loader:', e);
  }
}

// Export the getEnvVariable function for external use
export { getEnvVariable };

// Async function to get Contentful configuration
export async function getContentfulConfig() {
  return {
    SPACE_ID: await getEnvVariable('VITE_CONTENTFUL_SPACE_ID'),
    DELIVERY_TOKEN: await getEnvVariable('VITE_CONTENTFUL_DELIVERY_TOKEN'),
    PREVIEW_TOKEN: await getEnvVariable('VITE_CONTENTFUL_PREVIEW_TOKEN'),
    MANAGEMENT_TOKEN: await getEnvVariable('VITE_CONTENTFUL_MANAGEMENT_TOKEN'),
    ENVIRONMENT_ID: (await getEnvVariable('VITE_CONTENTFUL_ENVIRONMENT_ID')) || 'master'
  };
}

// Sync fallback for legacy code - populate from import.meta.env initially, then update from runtime config
export const CONTENTFUL_CONFIG = {
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
  PREVIEW_TOKEN: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || '',
  MANAGEMENT_TOKEN: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN || '',
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
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
  
  // Otherwise treat as preview if it matches known patterns or default to preview for safety
  return true;
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
  
  // Check runtime config first if available
  if (typeof window !== 'undefined' && window._runtimeConfig) {
    const hasRuntimeConfig = !!(window._runtimeConfig.VITE_CONTENTFUL_SPACE_ID && window._runtimeConfig.VITE_CONTENTFUL_DELIVERY_TOKEN);
    if (hasRuntimeConfig) {
      return true;
    }
  }
  
  // Check window.env as fallback
  if (typeof window !== 'undefined' && window.env) {
    const hasWindowEnv = !!(window.env.VITE_CONTENTFUL_SPACE_ID && window.env.VITE_CONTENTFUL_DELIVERY_TOKEN);
    if (hasWindowEnv) {
      return true;
    }
  }
  
  // Check the synchronous config object
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
  BLOG_PAGE_CONTENT: 'blogPageContent',
  HELP_DESK_ARTICLE: 'helpDeskArticle'
};
