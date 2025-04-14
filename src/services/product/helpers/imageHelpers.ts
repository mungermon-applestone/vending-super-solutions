
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

/**
 * Add or update a product's image
 */
export const updateProductImage = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[imageHelpers] Updating product image for product ID:', productId);
  console.log('[imageHelpers] Image data:', data.image);
  
  try {
    // First check if the product already has an image
    const { data: existingImages, error: fetchError } = await supabase
      .from('product_type_images')
      .select('id')
      .eq('product_type_id', productId);

    if (fetchError) {
      console.error('[imageHelpers] Error fetching existing product images:', fetchError);
      throw new Error(fetchError.message);
    }

    const hasExistingImage = existingImages && existingImages.length > 0;
    console.log('[imageHelpers] Product has existing image:', hasExistingImage);

    // If image data is provided with a URL
    if (data.image && data.image.url && data.image.url.trim() !== '') {
      console.log('[imageHelpers] Processing image update with URL:', data.image.url);
      
      // If we already have an image, update it
      if (hasExistingImage) {
        console.log('[imageHelpers] Updating existing image record');
        
        const { error: updateError } = await supabase
          .from('product_type_images')
          .update({
            url: data.image.url,
            alt: data.image.alt || '',
            updated_at: new Date().toISOString()
          })
          .eq('product_type_id', productId);

        if (updateError) {
          console.error('[imageHelpers] Error updating product image:', updateError);
          throw new Error(updateError.message);
        }
        
        console.log('[imageHelpers] Updated existing image successfully');
      } 
      // Otherwise insert a new one
      else {
        console.log('[imageHelpers] Creating new image record');
        
        const { error: insertError } = await supabase
          .from('product_type_images')
          .insert({
            product_type_id: productId,
            url: data.image.url,
            alt: data.image.alt || ''
          });

        if (insertError) {
          console.error('[imageHelpers] Error inserting product image:', insertError);
          throw new Error(insertError.message);
        }
        
        console.log('[imageHelpers] Inserted new image successfully');
      }
    } 
    // If image URL is empty or not provided but we have existing images
    else if (hasExistingImage) {
      // This is a case where the user might want to remove the image
      console.log('[imageHelpers] No valid image URL provided. Leaving existing image unchanged.');
    }

    console.log('[imageHelpers] Product image update completed');
  } catch (error) {
    console.error('[imageHelpers] Error in updateProductImage:', error);
    throw error;
  }
};

/**
 * Add a product image (alias for updateProductImage for consistency)
 */
export const addProductImage = updateProductImage;
