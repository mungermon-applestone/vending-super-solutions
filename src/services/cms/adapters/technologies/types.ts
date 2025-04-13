
import { CMSTechnology, QueryOptions } from '@/types/cms';

/**
 * Interface for technology adapter implementations
 */
export interface TechnologyAdapter {
  /**
   * Fetches all technologies
   */
  getAll: (options?: QueryOptions) => Promise<CMSTechnology[]>;
  
  /**
   * Fetches a technology by its slug
   */
  getBySlug: (slug: string) => Promise<CMSTechnology | null>;
  
  /**
   * Fetches a technology by its ID
   */
  getById: (id: string) => Promise<CMSTechnology | null>;
  
  /**
   * Creates a new technology
   */
  create: (technology: TechnologyCreateInput) => Promise<CMSTechnology>;
  
  /**
   * Updates an existing technology
   */
  update: (id: string, technology: TechnologyUpdateInput) => Promise<CMSTechnology>;
  
  /**
   * Deletes a technology
   */
  delete: (id: string) => Promise<boolean>;
  
  /**
   * Clones a technology (optional)
   */
  clone?: (id: string) => Promise<CMSTechnology | null>;
}

/**
 * Input data for creating a technology
 */
export interface TechnologyCreateInput {
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  visible?: boolean;
  sections?: any[];
}

/**
 * Input data for updating a technology
 */
export interface TechnologyUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  visible?: boolean;
  sections?: any[];
}
