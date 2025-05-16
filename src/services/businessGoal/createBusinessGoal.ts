
import { supabase } from '@/integrations/supabase/client';
import { BusinessGoalFormData } from '@/types/forms';
import { UseToastReturn } from '@/hooks/use-toast';
import { 
  checkBusinessGoalSlugExists,
  addBusinessGoalImage, 
  addBusinessGoalBenefits, 
  addBusinessGoalFeatures 
} from './businessGoalHelpers';

/**
 * Create a new business goal
 */
export const createBusinessGoal = async (data: BusinessGoalFormData, toast: UseToastReturn) => {
  console.log('[businessGoalService] Creating business goal with data:', data);
  
  try {
    // Check if a business goal with this slug already exists
    const slugExists = await checkBusinessGoalSlugExists(data.slug);
    
    if (slugExists) {
      console.error(`[businessGoalService] Business goal with slug "${data.slug}" already exists`);
      throw new Error(`A business goal with the slug "${data.slug}" already exists`);
    }
    
    // Create the business goal
    const { data: newBusinessGoal, error: createError } = await supabase
      .from('business_goals')
      .insert({
        title: data.title,
        slug: data.slug,
        description: data.description,
        icon: data.icon || null,
        visible: true
      })
      .select('id')
      .single();

    if (createError || !newBusinessGoal) {
      console.error('[businessGoalService] Error creating business goal:', createError);
      throw new Error(createError?.message || 'Failed to create business goal');
    }

    console.log('[businessGoalService] Created business goal:', newBusinessGoal);

    // Add business goal image
    await addBusinessGoalImage(data, newBusinessGoal.id);
    
    // Add business goal benefits
    await addBusinessGoalBenefits(data, newBusinessGoal.id);
    
    // Add business goal features
    await addBusinessGoalFeatures(data, newBusinessGoal.id);
    
    toast.toast({
      title: "Business goal created",
      description: `${data.title} has been created successfully.`
    });
    
    return newBusinessGoal.id;
  } catch (error) {
    console.error('[businessGoalService] Error in createBusinessGoal:', error);
    toast.toast({
      title: "Error",
      description: `Failed to create business goal: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    throw error;
  }
};
