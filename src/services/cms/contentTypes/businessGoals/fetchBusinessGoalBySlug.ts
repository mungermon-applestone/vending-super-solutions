
import { CMSBusinessGoal } from '@/types/cms';
import { businessGoalOperations } from './index';

/**
 * @deprecated Direct use of this function is deprecated. 
 * Use businessGoalOperations.fetchBySlug instead
 * 
 * This file serves as a compatibility layer for existing code that imports
 * fetchBusinessGoalBySlug from this location
 */
export const fetchBusinessGoalBySlug = async (slug: string): Promise<CMSBusinessGoal | null> => {
  console.warn(
    "⚠️ DEPRECATED: Direct import of fetchBusinessGoalBySlug is deprecated. " +
    "Please use businessGoalOperations.fetchBySlug instead."
  );
  return await businessGoalOperations.fetchBySlug(slug);
};

/**
 * @deprecated Direct use of this function is deprecated.
 * Use businessGoalOperations.fetchAll instead
 */
export const fetchBusinessGoals = async (options?: any): Promise<CMSBusinessGoal[]> => {
  console.warn(
    "⚠️ DEPRECATED: Direct import of fetchBusinessGoals is deprecated. " +
    "Please use businessGoalOperations.fetchAll instead."
  );
  return await businessGoalOperations.fetchAll(options);
};

export default fetchBusinessGoalBySlug;
