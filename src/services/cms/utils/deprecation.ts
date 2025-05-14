
/**
 * Utility functions for tracking and managing deprecated features
 */

// Track usage of deprecated features
export function logDeprecation(
  feature: string,
  message: string,
  suggestion?: string
): void {
  console.warn(`[DEPRECATED] ${feature}: ${message}`);
  
  if (suggestion) {
    console.info(`[SUGGESTION] ${suggestion}`);
  }
}

/**
 * Alias for backward compatibility
 */
export const logDeprecationWarning = logDeprecation;

/**
 * Generate a Contentful URL to redirect users to the appropriate content
 * Supports both object pattern and individual parameter calls for backward compatibility
 */
export function getContentfulRedirectUrl(
  contentTypeOrOptions: string | { 
    contentTypeId?: string; 
    entryId?: string;
    spaceId?: string;
    environmentId?: string;
    mode?: 'space' | 'entry' | 'content-type';
  },
  entryId?: string,
  spaceId?: string,
  environmentId?: string
): string {
  // Default configuration
  const defaultSpaceId = process.env.CONTENTFUL_SPACE_ID || 'al01e4yh2wq4';
  const defaultEnvironmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
  
  // Handle both call patterns
  if (typeof contentTypeOrOptions === 'object') {
    // Object parameter pattern
    const options = contentTypeOrOptions;
    const space = options.spaceId || defaultSpaceId;
    const environment = options.environmentId || defaultEnvironmentId;
    
    if (options.entryId) {
      // Entry mode
      return `https://app.contentful.com/spaces/${space}/environments/${environment}/entries/${options.entryId}`;
    } else if (options.contentTypeId) {
      // Content type mode
      return `https://app.contentful.com/spaces/${space}/environments/${environment}/content_types/${options.contentTypeId}`;
    } else {
      // Space mode
      return `https://app.contentful.com/spaces/${space}/environments/${environment}`;
    }
  } else {
    // Legacy parameter pattern with individual arguments
    const contentTypeId = contentTypeOrOptions;
    const actualSpaceId = spaceId || defaultSpaceId;
    const actualEnvironmentId = environmentId || defaultEnvironmentId;
    
    if (entryId) {
      // Entry mode
      return `https://app.contentful.com/spaces/${actualSpaceId}/environments/${actualEnvironmentId}/entries/${entryId}`;
    } else if (contentTypeId) {
      // Content type mode
      return `https://app.contentful.com/spaces/${actualSpaceId}/environments/${actualEnvironmentId}/content_types/${contentTypeId}`;
    } else {
      // Space mode
      return `https://app.contentful.com/spaces/${actualSpaceId}/environments/${actualEnvironmentId}`;
    }
  }
}

/**
 * Deprecated stats functions - stubs to prevent errors
 */
export interface DeprecationStat {
  feature: string;
  count: number;
  lastUsed: Date;
  suggestions: string[];
}

export function getDeprecationStats(): DeprecationStat[] {
  console.warn('[DEPRECATED] getDeprecationStats is no longer supported');
  return [];
}
