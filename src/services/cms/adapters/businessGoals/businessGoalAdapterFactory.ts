
/**
 * Business goal adapter factory
 * This is a simplified version since we're only using Contentful now.
 */

import { BusinessGoalAdapter } from '@/types/cms';

export const getBusinessGoalAdapter = (): BusinessGoalAdapter => {
  // Return a stub adapter since we're using only Contentful now
  return {
    getAll: async () => [],
    getBySlug: async () => null,
    getById: async () => null,
    create: async () => null,
    update: async () => false,
    delete: async () => false,
    clone: async () => null
  };
};
