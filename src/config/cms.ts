
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
