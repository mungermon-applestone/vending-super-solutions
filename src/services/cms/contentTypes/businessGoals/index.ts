
import { ContentTypeOperations } from '../types';
import { CMSBusinessGoal } from '@/types/cms';

// No-op implementations that return empty or mock data
export const fetchBusinessGoals = async (): Promise<CMSBusinessGoal[]> => {
  console.log('[fetchBusinessGoals] Returning empty array');
  return [];
};

export const fetchBusinessGoalBySlug = async (slug: string): Promise<CMSBusinessGoal | null> => {
  console.log(`[fetchBusinessGoalBySlug] Returning null for slug: ${slug}`);
  return null;
};

export const createBusinessGoal = async (data: any): Promise<string> => {
  console.log('[createBusinessGoal] Returning mock ID');
  return 'mock-id-' + Date.now();
};

export const updateBusinessGoal = async (id: string, data: any): Promise<boolean> => {
  console.log(`[updateBusinessGoal] Returning true for ID: ${id}`);
  return true;
};

export const deleteBusinessGoal = async (id: string): Promise<boolean> => {
  console.log(`[deleteBusinessGoal] Returning true for ID: ${id}`);
  return true;
};

export const cloneBusinessGoal = async (id: string): Promise<CMSBusinessGoal> => {
  console.log(`[cloneBusinessGoal] Returning mock data for ID: ${id}`);
  return {
    id: 'cloned-' + id,
    title: 'Cloned Goal',
    slug: 'cloned-goal-' + Date.now(),
    description: '',
    visible: true,
    icon: '',
    benefits: [],
    features: []
  };
};

export const businessGoalOperations: ContentTypeOperations<CMSBusinessGoal> = {
  fetchAll: fetchBusinessGoals,
  fetchBySlug: fetchBusinessGoalBySlug,
  fetchById: async (id) => {
    console.log(`[businessGoalOperations.fetchById] Returning null for ID: ${id}`);
    return null;
  },
  create: async (data) => {
    console.log('[businessGoalOperations.create] Returning mock data');
    return {
      id: 'mock-id-' + Date.now(),
      title: data.title,
      slug: data.slug || '',
      description: data.description || '',
      visible: data.visible || true,
      icon: data.icon || '',
      benefits: data.benefits || [],
      features: []
    };
  },
  update: async (id, data) => {
    console.log(`[businessGoalOperations.update] Returning mock data for ID: ${id}`);
    return {
      id: id,
      title: data.title,
      slug: data.slug || '',
      description: data.description || '',
      visible: data.visible || true,
      icon: data.icon || '',
      benefits: data.benefits || [],
      features: []
    };
  },
  delete: deleteBusinessGoal,
  clone: cloneBusinessGoal
};
