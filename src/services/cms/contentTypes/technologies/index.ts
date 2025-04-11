
import { ContentTypeOperations } from '../types';
import { CMSTechnology } from '@/types/cms';
import { fetchTechnologies } from './fetchTechnologies';
import { fetchTechnologyBySlug } from './fetchTechnologyBySlug';
import { createTechnology } from './createTechnology';
import { updateTechnology } from './updateTechnology';
import { deleteTechnology } from './deleteTechnology';
import { cloneTechnology } from './cloneTechnology';

export const technologyOperations: ContentTypeOperations<CMSTechnology> = {
  fetchAll: async () => fetchTechnologies(),
  fetchBySlug: fetchTechnologyBySlug,
  fetchById: async (id) => {
    // Find by ID by getting all technologies and filtering
    const techs = await fetchTechnologies();
    return techs.find(tech => tech.id === id) || null;
  },
  create: createTechnology,
  update: updateTechnology,
  delete: deleteTechnology,
  clone: cloneTechnology
};

// Export individual operations for direct imports
export {
  fetchTechnologies,
  fetchTechnologyBySlug,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
};
