
/**
 * CMS Services
 * 
 * This is the main entry point for CMS services.
 * It re-exports all CMS functionality from more specific modules.
 */

// Import operations from content type modules
import { productTypeOperations } from './contentTypes/productTypes';
import { businessGoalOperations } from './contentTypes/businessGoals';
import { technologyOperations } from './contentTypes/technologies';
import { machineOperations } from './contentTypes/machines/index';
import { caseStudyOperations } from './contentTypes/caseStudies';
import { landingPageOperations } from './contentTypes/landingPages/operations';

// Export standardized content type operations
export const productTypes = productTypeOperations;
export const businessGoals = businessGoalOperations;
export const technologies = technologyOperations;
export const machines = machineOperations;
export const caseStudies = caseStudyOperations;
export const landingPages = landingPageOperations;

// Re-export functions from specific content type services for backward compatibility
// These are being deprecated in favor of the operations objects above

// Product types
export {
  getProductTypes,
  getProductTypeBySlug,
  getProductTypeByUUID,
  deleteProductType
} from './productTypes';

// Business goals
export { 
  getBusinessGoals,
  getBusinessGoalBySlug 
} from './businessGoals';

// Machines
export {
  getMachines,
  getMachineBySlug,
  getMachineById,
  createNewMachine as createMachine,
  updateExistingMachine as updateMachine,
  removeExistingMachine as deleteMachine
} from './machines';

export { cloneMachine } from './contentTypes/machines/cloneMachine';

// Technologies
export {
  getTechnologies,
  getTechnologyBySlug,
  deleteTechnology
} from './technologies';

// Testimonials
export { getTestimonials } from './testimonials';

// Case Studies
export {
  fetchCaseStudies,
  fetchCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
} from './contentTypes/caseStudies';

// Landing Pages
export {
  fetchLandingPages,
  fetchLandingPageByKey,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage
} from './contentTypes/landingPages';

// Export the initialized contentful client for advanced usage
export { getContentfulClient } from './utils/contentfulClient';

// Export CMS initialization functions
export { initCMS, refreshCmsConnection } from './cmsInit';

// Export combined adapter
export { getCombinedAdapter } from './adapters';

