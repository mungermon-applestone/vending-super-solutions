/**
 * Adapter Compatibility Utilities
 *
 * Functions to help bridge different adapter interfaces and naming conventions.
 * This is particularly useful for the transition from different adapter types
 * to a standardized ContentTypeOperations interface.
 */

import { trackDeprecatedUsage } from './deprecationLogger';

/**
 * Makes any adapter follow the ContentTypeOperations interface naming convention
 * This helps bridge different naming conventions between adapters
 * 
 * @param adapter The original adapter
 * @param entityType The type of entity this adapter handles
 * @returns An adapter with both original methods and ContentTypeOperations-compatible methods
 */
export function makeContentTypeOperationsCompatible<T extends Record<string, any>>(
  adapter: T,
  entityType: string
): T & Record<string, any> {
  // Create a new object that preserves the original adapter's prototype chain
  const compatibleAdapter = Object.create(
    Object.getPrototypeOf(adapter),
    Object.getOwnPropertyDescriptors(adapter)
  );
  
  // Map of adapter methods to ContentTypeOperations methods
  const methodMapping: Record<string, string> = {
    'getAll': 'fetchAll',
    'getBySlug': 'fetchBySlug',
    'getById': 'fetchById'
  };
  
  // Add compatible methods that delegate to the original methods
  for (const [adapterMethod, operationsMethod] of Object.entries(methodMapping)) {
    if (adapterMethod in adapter && typeof adapter[adapterMethod as keyof T] === 'function') {
      const originalMethod = adapter[adapterMethod as keyof T];
      if (typeof originalMethod === 'function') {
        compatibleAdapter[operationsMethod] = originalMethod.bind(adapter);
      }
    }
  }
  
  // Track usage of the compatibility layer
  trackDeprecatedUsage(`CompatibilityAdapter-${entityType}`);
  
  return compatibleAdapter;
}

/**
 * Creates a standardized adapter interface from a variety of source adapters
 * 
 * @param options Configuration options including source adapters and entity type
 * @returns A standardized adapter that follows ContentTypeOperations conventions
 */
export function createStandardizedAdapter<T extends Record<string, any>>(
  options: {
    sourceAdapter: T,
    entityType: string,
    preserveSourceMethods?: boolean,
    methodMappings?: Record<string, string>
  }
): Record<string, any> {
  const { sourceAdapter, entityType, preserveSourceMethods = true, methodMappings = {} } = options;
  
  // Start with default mappings
  const defaultMappings = {
    'getAll': 'fetchAll',
    'getBySlug': 'fetchBySlug',
    'getById': 'fetchById',
    'create': 'createEntry',
    'update': 'updateEntry',
    'delete': 'deleteEntry'
  };
  
  // Merge with custom mappings
  const finalMappings = { ...defaultMappings, ...methodMappings };
  
  // Create the standardized adapter
  const standardAdapter: Record<string, any> = {};
  
  // Map methods from source to standardized names
  for (const [sourceName, standardName] of Object.entries(finalMappings)) {
    if (sourceName in sourceAdapter && typeof sourceAdapter[sourceName as keyof T] === 'function') {
      const originalMethod = sourceAdapter[sourceName as keyof T];
      if (typeof originalMethod === 'function') {
        standardAdapter[standardName] = originalMethod.bind(sourceAdapter);
        
        // If specified, also keep the original method name
        if (preserveSourceMethods) {
          standardAdapter[sourceName] = originalMethod.bind(sourceAdapter);
        }
      }
    }
  }
  
  // Track usage
  trackDeprecatedUsage(`StandardizedAdapter-${entityType}`);
  
  return standardAdapter;
}
