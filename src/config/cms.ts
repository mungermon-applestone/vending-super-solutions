// CMS Configuration

// Contentful Configuration
export const CONTENTFUL_CONFIG = {
  // Use correct Space ID from the content model
  SPACE_ID: 'al01e4yh2wq4',
  // Update delivery token for the correct space
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  PREVIEW_TOKEN: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN || import.meta.env.CONTENTFUL_PREVIEW_TOKEN,
  MANAGEMENT_TOKEN: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN || import.meta.env.CONTENTFUL_MANAGEMENT_TOKEN,
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master',
};

export const IS_DEVELOPMENT = import.meta.env.DEV || false;

export function checkContentfulConfig() {
  const { SPACE_ID, DELIVERY_TOKEN, ENVIRONMENT_ID } = CONTENTFUL_CONFIG;
  const missingValues = [];
  
  if (!SPACE_ID) missingValues.push('CONTENTFUL_SPACE_ID');
  if (!DELIVERY_TOKEN) missingValues.push('CONTENTFUL_DELIVERY_TOKEN');
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}

// Add the isContentfulConfigured function that was missing
export function isContentfulConfigured() {
  return checkContentfulConfig().isConfigured;
}

// Add logging function for debugging configuration
export function logContentfulConfig() {
  console.log('[cms.ts] Current Contentful configuration:', {
    hasSpaceId: !!CONTENTFUL_CONFIG.SPACE_ID,
    spaceId: CONTENTFUL_CONFIG.SPACE_ID,
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
  });
}

// Define CMS models constants for blog-related functionality
export const CMS_MODELS = {
  BLOG_POST: 'blogPost',
  BLOG_CATEGORY: 'blogCategory',
  BLOG_TAG: 'blogTag',
  BLOG_AUTHOR: 'blogAuthor',
  BLOG_PAGE_CONTENT: 'blogPageContent'
};
