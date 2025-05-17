
import { BusinessGoalFormData } from '@/types/forms';
import { UseToastReturn } from '@/hooks/use-toast';

/**
 * Update an existing business goal
 * @deprecated This function is deprecated as we are transitioning to Contentful.
 */
export const updateBusinessGoal = async (
  data: BusinessGoalFormData, 
  goalSlug: string, 
  toast: UseToastReturn
) => {
  console.log(`[businessGoalService] Updating business goals is deprecated, use Contentful instead`);
  
  toast.toast({
    title: "Deprecated Operation",
    description: "Business goal management has been moved to Contentful CMS",
    variant: "destructive"
  });
  
  throw new Error("This operation is deprecated. Please use Contentful for content management.");
};
