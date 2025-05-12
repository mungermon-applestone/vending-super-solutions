
import { logDeprecationWarning, showDeprecationToast, throwDeprecatedOperationError } from '@/services/cms/utils/deprecation';
import { ContentTypeOperations } from '@/services/cms/contentTypes/types';

/**
 * Create a read-only version of content type operations
 * This maintains read operations but prevents write operations as part of our migration to Contentful
 */
export function createReadOnlyContentTypeOperations<T>(
  contentType: string,
  contentTypeName: string,
  readAdapter: any
): ContentTypeOperations<T> {
  // Create base operations object with read operations
  const operations: ContentTypeOperations<T> = {
    fetchAll: async (options?: any) => {
      try {
        return await readAdapter.getAll(options);
      } catch (error) {
        console.error(`[${contentType}Operations] Error fetching all:`, error);
        throw error;
      }
    },
    
    fetchBySlug: async (slug: string, options?: any) => {
      try {
        return await readAdapter.getBySlug(slug, options);
      } catch (error) {
        console.error(`[${contentType}Operations] Error fetching by slug:`, error);
        throw error;
      }
    },
    
    fetchById: async (id: string, options?: any) => {
      try {
        return await readAdapter.getById(id, options);
      } catch (error) {
        console.error(`[${contentType}Operations] Error fetching by ID:`, error);
        throw error;
      }
    },
    
    // Write operations that will show deprecation warnings and throw errors
    create: async (data: any) => {
      showDeprecationToast(
        `${contentTypeName} Creation Disabled`,
        `Creating ${contentTypeName.toLowerCase()}s is not supported in this interface. Please use Contentful.`
      );
      throwDeprecatedOperationError('create', contentType);
      return null as any;
    },
    
    update: async (id: string, data: any) => {
      showDeprecationToast(
        `${contentTypeName} Updates Disabled`,
        `Updating ${contentTypeName.toLowerCase()}s is not supported in this interface. Please use Contentful.`
      );
      throwDeprecatedOperationError('update', contentType);
      return null as any;
    },
    
    delete: async (id: string) => {
      showDeprecationToast(
        `${contentTypeName} Deletion Disabled`,
        `Deleting ${contentTypeName.toLowerCase()}s is not supported in this interface. Please use Contentful.`
      );
      throwDeprecatedOperationError('delete', contentType);
      return false;
    },
    
    clone: async (id: string, newData?: any) => {
      showDeprecationToast(
        `${contentTypeName} Cloning Disabled`,
        `Cloning ${contentTypeName.toLowerCase()}s is not supported in this interface. Please use Contentful.`
      );
      throwDeprecatedOperationError('clone', contentType);
      return null as any;
    }
  };
  
  return operations;
}

// Re-export for backward compatibility
export const createReadOnlyAdapter = createReadOnlyContentTypeOperations;
