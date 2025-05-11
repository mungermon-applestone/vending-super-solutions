
/**
 * Centralized deprecation utilities
 * This file consolidates various deprecation-related functions into a single module
 */

import { toast } from '@/hooks/use-toast'; 
import { trackDeprecatedUsage } from './deprecationUsageTracker';

/**
 * Log a deprecation warning with consistent formatting
 */
export function logDeprecation(feature: string, message: string, alternative?: string): void {
  // Get caller information for better tracking
  const stack = new Error().stack || '';
  const callerLine = stack.split('\n')[2] || '';
  const callerMatch = callerLine.match(/at\s+(.+)\s+\((.+)\)/);
  const callerInfo = callerMatch ? callerMatch[2] : 'unknown';
  
  // Track this usage
  trackDeprecatedUsage(feature, callerInfo);
  
  // Construct the message
  const baseMessage = `⚠️ DEPRECATED: ${message}`;
  const altMessage = alternative ? `\n👉 RECOMMENDED: ${alternative}` : '';
  
  // Log to console
  console.warn(`${baseMessage}${altMessage}`);
}

/**
 * Show a toast notification for deprecated features
 */
export function showDeprecationToast(
  feature: string, 
  message?: string, 
  alternativePath?: string
): void {
  // Log to tracking system
  trackDeprecatedUsage(feature);
  
  // Default message if none provided
  const toastMessage = message || `This ${feature} functionality has been deprecated.`;
  const description = alternativePath 
    ? `${toastMessage} Please use Contentful for content management.` 
    : toastMessage;
  
  // Show toast notification
  toast({
    title: "Deprecated Feature",
    description,
    variant: "destructive",
  });
}

/**
 * Create a standard error for deprecated operations
 */
export function createDeprecationError(
  operation: string,
  entityType: string
): Error {
  return new Error(
    `${entityType} ${operation} is disabled. Please use Contentful directly.`
  );
}

/**
 * Get a URL to the corresponding Contentful resource
 */
export function getContentfulRedirectUrl(
  contentType: string,
  entityId?: string,
  spaceId: string = process.env.CONTENTFUL_SPACE_ID || '',
  environmentId: string = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master'
): string {
  let url = "https://app.contentful.com/";
  
  if (spaceId) {
    url += `spaces/${spaceId}/`;
    
    if (environmentId) {
      url += `environments/${environmentId}/`;
    }
    
    if (entityId) {
      url += `entries/${entityId}`;
    } else if (contentType) {
      url += `entries?contentTypeId=${contentType}`;
    } else {
      url += 'entries/';
    }
  }
  
  return url;
}
