
/**
 * Factory for creating standardized read-only content type adapters
 * 
 * This provides a consistent way to create adapters for different content types
 * while ensuring they follow our deprecation strategy and migration to Contentful.
 */

import { ContentTypeOperations } from '../contentTypes/types';
import { createReadOnlyContentTypeOperations } from './readOnlyAdapter';
import { logDeprecation } from '../utils/deprecation';

/**
 * Options for creating a read-only content type adapter
 */
export interface ReadOnlyAdapterOptions {
  /**
   * The content type name (e.g., 'businessGoal', 'product')
   */
  contentType: string;
  
  /**
   * Human-readable entity type name for messages (e.g., 'business goal', 'product')
   */
  entityName: string;
  
  /**
   * The actual adapter with implementation of the read methods
   */
  adapter: Record<string, any>;
  
  /**
   * Optional adapter name for logging purposes
   */
  adapterName?: string;
}

/**
 * Creates a standardized read-only content type adapter
 * 
 * @param options Options for creating the adapter
 * @returns A ContentTypeOperations-compatible adapter
 */
export function createReadOnlyContentTypeAdapter<T>(
  options: ReadOnlyAdapterOptions
): ContentTypeOperations<T> {
  const { contentType, entityName, adapter, adapterName = 'contentful' } = options;
  
  // Log creation of this adapter
  logDeprecation(
    `ReadOnlyAdapter-${contentType}`,
    `Created read-only ${adapterName} adapter for ${entityName} content type`,
    'Use Contentful directly for content management'
  );
  
  // Filter down to just the read methods to ensure write methods are properly deprecated
  const readMethods = {
    getAll: adapter.getAll || (async () => []),
    getBySlug: adapter.getBySlug || (async () => null),
    getById: adapter.getById || (async () => null),
  };
  
  return createReadOnlyContentTypeOperations<T>(
    adapterName, 
    entityName, 
    readMethods
  );
}
