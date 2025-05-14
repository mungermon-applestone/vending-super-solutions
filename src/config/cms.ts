
/**
 * Content Management System configuration
 */

// Contentful configuration
export const CONTENTFUL_CONFIG = {
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
};

// Contentful model IDs
export const CMS_MODELS = {
  // Core content types
  MACHINE: 'machine',
  PRODUCT_TYPE: 'productType',
  BUSINESS_GOAL: 'businessGoal',
  TECHNOLOGY: 'technology',
  TESTIMONIAL: 'testimonial',
  CASE_STUDY: 'caseStudy',
  LANDING_PAGE: 'landingPage',
  BLOG_POST: 'blogPost',
  
  // Supporting content types
  FEATURE: 'feature',
  TECH_SECTION: 'technologySection',
  TECH_FEATURE: 'technologyFeature'
};

/**
 * Check if Contentful is configured
 */
export function isContentfulConfigured(): boolean {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
  const deliveryToken = import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '';
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || '';
  
  return Boolean(spaceId && deliveryToken && environmentId);
}

/**
 * Check if we're in a preview environment
 */
export function isPreviewEnvironment(): boolean {
  return (
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('preview') || 
    window.location.hostname.includes('staging') ||
    window.location.search.includes('preview=true')
  );
}

/**
 * Log Contentful configuration for debugging
 */
export function logContentfulConfig(): void {
  console.log('[CMS Config] Current Contentful configuration:', {
    spaceId: CONTENTFUL_CONFIG.SPACE_ID,
    hasToken: Boolean(CONTENTFUL_CONFIG.DELIVERY_TOKEN),
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
    isConfigured: isContentfulConfigured()
  });
}
