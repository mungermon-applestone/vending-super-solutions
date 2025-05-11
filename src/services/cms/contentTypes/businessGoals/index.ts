
import { CMSBusinessGoal } from '@/types/cms';
import { contentfulBusinessGoalAdapter } from '@/services/cms/adapters/businessGoals/contentfulBusinessGoalAdapter';
import { createReadOnlyAdapter } from '@/services/cms/adapters/readOnlyAdapter';
import { v4 as uuidv4 } from 'uuid';

/**
 * Read-only version of the business goals adapter
 * This maintains read operations but prevents write operations as part of our migration to Contentful
 */
export const businessGoalOperations = createReadOnlyAdapter<typeof contentfulBusinessGoalAdapter>(
  'businessGoal',
  {
    getAll: contentfulBusinessGoalAdapter.getAll,
    getBySlug: contentfulBusinessGoalAdapter.getBySlug,
    getById: contentfulBusinessGoalAdapter.getById,
  },
  ['create', 'update', 'delete', 'clone']
);

// Export individual functions for backward compatibility
export const fetchBusinessGoals = businessGoalOperations.getAll;
export const fetchBusinessGoalBySlug = businessGoalOperations.getBySlug;
export const fetchBusinessGoalById = businessGoalOperations.getById;

// Mock implementations for write operations that will always fail with clear error messages
export const createBusinessGoal = businessGoalOperations.create;
export const updateBusinessGoal = businessGoalOperations.update;
export const deleteBusinessGoal = businessGoalOperations.delete;

/**
 * Clone a business goal - no longer supported
 * @deprecated This method is deprecated and will throw an error
 */
export const cloneBusinessGoal = businessGoalOperations.clone;
