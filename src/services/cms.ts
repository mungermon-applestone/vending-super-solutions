
// This file is maintained for backward compatibility
// New code should import from the specific modules directly

// Import services from specialized modules
import { 
  getProductTypes, 
  getProductTypeBySlug, 
  getProductTypeByUUID, 
  deleteProductType 
} from './cms/productTypes';

import { 
  getBusinessGoals,
  getBusinessGoalBySlug 
} from './cms/businessGoals';

import {
  getMachines,
  getMachineBySlug,
  getMachineById,
  createNewMachine,
  updateExistingMachine,
  removeExistingMachine
} from './cms/machines';

import {
  getTechnologies,
  getTechnologyBySlug,
  deleteTechnology
} from './cms/technologies';

import { getTestimonials } from './cms/testimonials';

// Import case studies service
import {
  fetchCaseStudies,
  fetchCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
} from './cms/contentTypes/caseStudies';

// Import landing pages service
import {
  fetchLandingPages,
  fetchLandingPageByKey,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage
} from './cms/contentTypes/landingPages';

// Import operations for direct access
import { productTypeOperations } from './cms/contentTypes/productTypes';
import { businessGoalOperations } from './cms/contentTypes/businessGoals';
import { technologyOperations } from './cms/contentTypes/technologies';
import { caseStudyOperations } from './cms/contentTypes/caseStudies/operations';
import { landingPageOperations } from './cms/contentTypes/landingPages/operations';
import { cloneMachine } from './cms/contentTypes/machines/cloneMachine';

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
  
  // Business goals
  getBusinessGoals,
  getBusinessGoalBySlug,
  
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
