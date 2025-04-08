
// Only making minimal changes to the update function signature
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';
import { UseToastReturn } from '@/hooks/use-toast';
import { registerSlugChange } from '@/services/cms/utils/slugMatching';

// Helper functions for updating products
const updateProductImage = async (data: ProductFormData, productId: string) => {
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

const updateProductBenefits = async (data: ProductFormData, productId: string) => {
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

const updateProductFeatures = async (data: ProductFormData, productId: string) => {
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
    console.log('[productService] Features updated successfully');
  } catch (error) {
    console.error('[productService] Error updating product features:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (data: ProductFormData, originalSlug: string, toastObj: UseToastReturn) => {
  console.log('[productService] Updating product:', originalSlug, 'with data:', data);
  
  try {
    // First get the product ID from the original slug
    const { data: productData, error: fetchError } = await supabase
      .from('product_types')
      .select('id, slug')
      .eq('slug', originalSlug)
      .maybeSingle();

    // If the product doesn't exist, throw an error
    if (!productData) {
      console.error(`[productService] Product with slug "${originalSlug}" not found`);
      throw new Error(`Product with slug "${originalSlug}" not found`);
    }

    const productId = productData.id;
    console.log('[productService] Found product ID for update:', productId);

    // If the slug is being changed, check that the new slug doesn't already exist
    // (skip this check if the slug isn't changing)
    if (data.slug !== originalSlug) {
      const { data: existingWithNewSlug, error: slugCheckError } = await supabase
        .from('product_types')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', productId) // Exclude the current product
        .maybeSingle();
      
      if (existingWithNewSlug) {
        console.error(`[productService] Cannot update: slug "${data.slug}" already in use by another product`);
        throw new Error(`The slug "${data.slug}" is already in use by another product`);
      }
      
      // Register the slug change for future lookups
      registerSlugChange(originalSlug, data.slug);
      console.log(`[productService] Registered slug change: "${originalSlug}" -> "${data.slug}"`);
    }

    // Update the product type
    const { error: updateError } = await supabase
      .from('product_types')
      .update({
        title: data.title,
        slug: data.slug,
        description: data.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) {
      console.error('[productService] Error updating product:', updateError);
      throw new Error(updateError.message);
    }

    console.log('[productService] Product type updated successfully');
    
    // Update product image
    await updateProductImage(data, productId);
    
    // Update product benefits
    await updateProductBenefits(data, productId);
    
    // Update product features
    await updateProductFeatures(data, productId);
    
    toastObj.toast({
      title: "Product updated",
      description: `${data.title} has been updated successfully.`
    });
    
    return productId;
  } catch (error) {
    console.error('[productService] Error in updateProduct:', error);
    toastObj.toast({
      title: "Error",
      description: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    throw error;
  }
};
