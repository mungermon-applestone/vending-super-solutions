
/**
 * Content model identifiers in Contentful
 */
export const CMS_MODELS = {
  PRODUCT_TYPE: 'productType',
  BUSINESS_GOAL: 'businessGoal',
  MACHINE: 'machine',
  TECHNOLOGY: 'technology',
  TESTIMONIAL: 'testimonial',
  BLOG_POST: 'blogPost',
  CASE_STUDY: 'caseStudy',
  LANDING_PAGE: 'landingPage'
};

/**
 * Configuration for content migration
 */
export const CONTENT_MIGRATION_CONFIG = {
  BATCH_SIZE: 50,
  AUTO_PUBLISH: true,
};

/**
 * Common validation patterns
 */
export const VALIDATION_PATTERNS = {
  SLUG: {
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    flags: 'i',
    message: 'Slug must contain only letters, numbers, and hyphens'
  }
};

/**
 * Default environment
 */
export const DEFAULT_ENVIRONMENT = 'master';

/**
 * Contentful configuration
 */
export const CONTENTFUL_CONFIG = {
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || '',
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
  PREVIEW_TOKEN: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || '',
  MANAGEMENT_TOKEN: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN || '',
};

/**
 * Check if Contentful is configured with valid credentials
 */
export function isContentfulConfigured(): boolean {
  return (
    !!CONTENTFUL_CONFIG.SPACE_ID &&
    CONTENTFUL_CONFIG.SPACE_ID.trim() !== '' &&
    !!CONTENTFUL_CONFIG.DELIVERY_TOKEN &&
    CONTENTFUL_CONFIG.DELIVERY_TOKEN.trim() !== ''
  );
}

/**
 * Check if using a preview/development environment for Contentful
 */
export function isPreviewEnvironment(): boolean {
  return (
    CONTENTFUL_CONFIG.ENVIRONMENT_ID !== 'master' ||
    import.meta.env.DEV ||
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
  );
}

/**
 * Log Contentful configuration for debugging
 */
export function logContentfulConfig(): void {
  console.log('Contentful Configuration:', {
    spaceId: CONTENTFUL_CONFIG.SPACE_ID ? `${CONTENTFUL_CONFIG.SPACE_ID.substring(0, 4)}...` : 'Not set',
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID,
    isPreview: isPreviewEnvironment(),
  });
}

/**
 * Get Contentful edit URL
 * @param contentType Content type ID
 * @param entryId Optional entry ID
 */
export function getContentfulEditUrl(contentType: string, entryId?: string): string {
  const baseUrl = 'https://app.contentful.com';
  const spaceId = CONTENTFUL_CONFIG.SPACE_ID;
  const environment = CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master';
  
  if (!entryId) {
    // Link to content type
    return `${baseUrl}/spaces/${spaceId}/environments/${environment}/entries?contentTypeId=${contentType}`;
  }
  
  // Link to specific entry
  return `${baseUrl}/spaces/${spaceId}/environments/${environment}/entries/${entryId}`;
}

