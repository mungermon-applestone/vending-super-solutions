
import { toast } from 'sonner';

interface DeprecationStat {
  id: string;
  component: string;
  message: string;
  suggestion?: string;
  timestamp: string;
  count: number;
}

// Store for tracking deprecated usages
const deprecationUsage: Record<string, DeprecationStat> = {};

/**
 * Log a deprecation warning to the console
 */
export function logDeprecation(
  component: string,
  message: string,
  suggestion?: string
) {
  const id = `${component}:${message}`;
  
  console.warn(`⚠️ DEPRECATION WARNING: ${component} is deprecated.`, message, suggestion ? `Use ${suggestion} instead.` : '');
  
  // Track the usage for statistical purposes
  trackDeprecatedUsage(component, message, suggestion);
  
  return id;
}

/**
 * Show a toast notification for a deprecated function
 */
export function showDeprecationToast(
  component: string,
  message: string,
  suggestion?: string
) {
  // Log to console first
  const id = logDeprecation(component, message, suggestion);
  
  // Show toast
  toast.warning(
    `Deprecated: ${component}`, 
    {
      description: suggestion || message,
      duration: 5000,
    }
  );
  
  return id;
}

/**
 * Track usage of deprecated functions for reporting
 */
export function trackDeprecatedUsage(
  component: string,
  message: string,
  suggestion?: string
) {
  const id = `${component}:${message}`;
  
  if (deprecationUsage[id]) {
    deprecationUsage[id].count += 1;
    deprecationUsage[id].timestamp = new Date().toISOString();
  } else {
    deprecationUsage[id] = {
      id,
      component,
      message,
      suggestion,
      timestamp: new Date().toISOString(),
      count: 1
    };
  }
}

/**
 * Get all deprecation usage statistics
 */
export function getDeprecatedUsage(): DeprecationStat[] {
  return Object.values(deprecationUsage).sort((a, b) => b.count - a.count);
}

/**
 * Get deprecation statistics in a formatted way
 */
export function getDeprecationStats(): {
  total: number;
  uniqueComponents: number;
  stats: DeprecationStat[];
} {
  const stats = getDeprecatedUsage();
  
  return {
    total: stats.reduce((sum, stat) => sum + stat.count, 0),
    uniqueComponents: new Set(stats.map(stat => stat.component)).size,
    stats
  };
}

/**
 * Reset the deprecation tracker (mainly for testing)
 */
export function resetDeprecationTracker() {
  Object.keys(deprecationUsage).forEach(key => {
    delete deprecationUsage[key];
  });
}

/**
 * Throw an error for deprecated operations that are no longer supported
 */
export function throwDeprecatedOperationError(
  operation: string,
  message?: string
): never {
  const errorMessage = `Operation '${operation}' is deprecated and no longer supported. ${message || ''}`;
  console.error(`❌ DEPRECATED OPERATION: ${errorMessage}`);
  throw new Error(errorMessage);
}

/**
 * Get a URL for redirecting to Contentful for a specific content type
 */
export function getContentfulRedirectUrl(
  contentType: string,
  contentId?: string
): string {
  // Detect environment variables for Contentful
  const spaceId = process.env.VITE_CONTENTFUL_SPACE_ID || 'unknown-space-id';
  const envId = process.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
  
  // Base URL for Contentful web app
  const baseUrl = 'https://app.contentful.com';
  
  if (contentId) {
    // URL for editing a specific entry
    return `${baseUrl}/spaces/${spaceId}/environments/${envId}/entries/${contentId}`;
  }
  
  // URL for content type listing
  return `${baseUrl}/spaces/${spaceId}/environments/${envId}/entries?contentTypeId=${contentType}`;
}

/**
 * Create wrapper for operations that now should use Contentful UI
 */
export function createDeprecatedWriteOperation(
  operationName: string,
  entityType: string
): (...args: any[]) => Promise<any> {
  return async (...args: any[]) => {
    const message = `${operationName} for ${entityType} through the API is deprecated.`;
    const suggestion = `Use Contentful UI to manage ${entityType} content.`;
    
    logDeprecation(`${entityType}.${operationName}`, message, suggestion);
    
    console.warn(`[DEPRECATED] ${message} ${suggestion}`);
    return null;
  };
}

/**
 * Create a set of read-only content type operations
 */
export function createReadOnlyContentTypeOperations(entityType: string): {
  create: (...args: any[]) => Promise<any>;
  update: (...args: any[]) => Promise<any>;
  delete: (...args: any[]) => Promise<any>;
} {
  return {
    create: createDeprecatedWriteOperation('create', entityType),
    update: createDeprecatedWriteOperation('update', entityType),
    delete: createDeprecatedWriteOperation('delete', entityType),
  };
}
