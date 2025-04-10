
// Import content type handlers
import {
  fetchBusinessGoalBySlug,
  fetchBusinessGoals,
} from './contentTypes/businessGoals';

import {
  getMachines,
  getMachineBySlug,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine
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

export {
  // Business Goals
  fetchBusinessGoalBySlug,
  fetchBusinessGoals,
  
  // Machines
  getMachines,
  getMachineBySlug,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  
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
