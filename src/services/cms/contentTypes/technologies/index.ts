
import { ContentTypeOperations } from '../types';
import { CMSTechnology } from '@/types/cms';
import { fetchTechnologies } from './fetchTechnologies';
import { fetchTechnologyBySlug } from './fetchTechnologyBySlug';
import { createTechnology } from './createTechnology';
import { updateTechnology } from './updateTechnology';
import { deleteTechnology } from './deleteTechnology';
import { cloneTechnology } from './cloneTechnology';

// Create a technologyOperations object that implements ContentTypeOperations interface
export const technologyOperations: ContentTypeOperations<CMSTechnology> = {
  fetchAll: async (options = {}) => {
    return await fetchTechnologies(options);
  },
  fetchBySlug: async (slug) => {
    return await fetchTechnologyBySlug(slug);
  },
  fetchById: async (id) => {
    // ID lookup by getting all technologies and filtering by ID
    const allTechnologies = await fetchTechnologies();
    return allTechnologies.find(tech => tech.id === id) || null;
  },
  create: async (data) => {
    const id = await createTechnology(data);
    
    // Return the newly created technology by fetching it
    const technologies = await fetchTechnologies();
    const newTechnology = technologies.find(tech => String(tech.id) === String(id));
    
    if (!newTechnology) {
      throw new Error('Failed to retrieve newly created technology');
    }
    
    return newTechnology;
  },
  update: async (id, data) => {
    const success = await updateTechnology(id, data);
    
    if (!success) {
      throw new Error('Failed to update technology');
    }
    
    // Return the updated technology
    const updatedTechnology = await technologyOperations.fetchById(id);
    
    if (!updatedTechnology) {
      throw new Error('Failed to retrieve updated technology');
    }
    
    return updatedTechnology;
  },
  delete: async (id) => {
    return await deleteTechnology(id);
  },
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
