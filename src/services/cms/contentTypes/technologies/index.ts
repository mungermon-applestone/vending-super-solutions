
// Re-export all technology-related operations
import { fetchTechnologies, getTechnologies } from './fetchTechnologies';
import { fetchTechnologyBySlug, getTechnologyBySlug } from './fetchTechnologyBySlug';
import { createTechnology } from './createTechnology';
import { updateTechnology } from './updateTechnology';
import { deleteTechnology } from './deleteTechnology';
import { cloneTechnology } from './cloneTechnology';

/**
 * Centralized operations object for technology management
 */
export const technologyOperations = {
  getAll: getTechnologies,
  getBySlug: getTechnologyBySlug,
  create: createTechnology,
  update: updateTechnology,
  delete: deleteTechnology,
  clone: cloneTechnology,
  // Add these for ContentTypeOperations compatibility
  fetchAll: fetchTechnologies,
  fetchBySlug: fetchTechnologyBySlug,
  fetchById: (id: string) => Promise.resolve(null) // Placeholder implementation
};

// Re-export individual functions for backwards compatibility
export {
  fetchTechnologies,
  getTechnologies,
  fetchTechnologyBySlug,
  getTechnologyBySlug,
  createTechnology,
  updateTechnology, 
  deleteTechnology,
  cloneTechnology
};
