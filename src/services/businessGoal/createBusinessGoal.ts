
import { supabase } from '@/integrations/supabase/client';
import { BusinessGoalFormData } from '@/types/forms';
import { UseToastReturn } from '@/hooks/use-toast';

/**
 * Create a new business goal
 * @deprecated This function is deprecated as we are transitioning to Contentful.
 */
export const createBusinessGoal = async (data: BusinessGoalFormData, toast: UseToastReturn) => {
  console.log('[businessGoalService] Creating business goal is deprecated, use Contentful instead');
  
  toast.toast({
    title: "Deprecated Operation",
    description: "Business goal management has been moved to Contentful CMS",
    variant: "destructive"
  });
  
  throw new Error("This operation is deprecated. Please use Contentful for content management.");
};
