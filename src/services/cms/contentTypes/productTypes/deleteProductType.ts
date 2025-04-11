
import { supabase } from '@/integrations/supabase/client';
import { logCMSOperation, handleCMSError } from '../types';

/**
 * Delete a product type from the database
 * @param slug The slug of the product type to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteProductType(slug: string): Promise<boolean> {
  console.log(`[deleteProductType] Attempting to delete product type with slug: ${slug}`);
  
  try {
    // First, fetch the product type to get its ID
    const { data: productType, error: fetchError } = await supabase
      .from('product_types')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (fetchError) {
      console.error('[deleteProductType] Error fetching product type:', fetchError);
      throw new Error(`Product type with slug '${slug}' not found`);
    }
    
    if (!productType || !productType.id) {
      console.error('[deleteProductType] Product type ID not found for slug', slug);
      throw new Error(`Product type with slug '${slug}' not found or has no ID`);
    }
    
    const productTypeId = productType.id;
    console.log(`[deleteProductType] Found product type ID: ${productTypeId} for slug: ${slug}`);
    
    // Delete related records first - product type features
    console.log(`[deleteProductType] Deleting related features for product type ID: ${productTypeId}`);
    
    // First get all feature IDs to delete their images
    const { data: features, error: featuresError } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', productTypeId);
      
    if (featuresError) {
      console.error('[deleteProductType] Error fetching features:', featuresError);
      // Continue with deletion attempt even if features fetch fails
    }
    
    // Delete feature images if features were found
    if (features && features.length > 0) {
      const featureIds = features.map(feature => feature.id);
      console.log(`[deleteProductType] Deleting feature images for features:`, featureIds);
      
      const { error: featureImagesDeleteError } = await supabase
        .from('product_type_feature_images')
        .delete()
        .in('feature_id', featureIds);
        
      if (featureImagesDeleteError) {
        console.error('[deleteProductType] Error deleting feature images:', featureImagesDeleteError);
        // Continue with deletion attempt even if image deletion fails
      }
    }
    
    // Now delete features
    const { error: featuresDeleteError } = await supabase
      .from('product_type_features')
      .delete()
      .eq('product_type_id', productTypeId);
      
    if (featuresDeleteError) {
      console.error('[deleteProductType] Error deleting features:', featuresDeleteError);
      // Continue with deletion attempt even if feature deletion fails
    }
    
    // Delete benefits
    console.log(`[deleteProductType] Deleting benefits for product type ID: ${productTypeId}`);
    const { error: benefitsDeleteError } = await supabase
      .from('product_type_benefits')
      .delete()
      .eq('product_type_id', productTypeId);
      
    if (benefitsDeleteError) {
      console.error('[deleteProductType] Error deleting benefits:', benefitsDeleteError);
      // Continue with deletion attempt even if benefits deletion fails
    }
    
    // Delete product type images
    console.log(`[deleteProductType] Deleting images for product type ID: ${productTypeId}`);
    const { error: imagesDeleteError } = await supabase
      .from('product_type_images')
      .delete()
      .eq('product_type_id', productTypeId);
      
    if (imagesDeleteError) {
      console.error('[deleteProductType] Error deleting images:', imagesDeleteError);
      // Continue with deletion attempt even if image deletion fails
    }
    
    // Now delete the product type itself
    console.log(`[deleteProductType] Now deleting the main product type record with ID: ${productTypeId}`);
    const { error: deleteError } = await supabase
      .from('product_types')
      .delete()
      .eq('id', productTypeId);
      
    if (deleteError) {
      console.error('[deleteProductType] Error deleting product type:', deleteError);
      throw new Error(`Failed to delete product type: ${deleteError.message}`);
    }
    
    console.log(`[deleteProductType] Successfully deleted product type with ID: ${productTypeId}`);
    logCMSOperation('deleteProductType', 'product_type', `Successfully deleted product type with slug: ${slug}`);
    return true;
  } catch (error) {
    handleCMSError('deleteProductType', 'product_type', error);
    throw error;
  }
}
