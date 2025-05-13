
import { toast } from 'sonner';

// Define the deprecation statistics type
export interface DeprecationStat {
  feature: string;
  message: string;
  alternative: string;  // Added to fix TS error
  count: number;
  lastUsed: Date;
}

/**
 * Tracking of deprecated feature usage
 */
const DEPRECATION_STATS: Record<string, DeprecationStat> = {};

/**
 * Log a deprecation warning to the console
 * @param feature The deprecated feature name
 * @param message The deprecation message
 * @param alternativeMethod The recommended alternative
 */
export const logDeprecationWarning = (
  feature: string,
  message: string,
  alternativeMethod: string = ""
): void => {
  console.warn(`⚠️ DEPRECATION WARNING: ${feature} is deprecated. ${message}`);
  
  if (alternativeMethod) {
    console.warn(`💡 RECOMMENDED: ${alternativeMethod}`);
  }
  
  // Track this usage
  trackDeprecatedFeatureUsage(feature, message, alternativeMethod);
};

/**
 * Alias for logDeprecationWarning
 */
export const logDeprecation = logDeprecationWarning;

/**
 * Show a deprecation toast notification to the user
 */
export const showDeprecationToast = (
  feature: string,
  message: string,
  alternativeMethod: string = ""
): void => {
  // Log to console as well
  logDeprecationWarning(feature, message, alternativeMethod);
  
  // Show toast notification
  toast.warning(`${feature} is deprecated`, {
    description: message,
    duration: 5000,
  });
};

/**
 * Track usage of a deprecated feature
 */
export const trackDeprecatedFeatureUsage = (
  feature: string,
  message: string,
  alternative: string = ""
): void => {
  if (!DEPRECATION_STATS[feature]) {
    DEPRECATION_STATS[feature] = {
      feature,
      message,
      alternative,
      count: 0,
      lastUsed: new Date(),
    };
  }
  
  DEPRECATION_STATS[feature].count++;
  DEPRECATION_STATS[feature].lastUsed = new Date();
};

/**
 * Alias for backward compatibility
 */
export const trackDeprecatedUsage = trackDeprecatedFeatureUsage;

/**
 * Get all tracked deprecation statistics
 */
export const getDeprecationStats = (): DeprecationStat[] => {
  return Object.values(DEPRECATION_STATS).sort((a, b) => 
    b.count - a.count || b.lastUsed.getTime() - a.lastUsed.getTime()
  );
};

/**
 * Alias for backward compatibility
 */
export const getDeprecatedUsage = getDeprecationStats;

/**
 * Reset the deprecation tracking statistics
 */
export const resetDeprecationTracker = (): void => {
  Object.keys(DEPRECATION_STATS).forEach(key => {
    delete DEPRECATION_STATS[key];
  });
};

/**
 * Throw a consistent error for deprecated operations
 */
export const throwDeprecatedOperationError = (
  operation: string,
  entityType: string
): never => {
  throw new Error(
    `Operation '${operation}' on ${entityType} is deprecated and no longer supported. ` +
    `Please use Contentful directly for content management.`
  );
};

/**
 * Create a read-only adapter from a full adapter
 * This maintains read operations but prevents write operations
 * @param adapter The full adapter with read and write operations
 * @param entityType The type of entity for error messages
 */
export const createReadOnlyAdapter = <T>(
  adapter: any,
  entityType: string
): T => {
  const readOnlyAdapter = { ...adapter };
  
  // Replace write operations with functions that throw errors
  if (adapter.create) {
    readOnlyAdapter.create = () => throwDeprecatedOperationError('create', entityType);
  }
  
  if (adapter.update) {
    readOnlyAdapter.update = () => throwDeprecatedOperationError('update', entityType);
  }
  
  if (adapter.delete) {
    readOnlyAdapter.delete = () => throwDeprecatedOperationError('delete', entityType);
  }
  
  if (adapter.clone) {
    readOnlyAdapter.clone = () => throwDeprecatedOperationError('clone', entityType);
  }
  
  return readOnlyAdapter as T;
};

/**
 * Get a URL for editing content in Contentful
 */
export const getContentfulRedirectUrl = (
  contentType: string,
  contentId?: string
): string => {
  // Base Contentful URL
  const baseUrl = 'https://app.contentful.com/';
  
  // Get the space ID from environment if available
  const spaceId = typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_SPACE_ID 
    ? window.env.VITE_CONTENTFUL_SPACE_ID 
    : process.env.VITE_CONTENTFUL_SPACE_ID || 'al01e4yh2wq4';
  
  // Get the environment ID (default to master)
  const environmentId = typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_ENVIRONMENT_ID
    ? window.env.VITE_CONTENTFUL_ENVIRONMENT_ID
    : process.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master';
  
  // Build the URL based on whether we have a specific content ID
  if (contentId) {
    return `${baseUrl}spaces/${spaceId}/environments/${environmentId}/entries/${contentId}`;
  }
  
  // Return URL to the content type
  return `${baseUrl}spaces/${spaceId}/environments/${environmentId}/entries?contentTypeId=${contentType}`;
};

/**
 * Create ContentTypeOperations compatible with previous operations
 */
export function createReadOnlyContentTypeOperations<T>(
  contentType: string,
  entityName: string,
  adapter: any
): any {
  return {
    // Base operations
    contentType,
    
    // Read operations
    fetchAll: (filters = {}) => adapter.getAll(filters),
    fetchBySlug: (slug: string) => adapter.getBySlug(slug),
    fetchById: (id: string) => adapter.getById(id),
    
    // Write operations (all deprecated)
    create: () => {
      logDeprecation(
        `${contentType}.create`,
        `Creating ${entityName} is deprecated`,
        'Contentful web interface directly'
      );
      throwDeprecatedOperationError('create', entityName);
    },
    
    update: () => {
      logDeprecation(
        `${contentType}.update`,
        `Updating ${entityName} is deprecated`,
        'Contentful web interface directly'
      );
      throwDeprecatedOperationError('update', entityName);
    },
    
    delete: () => {
      logDeprecation(
        `${contentType}.delete`,
        `Deleting ${entityName} is deprecated`,
        'Contentful web interface directly'
      );
      throwDeprecatedOperationError('delete', entityName);
    },
    
    clone: () => {
      logDeprecation(
        `${contentType}.clone`,
        `Cloning ${entityName} is deprecated`,
        'Contentful web interface directly'
      );
      throwDeprecatedOperationError('clone', entityName);
    }
  };
}
