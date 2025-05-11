
/**
 * Utilities for managing and tracking deprecated functions and components
 */
import { logDeprecationWarning } from './deprecationLogger';
import { toast } from '@/hooks/use-toast';

/**
 * Log a deprecation warning for a feature
 * @param feature The name of the feature being deprecated
 * @param message Optional message with details
 * @param alternative Optional suggestion for alternative
 */
export function logDeprecation(
  feature: string,
  message?: string,
  alternative?: string
): void {
  logDeprecationWarning(feature, message || `${feature} is deprecated`, alternative);
}

/**
 * Show a toast notification for deprecated features
 * @param feature The feature being used that is deprecated
 * @param alternativeAction Optional suggestion for alternative
 */
export function showDeprecationToast(feature: string, alternativeAction: string = 'Use Contentful directly'): void {
  // Log the deprecation first
  logDeprecation(feature, `${feature} is deprecated.`, alternativeAction);
  
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
        logDeprecation(
          `${name}.${String(prop)}`,
          `This property is deprecated: ${deprecatedProps[prop as keyof T]}`,
          'Use new Contentful-based APIs instead'
        );
      }
      return obj[prop as keyof T];
    }
  });
}
