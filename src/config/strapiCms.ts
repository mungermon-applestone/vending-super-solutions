
/**
 * Strapi CMS Configuration
 * 
 * This file contains all configuration settings for Strapi CMS integration.
 */

// Base URL for the Strapi API
export const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

// API key for authenticating with the Strapi API
export const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY || '';

// Define API endpoints for Strapi
export const STRAPI_ENDPOINTS = {
  // Content types
  PRODUCT_TYPES: '/api/product-types',
  BUSINESS_GOALS: '/api/business-goals',
  TECHNOLOGIES: '/api/technology', // Changed from '/api/technologies' to '/api/technology'
  MACHINES: '/api/machines',
  TESTIMONIALS: '/api/testimonials',
  CASE_STUDIES: '/api/case-studies',
  BLOG_POSTS: '/api/blog-posts',
  LANDING_PAGES: '/api/landing-pages',
  
  // Media
  MEDIA: '/api/upload/files',
  UPLOAD: '/api/upload',
  
  // Auth
  AUTH: '/api/auth',
};

// Configuration for various content types
export const STRAPI_CONFIG = {
  // Relation population depth
  POPULATION_DEPTH: {
    DEFAULT: 3,
    DEEP: 5
  },
  
  // Media settings
  MEDIA: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
};

/**
 * Helper to build Strapi query parameters for API requests
 */
export function buildStrapiQueryParams(options: {
  populate?: string | string[] | Record<string, any>,
  filters?: Record<string, any>,
  sort?: string | string[],
  pagination?: { page?: number, pageSize?: number },
  fields?: string[]
}): URLSearchParams {
  const params = new URLSearchParams();
  
  // Handle population
  if (options.populate) {
    if (typeof options.populate === 'string') {
      params.append('populate', options.populate);
    } else if (Array.isArray(options.populate)) {
      options.populate.forEach(field => {
        params.append('populate', field);
      });
    } else {
      params.append('populate', JSON.stringify(options.populate));
    }
  }
  
  // Handle filters
  if (options.filters && Object.keys(options.filters).length > 0) {
    params.append('filters', JSON.stringify(options.filters));
  }
  
  // Handle sorting
  if (options.sort) {
    if (typeof options.sort === 'string') {
      params.append('sort', options.sort);
    } else if (Array.isArray(options.sort)) {
      options.sort.forEach(sortField => {
        params.append('sort', sortField);
      });
    }
  }
  
  // Handle pagination
  if (options.pagination) {
    if (options.pagination.page) {
      params.append('pagination[page]', options.pagination.page.toString());
    }
    if (options.pagination.pageSize) {
      params.append('pagination[pageSize]', options.pagination.pageSize.toString());
    }
  }
  
  // Handle field selection
  if (options.fields && options.fields.length > 0) {
    options.fields.forEach(field => {
      params.append('fields', field);
    });
  }
  
  return params;
}
