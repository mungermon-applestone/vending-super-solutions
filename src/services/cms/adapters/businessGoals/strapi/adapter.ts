
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from '../types';
import { CMSBusinessGoal } from '@/types/cms';
import { logDeprecation } from '@/services/cms/utils/deprecation';

/**
 * Adapter for Strapi-based business goals
 * This adapter is being deprecated in favor of Contentful
 */
export const strapiBusinessGoalAdapter: BusinessGoalAdapter = {
  /**
   * Get all business goals
   */
  getAll: async (options = {}): Promise<CMSBusinessGoal[]> => {
    logDeprecation(
      'strapiBusinessGoalAdapter.getAll',
      'Using deprecated Strapi adapter for business goals',
      'Use contentfulBusinessGoalAdapter instead'
    );
    
    console.log('[strapiBusinessGoalAdapter] getAll called with options:', options);
    
    // Return empty array - we're deprecating this adapter
    return [];
  },
  
  /**
   * Get a business goal by slug
   */
  getBySlug: async (slug: string): Promise<CMSBusinessGoal | null> => {
    logDeprecation(
      'strapiBusinessGoalAdapter.getBySlug',
      `Looking up business goal with slug: ${slug}`,
      'Use contentfulBusinessGoalAdapter instead'
    );
    
    console.log(`[strapiBusinessGoalAdapter] getBySlug called with slug: ${slug}`);
    
    // Return null - we're deprecating this adapter
    return null;
  },
  
  /**
   * Get a business goal by ID
   */
  getById: async (id: string): Promise<CMSBusinessGoal | null> => {
    logDeprecation(
      'strapiBusinessGoalAdapter.getById',
      `Looking up business goal with id: ${id}`,
      'Use contentfulBusinessGoalAdapter instead'
    );
    
    console.log(`[strapiBusinessGoalAdapter] getById called with id: ${id}`);
    
    // Return null - we're deprecating this adapter
    return null;
  },
  
  /**
   * Create a business goal
   */
  create: async (data: BusinessGoalCreateInput): Promise<CMSBusinessGoal> => {
    logDeprecation(
      'strapiBusinessGoalAdapter.create',
      'Attempting to create a business goal via deprecated Strapi adapter',
      'Use contentfulBusinessGoalAdapter instead'
    );
    
    console.error('[strapiBusinessGoalAdapter] create called but this method is deprecated');
    throw new Error('This method is deprecated. Please use contentfulBusinessGoalAdapter instead.');
  },
  
  /**
   * Update a business goal
   */
  update: async (id: string, data: BusinessGoalUpdateInput): Promise<CMSBusinessGoal> => {
    logDeprecation(
      'strapiBusinessGoalAdapter.update',
      `Attempting to update business goal with id: ${id}`,
      'Use contentfulBusinessGoalAdapter instead'
    );
    
    console.error('[strapiBusinessGoalAdapter] update called but this method is deprecated');
    throw new Error('This method is deprecated. Please use contentfulBusinessGoalAdapter instead.');
  },
  
  /**
   * Delete a business goal
   */
  delete: async (id: string): Promise<boolean> => {
    logDeprecation(
      'strapiBusinessGoalAdapter.delete',
      `Attempting to delete business goal with id: ${id}`,
      'Use contentfulBusinessGoalAdapter instead'
    );
    
    console.error('[strapiBusinessGoalAdapter] delete called but this method is deprecated');
    throw new Error('This method is deprecated. Please use contentfulBusinessGoalAdapter instead.');
  }
};
