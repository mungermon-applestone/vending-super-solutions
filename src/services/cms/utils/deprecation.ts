import { toast } from '@/hooks/use-toast';

// Data types for tracking deprecation usage
export interface DeprecationStat {
  component: string;
  message: string;
  timestamp: number;
  count: number;
  // For backwards compatibility with existing code
  feature?: string;
  lastUsed?: number;
  alternative?: string;
}

// Singleton to track deprecations
const deprecationStats: DeprecationStat[] = [];

/**
 * Log deprecation warning and track usage statistics
 */
export const logDeprecation = (component: string, message: string, suggestion?: string) => {
  const fullMessage = suggestion ? `${message} ${suggestion}` : message;
  console.warn(`⚠️ DEPRECATED ${component}: ${fullMessage}`);
  
  // Record deprecation for tracking
  const existing = deprecationStats.find(
    (stat) => stat.component === component && stat.message === message
  );
  
  if (existing) {
    existing.count += 1;
    existing.timestamp = Date.now();
    // Update legacy properties for backward compatibility
    existing.lastUsed = Date.now();
    if (suggestion) {
      existing.alternative = suggestion;
    }
  } else {
    deprecationStats.push({
      component,
      message,
      timestamp: Date.now(),
      count: 1,
      // Legacy properties for backward compatibility
      feature: component,
      lastUsed: Date.now(),
      alternative: suggestion
    });
  }

  return fullMessage;
};

/**
 * Simple warning logger for deprecated interfaces
 */
export const logDeprecationWarning = (component: string, message: string, suggestion?: string) => {
  return logDeprecation(component, message, suggestion);
};

/**
 * Show toast notification for deprecation warning
 */
export const showDeprecationToast = (title: string, description: string = "This operation is deprecated and will be removed in a future version. Please use Contentful for content management.") => {
  // Log the deprecation first
  logDeprecation('DeprecationToast', `${title}: ${description}`);
  
  // Show the toast notification
  toast({
    title,
    description,
    variant: "destructive",
  });
};

/**
 * Throw an error for completely deprecated operations
 */
export const throwDeprecatedOperationError = (operation: string, contentType: string) => {
  const message = `${operation} is no longer supported for ${contentType}. Please use Contentful directly.`;
  logDeprecation('DeprecatedOperation', message);
  throw new Error(message);
};

/**
 * Get current deprecation stats for analysis
 */
export const getDeprecationStats = (): DeprecationStat[] => {
  return [...deprecationStats];
};

/**
 * Alias for getDeprecationStats - for backward compatibility
 */
export const getDeprecationUsageStats = getDeprecationStats;

/**
 * Track usage of deprecated features
 */
export const trackDeprecatedFeatureUsage = (feature: string, details: string) => {
  logDeprecation(feature, details);
};

/**
 * Track usage of deprecated code
 */
export const trackDeprecatedUsage = (component: string) => {
  logDeprecation(component, 'Usage of deprecated component/function');
};

/**
 * Get usage data for deprecated features
 */
export const getDeprecatedUsage = () => {
  return [...deprecationStats];
};

/**
 * Reset the deprecation tracker
 */
export const resetDeprecationTracker = () => {
  deprecationStats.length = 0;
};

/**
 * Legacy function for compatibility
 */
export const resetUsageStats = resetDeprecationTracker;

/**
 * Get Contentful redirect URL for a content type and optional ID
 * Updated to have fewer required parameters
 */
export const getContentfulRedirectUrl = (
  contentType?: string | null, 
  contentId?: string | null,
  spaceId: string = process.env.CONTENTFUL_SPACE_ID || '',
  environmentId: string = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master'
): string => {
  // Base Contentful URL
  const baseUrl = 'https://app.contentful.com';
  
  // If no space ID, return the base space selection URL
  if (!spaceId) {
    return `${baseUrl}/spaces`;
  }
  
  // If no content type, return the space home
  if (!contentType) {
    return `${baseUrl}/spaces/${spaceId}/home`;
  }
  
  // If we have a content ID, build an edit URL
  if (contentId) {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries/${contentId}`;
  }
  
  // Otherwise, return the content type listing URL
  return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries?contentTypeId=${contentType}`;
};

/**
 * Create a function that throws an error for deprecated write operations
 */
export const createDeprecatedWriteOperation = (operation: string, entityType: string) => {
  return (...args: any[]) => {
    throwDeprecatedOperationError(operation, entityType);
    return Promise.reject(new Error(`${operation} is not supported for ${entityType}`));
  };
};

/**
 * Create a read-only adapter from a source adapter by replacing write operations with error-throwing functions
 */
export function createReadOnlyAdapter<T extends Record<string, any>>(
  entityType: string,
  readOperations: Partial<T>,
  writeOperationNames: string[] = ['create', 'update', 'delete', 'clone']
): T {
  const adapter = { ...readOperations } as T;
  
  // Replace all write operations with error-throwing functions
  for (const operation of writeOperationNames) {
    if (!(operation in adapter)) {
      Object.defineProperty(adapter, operation, {
        value: createDeprecatedWriteOperation(operation, entityType),
        configurable: true,
        enumerable: true
      });
    }
  }
  
  // Track usage
  trackDeprecatedUsage(`ReadOnlyAdapter-${entityType}`);
  
  return adapter;
}

/**
 * Create read-only content type operations
 */
export function createReadOnlyContentTypeOperations<T>(
  contentType: string,
  entityName: string,
  baseAdapter: Record<string, any>
) {
  // Track usage of this function for deprecation monitoring
  trackDeprecatedUsage(`ReadOnlyContentTypeOps-${contentType}`);
  
  // Return an object with compatible operations
  return {
    // Read operations - pass through to the base adapter
    fetchAll: baseAdapter.getAll || (async () => []),
    fetchBySlug: baseAdapter.getBySlug || (async () => null),
    fetchById: baseAdapter.getById || (async () => null),
    
    // Write operations - these will throw appropriate errors
    create: createDeprecatedWriteOperation('create', entityName),
    update: createDeprecatedWriteOperation('update', entityName),
    delete: createDeprecatedWriteOperation('delete', entityName),
    clone: createDeprecatedWriteOperation('clone', entityName)
  };
}
