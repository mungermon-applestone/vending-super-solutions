
// Import content type handlers
import {
  fetchBusinessGoalBySlug,
  fetchBusinessGoals,
  cloneBusinessGoal
} from './contentTypes/businessGoals';

import {
  fetchMachines as getMachines,
  fetchMachineById as getMachineById,
  cloneMachine
} from './contentTypes/machines';

import {
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  fetchProductTypes,
  deleteProductType,
  cloneProductType
} from './contentTypes/productTypes';

import {
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology
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
  cloneBusinessGoal,
  
  // Machines
  getMachines,
  getMachineBySlug,
  getMachineById,
  cloneMachine,
  
  // Product Types
  fetchProductTypeBySlug,
  fetchProductTypeByUUID,
  fetchProductTypes,
  deleteProductType,
  cloneProductType,
  
  // Technologies
  fetchTechnologyBySlug,
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  cloneTechnology,
  
  // Testimonials
  fetchTestimonials,
};
