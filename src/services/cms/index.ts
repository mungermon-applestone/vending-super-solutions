
// Import content type handlers
import {
  fetchBusinessGoalBySlug,
  fetchBusinessGoals,
} from './contentTypes/businessGoals';

import {
  fetchMachines as getMachines,
  fetchMachineById as getMachineById
} from './contentTypes/machines';

import {
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  fetchProductTypes,
  deleteProductType
} from './contentTypes/productTypes';

import {
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology
} from './contentTypes/technologies';

import { fetchTestimonials } from './contentTypes/testimonials';

// Define getMachineBySlug locally since it doesn't exist in the imports
const getMachineBySlug = async (type: string, id: string) => {
  const machines = await getMachines({ type, slug: id });
  return machines.length > 0 ? machines[0] : null;
};

export {
  // Business Goals
  fetchBusinessGoalBySlug,
  fetchBusinessGoals,
  
  // Machines
  getMachines,
  getMachineBySlug,
  getMachineById,
  
  // Product Types
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  fetchProductTypes,
  deleteProductType,
  
  // Technologies
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  
  // Testimonials
  fetchTestimonials,
};
