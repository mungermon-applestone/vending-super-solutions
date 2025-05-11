
/**
 * ReadOnly Adapter for Business Goals
 * This adapter replaces the previous mock implementations with a read-only version
 * that clearly communicates the deprecated status and redirects to Contentful.
 */

import { BusinessGoalAdapter } from './types';
import { contentfulBusinessGoalAdapter } from './contentfulBusinessGoalAdapter';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';
import { toast } from '@/hooks/use-toast';

const showDeprecationToast = () => {
  toast({
    title: "Deprecated Feature",
    description: "Direct database operations for Business Goals are deprecated. Please use Contentful directly.",
    variant: "destructive",
  });
};

const warnDeprecation = (operation: string) => {
  logDeprecationWarning(
    `BusinessGoalAdapter.${operation}`,
    `This operation is now read-only and will be removed in a future release.`,
    "Please use Contentful directly for content management."
  );
};

/**
 * Read-only adapter for business goals
 * Allows reading data (redirected to Contentful) but prevents write operations
 */
export const readOnlyBusinessGoalAdapter: BusinessGoalAdapter = {
  getAll: async (filters) => {
    warnDeprecation('getAll');
    return await contentfulBusinessGoalAdapter.getAll(filters);
  },
  
  getBySlug: async (slug) => {
    warnDeprecation('getBySlug');
    return await contentfulBusinessGoalAdapter.getBySlug(slug);
  },
  
  getById: async (id) => {
    warnDeprecation('getById');
    return await contentfulBusinessGoalAdapter.getById(id);
  },
  
  create: async () => {
    warnDeprecation('create');
    showDeprecationToast();
    throw new Error("Business Goal creation is disabled. Please use Contentful directly.");
  },
  
  update: async () => {
    warnDeprecation('update');
    showDeprecationToast();
    throw new Error("Business Goal updates are disabled. Please use Contentful directly.");
  },
  
  delete: async () => {
    warnDeprecation('delete');
    showDeprecationToast();
    throw new Error("Business Goal deletion is disabled. Please use Contentful directly.");
  },
  
  clone: async (id) => {
    warnDeprecation('clone');
    showDeprecationToast();
    throw new Error("Business Goal cloning is disabled. Please use Contentful directly.");
  }
};

