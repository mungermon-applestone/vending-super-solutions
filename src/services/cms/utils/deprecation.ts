
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
