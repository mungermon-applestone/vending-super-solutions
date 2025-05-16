
import { CMSBusinessGoal } from '@/types/cms';
import { contentfulBusinessGoalAdapter } from '@/services/cms/adapters/businessGoals/contentfulBusinessGoalAdapter';
import { createReadOnlyContentTypeOperations } from '@/services/cms/utils/deprecation';
import { ContentTypeOperations } from '@/services/cms/contentTypes/types';

/**
 * Read-only version of the business goals adapter
 * This maintains read operations but prevents write operations as part of our migration to Contentful
 */
const baseAdapter = {
  getAll: contentfulBusinessGoalAdapter.getAll,
  getBySlug: contentfulBusinessGoalAdapter.getBySlug,
  getById: contentfulBusinessGoalAdapter.getById,
};

// Create a fully compatible ContentTypeOperations instance
export const businessGoalOperations: ContentTypeOperations<CMSBusinessGoal> = createReadOnlyContentTypeOperations<CMSBusinessGoal>(
  'businessGoal',
  'business goal',
  baseAdapter
);

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
