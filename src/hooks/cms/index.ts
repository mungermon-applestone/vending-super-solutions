
// Export all CMS hooks from specialized files
export * from './useProductTypes';
export * from './useBusinessGoals';
export * from './useMachines';
export * from './useTechnologies';
export * from './useTestimonials';
export * from './useQueryDefaults';
export * from './useLandingPages';

// Re-export hooks from useCloneCMS, but avoid the duplicate useCloneProductType
import {
  useCloneBusinessGoal,
  useCloneTechnology,
  useCloneMachine,
} from './useCloneCMS';

export {
  useCloneBusinessGoal,
  useCloneTechnology,
  useCloneMachine,
};
