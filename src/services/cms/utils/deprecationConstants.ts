
/**
 * Deprecation Constants
 * 
 * Centralized constants for deprecation messages, feature names, and recommendations.
 * This helps maintain consistency throughout the application.
 */

// Standard recommendations
export const CONTENTFUL_RECOMMENDATION = "Use Contentful directly for content management";
export const API_RECOMMENDATION = "Use the Contentful API client directly";

// Feature statuses
export const FEATURE_STATUS = {
  DEPRECATED: "Deprecated - will be removed in future updates",
  READ_ONLY: "Read-only mode - use Contentful for content management",
  REMOVED: "Removed - functionality has been removed"
};

// Migration status constants
export const MIGRATION_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  PENDING: 'pending',
  NOT_STARTED: 'not-started'
};

// Migration status for each content type
export const CONTENT_TYPE_MIGRATION_STATUS = {
  'product': MIGRATION_STATUS.COMPLETED,
  'businessGoal': MIGRATION_STATUS.COMPLETED,
  'technology': MIGRATION_STATUS.IN_PROGRESS,
  'machine': MIGRATION_STATUS.IN_PROGRESS,
  'landingPage': MIGRATION_STATUS.IN_PROGRESS,
  'caseStudy': MIGRATION_STATUS.IN_PROGRESS,
  'blog': MIGRATION_STATUS.PENDING
};

// Content type IDs for migration
export const CONTENT_TYPE_IDS = {
  PRODUCT: "productType",
  TECHNOLOGY: "technology",
  BUSINESS_GOAL: "businessGoal",
  MACHINE: "machine",
  CASE_STUDY: "caseStudy",
  BLOG_POST: "blogPost",
  LANDING_PAGE: "landingPage"
};

// Redirect URLs
export const CONTENTFUL_APP_URL = "https://app.contentful.com";
export const CONTENTFUL_DOCS_URL = "https://www.contentful.com/developers/docs/";

// Deprecation timeframes (in milliseconds)
export const DEPRECATION_TIMES = {
  SHORT: 30 * 24 * 60 * 60 * 1000, // 30 days
  MEDIUM: 60 * 24 * 60 * 60 * 1000, // 60 days
  LONG: 90 * 24 * 60 * 60 * 1000 // 90 days
};

// Standard messages
export const MESSAGES = {
  ADMIN_INTERFACE_DEPRECATED: "This admin interface is deprecated and will be removed in future updates.",
  USE_CONTENTFUL_INSTEAD: "Please use Contentful directly for content management.",
  READ_ONLY_WARNING: "This interface is now read-only. All content updates must be made in Contentful.",
  ADAPTER_DEPRECATED: "This adapter is deprecated and will be replaced with the Contentful equivalent.",
  MIGRATION_IN_PROGRESS: "Migration to Contentful is in progress. Some features may be unavailable."
};
