
/**
 * Centralized utilities for handling deprecation warnings, tracking, and creating read-only adapters
 */

// Track which deprecated features are being used
export type DeprecationStat = {
  count: number;
  lastUsed: Date;
  feature: string;
  message?: string;
};

// In-memory store for tracking deprecation usage
const deprecationStats: Record<string, DeprecationStat> = {};

/**
 * Log a deprecation warning to the console
 * @param feature The deprecated feature name
 * @param message The deprecation message
 * @param alternative The recommended alternative
 */
export function logDeprecationWarning(
  feature: string, 
  message: string, 
  alternative?: string
): void {
  // Build the warning message
  let warning = `⚠️ DEPRECATION WARNING: ${feature} is deprecated. ${message}`;
  if (alternative) {
    warning += ` Use ${alternative} instead.`;
  }
  
  console.warn(warning);
  trackDeprecatedFeatureUsage(feature, message);
}

/**
 * Track usage of a deprecated feature
 * @param feature The deprecated feature name
 * @param details Optional details about the usage
 */
export function trackDeprecatedFeatureUsage(
  feature: string, 
  details?: string
): void {
  if (!deprecationStats[feature]) {
    deprecationStats[feature] = {
      count: 0,
      lastUsed: new Date(),
      feature,
      message: details
    };
  }
  
  deprecationStats[feature].count += 1;
  deprecationStats[feature].lastUsed = new Date();
  
  if (details && !deprecationStats[feature].message) {
    deprecationStats[feature].message = details;
  }
}

/**
 * Get statistics about deprecated feature usage
 */
export function getDeprecationUsageStats(): DeprecationStat[] {
  return Object.values(deprecationStats);
}

/**
 * Reset the deprecation tracker (primarily for testing)
 */
export function resetDeprecationTracker(): void {
  for (const key of Object.keys(deprecationStats)) {
    delete deprecationStats[key];
  }
}

/**
 * Alias for trackDeprecatedFeatureUsage for backward compatibility
 * @deprecated Use trackDeprecatedFeatureUsage instead
 */
export const trackDeprecatedUsage = trackDeprecatedFeatureUsage;

/**
 * Alias for getDeprecationUsageStats for backward compatibility
 * @deprecated Use getDeprecationUsageStats instead
 */
export const getDeprecatedUsage = getDeprecationUsageStats;

/**
 * Log deprecation information for use in log analysis
 * @param component The component or module being deprecated
 * @param message Additional details about the deprecation
 * @param recommendation Optional recommendation for alternative
 */
export function logDeprecation(
  component: string,
  message: string,
  recommendation?: string
): void {
  trackDeprecatedFeatureUsage(component, message);
  
  // Format for log analysis
  const logData = {
    type: 'DEPRECATION',
    component,
    message,
    recommendation,
    timestamp: new Date().toISOString()
  };
  
  console.warn(`[DEPRECATION] ${component}: ${message}${recommendation ? ` | Recommendation: ${recommendation}` : ''}`);
  console.debug('deprecation-data', logData);
}

/**
 * Show a toast notification for a deprecated operation
 */
export function showDeprecationToast(title: string, message: string): void {
  console.warn(`DEPRECATION TOAST: ${title} - ${message}`);
  // This would normally show a toast, but we'll just log it for now
  // The actual toast implementation would be in the component that imports this
}

/**
 * Throw an error for a deprecated operation
 */
export function throwDeprecatedOperationError(operation: string, entityType: string, id?: string): never {
  const idInfo = id ? ` for ${entityType} with ID ${id}` : '';
  const errorMessage = `${operation} operation${idInfo} is not supported. Please use Contentful directly.`;
  
  trackDeprecatedFeatureUsage(
    `deprecated-operation-${entityType}-${operation}`,
    `Attempted to use deprecated ${operation} operation on ${entityType}`
  );
  
  throw new Error(errorMessage);
}

/**
 * Creates a function that throws an error for deprecated write operations
 * @param operation The operation name (create, update, delete, etc.)
 * @param entityType The entity type name
 * @returns A function that throws a descriptive error
 */
export function createDeprecatedWriteOperation<T>(
  operation: string, 
  entityType: string
): (...args: any[]) => Promise<T> {
  return (...args: any[]): Promise<T> => {
    const id = args[0] ? ` for ${entityType} with ID ${args[0]}` : '';
    const errorMessage = `${operation} operation${id} is not supported. Please use Contentful directly.`;
    
    // Track the attempted usage
    trackDeprecatedFeatureUsage(
      `deprecated-write-${entityType}-${operation}`,
      `Attempted to use deprecated ${operation} operation on ${entityType}`
    );
    
    // Log the deprecation
    logDeprecationWarning(
      `${entityType}.${operation}()`,
      `Direct ${operation} operations are deprecated and will be removed in a future release.`,
      'Contentful directly'
    );
    
    throw new Error(errorMessage);
  };
}

/**
 * Creates a read-only version of an adapter that allows read operations
 * but replaces write operations with functions that throw descriptive errors
 * 
 * @param entityType The type of entity this adapter handles (e.g., 'product', 'technology')
 * @param readOperations The read operations to keep from the original adapter
 * @param writeOperationNames Names of write operations to replace with error-throwing functions
 * @returns A new adapter with read operations intact but write operations replaced
 */
export function createReadOnlyAdapter<T extends Record<string, any>>(
  entityType: string,
  readOperations: Record<string, any>,
  writeOperationNames: string[]
): Record<string, any> {
  const readOnlyAdapter: Record<string, any> = { ...readOperations };
  
  // Replace all write operations with error-throwing functions
  for (const operation of writeOperationNames) {
    readOnlyAdapter[operation] = createDeprecatedWriteOperation(operation, entityType);
  }
  
  // Track usage of the read-only adapter
  logDeprecation(
    `ReadOnlyAdapter-${entityType}`,
    `Read-only adapter created for ${entityType}`,
    'Use Contentful directly for content management'
  );
  
  return readOnlyAdapter;
}

/**
 * Returns a Contentful URL for a specific content type or entry
 */
export function getContentfulRedirectUrl(
  contentType: string,
  entryId?: string,
  spaceId: string = process.env.CONTENTFUL_SPACE_ID || '',
  environmentId: string = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master'
): string {
  let url = 'https://app.contentful.com/';
  
  // Add space and environment if available
  if (spaceId) {
    url += `spaces/${spaceId}/`;
    
    if (environmentId) {
      url += `environments/${environmentId}/`;
    }
    
    // Direct to specific entry or content type
    if (entryId) {
      url += `entries/${entryId}`;
    } else if (contentType) {
      url += `entries?contentTypeId=${contentType}`;
    } else {
      url += 'entries';
    }
  }
  
  return url;
}
