
import { toast } from '@/hooks/use-toast';

// Data types for tracking deprecation usage
export interface DeprecationStat {
  component: string;
  message: string;
  timestamp: number;
  count: number;
}

// Singleton to track deprecations
const deprecationStats: DeprecationStat[] = [];

/**
 * Log deprecation warning and track usage statistics
 */
export const logDeprecation = (component: string, message: string) => {
  console.warn(`⚠️ DEPRECATED ${component}: ${message}`);
  
  // Record deprecation for tracking
  const existing = deprecationStats.find(
    (stat) => stat.component === component && stat.message === message
  );
  
  if (existing) {
    existing.count += 1;
    existing.timestamp = Date.now();
  } else {
    deprecationStats.push({
      component,
      message,
      timestamp: Date.now(),
      count: 1
    });
  }
};

/**
 * Simple warning logger for deprecated interfaces
 */
export const logDeprecationWarning = (component: string, message: string, suggestion?: string) => {
  const fullMessage = suggestion ? `${message} ${suggestion}` : message;
  logDeprecation(component, fullMessage);
  
  return fullMessage;
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
 * Get Contentful redirect URL for a content type and optional ID
 */
export const getContentfulRedirectUrl = (contentType: string, contentId?: string | null): string => {
  // Base Contentful URL
  const baseUrl = 'https://app.contentful.com/spaces';
  
  // Content type specific paths
  const contentTypeMapping: Record<string, string> = {
    'product': 'productType',
    'technology': 'technology',
    'businessGoal': 'businessGoal',
    'machine': 'machine',
    'caseStudy': 'caseStudy',
    'blog': 'blogPost',
    'landingPage': 'landingPage'
  };
  
  // Environment is usually 'master'
  const environment = 'master';
  
  // Contentful space ID - in a real app this would come from config
  const spaceId = process.env.CONTENTFUL_SPACE_ID || 'demo-space';
  
  // Build the URL
  let url = `${baseUrl}/${spaceId}/environments/${environment}/entries`;
  
  // If a specific content type is provided
  if (contentType && contentTypeMapping[contentType]) {
    url += `?contentTypeId=${contentTypeMapping[contentType]}`;
  }
  
  // If a specific content ID is provided
  if (contentId) {
    url += `/${contentId}`;
  }
  
  return url;
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
