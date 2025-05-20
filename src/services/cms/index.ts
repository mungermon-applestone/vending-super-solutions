
// This file is maintained for backward compatibility
// New code should import from the specific modules directly

// Import services from specialized modules
import { 
  getProductTypes, 
  getProductTypeBySlug, 
  getProductTypeByUUID, 
  deleteProductType 
} from './productTypes';

import { 
  getBusinessGoals,
  getBusinessGoalBySlug 
} from './businessGoals';

import {
  getMachines,
  getMachineBySlug,
  getMachineById,
  createNewMachine,
  updateExistingMachine,
  removeExistingMachine
} from './machines';

import {
  getTechnologies,
  getTechnologyBySlug,
  deleteTechnology
} from './technologies';

import { getTestimonials } from './testimonials';

// Import case studies service
import {
  fetchCaseStudies,
  fetchCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
} from './contentTypes/caseStudies';

// Import landing pages service
import {
  fetchLandingPages,
  fetchLandingPageByKey,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage
} from './contentTypes/landingPages';

// Import operations for direct access
import { productTypeOperations } from './contentTypes/productTypes';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { technologyOperations } from './contentTypes/technologies';
import { caseStudyOperations } from './contentTypes/caseStudies/operations';
import { landingPageOperations } from './contentTypes/landingPages/operations';
import { cloneProductType } from './contentTypes/productTypes/cloneProductType';
import { cloneBusinessGoal } from './contentTypes/businessGoals/cloneBusinessGoal';
import { cloneMachine } from './contentTypes/machines/cloneMachine';

// Create stub for cloneTechnology
const cloneTechnology = async (id: string) => {
  console.warn('[cloneTechnology] This function is deprecated and will be removed. Use Contentful directly.');
  return null;
};

// Export standardized content type operations
export const productTypes = productTypeOperations;
export const businessGoals = businessGoalOperations;
export const technologies = technologyOperations;
export const caseStudies = caseStudyOperations;
export const landingPages = landingPageOperations;

// Export individual service functions for backward compatibility
export {
  // Product types
  getProductTypes,
  getProductTypeBySlug,
  getProductTypeByUUID,
  deleteProductType,
  cloneProductType,
  
  // Business goals
  getBusinessGoals,
  getBusinessGoalBySlug,
  cloneBusinessGoal,
  
  // Machines
  getMachines,
  getMachineBySlug,
  getMachineById,
  createNewMachine,
  updateExistingMachine,
  removeExistingMachine,
  cloneMachine,
  
  // Technologies
  getTechnologies,
  getTechnologyBySlug,
  deleteTechnology,
  cloneTechnology,
  
  // Testimonials
  getTestimonials,
  
  // Case Studies
  fetchCaseStudies,
  fetchCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,

  // Landing Pages
  fetchLandingPages,
  fetchLandingPageByKey,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage
};
