
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';
import { CMSFeature } from '@/types/cms';

/**
 * Check if the feature icon is a string
 */
export const isFeatureIconString = (icon: any): icon is string => {
  return typeof icon === 'string';
};

/**
 * Parse feature data from any source and ensure it matches the CMSFeature interface
 * @param featureData Raw feature data
 * @returns Cleaned feature object conforming to CMSFeature interface
 */
export const parseFeatureData = (featureData: any): CMSFeature => {
  return {
    id: featureData.id || `feature-${Math.random().toString(36).substring(2, 9)}`,
    title: featureData.title || '',
    description: featureData.description || '',
    icon: featureData.icon || undefined,
    screenshot: featureData.screenshot ? {
      id: featureData.screenshot.id || 'screenshot',
      url: featureData.screenshot.url || '',
      alt: String(featureData.screenshot.alt || featureData.title || 'Feature image')
    } : undefined
  };
};

/**
 * Update product features for a product
 * @param data Product form data
 * @param productId Product ID
 */
export const updateProductFeatures = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Updating features for product', productId);
  
  try {
    // First delete all existing features for this product
    const { error: deleteError } = await supabase
      .from('product_features')
      .delete()
      .eq('product_id', productId);
    
    if (deleteError) {
      console.error('[productService] Error deleting existing features:', deleteError);
      throw new Error(`Failed to delete existing features: ${deleteError.message}`);
    }
    
    // If there are no features, we're done
    if (!data.features || data.features.length === 0) {
      console.log('[productService] No features to add for product', productId);
      return;
    }
    
    // Process features to ensure they match the CMSFeature interface
    const features = data.features.map(feature => {
      // Convert from form structure to CMSFeature structure
      const processedFeature = {
        id: `feature-${Math.random().toString(36).substring(2, 9)}`,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        screenshot: feature.screenshotUrl ? {
          id: 'screenshot',
          url: feature.screenshotUrl,
          alt: feature.screenshotAlt || feature.title || 'Feature image'
        } : undefined
      };
      
      // Use parseFeatureData to ensure the data is clean
      return parseFeatureData(processedFeature);
    });
    
    console.log(`[productService] Adding ${features.length} features for product ${productId}`);
    
    // Insert features one by one to handle errors better
    for (const feature of features) {
      const { error: insertError } = await supabase
        .from('product_features')
        .insert({
          product_id: productId,
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          screenshot_url: feature.screenshot?.url,
          screenshot_alt: feature.screenshot?.alt
        });
      
      if (insertError) {
        console.error('[productService] Error inserting feature:', insertError);
        throw new Error(`Failed to add feature "${feature.title}": ${insertError.message}`);
      }
    }
    
    console.log(`[productService] Successfully added ${features.length} features to product ${productId}`);
  } catch (error) {
    console.error('[productService] Error in updateProductFeatures:', error);
    throw error;
  }
};

/**
 * Add product features for a new product (alias to updateProductFeatures for consistency)
 * @param data Product form data
 * @param productId Product ID
 */
export const addProductFeatures = updateProductFeatures;
