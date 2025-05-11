
/**
 * Read-Only Adapter Factory
 *
 * This module provides utilities for creating read-only adapters by preserving
 * read operations and replacing write operations with functions that throw errors.
 */

import { createDeprecatedWriteOperation } from '../utils/deprecation';
import { trackDeprecatedUsage } from '../utils/deprecationLogger';

/**
 * Creates a read-only version of any adapter by preserving specified read operations
 * and disabling write operations.
 *
 * @param entityType The type of entity (e.g., 'product', 'businessGoal')
 * @param readOperations Object containing the read operations to preserve
 * @param disabledOperations Array of operation names that should throw errors when called
 * @returns A new adapter with read operations intact but write operations disabled
 */
export function createReadOnlyAdapter<T extends Record<string, any>>(
  entityType: string,
  readOperations: Record<string, Function>,
  disabledOperations: string[] = ['create', 'update', 'delete', 'clone']
): T {
  // Create a new adapter with the read operations
  const readOnlyAdapter = { ...readOperations } as unknown as T;

  // Add disabled operations that throw clear error messages
  for (const operation of disabledOperations) {
    Object.defineProperty(readOnlyAdapter, operation, {
      value: createDeprecatedWriteOperation(operation, entityType),
      configurable: true,
      enumerable: true
    });
  }

  // Track usage of the read-only adapter
  trackDeprecatedUsage(`ReadOnlyAdapter-${entityType}`);

  return readOnlyAdapter;
}

/**
 * Creates a logging wrapper around any adapter, useful for debugging
 * 
 * @param adapter The original adapter
 * @param adapterName Name to use in logs
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
        return function(...args: any[]) {
          console.log(`[${adapterName}] Called ${String(prop)}`, args);
          return Reflect.apply(value, target, args);
        };
      }
      
      return value;
    }
  });
}
