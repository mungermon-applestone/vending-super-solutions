
/**
 * Technologies operations
 * This provides simple stub functions for technology operations.
 */

// Re-export functions
export const fetchTechnologies = async () => [];
export const fetchTechnologyBySlug = async () => null;
export const createTechnology = async () => null;
export const updateTechnology = async () => false;
export const deleteTechnology = async () => false;

// Export operations object
export const technologyOperations = {
  getAll: fetchTechnologies,
  getBySlug: fetchTechnologyBySlug,
  create: createTechnology,
  update: updateTechnology,
  delete: deleteTechnology
};
