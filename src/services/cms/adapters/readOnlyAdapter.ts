
/**
 * Generic Read-Only Adapter
 * This adapter provides a consistent pattern for creating read-only versions
 * of content adapters as part of our deprecation strategy.
 */

import { logDeprecation, showDeprecationToast, createDeprecationError } from '../utils/deprecationUtils';

/**
 * Creates a function that logs deprecation and throws an error for write operations
 */
export function createDeprecatedWriteOperation<T extends (...args: any[]) => any>(
  operation: string,
  entityType: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    // Log the deprecation
    logDeprecation(
      `${entityType}.${operation}`, 
      `${operation} operation on ${entityType} is deprecated.`,
      `Use Contentful directly for ${entityType} management.`
    );
    
    // Show user-facing notification
    showDeprecationToast(`${entityType} ${operation}`);
    
    // Throw an error to prevent the operation
    throw createDeprecationError(operation, entityType);
  };
}

/**
 * Creates a function that wraps a read operation and logs deprecation
 */
export function createDeprecatedReadOperation<T extends (...args: any[]) => Promise<any>>(
  operation: string,
  entityType: string,
  implementation: T
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    // Log the deprecation but allow the operation
    logDeprecation(
      `${entityType}.${operation}`, 
      `${operation} operation on ${entityType} is deprecated, but still functional.`,
      `Consider using Contentful directly for future development.`
    );
    
    // Execute the actual implementation
    return await implementation(...args);
  };
}

/**
 * Creates a read-only version of any content adapter
 * This maintains read operations but replaces write operations with functions
 * that throw errors and log deprecation warnings.
 */
export function createReadOnlyAdapter<T extends Record<string, any>>(
  entityType: string,
  readImplementations: Partial<T>,
  writeOperations: string[]
): T {
  const adapter = {} as T;
  
  // Add all read implementations
  for (const [key, implementation] of Object.entries(readImplementations)) {
    if (typeof implementation === 'function') {
      adapter[key as keyof T] = createDeprecatedReadOperation(
        key, 
        entityType,
        implementation
      ) as T[keyof T];
    } else {
      adapter[key as keyof T] = implementation as T[keyof T];
    }
  }
  
  // Add write operations that throw errors
  for (const operation of writeOperations) {
    adapter[operation as keyof T] = createDeprecatedWriteOperation(
      operation,
      entityType
    ) as T[keyof T];
  }
  
  return adapter;
}
