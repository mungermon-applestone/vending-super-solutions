
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a machine from the CMS
 */
export async function deleteMachine(id: string): Promise<boolean> {
  try {
    console.log(`[deleteMachine] Deleting machine with ID: ${id}`);
    
    // Note: We're relying on cascading deletes for related records in the database
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[deleteMachine] Error deleting machine with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`[deleteMachine] Error:`, error);
    throw error;
  }
}
