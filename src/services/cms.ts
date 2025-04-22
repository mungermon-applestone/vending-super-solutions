
/**
 * CMS Service
 * 
 * This is a simplified version that only exports essential operations
 * that are still used by the application after migrating to Contentful.
 */

// Export standardized content type operations
export const productTypes = {};
export const businessGoals = {};
export const technologies = {};
export const caseStudies = {};
export const landingPages = {};

// Basic stubs for backward compatibility
export const getProductTypes = async () => [];
export const getProductTypeBySlug = async () => null;
export const getProductTypeByUUID = async () => null;
export const deleteProductType = async () => false;
export const cloneProductType = async () => null;

export const getBusinessGoals = async () => [];
export const getBusinessGoalBySlug = async () => null;
export const cloneBusinessGoal = async () => null;

export const getMachines = async () => [];
export const getMachineBySlug = async () => null;
export const getMachineById = async () => null;
export const createNewMachine = async () => null;
export const updateExistingMachine = async () => false;
export const removeExistingMachine = async () => false;
export const cloneMachine = async () => null;

export const getTechnologies = async () => [];
export const getTechnologyBySlug = async () => null;
export const deleteTechnology = async () => false;
export const cloneTechnology = async () => null;

export const getTestimonials = async () => [];
