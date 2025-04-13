
// Re-export all technology-related operations
import { getTechnologies } from './fetchTechnologies';
import { getTechnologyBySlug } from './fetchTechnologyBySlug';
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
  clone: cloneTechnology
};

// Re-export individual functions for backwards compatibility
export {
  getTechnologies,
  getTechnologyBySlug,
  createTechnology,
  updateTechnology, 
  deleteTechnology,
  cloneTechnology
};
