
import { BusinessGoalFormData } from '@/types/forms';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';

/**
 * Process benefits array to remove empty items
 */
export const processBenefits = (benefits: string[]): string[] => {
  return benefits.filter(benefit => benefit.trim() !== '');
};

/**
 * Check if a business goal with the given slug already exists
 */
export const checkBusinessGoalSlugExists = async (slug: string): Promise<boolean> => {
  // Always return false when Supabase CMS is disabled
  console.log(`[businessGoalService] Would check if slug "${slug}" exists, but Supabase CMS is disabled`);
  return false;
};

/**
 * Add business goal image
 */
export const addBusinessGoalImage = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  // No-op when Supabase CMS is disabled
  console.log('[businessGoalService] Would add business goal image, but Supabase CMS is disabled');
  return;
};

/**
 * Add business goal benefits
 */
export const addBusinessGoalBenefits = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  // No-op when Supabase CMS is disabled
  console.log('[businessGoalService] Would add business goal benefits, but Supabase CMS is disabled');
  return;
};

/**
 * Add business goal features
 */
export const addBusinessGoalFeatures = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  // No-op when Supabase CMS is disabled
  console.log('[businessGoalService] Would add business goal features, but Supabase CMS is disabled');
  return;
};

/**
 * Update business goal image
 */
export const updateBusinessGoalImage = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  // No-op when Supabase CMS is disabled
  console.log('[businessGoalService] Would update business goal image, but Supabase CMS is disabled');
  return;
};

/**
 * Update business goal benefits
 */
export const updateBusinessGoalBenefits = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  // No-op when Supabase CMS is disabled
  console.log('[businessGoalService] Would update business goal benefits, but Supabase CMS is disabled');
  return;
};

/**
 * Update business goal features
 */
export const updateBusinessGoalFeatures = async (
  data: BusinessGoalFormData, 
  businessGoalId: string
): Promise<void> => {
  // No-op when Supabase CMS is disabled
  console.log('[businessGoalService] Would update business goal features, but Supabase CMS is disabled');
  return;
};
