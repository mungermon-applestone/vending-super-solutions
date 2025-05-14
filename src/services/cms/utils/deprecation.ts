
/**
 * Simplified utility for tracking deprecated features
 */

export interface DeprecationStat {
  component: string;
  count: number;
  lastUsed: Date;
  messages: string[];
}

// In-memory store for deprecation stats (resets on page refresh)
const deprecationStats: Record<string, DeprecationStat> = {};

/**
 * Log a deprecation warning
 */
export function logDeprecation(component: string, message: string, alternative?: string): void {
  console.warn(`[DEPRECATED] ${component}: ${message}${alternative ? `. Use ${alternative} instead.` : ''}`);
  
  // Track usage
  if (!deprecationStats[component]) {
    deprecationStats[component] = {
      component,
      count: 0,
      lastUsed: new Date(),
      messages: []
    };
  }
  
  deprecationStats[component].count++;
  deprecationStats[component].lastUsed = new Date();
  deprecationStats[component].messages.push(message);
}

/**
 * Alias for logDeprecation (for backward compatibility)
 */
export const logDeprecationWarning = logDeprecation;

/**
 * Get statistics about deprecated feature usage
 */
export function getDeprecationStats(): DeprecationStat[] {
  return Object.values(deprecationStats)
    .sort((a, b) => b.count - a.count);
}

/**
 * Reset the deprecation tracker
 */
export function resetDeprecationTracker(): void {
  Object.keys(deprecationStats).forEach(key => {
    delete deprecationStats[key];
  });
}

/**
 * Alias for backward compatibility
 */
export const trackDeprecatedFeatureUsage = (component: string, message: string) => {
  logDeprecation(component, message);
};

/**
 * Alias for backward compatibility
 */
export const getDeprecationUsageStats = getDeprecationStats;

/**
 * Create read-only operations for deprecated content types
 */
export function createReadOnlyContentTypeOperations(contentType: string) {
  return {
    fetchAll: async () => {
      logDeprecation(`${contentType}.fetchAll`, `This content type is read-only`);
      return [];
    },
    fetchBySlug: async () => {
      logDeprecation(`${contentType}.fetchBySlug`, `This content type is read-only`);
      return null;
    },
    fetchById: async () => {
      logDeprecation(`${contentType}.fetchById`, `This content type is read-only`);
      return null;
    },
    create: async () => {
      logDeprecation(`${contentType}.create`, `This content type is read-only`);
      throw new Error(`${contentType} is read-only`);
    },
    update: async () => {
      logDeprecation(`${contentType}.update`, `This content type is read-only`);
      throw new Error(`${contentType} is read-only`);
    },
    delete: async () => {
      logDeprecation(`${contentType}.delete`, `This content type is read-only`);
      throw new Error(`${contentType} is read-only`);
    }
  };
}

/**
 * Create a deprecated write operation wrapper
 */
export function createDeprecatedWriteOperation(operation: string, contentType: string) {
  return async () => {
    logDeprecation(`${contentType}.${operation}`, `This operation is deprecated`);
    throw new Error(`${contentType}.${operation} is deprecated`);
  };
}

/**
 * Create a read-only adapter for contentful types
 */
export function createReadOnlyAdapter<T extends object>(
  contentType: string,
  readOperations: Partial<T>,
  deprecatedOperations: string[] = []
) {
  const adapter: any = { ...readOperations };
  
  // Add deprecated operations
  deprecatedOperations.forEach(operation => {
    adapter[operation] = () => {
      logDeprecation(`${contentType}.${operation}`, `This operation is deprecated`);
      throw new Error(`${contentType}.${operation} is not supported`);
    };
  });
  
  return adapter as T;
}

/**
 * Get Contentful URL for viewing or editing content
 */
export function getContentfulRedirectUrl(
  contentType?: string,
  entryId?: string,
  spaceId?: string,
  environmentId: string = 'master'
): string {
  // Use the provided space ID or fall back to the configured one
  const actualSpaceId = spaceId || import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
  
  // Base Contentful URL
  const baseUrl = `https://app.contentful.com/spaces/${actualSpaceId}`;
  
  // If no content type or entry ID is provided, just open Contentful
  if (!contentType && !entryId) {
    return baseUrl;
  }
  
  // Environment part of the URL
  const environmentPart = environmentId ? `/environments/${environmentId}` : '';
  
  // If we have both a content type and an entry ID, link to the specific entry
  if (contentType && entryId) {
    return `${baseUrl}${environmentPart}/entries/${entryId}`;
  }
  
  // If we only have a content type, link to the content type's entries
  if (contentType) {
    return `${baseUrl}${environmentPart}/entries?contentTypeId=${contentType}`;
  }
  
  // If we only have an entry ID, link directly to the entry
  if (entryId) {
    return `${baseUrl}${environmentPart}/entries/${entryId}`;
  }
  
  // Default fallback
  return baseUrl;
}

