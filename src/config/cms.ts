
/**
 * CMS configuration and utility functions
 */

/**
 * Contentful model names
 */
export const CMS_MODELS = {
  BLOG_POST: 'blogPost',
  BUSINESS_GOAL: 'businessGoal',
  CASE_STUDY: 'caseStudy',
  LANDING_PAGE: 'landingPage',
  MACHINE: 'machine',
  PRODUCT_TYPE: 'productType',
  TECHNOLOGY: 'technology',
  TESTIMONIAL: 'testimonial'
};

/**
 * Contentful configuration
 */
export const CONTENTFUL_CONFIG = {
  // Use env variables with runtime config fallbacks
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 
           (typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_SPACE_ID) || 
           '',
  
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || 
                 (typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_DELIVERY_TOKEN) || 
                 '',
  
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 
                 (typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_ENVIRONMENT_ID) || 
                 'master'
};

/**
 * Whether Contentful is configured with environment variables
 */
export function isContentfulConfigured(): boolean {
  return Boolean(
    CONTENTFUL_CONFIG.SPACE_ID && 
    CONTENTFUL_CONFIG.DELIVERY_TOKEN
  );
}

/**
 * Whether Contentful Management API is configured
 */
export function isContentfulManagementConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN);
}

/**
 * Get the Contentful Space ID
 */
export function getContentfulSpaceId(): string {
  return CONTENTFUL_CONFIG.SPACE_ID;
}

/**
 * Get the Contentful Environment ID
 */
export function getContentfulEnvironmentId(): string {
  return CONTENTFUL_CONFIG.ENVIRONMENT_ID;
}

/**
 * Log the current Contentful configuration (redacting tokens)
 */
export function logContentfulConfig(): void {
  console.log('[CMS] Current Contentful configuration:', {
    SPACE_ID: CONTENTFUL_CONFIG.SPACE_ID || 'Not set',
    ENVIRONMENT_ID: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'Not set',
    DELIVERY_TOKEN: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? '[REDACTED]' : 'Not set',
    isConfigured: isContentfulConfigured(),
    browserEnv: typeof window !== 'undefined' && window.env ? 'Available' : 'Not available'
  });
}

/**
 * Development mode flag
 */
export const IS_DEVELOPMENT = import.meta.env.DEV || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');
