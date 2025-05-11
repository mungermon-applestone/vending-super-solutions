
/**
 * Consolidated Deprecation Module
 * 
 * This module serves as the central point for all deprecation-related functionality.
 * It combines tracking, logging, UI notifications, and redirection utilities.
 */

import { toast } from '@/hooks/use-toast';

// Set to store unique deprecation events
const reportedDeprecations = new Set<string>();

// Interface for usage statistics data
export interface DeprecationStat {
  feature: string;
  count: number;
  lastUsed: number;
}

/**
 * Tracks usage of deprecated features and logs it only once per feature
 * to avoid console spam
 * 
 * @param feature The name of the deprecated feature being used
 * @param file The file where the usage occurred
 */
export function trackDeprecatedUsage(feature: string, file?: string): void {
  const key = `${feature}:${file || 'unknown'}`;
  
  // Only log each deprecation once
  if (!reportedDeprecations.has(key)) {
    reportedDeprecations.add(key);
    
    // Log to console for development visibility
    console.warn(
      `[Deprecation Tracker] Usage of deprecated feature "${feature}" detected in ${file || 'unknown location'}`
    );
    
    // In a real implementation, this could also send telemetry data
    // to track usage across the application
  }
}

/**
 * Gets a list of all deprecated features that have been used
 * @returns Array of feature:file strings that have been tracked
 */
export function getDeprecatedUsage(): string[] {
  return Array.from(reportedDeprecations);
}

/**
 * Reset the deprecation usage tracker (mainly for testing)
 */
export function resetDeprecationTracker(): void {
  reportedDeprecations.clear();
}

/**
 * Log a deprecation warning message consistently
 * @param feature The name of the feature that is deprecated
 * @param message The deprecation message
 * @param replacement Optional recommendation for replacement
 */
export function logDeprecationWarning(
  feature: string, 
  message: string, 
  replacement?: string
): void {
  // Get stack trace to find calling file
  const stack = new Error().stack || '';
  const stackLines = stack.split('\n');
  const callerLine = stackLines.length > 2 ? stackLines[2] : '';
  const callerMatch = callerLine.match(/at\s+(.+)\s+\((.+)\)/);
  const callerFile = callerMatch ? callerMatch[2] : 'unknown';
  
  // Track this usage for deprecation metrics
  trackDeprecatedUsage(feature, callerFile);
  
  // Log the warning
  const baseMessage = `⚠️ DEPRECATED: ${message}`;
  const replacementMessage = replacement ? `\n👉 RECOMMENDED: ${replacement}` : '';
  
  console.warn(`${baseMessage}${replacementMessage}`);
}

/**
 * Legacy name for trackDeprecatedUsage to maintain compatibility
 * @deprecated Use trackDeprecatedUsage instead
 */
export function trackDeprecatedFeatureUsage(feature: string, details?: string): void {
  // Forward to the standard tracking function
  trackDeprecatedUsage(feature, details);
}

/**
 * Get formatted statistics about deprecated feature usage
 * @returns Array of statistics objects with feature name, count, and last usage time
 */
export function getDeprecationUsageStats(): DeprecationStat[] {
  const usageEntries = getDeprecatedUsage();
  const stats: Record<string, DeprecationStat> = {};
  
  // Process the raw usage data into statistics
  usageEntries.forEach(entry => {
    const [feature] = entry.split(':');
    
    if (!stats[feature]) {
      stats[feature] = {
        feature,
        count: 0,
        lastUsed: Date.now()
      };
    }
    
    stats[feature].count++;
  });
  
  return Object.values(stats).sort((a, b) => b.count - a.count);
}

/**
 * Show a toast notification for deprecated features
 * @param feature The feature being used that is deprecated
 * @param alternativeAction Optional suggestion for alternative
 */
export function showDeprecationToast(feature: string, alternativeAction: string = 'Use Contentful directly'): void {
  // Log the deprecation first
  logDeprecationWarning(feature, `${feature} is deprecated.`, alternativeAction);
  
  // Show toast notification
  toast({
    title: "Deprecated Feature",
    description: `${feature} is deprecated. ${alternativeAction} for content management.`,
    variant: "destructive",
  });
}

/**
 * Create an error object with a standardized message for deprecated operations
 * @param operation The operation being attempted (e.g., 'create', 'update')
 * @param entityType The type of entity being operated on
 */
export function createDeprecationError(operation: string, entityType: string): Error {
  return new Error(`${operation} operation on ${entityType} is disabled. Please use Contentful directly.`);
}

/**
 * Throw an error for a deprecated operation
 * @param operation The operation being attempted (e.g., 'create', 'update')
 * @param entityType The type of entity being operated on
 */
export function throwDeprecatedOperationError(operation: string, entityType: string): never {
  throw createDeprecationError(operation, entityType);
}

/**
 * Get a URL for redirecting users directly to Contentful
 * for a specific content type
 */
export function getContentfulRedirectUrl(
  contentTypeId: string,
  entryId?: string,
  spaceId?: string,
  environmentId: string = 'master'
): string {
  // Use environment variables for space ID if not provided
  const contentfulSpaceId = spaceId || process.env.REACT_APP_CONTENTFUL_SPACE_ID || '';
  
  // Base URL for Contentful web app
  const baseUrl = 'https://app.contentful.com/spaces';
  
  // If we have a specific entry ID, direct to that entry
  if (entryId) {
    return `${baseUrl}/${contentfulSpaceId}/environments/${environmentId}/entries/${entryId}`;
  }
  
  // Otherwise, direct to the content type listing
  return `${baseUrl}/${contentfulSpaceId}/environments/${environmentId}/entries?contentTypeId=${contentTypeId}`;
}

/**
 * Create a proxy handler that warns when deprecated properties are accessed
 * Useful for creating backward compatibility layers
 */
export function createDeprecationProxy<T extends object>(
  target: T,
  name: string,
  deprecatedProps: Record<keyof T, string>
): T {
  return new Proxy(target, {
    get(obj, prop: string) {
      // Check if the accessed property is deprecated
      if (prop in deprecatedProps) {
        logDeprecationWarning(
          `${name}.${String(prop)}`,
          `This property is deprecated: ${deprecatedProps[prop as keyof T]}`,
          'Use new Contentful-based APIs instead'
        );
      }
      return obj[prop as keyof T];
    }
  });
}

/**
 * Creates a function that logs deprecation and throws an error
 * Useful for creating stubs for deprecated write operations
 * @param operation The operation type (create, update, delete, etc)
 * @param entityType The entity type (product, technology, etc)
 * @param customMessage Optional custom error message
 */
export function createDeprecatedWriteOperation(
  operation: string,
  entityType: string,
  customMessage?: string
): (...args: any[]) => never {
  return (...args: any[]): never => {
    // Track usage
    trackDeprecatedUsage(`${operation}${entityType}`, `deprecated-write-operation`);
    
    // Show toast
    showDeprecationToast(
      `${operation} ${entityType}`,
      `Use Contentful directly for ${entityType} management`
    );
    
    // Throw error
    throw createDeprecationError(
      operation,
      entityType
    );
  };
}

/**
 * Helper to create a complete set of deprecated write operations for an entity
 * @param entityType The type of entity (product, technology, etc)
 * @returns Object with create, update, delete methods that all throw errors
 */
export function createDeprecatedWriteOperations(entityType: string): {
  create: (...args: any[]) => never;
  update: (...args: any[]) => never;
  delete: (...args: any[]) => never;
  clone?: (...args: any[]) => never;
} {
  return {
    create: createDeprecatedWriteOperation('create', entityType),
    update: createDeprecatedWriteOperation('update', entityType),
    delete: createDeprecatedWriteOperation('delete', entityType),
    clone: createDeprecatedWriteOperation('clone', entityType)
  };
}

/**
 * Mark a component or function as deprecated with JSDoc comment
 * This is just a type utility for better code documentation
 */
export function deprecated<T>(
  target: T,
  reason: string,
  alternative?: string
): T {
  // This doesn't actually do anything at runtime,
  // it's just for TypeScript documentation
  return target;
}

// Explicitly export the DeprecationStat type to fix the build error
export type { DeprecationStat };
