
import { CMSTechnology, QueryOptions } from '@/types/cms';

/**
 * Interface for technology adapter implementations
 */
export interface TechnologyAdapter {
  /**
   * Fetches all technologies
   */
  getAllTechnologies: (options?: QueryOptions) => Promise<CMSTechnology[]>;
  
  /**
   * Fetches a technology by its slug
   */
  getTechnologyBySlug: (slug: string) => Promise<CMSTechnology | null>;
  
  /**
   * Creates a new technology
   */
  createTechnology: (technology: Partial<CMSTechnology>) => Promise<string>;
  
  /**
   * Updates an existing technology
   */
  updateTechnology: (id: string, technology: Partial<CMSTechnology>) => Promise<boolean>;
  
  /**
   * Deletes a technology
   */
  deleteTechnology: (id: string) => Promise<boolean>;
}
