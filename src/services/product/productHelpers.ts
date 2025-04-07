
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

/**
 * Add a product image
 */
export const addProductImage = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Adding image for product:', productId);
  
  try {
    if (data.image.url) {
      await supabase
        .from('product_type_images')
        .insert({
          product_type_id: productId,
          url: data.image.url,
          alt: data.image.alt || data.title
        });
      console.log('[productService] Image added successfully');
    } else {
      console.log('[productService] No image URL provided, skipping image creation');
    }
  } catch (error) {
    console.error('[productService] Error adding product image:', error);
    throw error;
  }
};

/**
 * Add product benefits
 */
export const addProductBenefits = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Adding benefits for product:', productId);
  
  try {
    const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
    
    if (benefitsToInsert.length > 0) {
      const { data: insertedBenefits, error } = await supabase
        .from('product_type_benefits')
        .insert(
          benefitsToInsert.map((benefit, index) => ({
            product_type_id: productId,
            benefit,
            display_order: index
          }))
        );
        
      if (error) {
        console.error('[productService] Error inserting benefits:', error);
        throw error;
      }
      console.log('[productService] Benefits added successfully');
    } else {
      console.log('[productService] No benefits to insert');
    }
  } catch (error) {
    console.error('[productService] Error adding product benefits:', error);
    throw error;
  }
};

/**
 * Add product features
 */
export const addProductFeatures = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Adding features for product:', productId);
  
  try {
    for (let i = 0; i < data.features.length; i++) {
      const feature = data.features[i];
      if (feature.title.trim() !== '') {
        const { data: newFeature, error: featureError } = await supabase
          .from('product_type_features')
          .insert({
            product_type_id: productId,
            title: feature.title,
            description: feature.description,
            icon: feature.icon || 'check',
            display_order: i
          })
          .select('id')
          .single();

        if (featureError || !newFeature) {
          console.error('[productService] Failed to create feature:', featureError);
          continue;
        }

        if (feature.screenshotUrl) {
          const { error: imageError } = await supabase
            .from('product_type_feature_images')
            .insert({
              feature_id: newFeature.id,
              url: feature.screenshotUrl,
              alt: feature.screenshotAlt || feature.title
            });
            
          if (imageError) {
            console.error('[productService] Failed to add feature image:', imageError);
          }
        }
      }
    }
    console.log('[productService] Features added successfully');
  } catch (error) {
    console.error('[productService] Error adding product features:', error);
    throw error;
  }
};

/**
 * Update product image
 */
export const updateProductImage = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Updating image for product:', productId);
  
  try {
    const { data: existingImages, error: fetchError } = await supabase
      .from('product_type_images')
      .select('id')
      .eq('product_type_id', productId);
      
    if (fetchError) {
      console.error('[productService] Error fetching existing images:', fetchError);
      throw fetchError;
    }

    if (existingImages && existingImages.length > 0) {
      const { error: updateError } = await supabase
        .from('product_type_images')
        .update({
          url: data.image.url,
          alt: data.image.alt || data.title,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingImages[0].id);
        
      if (updateError) {
        console.error('[productService] Error updating image:', updateError);
        throw updateError;
      }
      console.log('[productService] Image updated successfully');
    } else if (data.image.url) {
      const { error: insertError } = await supabase
        .from('product_type_images')
        .insert({
          product_type_id: productId,
          url: data.image.url,
          alt: data.image.alt || data.title
        });
        
      if (insertError) {
        console.error('[productService] Error inserting new image:', insertError);
        throw insertError;
      }
      console.log('[productService] New image added successfully');
    } else {
      console.log('[productService] No image URL provided, skipping image update/creation');
    }
  } catch (error) {
    console.error('[productService] Error updating product image:', error);
    throw error;
  }
};

/**
 * Update product benefits
 */
export const updateProductBenefits = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Updating benefits for product:', productId);
  
  try {
    // Delete existing benefits
    const { error: deleteError } = await supabase
      .from('product_type_benefits')
      .delete()
      .eq('product_type_id', productId);
      
    if (deleteError) {
      console.error('[productService] Error deleting existing benefits:', deleteError);
      throw deleteError;
    }

    const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
    if (benefitsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('product_type_benefits')
        .insert(
          benefitsToInsert.map((benefit, index) => ({
            product_type_id: productId,
            benefit,
            display_order: index
          }))
        );
        
      if (insertError) {
        console.error('[productService] Error inserting updated benefits:', insertError);
        throw insertError;
      }
      console.log('[productService] Benefits updated successfully');
    } else {
      console.log('[productService] No benefits to insert after update');
    }
  } catch (error) {
    console.error('[productService] Error updating product benefits:', error);
    throw error;
  }
};

/**
 * Update product features
 */
export const updateProductFeatures = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Updating features for product:', productId);
  
  try {
    // Get existing features
    const { data: existingFeatures, error: fetchError } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', productId);
      
    if (fetchError) {
      console.error('[productService] Error fetching existing features:', fetchError);
      throw fetchError;
    }

    // Delete existing features
    if (existingFeatures && existingFeatures.length > 0) {
      const { error: deleteError } = await supabase
        .from('product_type_features')
        .delete()
        .eq('product_type_id', productId);
        
      if (deleteError) {
        console.error('[productService] Error deleting existing features:', deleteError);
        throw deleteError;
      }
    }

    // Add new features
    await addProductFeatures(data, productId);
    console.log('[productService] Features updated successfully');
  } catch (error) {
    console.error('[productService] Error updating product features:', error);
    throw error;
  }
};
