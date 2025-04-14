
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

    // If image data is provided
    if (data.image && data.image.url) {
      console.log('[imageHelpers] Processing image update with URL:', data.image.url);
      
      // If we already have an image, update it
      if (existingImages && existingImages.length > 0) {
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
    } else {
      console.log('[imageHelpers] No image URL provided, skipping image update');
    }

    console.log('[imageHelpers] Product image updated successfully');
  } catch (error) {
    console.error('[imageHelpers] Error in updateProductImage:', error);
    throw error;
  }
};

/**
 * Add a product image (alias for updateProductImage for consistency)
 */
export const addProductImage = updateProductImage;
