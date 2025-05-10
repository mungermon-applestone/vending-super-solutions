
/**
 * CMS Configuration
 */

import {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID,
  CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_PREVIEW_TOKEN,
  USE_CONTENTFUL_PREVIEW,
  isContentfulConfigured
} from './contentful';

/**
 * Current selected CMS provider
 */
export type CMSProvider = 'contentful';

export const CMS_PROVIDER: CMSProvider = 'contentful';

/**
 * Contentful configuration object
 */
export const CONTENTFUL_CONFIG = {
  SPACE_ID: CONTENTFUL_SPACE_ID,
  ENVIRONMENT_ID: CONTENTFUL_ENVIRONMENT_ID,
  DELIVERY_TOKEN: CONTENTFUL_ACCESS_TOKEN,
  PREVIEW_TOKEN: CONTENTFUL_PREVIEW_TOKEN
};

/**
 * Re-export isContentfulConfigured so it can be imported from '@/config/cms'
 */
export { isContentfulConfigured };

/**
 * Log Contentful configuration for debugging (redacts sensitive information)
 */
export function logContentfulConfig(): void {
  console.log('[CMS Config] Configuration:', {
    provider: CMS_PROVIDER,
    spaceId: CONTENTFUL_SPACE_ID,
    environmentId: CONTENTFUL_ENVIRONMENT_ID || 'master',
    hasDeliveryToken: !!CONTENTFUL_ACCESS_TOKEN,
    hasPreviewToken: !!CONTENTFUL_PREVIEW_TOKEN,
    previewMode: USE_CONTENTFUL_PREVIEW
  });
}

/**
 * Check if the current environment is a preview environment
 * @returns Boolean indicating if this is a preview environment
 */
export function isPreviewEnvironment(): boolean {
  return !!import.meta.env.VITE_CONTENTFUL_PREVIEW === true || 
    import.meta.env.VITE_CONTENTFUL_PREVIEW === 'true';
}

/**
 * Check if the site is running in development mode
 * @returns Boolean indicating if the site is running in development mode
 */
export function isDevelopmentMode(): boolean {
  return import.meta.env.DEV === true;
}

/**
 * Get CMS provider name for display
 * @returns Human readable CMS provider name
 */
export function getCMSProviderName(): string {
  return 'Contentful';
}

/**
 * Content model constants for use with Contentful
 */
export const CMS_MODELS = {
  BLOG_POST: 'blogPost',
  BLOG_CATEGORY: 'blogCategory',
  MACHINE: 'machine',
  PRODUCT: 'product',
  BUSINESS_GOAL: 'businessGoal',
  TECHNOLOGY: 'technology',
  LANDING_PAGE: 'landingPage',
  CASE_STUDY: 'caseStudy',
  HERO_CONTENT: 'heroContent'
};
