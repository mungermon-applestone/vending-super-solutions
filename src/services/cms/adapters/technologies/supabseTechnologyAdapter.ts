
import { CMSTechnology } from '@/types/cms';
import { TechnologyAdapter, TechnologyCreateInput, TechnologyUpdateInput } from './types';
import { cloneTechnology } from '../../contentTypes/technologies/cloneTechnology';

/**
 * Implementation of the Technology Adapter for Supabase
 */
export const supabseTechnologyAdapter: TechnologyAdapter = {
  getAll: async (): Promise<CMSTechnology[]> => {
    console.log('[supabseTechnologyAdapter] Fetching all technologies');
    
    // Use the existing technology service
    const { fetchTechnologies } = await import('../../contentTypes/technologies');
    return await fetchTechnologies();
  },
  
  getBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    console.log(`[supabseTechnologyAdapter] Fetching technology with slug: ${slug}`);
    
    // Use the existing technology service
    const { fetchTechnologyBySlug } = await import('../../contentTypes/technologies');
    return await fetchTechnologyBySlug(slug);
  },
  
  getById: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabseTechnologyAdapter] Fetching technology with ID: ${id}`);
    
    // Get all technologies and filter by ID
    const technologies = await this.getAll();
    return technologies.find(tech => tech.id === id) || null;
  },
  
  create: async (data: TechnologyCreateInput): Promise<CMSTechnology> => {
    console.log('[supabseTechnologyAdapter] Creating new technology:', data);
    
    // Use the existing technology service
    const { createTechnology } = await import('../../contentTypes/technologies');
    return await createTechnology(data);
  },
  
  update: async (id: string, data: TechnologyUpdateInput): Promise<CMSTechnology> => {
    console.log(`[supabseTechnologyAdapter] Updating technology with ID: ${id}`, data);
    
    // Use the existing technology service
    const { updateTechnology } = await import('../../contentTypes/technologies');
    return await updateTechnology(id, data);
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabseTechnologyAdapter] Deleting technology with ID: ${id}`);
    
    // First need to find the slug from the ID
    const tech = await this.getById(id);
    if (!tech) {
      throw new Error(`Technology with ID "${id}" not found`);
    }
    
    // Use the existing technology service
    const { deleteTechnology } = await import('../../contentTypes/technologies');
    return await deleteTechnology(tech.slug);
  },
  
  clone: async (id: string): Promise<CMSTechnology | null> => {
    console.log(`[supabseTechnologyAdapter] Cloning technology with ID: ${id}`);
    
    return await cloneTechnology(id);
  }
};
