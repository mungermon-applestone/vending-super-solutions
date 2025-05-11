
/**
 * CMS Migration Status Constants
 * 
 * This file contains constants related to the CMS migration status
 * and configuration for different content types.
 */

// Migration status for each content type
export const CONTENT_TYPE_MIGRATION_STATUS: Record<string, 'completed' | 'in-progress' | 'pending'> = {
  // Completed migrations
  'product': 'completed',
  'businessGoal': 'completed',
  
  // In-progress migrations
  'technology': 'in-progress',
  'machine': 'in-progress',
  'landingPage': 'in-progress',
  'caseStudy': 'in-progress',
  
  // Pending migrations
  'blog': 'pending'
};

// Contentful content type IDs for each entity type
export const CONTENTFUL_CONTENT_TYPE_IDS = {
  PRODUCT: 'product',
  BUSINESS_GOAL: 'businessGoal',
  TECHNOLOGY: 'technology',
  MACHINE: 'machine',
  CASE_STUDY: 'caseStudy',
  LANDING_PAGE: 'landingPage',
  BLOG_POST: 'blogPost'
};

// URL to migration guide documentation
export const MIGRATION_GUIDE_URL = 'https://docs.contentful.com/migration-guides';

// Deprecation message templates
export const DEPRECATION_MESSAGES = {
  ADAPTER_DEPRECATED: (adapterName: string) => 
    `${adapterName} is deprecated and will be removed in a future release.`,
  
  OPERATION_DISABLED: (operation: string, entityType: string) =>
    `${operation} operation on ${entityType} is disabled. Please use Contentful directly.`,
  
  INTERFACE_DEPRECATED: (interfaceName: string) =>
    `${interfaceName} is deprecated and will be removed in future updates.`
};
