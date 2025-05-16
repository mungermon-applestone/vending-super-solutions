
import { supabase } from '@/integrations/supabase/client';
import { BusinessGoalFormData } from '@/types/forms';
import { UseToastReturn } from '@/hooks/use-toast';
import { 
  updateBusinessGoalImage, 
  updateBusinessGoalBenefits, 
  updateBusinessGoalFeatures 
} from './businessGoalHelpers';

/**
 * Update an existing business goal
 */
export const updateBusinessGoal = async (
  data: BusinessGoalFormData, 
  goalSlug: string, 
  toast: UseToastReturn
) => {
  console.log(`[businessGoalService] Updating business goal "${goalSlug}" with data:`, data);
  
  try {
    // First fetch the business goal to get its ID
    const { data: existingGoal, error: fetchError } = await supabase
      .from('business_goals')
      .select('id')
      .eq('slug', goalSlug)
      .maybeSingle();
      
    if (fetchError) {
      console.error('[businessGoalService] Error fetching business goal:', fetchError);
      throw new Error(`Error fetching business goal: ${fetchError.message}`);
    }
    
    if (!existingGoal) {
      console.error(`[businessGoalService] Business goal with slug "${goalSlug}" not found`);
      throw new Error(`Business goal with slug "${goalSlug}" not found`);
    }
    
    const goalId = existingGoal.id;
    
    // Update the basic business goal information
    const { error: updateError } = await supabase
      .from('business_goals')
      .update({
        title: data.title,
        slug: data.slug,
        description: data.description,
        icon: data.icon || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId);
      
    if (updateError) {
      console.error('[businessGoalService] Error updating business goal:', updateError);
      throw new Error(`Error updating business goal: ${updateError.message}`);
    }
    
    // Update business goal image
    await updateBusinessGoalImage(data, goalId);
    
    // Update business goal benefits
    await updateBusinessGoalBenefits(data, goalId);
    
    // Update business goal features
    await updateBusinessGoalFeatures(data, goalId);
    
    toast.toast({
      title: "Business goal updated",
      description: `${data.title} has been updated successfully.`
    });
    
    return goalId;
  } catch (error) {
    console.error('[businessGoalService] Error in updateBusinessGoal:', error);
    toast.toast({
      title: "Error",
      description: `Failed to update business goal: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    throw error;
  }
};
