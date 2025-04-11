
import { supabase } from '@/integrations/supabase/client';
import { logCMSOperation, handleCMSError } from '../types';

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
    
    if (!technology || !technology.id) {
      console.error('[deleteTechnology] Technology ID not found for slug', slug);
      throw new Error(`Technology with slug '${slug}' not found or has no ID`);
    }
    
    const technologyId = technology.id;
    console.log(`[deleteTechnology] Found technology ID: ${technologyId} for slug: ${slug}`);
    
    // Delete related records first - technology sections
    // This will cascade to delete technology_features and technology_feature_items
    console.log(`[deleteTechnology] Deleting related sections for technology ID: ${technologyId}`);
    const { error: sectionDeleteError } = await supabase
      .from('technology_sections')
      .delete()
      .eq('technology_id', technologyId);
    
    if (sectionDeleteError) {
      console.error('[deleteTechnology] Error deleting related sections:', sectionDeleteError);
      // Continue with deletion attempt even if section deletion fails
    }
    
    // Delete related technology images
    console.log(`[deleteTechnology] Deleting related images for technology ID: ${technologyId}`);
    const { error: imageDeleteError } = await supabase
      .from('technology_images')
      .delete()
      .eq('technology_id', technologyId);
      
    if (imageDeleteError) {
      console.error('[deleteTechnology] Error deleting related images:', imageDeleteError);
      // Continue with deletion attempt even if image deletion fails
    }
    
    // Now delete the technology itself
    console.log(`[deleteTechnology] Now deleting the main technology record with ID: ${technologyId}`);
    const { error: deleteError } = await supabase
      .from('technologies')
      .delete()
      .eq('id', technologyId);
      
    if (deleteError) {
      console.error('[deleteTechnology] Error deleting technology:', deleteError);
      throw new Error(`Failed to delete technology: ${deleteError.message}`);
    }
    
    console.log(`[deleteTechnology] Successfully deleted technology with ID: ${technologyId}`);
    logCMSOperation('deleteTechnology', 'technology', `Successfully deleted technology with slug: ${slug}`);
    return true;
  } catch (error) {
    handleCMSError('deleteTechnology', 'technology', error);
    throw error;
  }
};
