
/**
 * Constants for deprecation messages and URLs
 * Centralizing these values ensures consistency across the application
 */

// Base URL for Contentful
export const CONTENTFUL_APP_URL = 'https://app.contentful.com/';

// Standard messages for deprecation notices
export const MESSAGES = {
  USE_CONTENTFUL_INSTEAD: 'Please use Contentful directly for content management.',
  READ_ONLY_WARNING: 'This interface is now read-only. All content updates must be performed in Contentful.',
  MIGRATION_IN_PROGRESS: 'Content migration to Contentful is in progress. Some features may be limited.',
  CONTACT_SUPPORT: 'If you need assistance with Contentful, please contact support.',
  VIEW_MIGRATION_GUIDE: 'See our migration guide for more information.',
};

// Content type mappings between our app and Contentful
export const CONTENT_TYPE_MAPPINGS = {
  'product': 'productType',
  'technology': 'technology',
  'businessGoal': 'businessGoal',
  'machine': 'machine',
  'caseStudy': 'caseStudy',
  'blog': 'blogPost',
  'landingPage': 'landingPage',
  'faq': 'faqItem',
  'contact': 'contactInformation'
};

// Deprecation phases
export const DEPRECATION_PHASES = {
  NOTICE: 'notice',      // Just notify users
  READ_ONLY: 'readOnly', // Interface is read-only
  REDIRECT: 'redirect',  // Redirect to Contentful
  REMOVED: 'removed'     // Functionality is completely removed
};
