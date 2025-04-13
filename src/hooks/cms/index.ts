
// Export all CMS hooks from specialized files
export * from './useProductTypes';
export * from './useBusinessGoals';
export * from './useMachines';
export * from './useTechnologies';
export * from './useTestimonials';
export * from './useQueryDefaults';
export * from './useLandingPages';

// Export the clone hooks directly from useCloneCMS
// This resolves the duplicate export issue by not re-exporting useCloneProductType
// which is already exported from useProductTypes
export {
  useCloneBusinessGoal,
  useCloneTechnology,
  useCloneMachine,
  useCloneProductType  // Explicitly export useCloneProductType
} from './useCloneCMS';
