
/**
 * Adapter Compatibility Utilities
 * 
 * This module provides tools to make different adapter interfaces compatible with each other.
 * It's part of our deprecation strategy to maintain backward compatibility while
 * we transition to Contentful and standardize interfaces.
 */

import { ContentTypeOperations } from '../contentTypes/types';
import { logDeprecation } from './deprecationUtils';

/**
 * Type to ensure adapter has the necessary methods
 */
interface GetMethods {
  getAll?: (...args: any[]) => Promise<any>;
  getBySlug?: (...args: any[]) => Promise<any>;
  getById?: (...args: any[]) => Promise<any>;
}

/**
 * Makes any adapter with getAll/getBySlug/getById methods compatible with
 * the ContentTypeOperations interface by adding fetchAll/fetchBySlug/fetchById methods
 * that delegate to the original methods.
 * 
 * @param adapter The original adapter with get* methods
 * @param entityType The name of the entity type (for logging)
 * @returns The adapter enhanced with fetch* methods
 */
export function makeContentTypeOperationsCompatible<T extends GetMethods>(
  adapter: T,
  entityType: string
): T & ContentTypeOperations<any> {
  const enhancedAdapter = { ...adapter } as T & ContentTypeOperations<any>;
  
  // Only add compatibility methods if they don't already exist
  if (!enhancedAdapter.fetchAll && enhancedAdapter.getAll) {
    enhancedAdapter.fetchAll = async (...args: any[]) => {
      logDeprecation(
        `${entityType}.fetchAll`, 
        `fetchAll is a compatibility method. Consider using ${entityType}.getAll directly.`,
        `Use Contentful API directly for ${entityType} retrieval in new code.`
      );
      return enhancedAdapter.getAll!(...args);
    };
  }

  if (!enhancedAdapter.fetchBySlug && enhancedAdapter.getBySlug) {
    enhancedAdapter.fetchBySlug = async (...args: any[]) => {
      logDeprecation(
        `${entityType}.fetchBySlug`, 
        `fetchBySlug is a compatibility method. Consider using ${entityType}.getBySlug directly.`,
        `Use Contentful API directly for ${entityType} retrieval in new code.`
      );
      return enhancedAdapter.getBySlug!(...args);
    };
  }

  if (!enhancedAdapter.fetchById && enhancedAdapter.getById) {
    enhancedAdapter.fetchById = async (...args: any[]) => {
      logDeprecation(
        `${entityType}.fetchById`, 
        `fetchById is a compatibility method. Consider using ${entityType}.getById directly.`,
        `Use Contentful API directly for ${entityType} retrieval in new code.`
      );
      return enhancedAdapter.getById!(...args);
    };
  }

  return enhancedAdapter;
}

/**
 * Registers an adapter with the ContentTypeOperations factory, ensuring compatibility
 * by adding any missing methods needed by the ContentTypeOperations interface.
 * 
 * @param factory The factory to register with
 * @param contentType The content type identifier
 * @param adapter The adapter to register
 */
export function registerCompatibleAdapter(
  factory: any,
  contentType: string,
  adapter: Record<string, any>
): void {
  const compatibleAdapter = makeContentTypeOperationsCompatible(adapter, contentType);
  factory.registerOperations(contentType, compatibleAdapter);
}
