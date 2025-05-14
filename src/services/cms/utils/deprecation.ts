
/**
 * Utilities for handling and logging deprecation warnings
 */

// Store deprecation notices to avoid repeating them
const deprecationNotices: Record<string, boolean> = {};
const usageStatistics: Record<string, { count: number, lastOccurred: string }> = {};

/**
 * Log a deprecation warning to the console
 * 
 * @param item The item (function, component, etc.) that is deprecated
 * @param message The deprecation message explaining why it's deprecated
 * @param recommendation Optional recommendation for what to use instead
 */
export function logDeprecation(item: string, message: string, recommendation?: string): void {
  const key = `${item}:${message}`;
  
  // Avoid logging the same deprecation multiple times per session
  if (deprecationNotices[key]) {
    return;
  }
  
  console.warn(`[DEPRECATED] ${item}: ${message}`);
  
  if (recommendation) {
    console.warn(`[RECOMMENDATION] ${recommendation}`);
  }
  
  // Mark this deprecation as having been logged
  deprecationNotices[key] = true;
  
  // Also track usage statistics
  trackUsage(item);
}

/**
 * Legacy name for logDeprecation - maintained for backward compatibility
 */
export const logDeprecationWarning = logDeprecation;

/**
 * Track usage of deprecated features
 */
function trackUsage(feature: string): void {
  if (!usageStatistics[feature]) {
    usageStatistics[feature] = { count: 0, lastOccurred: new Date().toISOString() };
  }
  
  usageStatistics[feature].count += 1;
  usageStatistics[feature].lastOccurred = new Date().toISOString();
}

/**
 * Get statistics about deprecation usage
 */
export function getDeprecationStats(): DeprecationStat[] {
  return Object.entries(usageStatistics)
    .map(([item, data]) => ({
      id: `stat-${item.replace(/[^a-z0-9]/gi, '-')}`,
      item,
      count: data.count,
      timestamp: data.lastOccurred,
      lastOccurred: data.lastOccurred
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Reset the deprecation tracker
 */
export function resetDeprecationTracker(): void {
  Object.keys(usageStatistics).forEach(key => {
    delete usageStatistics[key];
  });
}

/**
 * Create a compatible wrapper for a deprecated function
 * 
 * @param oldFn The name of the deprecated function
 * @param newFn The new function to use
 * @param message Optional custom deprecation message
 * @returns A wrapped function that warns about deprecation
 */
export function createDeprecatedWrapper<T extends (...args: any[]) => any>(
  oldFn: string, 
  newFn: T, 
  message?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    logDeprecation(
      oldFn,
      message || `This function is deprecated and will be removed in a future version.`,
      `Use ${newFn.name || 'the new implementation'} instead.`
    );
    return newFn(...args);
  }) as T;
}

/**
 * Create read-only operations with deprecation warnings
 * @param contentType The content type name
 * @param operations The actual operations to use
 */
export function createReadOnlyContentTypeOperations<T>(
  contentType: string,
  operations: any
): any {
  return {
    ...operations,
    
    // Override write operations with warnings
    create: (...args: any[]) => {
      logDeprecation(
        `${contentType}.create()`,
        `Direct creation is no longer supported through the API`,
        `Use the Contentful UI to create ${contentType} content`
      );
      return Promise.reject(new Error(`${contentType}.create is deprecated`));
    },
    
    update: (...args: any[]) => {
      logDeprecation(
        `${contentType}.update()`,
        `Direct updates are no longer supported through the API`,
        `Use the Contentful UI to update ${contentType} content`
      );
      return Promise.reject(new Error(`${contentType}.update is deprecated`));
    },
    
    delete: (...args: any[]) => {
      logDeprecation(
        `${contentType}.delete()`,
        `Direct deletion is no longer supported through the API`,
        `Use the Contentful UI to delete ${contentType} content`
      );
      return Promise.reject(new Error(`${contentType}.delete is deprecated`));
    }
  };
}

/**
 * Generate a URL that redirects to Contentful
 */
export function getContentfulRedirectUrl(
  contentType?: string,
  entryId?: string
): string {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID || '';
  const environmentId = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
  const baseUrl = 'https://app.contentful.com';
  
  if (!contentType) {
    // Just open Contentful
    return `${baseUrl}/spaces/${spaceId}/home`;
  }
  
  if (!entryId) {
    // Open the content type
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries?contentTypeId=${contentType}`;
  }
  
  // Open the specific entry
  return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
}

/**
 * Show a deprecation toast (placeholder for future implementation)
 */
export function showDeprecationToast(feature: string, message: string): void {
  // This will be implemented in the future
  console.warn(`[DEPRECATED FEATURE] ${feature}: ${message}`);
  logDeprecation(feature, message);
}

/**
 * Throw a deprecated operation error
 */
export function throwDeprecatedOperationError(operation: string, alternativeMethod?: string): never {
  const message = `Operation ${operation} is deprecated and no longer supported.` + 
    (alternativeMethod ? ` Use ${alternativeMethod} instead.` : '');
  
  logDeprecation(operation, message);
  throw new Error(message);
}

// Export a simple DeprecationStat interface for the admin page
export interface DeprecationStat {
  id: string;
  item: string;
  count: number;
  timestamp: string;
  lastOccurred: string;
  message?: string;
  recommendation?: string;
  component?: string;
}

// For backward compatibility, provide these aliases
export const trackDeprecatedUsage = trackUsage;
export const getDeprecatedUsage = getDeprecationStats;

