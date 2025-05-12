
/**
 * Adapter Compatibility Utilities
 *
 * Functions to help bridge different adapter interfaces and naming conventions.
 * This is particularly useful for the transition from different adapter types
 * to a standardized ContentTypeOperations interface.
 */

import { trackDeprecatedUsage } from './deprecationLogger';
import { ContentTypeOperations } from '../contentTypes/types';
import { createDeprecatedWriteOperation } from './deprecation';

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
): ContentTypeOperations<EntityType> {
  // Create a new object with the ContentTypeOperations interface
  const compatibleAdapter: Partial<ContentTypeOperations<EntityType>> = {};
  
  // Map adapter methods to ContentTypeOperations methods
  if (typeof adapter.getAll === 'function') {
    compatibleAdapter.fetchAll = adapter.getAll.bind(adapter);
  }
  
  if (typeof adapter.getBySlug === 'function') {
    compatibleAdapter.fetchBySlug = adapter.getBySlug.bind(adapter);
  }
  
  if (typeof adapter.getById === 'function') {
    compatibleAdapter.fetchById = adapter.getById.bind(adapter);
  }
  
  // For write operations, check if they exist or create deprecated versions
  if (typeof adapter.create === 'function') {
    compatibleAdapter.create = adapter.create.bind(adapter);
  } else {
    compatibleAdapter.create = createDeprecatedWriteOperation('create', entityType);
  }
  
  if (typeof adapter.update === 'function') {
    compatibleAdapter.update = adapter.update.bind(adapter);
  } else {
    compatibleAdapter.update = createDeprecatedWriteOperation('update', entityType);
  }
  
  if (typeof adapter.delete === 'function') {
    compatibleAdapter.delete = adapter.delete.bind(adapter);
  } else {
    compatibleAdapter.delete = createDeprecatedWriteOperation('delete', entityType);
  }
  
  // Clone is optional in some interfaces
  if (typeof adapter.clone === 'function') {
    compatibleAdapter.clone = adapter.clone.bind(adapter);
  }
  
  // Add original methods for backward compatibility
  const result = {
    ...adapter,
    ...compatibleAdapter
  } as ContentTypeOperations<EntityType>;
  
  // Track usage of the compatibility layer
  trackDeprecatedUsage(`CompatibilityAdapter-${entityType}`);
  
  return result;
}

/**
 * Creates a standardized adapter interface from a variety of source adapters
 * 
 * @param options Configuration options including source adapters and entity type
 * @returns A standardized adapter that follows ContentTypeOperations conventions
 */
export function createStandardizedAdapter<T extends Record<string, any>, EntityType>(
  options: {
    sourceAdapter: T,
    entityType: string,
    preserveSourceMethods?: boolean,
    methodMappings?: Record<string, string>
  }
): ContentTypeOperations<EntityType> {
  const { sourceAdapter, entityType, preserveSourceMethods = true, methodMappings = {} } = options;
  
  // Start with default mappings
  const defaultMappings = {
    'getAll': 'fetchAll',
    'getBySlug': 'fetchBySlug',
    'getById': 'fetchById',
    'create': 'create',
    'update': 'update',
    'delete': 'delete'
  };
  
  // Merge with custom mappings
  const finalMappings = { ...defaultMappings, ...methodMappings };
  
  // Create the standardized adapter
  const standardAdapter: Partial<ContentTypeOperations<EntityType>> = {};
  
  // Map methods from source to standardized names
  for (const [sourceName, standardName] of Object.entries(finalMappings)) {
    if (sourceName in sourceAdapter && typeof sourceAdapter[sourceName] === 'function') {
      const originalMethod = sourceAdapter[sourceName];
      if (typeof originalMethod === 'function') {
        // Use type assertion to handle the dynamic property access
        (standardAdapter as any)[standardName] = originalMethod.bind(sourceAdapter);
      }
    }
  }
  
  // If required, add the source methods to preserve backward compatibility
  const result: ContentTypeOperations<EntityType> = preserveSourceMethods 
    ? { ...sourceAdapter, ...standardAdapter } as ContentTypeOperations<EntityType>
    : standardAdapter as ContentTypeOperations<EntityType>;
  
  // Track usage
  trackDeprecatedUsage(`StandardizedAdapter-${entityType}`);
  
  return result;
}
