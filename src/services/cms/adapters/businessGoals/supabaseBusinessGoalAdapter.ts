
/**
 * @deprecated ARCHIVED ADAPTER - Do not use in new development
 * 
 * This adapter is deprecated as we are transitioning to Contentful.
 * This file provides a minimal implementation that logs operations 
 * and returns empty results.
 */

import { CMSBusinessGoal } from '@/types/cms';
import { BusinessGoalAdapter, BusinessGoalCreateInput, BusinessGoalUpdateInput } from './types';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';
import { contentfulBusinessGoalAdapter } from './contentfulBusinessGoalAdapter';

// Log deprecation warning when this module is imported
const warnDeprecation = () => {
  logDeprecationWarning(
    "supabaseBusinessGoalAdapter", 
    "This adapter is deprecated and will be removed in a future release.",
    "Please use contentfulBusinessGoalAdapter directly."
  );
};

// Create a proxy that logs deprecation warnings and delegates to Contentful
export const supabaseBusinessGoalAdapter: BusinessGoalAdapter = {
  getAll: async (filters) => {
    warnDeprecation();
    return await contentfulBusinessGoalAdapter.getAll(filters);
  },
  
  getBySlug: async (slug) => {
    warnDeprecation();
    return await contentfulBusinessGoalAdapter.getBySlug(slug);
  },
  
  getById: async (id) => {
    warnDeprecation();
    return await contentfulBusinessGoalAdapter.getById(id);
  },
  
  create: async (data) => {
    warnDeprecation();
    logDeprecationWarning("supabaseBusinessGoalAdapter.create", "Write operations are disabled");
    throw new Error("This operation is deprecated. Please use Contentful directly.");
  },
  
  update: async (id, data) => {
    warnDeprecation();
    logDeprecationWarning("supabaseBusinessGoalAdapter.update", "Write operations are disabled");
    throw new Error("This operation is deprecated. Please use Contentful directly.");
  },
  
  delete: async (id) => {
    warnDeprecation();
    logDeprecationWarning("supabaseBusinessGoalAdapter.delete", "Write operations are disabled");
    throw new Error("This operation is deprecated. Please use Contentful directly.");
  },
  
  clone: async (id) => {
    warnDeprecation();
    logDeprecationWarning("supabaseBusinessGoalAdapter.clone", "Write operations are disabled");
    throw new Error("This operation is deprecated. Please use Contentful directly.");
  }
};
