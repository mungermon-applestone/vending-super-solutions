import { STRAPI_API_URL, STRAPI_API_KEY, STRAPI_ENDPOINTS } from './strapiCms';

/**
 * CMS Configuration
 * 
 * This file contains configuration settings for connecting to your CMS.
 * Update these values when integrating with your actual CMS provider.
 */

// Contentful configuration from environment variables
export const CONTENTFUL_CONFIG = {
  // Use public environment variable for Space ID (can be client-side)
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'your_space_id_here',
  
  // Use non-VITE prefix for sensitive tokens to keep them private
  DELIVERY_TOKEN: import.meta.env.CONTENTFUL_DELIVERY_TOKEN || '',
  
  // Optional: Environment ID (typically 'master')
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
};

// Add a utility to check if Contentful is properly configured
export const isContentfulConfigured = () => {
  const { SPACE_ID, DELIVERY_TOKEN } = CONTENTFUL_CONFIG;
  return !!(SPACE_ID && DELIVERY_TOKEN);
};

// Base URL for your CMS API
export const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'https://your-cms-api.example.com';

// API key or token for authenticating with the CMS
export const CMS_API_KEY = import.meta.env.VITE_CMS_API_KEY || '';

// Content preview settings
export const CMS_PREVIEW_MODE = import.meta.env.VITE_CMS_PREVIEW_MODE === 'true' || false;

// Content model IDs or types
export const CMS_MODELS = {
  MACHINE: 'machine',
  PRODUCT_TYPE: 'product-type',
  BUSINESS_GOAL: 'business-goal',
  TESTIMONIAL: 'testimonial',
  CASE_STUDY: 'case-study',
  BLOG_POST: 'blog-post',
};

// Image transformations
export const IMAGE_TRANSFORMATIONS = {
  THUMBNAIL: { width: 300, height: 200, fit: 'cover' },
  MEDIUM: { width: 600, height: 400, fit: 'cover' },
  LARGE: { width: 1200, height: 800, fit: 'cover' },
};

// Environment flag to check if we're in development mode
export const IS_DEVELOPMENT = import.meta.env.DEV;

// Fallback image if CMS image is missing
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1481495278953-0a688f58e194';

// Strapi specific configuration
export const STRAPI_CONFIG = {
  API_URL: STRAPI_API_URL,
  API_KEY: STRAPI_API_KEY,
  ENDPOINTS: STRAPI_ENDPOINTS
};
