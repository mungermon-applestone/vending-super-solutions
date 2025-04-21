
/**
 * CMS Configuration
 * 
 * This file contains configuration settings for connecting to your CMS.
 */

// You can set your Contentful credentials directly here for testing purposes
// WARNING: In production, you should use environment variables instead
const INLINE_CONTENTFUL_CONFIG = {
  SPACE_ID: 'al01e4yh2wq4',       // Set your Space ID here if not using environment variables
  DELIVERY_TOKEN: 'fxpQth03vfdKzI4VNT_fYg8cD5BwoTiGaa6INIyYync', // Set your Delivery Token here if not using environment variables
  ENVIRONMENT_ID: 'master' // Default environment
};

// Contentful configuration (prioritizes environment variables, falls back to inline config)
export const CONTENTFUL_CONFIG = {
  // Space ID (required)
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || INLINE_CONTENTFUL_CONFIG.SPACE_ID,
  
  // Delivery Token (required)
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || INLINE_CONTENTFUL_CONFIG.DELIVERY_TOKEN,
  
  // Environment ID (optional, defaults to 'master')
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || INLINE_CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
};

// Simple check if Contentful is configured
export const isContentfulConfigured = () => {
  const { SPACE_ID, DELIVERY_TOKEN } = CONTENTFUL_CONFIG;
  const configured = !!(SPACE_ID && DELIVERY_TOKEN);
  
  console.log('[CMS Config] Contentful configuration status:', {
    configured,
    hasSpaceId: !!SPACE_ID,
    spaceIdLength: SPACE_ID?.length || 0,
    hasDeliveryToken: !!DELIVERY_TOKEN, 
    deliveryTokenLength: DELIVERY_TOKEN?.length || 0,
    environmentId: CONTENTFUL_CONFIG.ENVIRONMENT_ID
  });
  
  return configured;
};

// Strapi specific configuration
import { STRAPI_API_URL, STRAPI_API_KEY, STRAPI_ENDPOINTS } from './strapiCms';

export const STRAPI_CONFIG = {
  API_URL: STRAPI_API_URL,
  API_KEY: STRAPI_API_KEY,
  ENDPOINTS: STRAPI_ENDPOINTS
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
