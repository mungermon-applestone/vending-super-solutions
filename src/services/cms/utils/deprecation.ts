
/**
 * Utility functions for tracking and managing deprecated features
 */

// In-memory storage for deprecated feature usage stats
const deprecationStats: Record<string, { count: number, lastUsed: Date, messages: string[] }> = {};

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
  
  // Track usage for stats
  if (!deprecationStats[feature]) {
    deprecationStats[feature] = {
      count: 0,
      lastUsed: new Date(),
      messages: []
    };
  }
  
  deprecationStats[feature].count += 1;
  deprecationStats[feature].lastUsed = new Date();
  
  // Store the message (limit to most recent 5)
  if (deprecationStats[feature].messages.length >= 5) {
    deprecationStats[feature].messages.pop();
  }
  deprecationStats[feature].messages.unshift(message);
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
 * Stats functions for deprecation tracking
 */
export interface DeprecationStat {
  feature: string;
  count: number;
  lastUsed: Date;
  messages: string[];
}

export function getDeprecationStats(): DeprecationStat[] {
  return Object.entries(deprecationStats).map(([feature, data]) => ({
    feature,
    count: data.count,
    lastUsed: data.lastUsed,
    messages: [...data.messages]
  }));
}

/**
 * Reset the deprecation tracker (clear all stats)
 */
export function resetDeprecationTracker(): void {
  Object.keys(deprecationStats).forEach(key => {
    delete deprecationStats[key];
  });
  console.log('[Deprecation] Usage tracker has been reset');
}
