
/**
 * Utilities for handling and logging deprecation warnings
 */

// Store deprecation notices to avoid repeating them
const deprecationNotices: Record<string, boolean> = {};

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
  
  // Also track using our deprecation statistics if available
  try {
    trackDeprecation(item, message, recommendation);
  } catch (err) {
    // Fail silently if tracking isn't available
  }
}

/**
 * Track deprecation usage for statistical purposes
 * This is an internal function that might not work in all environments
 */
function trackDeprecation(item: string, message: string, recommendation?: string): void {
  // Implementation might vary depending on tracking system
  if (typeof window !== 'undefined' && (window as any).__trackDeprecation) {
    (window as any).__trackDeprecation(item, message, recommendation);
  }
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
 * Create deprecated write operation with warning
 */
export function createDeprecatedWriteOperation(
  operationName: string,
  contentType: string
): (...args: any[]) => Promise<never> {
  return (...args: any[]) => {
    logDeprecation(
      `${contentType}.${operationName}()`,
      `This operation is no longer supported through the API`,
      `Use the Contentful UI to manage ${contentType} content`
    );
    return Promise.reject(new Error(`${contentType}.${operationName} is deprecated`));
  };
}

// Export a simple DeprecationStat interface for the admin page
export interface DeprecationStat {
  id: string;
  item: string;
  message: string;
  recommendation?: string;
  component?: string;
  count: number;
  timestamp: string;
  lastOccurred: string;
}
