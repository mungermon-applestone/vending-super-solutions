
import { ContentTypeOperations } from '../types';
import { CMSBusinessGoal } from '@/types/cms';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

// No-op implementations that return empty or mock data
export const fetchBusinessGoals = async (): Promise<CMSBusinessGoal[]> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[fetchBusinessGoals] Supabase CMS is disabled, returning empty array');
    return [];
  }
  return [];
};

export const fetchBusinessGoalBySlug = async (slug: string): Promise<CMSBusinessGoal | null> => {
  if (!USE_SUPABASE_CMS) {
    console.log(`[fetchBusinessGoalBySlug] Supabase CMS is disabled, returning null for slug: ${slug}`);
    return null;
  }
  return null;
};

export const createBusinessGoal = async (data: any): Promise<string> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[createBusinessGoal] Supabase CMS is disabled, returning mock ID');
    return 'mock-id-' + Date.now();
  }
  return 'mock-id-' + Date.now();
};

export const updateBusinessGoal = async (id: string, data: any): Promise<boolean> => {
  if (!USE_SUPABASE_CMS) {
    console.log(`[updateBusinessGoal] Supabase CMS is disabled, returning true for ID: ${id}`);
    return true;
  }
  return true;
};

export const deleteBusinessGoal = async (id: string): Promise<boolean> => {
  if (!USE_SUPABASE_CMS) {
    console.log(`[deleteBusinessGoal] Supabase CMS is disabled, returning true for ID: ${id}`);
    return true;
  }
  return true;
};

export const cloneBusinessGoal = async (id: string): Promise<CMSBusinessGoal> => {
  if (!USE_SUPABASE_CMS) {
    console.log(`[cloneBusinessGoal] Supabase CMS is disabled, returning mock data for ID: ${id}`);
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
  }
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
    if (!USE_SUPABASE_CMS) {
      console.log(`[businessGoalOperations.fetchById] Supabase CMS is disabled, returning null for ID: ${id}`);
      return null;
    }
    return null;
  },
  create: async (data) => {
    if (!USE_SUPABASE_CMS) {
      console.log('[businessGoalOperations.create] Supabase CMS is disabled, returning mock data');
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
    }
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
    if (!USE_SUPABASE_CMS) {
      console.log(`[businessGoalOperations.update] Supabase CMS is disabled, returning mock data for ID: ${id}`);
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
    }
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
