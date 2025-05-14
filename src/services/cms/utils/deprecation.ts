import { logDeprecationWarning } from './deprecationLogger';

/**
 * Log a deprecation warning once per key
 * Re-export for backward compatibility
 */
export { logDeprecationWarning } from './deprecationLogger';

/**
 * Log usage of deprecated code paths
 */
export function logDeprecation(key: string, message: string, recommendation?: string) {
  logDeprecationWarning(key, message, recommendation);
}

/**
 * Utility functions for deprecation warnings and backwards compatibility
 */

/**
 * Log a deprecation warning for CMS components
 * @param component The component or function name being deprecated
 * @param message The deprecation message
 * @param recommendation Alternative recommendation
 */
export function logDeprecation(component: string, message: string, recommendation?: string): void {
  const warningMessage = `[DEPRECATED] ${component}: ${message}` +
    (recommendation ? `\nRecommendation: ${recommendation}` : '');
  
  console.warn(warningMessage);
}

/**
 * Create a URL for viewing/editing content in Contentful
 */
export function getContentfulRedirectUrl(
  contentType?: string,
  entryId?: string,
  spaceId: string = import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  environmentId: string = import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'
): string {
  // Base Contentful web app URL
  const baseUrl = 'https://app.contentful.com';
  
  // If we don't have a space ID, return the Contentful login
  if (!spaceId) {
    return baseUrl;
  }
  
  // If we don't have a content type, just go to the space
  if (!contentType) {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}`;
  }
  
  // If we have an entry ID, go to that specific entry
  if (entryId) {
    return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;
  }
  
  // Otherwise, go to the content model for that content type
  return `${baseUrl}/spaces/${spaceId}/environments/${environmentId}/content_types/${contentType}`;
}

/**
 * Creates a read-only version of an adapter with deprecation warnings
 * @param contentType The content type name
 * @param readOperations The read operations to keep
 * @param disabledOperations The operations to disable
 * @returns A read-only adapter
 */
export function createReadOnlyAdapter<T extends Record<string, any>>(
  contentType: string,
  readOperations: Partial<T>,
  disabledOperations: string[]
): T {
  const adapter = { ...readOperations } as any;
  
  // Add stub implementations for disabled operations
  disabledOperations.forEach(op => {
    adapter[op] = (...args: any[]) => {
      const idArg = args[0] ? ` for ID ${args[0]}` : '';
      logDeprecation(
        `${contentType}.${op}()`,
        `Write operation "${op}"${idArg} is deprecated`,
        `Use Contentful directly for content management`
      );
      throw new Error(
        `Operation "${op}" for ${contentType} is no longer supported. Please use Contentful directly.`
      );
    };
  });
  
  return adapter as T;
}
