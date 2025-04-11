
import { ContentTypeOperations } from '../types';
import { CMSBusinessGoal } from '@/types/cms';
import { fetchBusinessGoals } from './fetchBusinessGoals';
import { fetchBusinessGoalBySlug } from './fetchBusinessGoalBySlug';
import { createBusinessGoal } from './createBusinessGoal';
import { updateBusinessGoal } from './updateBusinessGoal';
import { deleteBusinessGoal } from './deleteBusinessGoal';

export const businessGoalOperations: ContentTypeOperations<CMSBusinessGoal> = {
  fetchAll: async () => {
    return await fetchBusinessGoals();
  },
  fetchBySlug: async (slug) => {
    return await fetchBusinessGoalBySlug(slug);
  },
  fetchById: async (id) => {
    // ID lookup by getting all goals and filtering by ID
    const allGoals = await fetchBusinessGoals();
    return allGoals.find(goal => goal.id === id) || null;
  },
  create: async (data) => {
    const id = await createBusinessGoal(data);
    // Return the newly created business goal by fetching it
    const goals = await fetchBusinessGoals();
    const newGoal = goals.find(goal => goal.id === id);
    if (!newGoal) {
      throw new Error('Failed to retrieve newly created business goal');
    }
    return newGoal;
  },
  update: async (id, data) => {
    const success = await updateBusinessGoal(id, data);
    if (!success) {
      throw new Error('Failed to update business goal');
    }
    
    // Return the updated business goal
    const updatedGoal = await businessGoalOperations.fetchById(id);
    if (!updatedGoal) {
      throw new Error('Failed to retrieve updated business goal');
    }
    return updatedGoal;
  },
  delete: async (id) => {
    return await deleteBusinessGoal(id);
  }
};

// Export individual operations for direct imports
export {
  fetchBusinessGoals,
  fetchBusinessGoalBySlug,
  createBusinessGoal,
  updateBusinessGoal,
  deleteBusinessGoal
};
