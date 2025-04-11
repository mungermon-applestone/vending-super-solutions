
import { ContentTypeOperations } from '../types';
import { CMSTechnology, QueryOptions } from '@/types/cms';
import { fetchTechnologyBySlug } from './fetchTechnologyBySlug';
import { fetchTechnologies } from './fetchTechnologies';
import { createTechnology } from './createTechnology';
import { updateTechnology } from './updateTechnology';
import { deleteTechnology } from './deleteTechnology';
import { cloneTechnology } from './cloneTechnology';

/**
 * Standardized API for technology operations
 */
export const technologyOperations: ContentTypeOperations<CMSTechnology> = {
  fetchAll: async (options?: QueryOptions) => fetchTechnologies(),
  fetchBySlug: fetchTechnologyBySlug,
  fetchById: async (id: string) => {
    // For technologies, we'll implement a simple ID lookup based on slug lookup
    const technologies = await fetchTechnologies();
    return technologies.find(tech => tech.id === id) || null;
  },
  create: async (data: any) => createTechnology(data),
  update: async (slug: string, data: any) => updateTechnology(slug, data),
  delete: deleteTechnology,
  clone: cloneTechnology
};

// Export individual operations for backward compatibility
export {
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};
