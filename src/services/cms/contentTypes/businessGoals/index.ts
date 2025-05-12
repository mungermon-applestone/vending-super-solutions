import { CMSBusinessGoal } from '@/types/cms';
import { contentfulBusinessGoalAdapter } from '@/services/cms/adapters/businessGoals/contentfulBusinessGoalAdapter';
import { createReadOnlyAdapter } from '@/services/cms/adapters/readOnlyAdapter';
import { ContentTypeOperations } from '@/services/cms/contentTypes/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Read-only version of the business goals adapter
 * This maintains read operations but prevents write operations as part of our migration to Contentful
 */
const baseAdapter = createReadOnlyAdapter<typeof contentfulBusinessGoalAdapter>(
  'businessGoal',
  {
    getAll: contentfulBusinessGoalAdapter.getAll,
    getBySlug: contentfulBusinessGoalAdapter.getBySlug,
    getById: contentfulBusinessGoalAdapter.getById,
  },
  ['create', 'update', 'delete', 'clone']
);

// Create a fully compatible ContentTypeOperations instance
export const businessGoalOperations: ContentTypeOperations<CMSBusinessGoal> = {
  // Map the standard methods from ContentTypeOperations interface
  fetchAll: baseAdapter.getAll,
  fetchBySlug: baseAdapter.getBySlug,
  fetchById: baseAdapter.getById,
  
  // Explicitly implement write operations that throw deprecation errors
  create: baseAdapter.create,
  update: baseAdapter.update,
  delete: baseAdapter.delete,
  clone: baseAdapter.clone || ((id) => {
    throw new Error(`Clone operation for businessGoal with ID ${id} is not supported. Please use Contentful directly.`);
  }),
};

// Keep the original adapter methods as properties on the operations object for backward compatibility
// but don't explicitly declare them in the type signature
Object.assign(businessGoalOperations, baseAdapter);

// Export individual functions for backward compatibility
export const fetchBusinessGoals = businessGoalOperations.fetchAll;
export const fetchBusinessGoalBySlug = businessGoalOperations.fetchBySlug;
export const fetchBusinessGoalById = businessGoalOperations.fetchById;

// Mock implementations for write operations that will always fail with clear error messages
export const createBusinessGoal = businessGoalOperations.create;
export const updateBusinessGoal = businessGoalOperations.update;
export const deleteBusinessGoal = businessGoalOperations.delete;

/**
 * Clone a business goal - no longer supported
 * @deprecated This method is deprecated and will throw an error
 */
export const cloneBusinessGoal = businessGoalOperations.clone;
