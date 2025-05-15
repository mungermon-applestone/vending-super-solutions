
import { CMSBusinessGoal } from '@/types/cms';

/**
 * Input data structure for creating a new business goal
 */
export interface BusinessGoalCreateInput {
  title: string;
  slug: string;
  description: string;
  visible: boolean;
  icon?: string;
  image?: {
    url: string;
    alt: string;
  };
  benefits?: string[];
  features?: {
    title: string;
    description: string;
    icon?: string;
    screenshot?: {
      url: string;
      alt: string;
    };
    display_order?: number;
  }[];
}

/**
 * Input data structure for updating an existing business goal
 */
export interface BusinessGoalUpdateInput extends BusinessGoalCreateInput {
  // We may need additional fields specific to updates in the future
  originalSlug?: string;
}

/**
 * Business Goal Adapter interface that both Supabase and Strapi implementations must follow
 */
export interface BusinessGoalAdapter {
  /**
   * Fetch all business goals
   */
  getAll: (filters?: Record<string, any>) => Promise<CMSBusinessGoal[]>;
  
  /**
   * Fetch a business goal by slug
   */
  getBySlug: (slug: string) => Promise<CMSBusinessGoal | null>;
  
  /**
   * Fetch a business goal by ID
   */
  getById: (id: string) => Promise<CMSBusinessGoal | null>;
  
  /**
   * Create a new business goal
   */
  create: (data: BusinessGoalCreateInput) => Promise<CMSBusinessGoal>;
  
  /**
   * Update an existing business goal
   */
  update: (id: string, data: BusinessGoalUpdateInput) => Promise<CMSBusinessGoal>;
  
  /**
   * Delete a business goal by ID
   */
  delete: (id: string) => Promise<boolean>;
  
  /**
   * Clone an existing business goal
   */
  clone?: (id: string) => Promise<CMSBusinessGoal | null>;
}
