
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
  REMOVED: "Removed - functionality has been removed",
  CONTENTFUL_ONLY: "Contentful only - this feature is only available via Contentful"
};

// Redirect URLs
export const CONTENTFUL_APP_URL = "https://app.contentful.com";
export const CONTENTFUL_DOCS_URL = "https://www.contentful.com/developers/docs/";
export const MIGRATION_GUIDE_URL = "/admin/contentful-migration-guide";

// Deprecation timeframes (in milliseconds)
export const DEPRECATION_TIMES = {
  SHORT: 30 * 24 * 60 * 60 * 1000, // 30 days
  MEDIUM: 60 * 24 * 60 * 60 * 1000, // 60 days
  LONG: 90 * 24 * 60 * 60 * 1000 // 90 days
};

// Content type IDs for migration
export const CONTENT_TYPE_IDS = {
  PRODUCT: "productType",
  TECHNOLOGY: "technology",
  BUSINESS_GOAL: "businessGoal",
  MACHINE: "machine",
  CASE_STUDY: "caseStudy",
  BLOG: "blogPost",
  LANDING_PAGE: "landingPage"
};

// Migration status
export const MIGRATION_STATUS = {
  COMPLETE: "complete",
  IN_PROGRESS: "in-progress",
  PENDING: "pending",
  NOT_STARTED: "not-started"
};

// Content type migration status
export const CONTENT_TYPE_MIGRATION_STATUS = {
  [CONTENT_TYPE_IDS.PRODUCT]: MIGRATION_STATUS.COMPLETE,
  [CONTENT_TYPE_IDS.TECHNOLOGY]: MIGRATION_STATUS.COMPLETE,
  [CONTENT_TYPE_IDS.BUSINESS_GOAL]: MIGRATION_STATUS.IN_PROGRESS,
  [CONTENT_TYPE_IDS.MACHINE]: MIGRATION_STATUS.IN_PROGRESS,
  [CONTENT_TYPE_IDS.CASE_STUDY]: MIGRATION_STATUS.COMPLETE,
  [CONTENT_TYPE_IDS.BLOG]: MIGRATION_STATUS.COMPLETE,
  [CONTENT_TYPE_IDS.LANDING_PAGE]: MIGRATION_STATUS.IN_PROGRESS
};

// Standard messages
export const MESSAGES = {
  ADMIN_INTERFACE_DEPRECATED: "This admin interface is deprecated and will be removed in future updates.",
  USE_CONTENTFUL_INSTEAD: "Please use Contentful directly for content management.",
  READ_ONLY_WARNING: "This interface is now read-only. All content updates must be made in Contentful.",
  ADAPTER_DEPRECATED: "This adapter is deprecated and will be replaced with the Contentful equivalent.",
  MIGRATION_IN_PROGRESS: "Migration to Contentful is in progress. Some features may be unavailable."
};
