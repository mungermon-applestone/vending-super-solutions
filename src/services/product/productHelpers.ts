
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';

/**
 * Check if a product slug already exists
 */
export const checkProductSlugExists = async (slug: string, excludeProductId?: string): Promise<boolean> => {
  console.log(`[productHelpers] Checking if slug "${slug}" exists (excluding product ID: ${excludeProductId || 'none'})`);

  let query = supabase
    .from('product_types')
    .select('id')
    .eq('slug', slug);

  // If we're excluding a product ID (for updates), add that filter
  if (excludeProductId) {
    query = query.neq('id', excludeProductId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[productHelpers] Error checking slug existence:', error);
    throw new Error(`Failed to check if slug exists: ${error.message}`);
  }

  const exists = data.length > 0;
  console.log(`[productHelpers] Slug "${slug}" exists: ${exists}`);
  return exists;
};

/**
 * Add or update a product's image
 */
export const updateProductImage = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[productHelpers] Updating product image for product ID:', productId);
  
  try {
    // First check if the product already has an image
    const { data: existingImages, error: fetchError } = await supabase
      .from('product_type_images')
      .select('id')
      .eq('product_type_id', productId);

    if (fetchError) {
      console.error('[productHelpers] Error fetching existing product images:', fetchError);
      throw new Error(fetchError.message);
    }

    // If image data is provided
    if (data.image && (data.image.url || data.image.alt)) {
      // If we already have an image, update it
      if (existingImages && existingImages.length > 0) {
        const { error: updateError } = await supabase
          .from('product_type_images')
          .update({
            url: data.image.url,
            alt: data.image.alt,
            updated_at: new Date().toISOString()
          })
          .eq('product_type_id', productId);

        if (updateError) {
          console.error('[productHelpers] Error updating product image:', updateError);
          throw new Error(updateError.message);
        }
      } 
      // Otherwise insert a new one
      else {
        const { error: insertError } = await supabase
          .from('product_type_images')
          .insert({
            product_type_id: productId,
            url: data.image.url,
            alt: data.image.alt
          });

        if (insertError) {
          console.error('[productHelpers] Error inserting product image:', insertError);
          throw new Error(insertError.message);
        }
      }
    }

    console.log('[productHelpers] Product image updated successfully');
  } catch (error) {
    console.error('[productHelpers] Error in updateProductImage:', error);
    throw error;
  }
};

/**
 * Add a product image (alias for updateProductImage for consistency)
 */
export const addProductImage = updateProductImage;

/**
 * Update a product's benefits
 */
export const updateProductBenefits = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[productHelpers] Updating benefits for product ID:', productId);
  console.log('[productHelpers] Benefits data:', data.benefits);
  
  try {
    // First delete all existing benefits for this product for a clean slate
    const { error: deleteError } = await supabase
      .from('product_type_benefits')
      .delete()
      .eq('product_type_id', productId);

    if (deleteError) {
      console.error('[productHelpers] Error deleting existing benefits:', deleteError);
      throw new Error(deleteError.message);
    }
    
    // Only insert benefits that aren't empty strings
    const validBenefits = data.benefits.filter(benefit => benefit.trim() !== '');
    
    // Skip the insertion step if there are no valid benefits to insert
    if (validBenefits.length === 0) {
      console.log('[productHelpers] No valid benefits to insert');
      return;
    }
    
    const benefitsToInsert = validBenefits.map((benefit, index) => ({
      product_type_id: productId,
      benefit: benefit,
      display_order: index
    }));

    const { error: insertError } = await supabase
      .from('product_type_benefits')
      .insert(benefitsToInsert);

    if (insertError) {
      console.error('[productHelpers] Error inserting benefits:', insertError);
      throw new Error(insertError.message);
    }

    console.log(`[productHelpers] ${validBenefits.length} benefits inserted successfully`);
  } catch (error) {
    console.error('[productHelpers] Error in updateProductBenefits:', error);
    throw error;
  }
};

/**
 * Add product benefits (alias for updateProductBenefits for consistency)
 */
export const addProductBenefits = updateProductBenefits;

/**
 * Update a product's features
 */
export const updateProductFeatures = async (data: ProductFormData, productId: string): Promise<void> => {
  console.log('[productHelpers] Updating features for product ID:', productId);
  
  try {
    // Get existing features to manage their associated images
    const { data: existingFeatures, error: fetchError } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', productId);

    if (fetchError) {
      console.error('[productHelpers] Error fetching existing features:', fetchError);
      throw new Error(fetchError.message);
    }

    // First delete all existing features (and cascade to their images)
    const { error: deleteError } = await supabase
      .from('product_type_features')
      .delete()
      .eq('product_type_id', productId);

    if (deleteError) {
      console.error('[productHelpers] Error deleting existing features:', deleteError);
      throw new Error(deleteError.message);
    }

    // Insert each new feature and its screenshot
    for (let i = 0; i < data.features.length; i++) {
      const feature = data.features[i];
      
      // Skip features with empty title or description
      if (!feature.title.trim() || !feature.description.trim()) {
        console.log('[productHelpers] Skipping empty feature at index:', i);
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
        console.error('[productHelpers] Error inserting feature:', featureError);
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
          console.error('[productHelpers] Error inserting feature screenshot:', screenshotError);
          // Continue with other features even if this screenshot fails
        }
      }
    }

    console.log(`[productHelpers] ${data.features.length} features processed successfully`);
  } catch (error) {
    console.error('[productHelpers] Error in updateProductFeatures:', error);
    throw error;
  }
};

/**
 * Add product features (alias for updateProductFeatures for consistency)
 */
export const addProductFeatures = updateProductFeatures;

/**
 * Process benefits to remove duplicates and empty entries
 */
export const processBenefits = (benefits: string[]): string[] => {
  // Filter out empty benefits and remove duplicates
  const uniqueBenefits = new Set<string>();
  return benefits
    .filter(benefit => benefit.trim() !== '')
    .filter(benefit => {
      const normalized = benefit.trim().toLowerCase();
      if (uniqueBenefits.has(normalized)) {
        return false;
      }
      uniqueBenefits.add(normalized);
      return true;
    });
};

