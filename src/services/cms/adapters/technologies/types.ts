
import { CMSTechnology, QueryOptions } from '@/types/cms';

/**
 * Input for creating a new technology
 */
export interface TechnologyCreateInput {
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  image_alt?: string;
  visible?: boolean;
  sections?: {
    title: string;
    description?: string;
    type?: string;
    display_order?: number;
    features?: {
      title?: string;
      description?: string;
      icon?: string;
      display_order?: number;
      items?: string[];
    }[];
  }[];
}

/**
 * Input for updating an existing technology
 */
export interface TechnologyUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  visible?: boolean;
  sections?: {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    display_order?: number;
    features?: {
      id?: string;
      title?: string;
      description?: string;
      icon?: string;
      display_order?: number;
      items?: string[];
    }[];
  }[];
}

/**
 * Interface for technology adapter implementation
 */
export interface TechnologyAdapter {
  /**
   * Get all technologies
   */
  getAll(options?: QueryOptions): Promise<CMSTechnology[]>;
  
  /**
   * Get technology by slug
   */
  getBySlug(slug: string): Promise<CMSTechnology | null>;
  
  /**
   * Get technology by ID
   */
  getById(id: string): Promise<CMSTechnology | null>;
  
  /**
   * Create a new technology
   */
  create(data: TechnologyCreateInput): Promise<CMSTechnology>;
  
  /**
   * Update an existing technology
   */
  update(id: string, data: TechnologyUpdateInput): Promise<CMSTechnology>;
  
  /**
   * Delete a technology
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Clone a technology (optional)
   */
  clone?(id: string): Promise<CMSTechnology | null>;
}
