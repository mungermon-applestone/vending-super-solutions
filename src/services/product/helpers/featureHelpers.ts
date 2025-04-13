
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

/**
 * Update a product's features
 */
export const updateProductFeatures = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[featureHelpers] Updating features for product ID:', productId);
  
  try {
    // Get existing features to manage their associated images
    const { data: existingFeatures, error: fetchError } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', productId);

    if (fetchError) {
      console.error('[featureHelpers] Error fetching existing features:', fetchError);
      throw new Error(fetchError.message);
    }

    // First delete all existing features (and cascade to their images)
    const { error: deleteError } = await supabase
      .from('product_type_features')
      .delete()
      .eq('product_type_id', productId);

    if (deleteError) {
      console.error('[featureHelpers] Error deleting existing features:', deleteError);
      throw new Error(deleteError.message);
    }

    // Insert each new feature and its screenshot
    for (let i = 0; i < data.features.length; i++) {
      const feature = data.features[i];
      
      // Skip features with empty title or description
      if (!feature.title.trim() || !feature.description.trim()) {
        console.log('[featureHelpers] Skipping empty feature at index:', i);
        continue;
      }
      
      // Insert the feature
      const { data: newFeature, error: featureError } = await supabase
        .from('product_type_features')
        .insert({
          product_type_id: productId,
          title: feature.title,
          description: feature.description,
          icon: feature.icon || 'check',
          display_order: i
        })
        .select()
        .single();

      if (featureError) {
        console.error('[featureHelpers] Error inserting feature:', featureError);
        throw new Error(featureError.message);
      }

      // If screenshot data is provided, insert it
      if (feature.screenshotUrl || feature.screenshotAlt) {
        const { error: screenshotError } = await supabase
          .from('product_type_feature_images')
          .insert({
            feature_id: newFeature.id,
            url: feature.screenshotUrl || '',
            alt: feature.screenshotAlt || ''
          });

        if (screenshotError) {
          console.error('[featureHelpers] Error inserting feature screenshot:', screenshotError);
          // Continue with other features even if this screenshot fails
        }
      }
    }

    console.log(`[featureHelpers] ${data.features.length} features processed successfully`);
  } catch (error) {
    console.error('[featureHelpers] Error in updateProductFeatures:', error);
    throw error;
  }
};

/**
 * Add product features (alias for updateProductFeatures for consistency)
 */
export const addProductFeatures = updateProductFeatures;
