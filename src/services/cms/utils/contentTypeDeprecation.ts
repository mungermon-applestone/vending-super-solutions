
import { toast } from 'sonner';
import { logDeprecation } from './deprecation';
import { showRedirectToContentfulNotice } from './deprecationNotices';
import { getContentfulRedirectUrl } from './deprecation';
import { MESSAGES } from './deprecationConstants';

/**
 * Creates a deprecated write operation function that logs the deprecation
 * and returns an error stating the operation should be performed in Contentful
 * 
 * @param operationType Type of operation (create, update, delete)
 * @param entityName Human-readable entity name
 * @returns A function that throws an error with a clear message
 */
export function createDeprecatedWriteOperation(operationType: string, entityName: string) {
  return async (...args: any[]) => {
    const operationName = `${operationType}${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`;
    
    // Log the attempted operation
    logDeprecation(
      operationName,
      `Attempted to ${operationType} ${entityName} but operation is deprecated`
    );
    
    // Show a toast notification
    showRedirectToContentfulNotice(entityName);
    
    // Throw an error with clear guidance
    throw new Error(
      `${operationType.charAt(0).toUpperCase() + operationType.slice(1)} operations for ${entityName} have been moved to Contentful. ${MESSAGES.USE_CONTENTFUL_INSTEAD}`
    );
  };
}

/**
 * Creates a read-only wrapper for content type operations
 * 
 * @param contentType Content type identifier
 * @param entityName Human-readable entity name
 * @param operations Object containing read operations
 * @returns Object with both read operations and deprecated write operations
 */
export function createReadOnlyContentType<T>(
  contentType: string,
  entityName: string,
  operations: Record<string, Function>
) {
  // Create deprecated write operations
  const deprecatedOperations = {
    create: createDeprecatedWriteOperation('create', entityName),
    update: createDeprecatedWriteOperation('update', entityName),
    delete: createDeprecatedWriteOperation('delete', entityName),
    clone: createDeprecatedWriteOperation('clone', entityName),
  };
  
  // Wrap read operations to track usage
  const wrappedReadOperations = Object.entries(operations).reduce(
    (acc, [key, operation]) => {
      acc[key] = async (...args: any[]) => {
        // Log read operation for tracking
        logDeprecation(
          `${contentType}:${key}`,
          `Read operation ${key} performed on ${entityName}`
        );
        
        // Execute the actual read operation
        return operation(...args);
      };
      return acc;
    },
    {} as Record<string, Function>
  );
  
  // Combine read and deprecated write operations
  return {
    ...wrappedReadOperations,
    ...deprecatedOperations,
    
    // Add helper method for redirecting to Contentful
    getContentfulUrl: (id?: string) => getContentfulRedirectUrl(contentType, id),
  };
}
