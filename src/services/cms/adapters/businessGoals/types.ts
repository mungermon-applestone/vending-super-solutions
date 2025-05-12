
/**
 * Types for business goal adapters
 */

import { CMSBusinessGoal } from '@/types/cms';

/**
 * Input data for creating a business goal
 */
export interface BusinessGoalCreateInput {
  title: string;
  slug: string;
  description: string;
  icon?: string;
  benefits?: string[];
  visible?: boolean;
  image?: {
    url: string;
    alt: string;
  };
}

/**
 * Input data for updating a business goal
 */
export interface BusinessGoalUpdateInput extends Partial<BusinessGoalCreateInput> {
  id?: string;
}

/**
 * Interface for business goal adapter implementations
 */
export interface BusinessGoalAdapter {
  /**
   * Get all business goals
   */
  getAll: (options?: Record<string, any>) => Promise<CMSBusinessGoal[]>;
  
  /**
   * Get a business goal by slug
   */
  getBySlug: (slug: string) => Promise<CMSBusinessGoal | null>;
  
  /**
   * Get a business goal by ID
   */
  getById: (id: string) => Promise<CMSBusinessGoal | null>;
  
  /**
   * Create a business goal
   */
  create: (data: BusinessGoalCreateInput) => Promise<CMSBusinessGoal>;
  
  /**
   * Update a business goal
   */
  update: (id: string, data: BusinessGoalUpdateInput) => Promise<CMSBusinessGoal>;
  
  /**
   * Delete a business goal
   */
  delete: (id: string) => Promise<boolean>;
  
  /**
   * Clone a business goal
   */
  clone?: (id: string) => Promise<CMSBusinessGoal>;
}
