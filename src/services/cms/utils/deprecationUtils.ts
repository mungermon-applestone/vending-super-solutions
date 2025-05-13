
/**
 * Utility functions to help with deprecation tasks and tracking
 */

import { 
  logDeprecationWarning, 
  trackDeprecatedFeatureUsage, 
  getContentfulRedirectUrl
} from './deprecation';

/**
 * Log deprecation with standardized format
 * @param featureName The name of the deprecated feature
 * @param message Details about why it's deprecated
 * @param recommendation What to use instead
 */
export function logDeprecation(
  featureName: string,
  message: string,
  recommendation?: string
): void {
  // Track the usage for statistics
  trackDeprecatedFeatureUsage(featureName, message);
  
  // Log a warning with consistent formatting
  logDeprecationWarning(featureName, message, recommendation);
  
  // Log structured data for analytics
  console.debug('deprecation-event', {
    feature: featureName,
    message,
    recommendation,
    timestamp: new Date().toISOString(),
    type: 'DEPRECATION_LOG'
  });
}

/**
 * Get migration status for a component
 * @param componentName The name of the component
 */
export function getMigrationStatus(componentName: string): 'deprecated' | 'migrating' | 'migrated' {
  // This would normally check some configuration
  // For now we'll just mark everything as 'migrating' for consistency
  return 'migrating';
}

/**
 * Get a standardized message for a deprecated feature
 * @param entityType The type of entity (product, technology, etc)
 * @param operation The operation being performed
 */
export function getDeprecationMessage(entityType: string, operation: string): string {
  return `This ${entityType} ${operation} interface is deprecated and will be removed in July 2025. Please use Contentful for all content management.`;
}

/**
 * Generate interface recommendations based on content type
 * @param contentType The content type being used
 */
export function getInterfaceRecommendation(contentType: string): string {
  return `Use the Contentful web interface to manage ${contentType} content directly.`;
}

/**
 * Format dates for deprecation notices
 * @param date The date to format
 */
export function formatDeprecationDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Re-export getContentfulRedirectUrl for convenience
 */
export { getContentfulRedirectUrl };
