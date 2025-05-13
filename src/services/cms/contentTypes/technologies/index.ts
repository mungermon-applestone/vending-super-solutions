import { CMSTechnology } from '@/types/cms';
import { contentfulTechnologyAdapter } from '@/services/cms/adapters/technologies/contentfulTechnologyAdapter';
import { createReadOnlyAdapter } from '@/services/cms/utils/deprecation';
import { ContentTypeOperations } from '@/services/cms/contentTypes/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Read-only version of the technology adapter
 * This maintains read operations but prevents write operations as part of our migration to Contentful
 */
const baseAdapter = createReadOnlyAdapter<typeof contentfulTechnologyAdapter>(
  'technology',
  {
    getAll: contentfulTechnologyAdapter.getAll,
    getBySlug: contentfulTechnologyAdapter.getBySlug,
    getById: contentfulTechnologyAdapter.getById,
  },
  ['create', 'update', 'delete', 'clone']
);

// Create a fully compatible ContentTypeOperations instance
export const technologyOperations: ContentTypeOperations<CMSTechnology> = {
  // Map the standard methods from ContentTypeOperations interface
  fetchAll: baseAdapter.getAll,
  fetchBySlug: baseAdapter.getBySlug,
  fetchById: baseAdapter.getById,
  
  // Explicitly implement write operations that throw deprecation errors
  create: baseAdapter.create,
  update: baseAdapter.update,
  delete: baseAdapter.delete,
  clone: baseAdapter.clone || ((id) => {
    throw new Error(`Clone operation for technology with ID ${id} is not supported. Please use Contentful directly.`);
  }),
};

// Keep the original adapter methods as properties on the operations object for backward compatibility
// but don't explicitly declare them in the type signature
Object.assign(technologyOperations, baseAdapter);

// Export individual functions for backward compatibility
export const fetchTechnologies = technologyOperations.fetchAll;
export const fetchTechnologyBySlug = technologyOperations.fetchBySlug;
export const fetchTechnologyById = technologyOperations.fetchById;

// Mock implementations for write operations that will always fail with clear error messages
export const createTechnology = technologyOperations.create;
export const updateTechnology = technologyOperations.update;
export const deleteTechnology = technologyOperations.delete;

/**
 * Clone a technology - no longer supported
 * @deprecated This method is deprecated and will throw an error
 */
export const cloneTechnology = technologyOperations.clone;
