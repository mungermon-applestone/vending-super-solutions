
import { STRAPI_API_URL, STRAPI_API_KEY, STRAPI_ENDPOINTS } from './strapiCms';

/**
 * CMS Configuration
 * 
 * This file contains configuration settings for connecting to your CMS.
 * Update these values when integrating with your actual CMS provider.
 */

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

// Contentful configuration from environment variables
export const CONTENTFUL_CONFIG = {
  SPACE_ID: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'your_space_id_here',
  DELIVERY_TOKEN: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN || 'your_delivery_token_here',
  ENVIRONMENT_ID: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
};
