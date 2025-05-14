
// Define the window interface to include __RUNTIME_CONFIG__
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Record<string, string>;
    _contentfulInitialized?: boolean;
    _contentfulInitializedSource?: string;
  }
}

// Get runtime environment configuration from public/api/runtime-config when available
const getRuntimeConfig = () => {
  try {
    // Try to load from runtime-config if available
    if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
      return window.__RUNTIME_CONFIG__ || {};
    }
  } catch (e) {
    console.warn('[cms] Runtime config not available:', e);
  }
  return {};
};

// Get environment variables with fallbacks
// Priority: runtime config > process.env > hardcoded defaults
const getEnvVar = (name: string, defaultValue: string = ''): string => {
  const runtimeConfig = getRuntimeConfig();
  return runtimeConfig[name] || (import.meta.env && import.meta.env[name]) || process.env[name] || defaultValue;
};

// Contentful configuration
export const CONTENTFUL_CONFIG = {
  SPACE_ID: getEnvVar('VITE_CONTENTFUL_SPACE_ID', 'al01e4yh2wq4'), 
  DELIVERY_TOKEN: getEnvVar('VITE_CONTENTFUL_DELIVERY_TOKEN', 'fxpQth03vfdKzI4VNT_fYg8cD5BwoTiGaa6INIyYync'),
  ENVIRONMENT_ID: getEnvVar('VITE_CONTENTFUL_ENVIRONMENT_ID', 'master'),
  PREVIEW_TOKEN: getEnvVar('VITE_CONTENTFUL_PREVIEW_TOKEN', ''),
};

// Content model identifiers
export const CMS_MODELS = {
  PRODUCT_TYPE: 'productType',
  BUSINESS_GOAL: 'businessGoal',
  MACHINE: 'machine',
  FEATURE: 'feature',
  BLOG_POST: 'blogPost',
  TECHNOLOGY: 'technology',
  HOME_PAGE_CONTENT: 'homePageContent',
  HERO: 'hero',
};

// Check if Contentful is properly configured
export function isContentfulConfigured(): boolean {
  const hasConfig = !!(CONTENTFUL_CONFIG.SPACE_ID && CONTENTFUL_CONFIG.DELIVERY_TOKEN);
  console.log('[CMS Config] Contentful configuration status:', hasConfig ? 'Valid' : 'Invalid');
  return hasConfig;
}

// Check if we're running in development mode
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || import.meta.env?.DEV === true;

// Check if we're in a preview environment
export function isPreviewEnvironment(): boolean {
  const isPreview = import.meta.env?.VITE_CONTENTFUL_PREVIEW === 'true' || 
                   process.env.CONTENTFUL_PREVIEW === 'true' ||
                   !!CONTENTFUL_CONFIG.PREVIEW_TOKEN;
  return isPreview;
}

// Log Contentful configuration for debugging
export function logContentfulConfig(): void {
  console.log('[CMS Config] Current Contentful configuration:', {
    spaceId: CONTENTFUL_CONFIG.SPACE_ID ? `${CONTENTFUL_CONFIG.SPACE_ID.substring(0, 4)}...` : 'undefined',
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
    isConfigured: isContentfulConfigured(),
    isPreview: isPreviewEnvironment()
  });
}
