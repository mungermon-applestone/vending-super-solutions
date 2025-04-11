
import { ContentTypeOperations } from '../types';
import { CMSBusinessGoal, QueryOptions } from '@/types/cms';
import { fetchBusinessGoals } from './fetchBusinessGoals';
import { fetchBusinessGoalBySlug } from './fetchBusinessGoalBySlug';
import { createBusinessGoal } from './createBusinessGoal';
import { updateBusinessGoal } from './updateBusinessGoal';
import { deleteBusinessGoal } from './deleteBusinessGoal';

/**
 * Standardized API for business goal operations
 */
export const businessGoalOperations: ContentTypeOperations<CMSBusinessGoal> = {
  fetchAll: (options?: QueryOptions) => fetchBusinessGoals(),
  fetchBySlug: fetchBusinessGoalBySlug,
  fetchById: async (id: string) => {
    // For business goals, we'll implement a simple ID lookup
    const goals = await fetchBusinessGoals();
    return goals.find(goal => goal.id === id) || null;
  },
  create: async (data: any) => {
    // Since our existing implementation doesn't match the interface,
    // we'll provide an adapter here
    try {
      const { createBusinessGoal: externalCreate } = await import('@/services/businessGoal');
      const toast = { toast: () => {} }; // Mock toast object
      return await externalCreate(data, toast);
    } catch (error) {
      console.error('[BusinessGoal] Error in create:', error);
      return '';
    }
  },
  update: async (id: string, data: any) => {
    // Adapter for existing implementation
    try {
      const { updateBusinessGoal: externalUpdate } = await import('@/services/businessGoal');
      const toast = { toast: () => {} }; // Mock toast object
      await externalUpdate(data, id, toast);
      return true;
    } catch (error) {
      console.error('[BusinessGoal] Error in update:', error);
      return false;
    }
  },
  delete: async (id: string) => {
    // Adapter for existing implementation
    try {
      const { deleteBusinessGoal: externalDelete } = await import('@/services/businessGoal');
      return await externalDelete(id);
    } catch (error) {
      console.error('[BusinessGoal] Error in delete:', error);
      return false;
    }
  }
};

// Export individual operations for backward compatibility
export {
  fetchBusinessGoals,
  fetchBusinessGoalBySlug,
  createBusinessGoal,
  updateBusinessGoal,
  deleteBusinessGoal
};
