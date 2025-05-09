
import { CMSBusinessGoal, CMSFeature } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

/**
 * Implementation of the Business Goal Adapter for Supabase
 * Completely disabled when USE_SUPABASE_CMS is false
 */
export const supabaseBusinessGoalAdapter: BusinessGoalAdapter = {
  getAll: async (): Promise<CMSBusinessGoal[]> => {
    console.log('[supabaseBusinessGoalAdapter] Fetching all business goals');
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning empty array');
      return [];
    }
    
    // We won't actually import functions when CMS is disabled
    console.log('[supabaseBusinessGoalAdapter] Would fetch business goals from Supabase if CMS was enabled');
    return [];
  },
  
  getBySlug: async (slug: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[supabaseBusinessGoalAdapter] Fetching business goal with slug: ${slug}`);
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning null');
      return null;
    }
    
    console.log('[supabaseBusinessGoalAdapter] Would fetch business goal by slug from Supabase if CMS was enabled');
    return null;
  },
  
  getById: async (id: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[supabaseBusinessGoalAdapter] Fetching business goal with ID: ${id}`);
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning null');
      return null;
    }
    
    console.log('[supabaseBusinessGoalAdapter] Would fetch business goal by ID from Supabase if CMS was enabled');
    return null;
  },
  
  create: async (data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> => {
    console.log('[supabaseBusinessGoalAdapter] Creating new business goal:', data);
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning mock data');
      return {
        id: 'mock-id',
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        visible: data.visible || true,
        icon: data.icon || '',
        benefits: data.benefits || [],
        features: []
      };
    }
    
    console.log('[supabaseBusinessGoalAdapter] Would create business goal in Supabase if CMS was enabled');
    return {
      id: 'mock-id',
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      visible: data.visible || true,
      icon: data.icon || '',
      benefits: data.benefits || [],
      features: []
    };
  },
  
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> => {
    console.log(`[supabaseBusinessGoalAdapter] Updating business goal with ID: ${id}`, data);
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning mock data');
      return {
        id: id,
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        visible: data.visible || true,
        icon: data.icon || '',
        benefits: data.benefits || [],
        features: []
      };
    }
    
    console.log('[supabaseBusinessGoalAdapter] Would update business goal in Supabase if CMS was enabled');
    return {
      id: id,
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      visible: data.visible || true,
      icon: data.icon || '',
      benefits: data.benefits || [],
      features: []
    };
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabaseBusinessGoalAdapter] Deleting business goal with ID: ${id}`);
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning true');
      return true;
    }
    
    console.log('[supabaseBusinessGoalAdapter] Would delete business goal from Supabase if CMS was enabled');
    return true;
  },
  
  clone: async (id: string): Promise<CMSBusinessGoal> => {
    console.log(`[supabaseBusinessGoalAdapter] Cloning business goal with ID: ${id}`);
    
    if (!USE_SUPABASE_CMS) {
      console.log('[supabaseBusinessGoalAdapter] Supabase CMS is disabled, returning mock data');
      return {
        id: 'mock-id',
        title: 'Cloned Goal',
        slug: 'cloned-goal',
        description: '',
        visible: true,
        icon: '',
        benefits: [],
        features: []
      };
    }
    
    console.log('[supabaseBusinessGoalAdapter] Would clone business goal in Supabase if CMS was enabled');
    return {
      id: 'mock-id',
      title: 'Cloned Goal',
      slug: 'cloned-goal',
      description: '',
      visible: true,
      icon: '',
      benefits: [],
      features: []
    };
  }
};
