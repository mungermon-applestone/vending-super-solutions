/**
 * CMS Migration Helper Utilities
 * 
 * This module provides helper functions for migrating from legacy CMS
 * systems to Contentful, including data transformation and URL generation.
 */

import { logDeprecation } from './deprecation';

/**
 * Get the Contentful edit URL for a content type
 */
export function getContentfulEditUrl(
  contentType?: string, 
  contentId?: string,
  spaceId: string = process.env.CONTENTFUL_SPACE_ID || '',
  environmentId: string = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master'
): string {
  // Log usage of this helper
  logDeprecation(
    'getContentfulEditUrl',
    `Generated Contentful URL for ${contentType || 'Unknown'} ${contentId ? ` (${contentId})` : ''}`,
    'direct Contentful access'
  );
  
  // Base Contentful URL
  const baseUrl = 'https://app.contentful.com';
  
  // Handle missing space ID
  if (!spaceId) {
    return `${baseUrl}/spaces`;
  }
  
  // If no content type, return the space home
  if (!contentType) {
    return `${baseUrl}/spaces/${spaceId}/home`;
  }
  
  // If we have a content ID, build a direct edit URL
  if (contentId) {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries/${contentId}`;
  }
  
  // Otherwise, return the content type listing URL
  return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries?contentTypeId=${contentType}`;
}

/**
 * Generate a migration report to show progress towards full Contentful migration
 * This is used by various admin components to display migration status
 */
export function generateMigrationReport() {
  // This could eventually pull from a database or API to show real migration status
  return {
    completionPercentage: 75,
    stats: {
      completed: 6,
      inProgress: 1,
      pending: 1
    },
    contentTypes: [
      { name: "Products", status: "completed" },
      { name: "Business Goals", status: "completed" },
      { name: "Technologies", status: "completed" },
      { name: "Machines", status: "in-progress" },
      { name: "Case Studies", status: "completed" },
      { name: "Landing Pages", status: "completed" },
      { name: "Testimonials", status: "completed" },
      { name: "Media Library", status: "pending" }
    ]
  };
}

/**
 * Helper for ensuring backward compatibility with Strapi data structures
 * when migrating to Contentful
 */
export function normalizeDeprecatedCmsData<T extends Record<string, any>>(
  data: any, 
  contentType: string
): T {
  if (!data) return null as unknown as T;
  
  // Log the normalization
  logDeprecation(
    'normalizeDeprecatedCmsData',
    `Normalizing deprecated ${contentType} data structure`,
    'Contentful data structure directly'
  );
  
  // Handle common normalizations here based on content type
  // This is a simplified example - in a real scenario, you'd have
  // type-specific transformations
  
  return data as T;
}

/**
 * Create a utility for checking if Strapi-style data needs migration
 */
export function requiresMigration(data: any): boolean {
  // Check for common Strapi data structures
  if (data && data.attributes && data.id) {
    return true;
  }
  
  return false;
}
