
import { CMSBusinessGoal } from '@/types/cms';
import { fetchBusinessGoals, fetchBusinessGoalBySlug } from './fetchBusinessGoals';
import { cloneBusinessGoal } from './cloneBusinessGoal';

// Mock create function
const createBusinessGoal = async (data: Partial<CMSBusinessGoal>): Promise<CMSBusinessGoal> => {
  console.log('[createBusinessGoal] Creating new business goal:', data);
  return {
    id: `mock-${Date.now()}`,
    title: data.title || 'New Business Goal',
    slug: data.slug || 'new-business-goal',
    description: data.description || '',
    icon: data.icon || 'activity',
    features: data.features || [],
    benefits: data.benefits || []
  };
};

// Mock update function
const updateBusinessGoal = async (id: string, data: Partial<CMSBusinessGoal>): Promise<CMSBusinessGoal> => {
  console.log('[updateBusinessGoal] Updating business goal:', id, data);
  return {
    id: id,
    title: data.title || 'Updated Business Goal',
    slug: data.slug || 'updated-business-goal',
    description: data.description || '',
    icon: data.icon || 'activity',
    features: data.features || [],
    benefits: data.benefits || []
  };
};

// Mock delete function
const deleteBusinessGoal = async (id: string): Promise<boolean> => {
  console.log('[deleteBusinessGoal] Deleting business goal:', id);
  return true;
};

// Export all business goal operations
export const businessGoalOperations = {
  fetchAll: fetchBusinessGoals,
  fetchBySlug: fetchBusinessGoalBySlug,
  create: createBusinessGoal,
  update: updateBusinessGoal,
  delete: deleteBusinessGoal,
  clone: cloneBusinessGoal
};

// Re-export individual functions for backwards compatibility
export {
  fetchBusinessGoals,
  fetchBusinessGoalBySlug,
  createBusinessGoal,
  updateBusinessGoal,
  deleteBusinessGoal,
  cloneBusinessGoal
};
