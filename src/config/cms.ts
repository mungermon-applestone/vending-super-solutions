
/**
 * Configuration for content management system
 */

// Get Contentful env variables from window.ENV_CONFIG
function getContentfulConfig() {
  // Check if we're in a browser environment and ENV_CONFIG exists
  if (typeof window !== 'undefined' && window.ENV_CONFIG) {
    return {
      SPACE_ID: window.ENV_CONFIG.VITE_CONTENTFUL_SPACE_ID || '',
      DELIVERY_TOKEN: window.ENV_CONFIG.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
      ENVIRONMENT_ID: window.ENV_CONFIG.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
    };
  }
  
  // Fallback to import.meta.env for Vite environments
  return {
    SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
    DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
    ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
  };
}

// Export Contentful config
export const CONTENTFUL_CONFIG = getContentfulConfig();

// Helper to check if Contentful is configured
export const isContentfulConfigured = () => {
  return !!(CONTENTFUL_CONFIG.SPACE_ID && CONTENTFUL_CONFIG.DELIVERY_TOKEN);
};

// Check if current environment is a preview environment
export const isPreviewEnvironment = () => {
  // Check if we're in a Lovable preview environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname.includes('preview') || 
           hostname.includes('staging') || 
           hostname.includes('dev.lovable.app') ||
           hostname.includes('id-preview');
  }
  return false;
};

// Flag for development environment
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Log Contentful configuration
export const logContentfulConfig = () => {
  console.log('[Config] Contentful configuration status:', {
    isConfigured: isContentfulConfigured(),
    spaceId: CONTENTFUL_CONFIG.SPACE_ID ? 'Set' : 'Not set',
    deliveryToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? 'Set' : 'Not set',
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
    isPreviewEnvironment: isPreviewEnvironment()
  });
  return {
    isConfigured: isContentfulConfigured(),
    spaceId: CONTENTFUL_CONFIG.SPACE_ID ? 'Set' : 'Not set',
    deliveryToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? 'Set' : 'Not set',
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master',
    isPreviewEnvironment: isPreviewEnvironment()
  };
};

// Content model definitions for use in hooks and components
export const CMS_MODELS = {
  BUSINESS_GOAL: 'businessGoal',
  MACHINE: 'machine',
  TECHNOLOGY: 'technology',
  PRODUCT: 'product',
  PRODUCT_TYPE: 'productType',
  HERO: 'heroSection',
  BLOG_POST: 'blogPost',
  BLOG_CATEGORY: 'blogCategory',
  CUSTOMER_TESTIMONIAL: 'customerTestimonial'
};

// Log Contentful configuration status
console.log('[Config] Contentful configuration status:', {
  isConfigured: isContentfulConfigured(),
  spaceId: CONTENTFUL_CONFIG.SPACE_ID ? 'Set' : 'Not set',
  deliveryToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? 'Set' : 'Not set',
  environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
});

// Add global type declaration for ENV_CONFIG
declare global {
  interface Window {
    ENV_CONFIG?: {
      VITE_CONTENTFUL_SPACE_ID?: string;
      VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
      VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
      [key: string]: string | undefined;
    };
    _contentfulInitialized?: boolean | string;
    _contentfulInitializedSource?: string;
    _refreshContentfulAfterConfig?: () => Promise<void>;
    env?: {
      VITE_CONTENTFUL_SPACE_ID?: string;
      VITE_CONTENTFUL_DELIVERY_TOKEN?: string;
      VITE_CONTENTFUL_ENVIRONMENT_ID?: string;
      spaceId?: string;
      deliveryToken?: string;
      environmentId?: string;
      [key: string]: string | undefined;
    };
  }
}
