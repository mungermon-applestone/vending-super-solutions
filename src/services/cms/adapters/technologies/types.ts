
import { CMSTechnology } from '@/types/cms';

/**
 * Input data structure for creating a new technology
 */
export interface TechnologyCreateInput {
  title: string;
  slug: string;
  description: string;
  visible: boolean;
  image?: {
    url: string;
    alt: string;
  };
  sections?: {
    title: string;
    description?: string;
    type: string;
    features?: {
      title?: string;
      description?: string;
      icon?: string;
      items?: string[];
    }[];
  }[];
}

/**
 * Input data structure for updating an existing technology
 */
export interface TechnologyUpdateInput extends TechnologyCreateInput {
  // We may need additional fields specific to updates in the future
  originalSlug?: string;
}

/**
 * Technology Adapter interface that both Supabase and Strapi implementations must follow
 */
export interface TechnologyAdapter {
  /**
   * Fetch all technologies
   */
  getAll: (filters?: Record<string, any>) => Promise<CMSTechnology[]>;
  
  /**
   * Fetch a technology by slug
   */
  getBySlug: (slug: string) => Promise<CMSTechnology | null>;
  
  /**
   * Fetch a technology by ID
   */
  getById: (id: string) => Promise<CMSTechnology | null>;
  
  /**
   * Create a new technology
   */
  create: (data: TechnologyCreateInput) => Promise<CMSTechnology>;
  
  /**
   * Update an existing technology
   */
  update: (id: string, data: TechnologyUpdateInput) => Promise<CMSTechnology>;
  
  /**
   * Delete a technology by ID
   */
  delete: (id: string) => Promise<boolean>;
  
  /**
   * Clone an existing technology
   */
  clone: (id: string) => Promise<CMSTechnology | null>;
}
