
/**
 * Adapter Utility Functions
 * 
 * Utilities for working with CMS adapters, particularly for handling
 * the transition from direct database operations to Contentful.
 */

import { 
  trackDeprecatedUsage, 
  createDeprecatedWriteOperation 
} from './deprecation';
import type { ContentTypeOperations } from '../contentTypes/types';

/**
 * Creates a read-only version of any adapter by replacing write operations
 * with functions that throw errors
 * 
 * @param adapter The original adapter with read and write operations
 * @param entityType The type of entity this adapter handles (e.g., 'product', 'technology')
 * @returns A new adapter with read operations intact but write operations replaced
 */
export function makeAdapterReadOnly<T extends Record<string, any>>(
  adapter: T,
  entityType: string
): T {
  const readOnlyAdapter = { ...adapter } as T;
  
  // Define which methods are write operations that should be disabled
  const writeOperations = ['create', 'update', 'delete', 'clone', 'publish', 'unpublish'];
  
  // Replace all write operations with error-throwing functions
  for (const operation of writeOperations) {
    if (operation in adapter && typeof adapter[operation as keyof T] === 'function') {
      // Use type assertion to safely assign to the readOnlyAdapter
      Object.defineProperty(readOnlyAdapter, operation, {
        value: createDeprecatedWriteOperation(operation, entityType),
        configurable: true,
        enumerable: true
      });
    }
  }
  
  // Track each time the adapter is used
  trackDeprecatedUsage(`ReadOnlyAdapter-${entityType}`);
  
  return readOnlyAdapter;
}

/**
 * Makes any adapter follow the ContentTypeOperations interface naming convention
 * This helps bridge different naming conventions between adapters
 * 
 * @param adapter The original adapter
 * @param entityType The type of entity this adapter handles
 * @returns An adapter with both original methods and ContentTypeOperations-compatible methods
 */
export function makeContentTypeOperationsCompatible<T extends Record<string, any>, EntityType>(
  adapter: T,
  entityType: string
): T & ContentTypeOperations<EntityType> {
  // Create a new object that preserves the original adapter's prototype chain
  const compatibleAdapter = Object.create(
    Object.getPrototypeOf(adapter),
    Object.getOwnPropertyDescriptors(adapter)
  ) as T & ContentTypeOperations<EntityType>;
  
  // Map of adapter methods to ContentTypeOperations methods
  const methodMapping: Record<string, keyof ContentTypeOperations<any>> = {
    'getAll': 'fetchAll',
    'getBySlug': 'fetchBySlug',
    'getById': 'fetchById',
    'create': 'create',
    'update': 'update',
    'delete': 'delete',
    'clone': 'clone'
  };
  
  // Add compatible methods that delegate to the original methods
  for (const [adapterMethod, operationsMethod] of Object.entries(methodMapping)) {
    if (adapterMethod in adapter && typeof adapter[adapterMethod as keyof T] === 'function') {
      const originalMethod = adapter[adapterMethod as keyof T];
      if (typeof originalMethod === 'function') {
        // Safely assign methods to the compatible adapter
        (compatibleAdapter as any)[operationsMethod] = originalMethod.bind(adapter);
      }
    }
  }
  
  // Track usage of the compatibility layer
  trackDeprecatedUsage(`CompatibilityAdapter-${entityType}`);
  
  return compatibleAdapter;
}

/**
 * Creates an adapter that logs every method call
 * Useful for debugging and tracking adapter usage
 * 
 * @param adapter The original adapter
 * @param adapterName The name of the adapter (for logging)
 * @returns A proxy that logs all method calls
 */
export function createLoggingAdapter<T extends object>(
  adapter: T,
  adapterName: string
): T {
  return new Proxy(adapter, {
    get(target, prop: string) {
      const value = Reflect.get(target, prop);
      
      if (typeof value === 'function') {
        // Return a function that logs the call and then delegates to the original function
        return function(...args: any[]) {
          console.log(`[${adapterName}] Called ${String(prop)}`, args);
          return Reflect.apply(value, target, args);
        };
      }
      
      return value;
    }
  });
}
