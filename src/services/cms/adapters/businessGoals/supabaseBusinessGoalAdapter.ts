
import { supabase } from '@/integrations/supabase/client';
import { CMSBusinessGoal } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { cloneBusinessGoal } from '../../contentTypes/businessGoals/cloneBusinessGoal';

/**
 * Implementation of the BusinessGoal Adapter for Supabase
 */
export const supabaseBusinessGoalAdapter: BusinessGoalAdapter = {
  getAll: async (): Promise<CMSBusinessGoal[]> => {
    console.log('[supabaseBusinessGoalAdapter] Fetching all business goals');
    
    // Use the existing business goals service
    const { fetchBusinessGoals } = await import('../../contentTypes/businessGoals');
    return await fetchBusinessGoals();
  },
  
  getBySlug: async (slug: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[supabaseBusinessGoalAdapter] Fetching business goal with slug: ${slug}`);
    
    // Use the existing business goal service
    const { fetchBusinessGoalBySlug } = await import('../../contentTypes/businessGoals');
    return await fetchBusinessGoalBySlug(slug);
  },
  
  getById: async (id: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[supabaseBusinessGoalAdapter] Fetching business goal with ID: ${id}`);
    
    try {
      // Query business goals by ID directly
      const { data: goal, error } = await supabase
        .from('business_goals')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('[supabaseBusinessGoalAdapter] Error fetching business goal by ID:', error);
        return null;
      }
      
      if (!goal) {
        return null;
      }
      
      // Transform to CMSBusinessGoal format
      return {
        id: goal.id,
        title: goal.title,
        slug: goal.slug,
        description: goal.description,
        image: {
          id: `img-${Math.random().toString(36).substr(2, 9)}`,
          url: goal.image_url || '',
          alt: goal.image_alt || ''
        },
        icon: goal.icon || '',
        visible: goal.visible,
        created_at: goal.created_at,
        updated_at: goal.updated_at,
        benefits: [], // These would need to be fetched separately
        features: [], // These would need to be fetched separately
        caseStudies: [] // These would need to be fetched separately
      };
    } catch (error) {
      console.error('[supabaseBusinessGoalAdapter] Error in getById:', error);
      return null;
    }
  },
  
  create: async (data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> => {
    console.log('[supabaseBusinessGoalAdapter] Creating new business goal:', data);
    
    // Use the existing business goal service
    const { createBusinessGoal } = await import('../../contentTypes/businessGoals');
    const id = await createBusinessGoal(data);
    
    // Get the newly created business goal
    const newGoal = await supabaseBusinessGoalAdapter.getById(id);
    if (!newGoal) {
      throw new Error('Failed to retrieve newly created business goal');
    }
    
    return newGoal;
  },
  
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> => {
    console.log(`[supabaseBusinessGoalAdapter] Updating business goal with ID: ${id}`, data);
    
    // Use the existing business goal service
    const { updateBusinessGoal } = await import('../../contentTypes/businessGoals');
    const success = await updateBusinessGoal(id, data);
    
    if (!success) {
      throw new Error('Failed to update business goal');
    }
    
    // Get the updated business goal
    const updatedGoal = await supabaseBusinessGoalAdapter.getById(id);
    if (!updatedGoal) {
      throw new Error('Failed to retrieve updated business goal');
    }
    
    return updatedGoal;
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabaseBusinessGoalAdapter] Deleting business goal with ID: ${id}`);
    
    // Use the existing business goal service
    const { deleteBusinessGoal } = await import('../../contentTypes/businessGoals');
    return await deleteBusinessGoal(id);
  },
  
  clone: async (id: string): Promise<CMSBusinessGoal | null> => {
    console.log(`[supabaseBusinessGoalAdapter] Cloning business goal with ID: ${id}`);
    
    return await cloneBusinessGoal(id);
  }
};
