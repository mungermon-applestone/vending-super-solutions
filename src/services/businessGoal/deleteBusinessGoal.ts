
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a business goal from the database
 * @param slug The slug of the business goal to delete
 * @returns True if successful, throws error otherwise
 */
export const deleteBusinessGoal = async (slug: string): Promise<boolean> => {
  console.log(`[deleteBusinessGoal] Deleting business goal with slug: ${slug}`);
  
  try {
    // First, fetch the business goal to get its ID
    const { data: businessGoal, error: fetchError } = await supabase
      .from('business_goals')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (fetchError) {
      console.error('[deleteBusinessGoal] Error fetching business goal:', fetchError);
      throw new Error(`Business goal with slug '${slug}' not found`);
    }
    
    const businessGoalId = businessGoal.id;
    
    // Delete the business goal
    const { error: deleteError } = await supabase
      .from('business_goals')
      .delete()
      .eq('id', businessGoalId);
      
    if (deleteError) {
      console.error('[deleteBusinessGoal] Error deleting business goal:', deleteError);
      throw new Error(`Failed to delete business goal: ${deleteError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('[deleteBusinessGoal] Error:', error);
    throw error;
  }
};
