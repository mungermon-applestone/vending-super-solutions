
// This file is maintained for backward compatibility
// New code should import from '@/hooks/cms' directly

import {
  useContentfulBusinessGoals as useBusinessGoals,
  useContentfulBusinessGoalBySlug as useBusinessGoal
} from './cms/useContentfulBusinessGoals';

import {
  useContentfulTestimonials as useTestimonials
} from './cms/useContentfulTestimonials';

// Re-export hooks with legacy names for backward compatibility
export {
  useBusinessGoals,
  useBusinessGoal,
  useTestimonials
};

// Provide placeholders for other hooks that might be used but will be deprecated
// These will be migrated to Contentful versions in subsequent updates
export const useProductTypes = () => {
  console.warn('useProductTypes is not yet implemented with Contentful');
  return { data: [], isLoading: false, error: null };
};

export const useProductType = () => {
  console.warn('useProductType is not yet implemented with Contentful');
  return { data: null, isLoading: false, error: null };
};

export const useMachines = () => {
  console.warn('useMachines is not yet implemented with Contentful');
  return { data: [], isLoading: false, error: null };
};

export const useMachine = () => {
  console.warn('useMachine is not yet implemented with Contentful');
  return { data: null, isLoading: false, error: null };
};

export const useTechnologies = () => {
  console.warn('useTechnologies is not yet implemented with Contentful');
  return { data: [], isLoading: false, error: null };
};

export const useTechnology = () => {
  console.warn('useTechnology is not yet implemented with Contentful');
  return { data: null, isLoading: false, error: null };
};

// Clone functions will need to be replaced with Contentful Management API versions
export const useCloneProductType = () => {
  console.warn('useCloneProductType is not yet implemented with Contentful');
  return { mutateAsync: async () => {}, isLoading: false };
};

export const useCloneBusinessGoal = () => {
  console.warn('useCloneBusinessGoal is not yet implemented with Contentful');
  return { mutateAsync: async () => {}, isLoading: false };
};

export const useCloneTechnology = () => {
  console.warn('useCloneTechnology is not yet implemented with Contentful');
  return { mutateAsync: async () => {}, isLoading: false };
};

export const useCloneMachine = () => {
  console.warn('useCloneMachine is not yet implemented with Contentful');
  return { mutateAsync: async () => {}, isLoading: false };
};
