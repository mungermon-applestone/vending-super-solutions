
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { getCMSProviderConfig } from '../../providerConfig';
import { getTechnologyAdapter } from '../../adapters/technologies/technologyAdapterFactory';
import { ContentTypeOperations } from '../types';

// Export technology operations object implementing ContentTypeOperations interface
export const technologyOperations: ContentTypeOperations<CMSTechnology> = {
  fetchAll: async (options?: QueryOptions): Promise<CMSTechnology[]> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return adapter.getAll(options);
  },
  
  fetchBySlug: async (slug: string): Promise<CMSTechnology | null> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return adapter.getBySlug(slug);
  },
  
  fetchById: async (id: string): Promise<CMSTechnology | null> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return adapter.getById(id);
  },
  
  create: async (data: any): Promise<CMSTechnology> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return adapter.create(data);
  },
  
  update: async (id: string, data: any): Promise<CMSTechnology> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return adapter.update(id, data);
  },
  
  delete: async (id: string): Promise<boolean> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    return adapter.delete(id);
  },
  
  clone: async (id: string): Promise<CMSTechnology> => {
    const adapter = getTechnologyAdapter(getCMSProviderConfig());
    const result = await adapter.clone?.(id);
    if (!result) {
      throw new Error(`Failed to clone technology with ID: ${id}`);
    }
    return result;
  }
};

// Re-export individual technology operations
export { fetchTechnologies } from './fetchTechnologies';
export { fetchTechnologyBySlug } from './fetchTechnologyBySlug';
export { createTechnology } from './createTechnology';
export { updateTechnology } from './updateTechnology';
export { deleteTechnology } from './deleteTechnology';
export { cloneTechnology } from './cloneTechnology';
