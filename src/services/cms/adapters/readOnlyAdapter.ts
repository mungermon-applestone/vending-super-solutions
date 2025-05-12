
/**
 * Read-only adapter utilities for transitioning to Contentful
 * 
 * This module provides utilities to create read-only versions of CMS adapters,
 * which is part of our transition strategy to Contentful CMS.
 */

import { createReadOnlyAdapter, createDeprecatedWriteOperation } from '../utils/deprecation';
import { ContentTypeOperations } from '../contentTypes/types';

/**
 * Creates a read-only adapter that implements the ContentTypeOperations interface
 * 
 * @param adapterName The name of the adapter for logging and error messages
 * @param entityType The type of entity this adapter handles (e.g., 'product')
 * @param adapter The original adapter with read operations
 * @returns A ContentTypeOperations-compatible read-only adapter
 */
export function createReadOnlyContentTypeOperations<T>(
  adapterName: string,
  entityType: string,
  adapter: Record<string, any>
): ContentTypeOperations<T> {
  // Map adapter methods to ContentTypeOperations interface
  const operations: ContentTypeOperations<T> = {
    // Map read methods
    fetchAll: adapter.getAll || (async () => []),
    fetchBySlug: adapter.getBySlug || (async () => null),
    fetchById: adapter.getById || (async () => null),
    
    // Map write methods to deprecated versions
    create: createDeprecatedWriteOperation('create', entityType),
    update: createDeprecatedWriteOperation('update', entityType),
    delete: createDeprecatedWriteOperation('delete', entityType),
    clone: createDeprecatedWriteOperation('clone', entityType),
  };
  
  // For backward compatibility, also add the original adapter methods
  Object.assign(operations, adapter);
  
  return operations;
}

/**
 * Standard schema for CMS adapter methods to ensure consistent naming
 */
export const standardAdapterMethodNames = {
  read: ['getAll', 'getBySlug', 'getById'],
  write: ['create', 'update', 'delete', 'clone'],
  operations: ['fetchAll', 'fetchBySlug', 'fetchById', 'create', 'update', 'delete', 'clone']
};

// Re-export the createReadOnlyAdapter function from the deprecation module
export { createReadOnlyAdapter } from '../utils/deprecation';
