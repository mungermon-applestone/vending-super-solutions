
import { supabase } from '@/integrations/supabase/client';

/**
 * Deletes a technology entry from the database
 * @param slug Slug of the technology to delete
 * @returns True if successful, throws error otherwise
 */
export const deleteTechnology = async (slug: string): Promise<boolean> => {
  console.log(`[deleteTechnology] Deleting technology with slug: ${slug}`);
  
  try {
    // First, fetch the technology to get its ID
    const { data: technology, error: fetchError } = await supabase
      .from('technologies')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (fetchError) {
      console.error('[deleteTechnology] Error fetching technology:', fetchError);
      throw new Error(`Technology with slug '${slug}' not found`);
    }
    
    const technologyId = technology.id;
    
    // Delete the technology
    const { error: deleteError } = await supabase
      .from('technologies')
      .delete()
      .eq('id', technologyId);
      
    if (deleteError) {
      console.error('[deleteTechnology] Error deleting technology:', deleteError);
      throw new Error(`Failed to delete technology: ${deleteError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('[deleteTechnology] Error:', error);
    throw error;
  }
};
