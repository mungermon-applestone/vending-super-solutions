
/**
 * CMS Configuration
 * 
 * This file contains configuration settings for connecting to your CMS.
 * Update these values when integrating with your actual CMS provider.
 */

// Base URL for your CMS API
export const CMS_API_URL = process.env.CMS_API_URL || 'https://your-cms-api.example.com';

// API key or token for authenticating with the CMS
export const CMS_API_KEY = process.env.CMS_API_KEY || '';

// Content preview settings
export const CMS_PREVIEW_MODE = process.env.CMS_PREVIEW_MODE === 'true' || false;

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
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Fallback image if CMS image is missing
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1481495278953-0a688f58e194';
