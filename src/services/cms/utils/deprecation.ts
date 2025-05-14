
import { toast } from 'sonner';

// Track deprecated features usage
const deprecatedUsage: Record<string, number> = {};

/**
 * Log a deprecation warning to the console
 */
export function logDeprecation(name: string, message: string = 'This feature is deprecated and will be removed in a future version.') {
  console.warn(`⚠️ DEPRECATION WARNING: ${name} is deprecated. ${message}`);
  trackDeprecatedUsage(name);
}

// Alias for backward compatibility
export const logDeprecationWarning = logDeprecation;

/**
 * Show a toast notification about deprecation
 */
export function showDeprecationToast(feature: string, alternative?: string) {
  const message = alternative
    ? `${feature} is deprecated. Please use ${alternative} instead.`
    : `${feature} is deprecated and will be removed in a future version.`;
    
  toast.warning(message, {
    id: `deprecation-${feature.replace(/\s+/g, '-')}`,
    duration: 6000,
  });
  
  trackDeprecatedUsage(feature);
}

/**
 * Track usage of deprecated features
 */
export function trackDeprecatedUsage(feature: string) {
  deprecatedUsage[feature] = (deprecatedUsage[feature] || 0) + 1;
}

/**
 * Get usage statistics for deprecated features
 */
export function getDeprecatedUsage() {
  return { ...deprecatedUsage };
}

/**
 * Reset deprecation usage tracking
 */
export function resetDeprecationTracker() {
  Object.keys(deprecatedUsage).forEach(key => {
    delete deprecatedUsage[key];
  });
}

/**
 * Throw an error for completely removed functionality
 */
export function throwDeprecatedOperationError(operation: string): never {
  const error = new Error(`${operation} has been removed. Please use the new Contentful API instead.`);
  console.error(`🚫 DEPRECATED OPERATION: ${error.message}`);
  throw error;
}

/**
 * Get a redirect URL to view/edit content in Contentful
 */
export function getContentfulRedirectUrl({
  spaceId,
  environmentId = 'master',
  entryId,
  contentTypeId,
  mode = 'entry'
}: {
  spaceId: string;
  environmentId?: string;
  entryId?: string;
  contentTypeId?: string;
  mode?: 'entry' | 'content-type' | 'space';
}): string {
  // Base URL for Contentful web app
  const baseUrl = 'https://app.contentful.com';
  
  if (mode === 'entry' && entryId) {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
  } else if (mode === 'content-type' && contentTypeId) {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/content_types/${contentTypeId}`;
  } else if (mode === 'space') {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}`;
  }
  
  // Default fallback
  return `${baseUrl}/spaces/${spaceId}`;
}
