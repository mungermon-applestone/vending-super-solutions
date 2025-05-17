
import { BusinessGoalFormData } from '@/types/forms';

/**
 * @deprecated These functions are deprecated as we are transitioning to Contentful.
 */

// Simplified version that just shows deprecation messages
const showDeprecationMessage = (operation: string) => {
  console.warn(`[businessGoalService] ${operation} is deprecated, use Contentful instead`);
  return 'disabled';
};

/**
 * Create a new business goal
 * @deprecated This function is deprecated as we are transitioning to Contentful.
 */
export const createBusinessGoal = async (
  data: BusinessGoalFormData,
  toast: any
): Promise<string> => {
  toast.toast({
    title: "Operation disabled",
    description: "Business goal creation is disabled. Using Contentful for content management.",
    variant: "destructive",
  });
  return showDeprecationMessage('Create business goal');
};

/**
 * Update an existing business goal
 * @deprecated This function is deprecated as we are transitioning to Contentful.
 */
export const updateBusinessGoal = async (
  data: BusinessGoalFormData,
  goalSlug: string,
  toast: any
): Promise<string> => {
  toast.toast({
    title: "Operation disabled",
    description: "Business goal update is disabled. Using Contentful for content management.",
    variant: "destructive",
  });
  return showDeprecationMessage('Update business goal');
};

/**
 * Delete a business goal
 * @deprecated This function is deprecated as we are transitioning to Contentful.
 */
export const deleteBusinessGoal = async (slug: string): Promise<boolean> => {
  showDeprecationMessage('Delete business goal');
  return false;
};
