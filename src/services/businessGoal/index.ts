
import { BusinessGoalFormData } from '@/types/forms';
import { USE_SUPABASE_CMS } from '@/config/featureFlags';
import {
  processBenefits,
  checkBusinessGoalSlugExists,
  addBusinessGoalImage,
  addBusinessGoalBenefits,
  addBusinessGoalFeatures,
  updateBusinessGoalImage,
  updateBusinessGoalBenefits,
  updateBusinessGoalFeatures
} from './businessGoalHelpers';

/**
 * Create a new business goal
 */
export const createBusinessGoal = async (
  data: BusinessGoalFormData,
  toast: any
): Promise<string> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping business goal creation');
    toast.toast({
      title: "Operation disabled",
      description: "Business goal creation is disabled. Using Contentful for content management.",
      variant: "destructive",
    });
    return 'disabled';
  }

  const toastId = toast.toast({
    title: "Creating business goal",
    description: "Please wait...",
  });

  try {
    // Check if slug already exists
    const slugExists = await checkBusinessGoalSlugExists(data.slug);
    if (slugExists) {
      toast.toast({
        id: toastId,
        title: "Error",
        description: `A business goal with slug "${data.slug}" already exists.`,
        variant: "destructive",
      });
      throw new Error(`Slug "${data.slug}" already exists`);
    }

    // Create the business goal in Supabase
    // This implementation would contain the actual Supabase code
    // but since we're disabling it, this code will never run

    return 'disabled';
  } catch (error) {
    console.error('[businessGoalService] Error creating business goal:', error);
    toast.toast({
      id: toastId,
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred while creating business goal",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Update an existing business goal
 */
export const updateBusinessGoal = async (
  data: BusinessGoalFormData,
  goalSlug: string,
  toast: any
): Promise<string> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping business goal update');
    toast.toast({
      title: "Operation disabled",
      description: "Business goal update is disabled. Using Contentful for content management.",
      variant: "destructive",
    });
    return 'disabled';
  }

  const toastId = toast.toast({
    title: "Updating business goal",
    description: "Please wait...",
  });

  try {
    // This implementation would contain the actual Supabase code
    // but since we're disabling it, this code will never run
    return 'disabled';
  } catch (error) {
    console.error('[businessGoalService] Error updating business goal:', error);
    toast.toast({
      id: toastId,
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred while updating business goal",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Delete a business goal
 */
export const deleteBusinessGoal = async (slug: string): Promise<boolean> => {
  if (!USE_SUPABASE_CMS) {
    console.log('[businessGoalService] Supabase CMS is disabled, skipping business goal deletion');
    return false;
  }

  try {
    // This implementation would contain the actual Supabase code
    // but since we're disabling it, this code will never run
    return true;
  } catch (error) {
    console.error('[businessGoalService] Error deleting business goal:', error);
    throw error;
  }
};
