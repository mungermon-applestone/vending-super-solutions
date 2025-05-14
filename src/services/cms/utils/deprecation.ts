
import { toast } from 'sonner';

/**
 * Type for tracking deprecation statistics
 */
export interface DeprecationStat {
  component: string;
  count: number;
  lastUsed?: Date;
}

// Track deprecated features usage
const deprecatedUsage: Record<string, number> = {};

/**
 * Log a deprecation warning to the console
 */
export function logDeprecation(name: string, message: string = 'This feature is deprecated and will be removed in a future version.'): void {
  console.warn(`⚠️ DEPRECATION WARNING: ${name} is deprecated. ${message}`);
  trackDeprecatedUsage(name);
}

// Alias for backward compatibility
export const logDeprecationWarning = logDeprecation;

/**
 * Show a toast notification about deprecation
 */
export function showDeprecationToast(feature: string, alternative?: string): void {
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
export function trackDeprecatedUsage(feature: string): void {
  deprecatedUsage[feature] = (deprecatedUsage[feature] || 0) + 1;
}

/**
 * Get usage statistics for deprecated features
 */
export function getDeprecatedUsage(): Record<string, number> {
  return { ...deprecatedUsage };
}

/**
 * Transform usage data into DeprecationStat array
 */
export function getDeprecationStats(): DeprecationStat[] {
  return Object.entries(deprecatedUsage)
    .map(([component, count]) => ({
      component,
      count,
      lastUsed: new Date()
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Reset deprecation usage tracking
 */
export function resetDeprecationTracker(): void {
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
 * This overload accepts individual parameters
 */
export function getContentfulRedirectUrl(
  contentTypeId?: string,
  entryId?: string,
  spaceId?: string,
  environmentId: string = 'master'
): string;

/**
 * Get a redirect URL to view/edit content in Contentful
 * This overload accepts an object with all parameters
 */
export function getContentfulRedirectUrl(params: {
  spaceId: string;
  environmentId?: string;
  entryId?: string;
  contentTypeId?: string;
  mode?: 'entry' | 'content-type' | 'space';
}): string;

/**
 * Implementation of getContentfulRedirectUrl that handles both parameter patterns
 */
export function getContentfulRedirectUrl(
  contentTypeIdOrParams?: string | {
    spaceId: string;
    environmentId?: string;
    entryId?: string;
    contentTypeId?: string;
    mode?: 'entry' | 'content-type' | 'space';
  },
  entryId?: string,
  spaceId?: string,
  environmentId: string = 'master'
): string {
  // Base URL for Contentful web app
  const baseUrl = 'https://app.contentful.com';
  
  // Object parameter pattern
  if (typeof contentTypeIdOrParams === 'object' && contentTypeIdOrParams !== null) {
    const params = contentTypeIdOrParams;
    const mode = params.mode || (params.entryId ? 'entry' : params.contentTypeId ? 'content-type' : 'space');
    
    if (mode === 'entry' && params.entryId) {
      return `${baseUrl}/spaces/${params.spaceId}/environments/${params.environmentId || 'master'}/entries/${params.entryId}`;
    } else if (mode === 'content-type' && params.contentTypeId) {
      return `${baseUrl}/spaces/${params.spaceId}/environments/${params.environmentId || 'master'}/content_types/${params.contentTypeId}`;
    } else if (mode === 'space') {
      return `${baseUrl}/spaces/${params.spaceId}/environments/${params.environmentId || 'master'}`;
    }
    
    // Default fallback for object pattern
    return `${baseUrl}/spaces/${params.spaceId}`;
  }
  
  // Individual parameters pattern
  const contentTypeId = contentTypeIdOrParams as string;
  const actualSpaceId = spaceId || process.env.CONTENTFUL_SPACE_ID || import.meta.env?.VITE_CONTENTFUL_SPACE_ID;
  
  if (!actualSpaceId) {
    console.warn('[getContentfulRedirectUrl] No space ID provided or found in environment variables');
    return baseUrl;
  }
  
  if (entryId) {
    return `${baseUrl}/spaces/${actualSpaceId}/environments/${environmentId}/entries/${entryId}`;
  } else if (contentTypeId) {
    return `${baseUrl}/spaces/${actualSpaceId}/environments/${environmentId}/content_types/${contentTypeId}`;
  }
  
  // Default fallback for individual parameters pattern
  return `${baseUrl}/spaces/${actualSpaceId}/environments/${environmentId}`;
}

