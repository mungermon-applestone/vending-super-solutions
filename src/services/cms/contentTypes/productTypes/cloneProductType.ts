
import { CMSProductType } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../types';
import { cloneContentItem, cloneRelatedItems } from '../../utils/cloneContent';
import { supabase } from '@/integrations/supabase/client';

/**
 * Clone a product type
 * @param id ID of the product type to clone
 * @returns The cloned product type or null if failed
 */
export async function cloneProductType(id: string): Promise<CMSProductType | null> {
  try {
    logCMSOperation('cloneProductType', 'Product Type', `Starting clone operation for product type with ID: ${id}`);
    
    // Clone the main product type
    const newProductType = await cloneContentItem<CMSProductType>(
      'product_types',
      id,
      'Product Type'
    );
    
    if (!newProductType) {
      throw new Error('Failed to clone product type');
    }
    
    // Clone related items
    await Promise.all([
      // Clone benefits
      cloneRelatedItems('product_type_benefits', 'product_type_id', id, newProductType.id),
      
      // Clone features
      cloneRelatedItems('product_type_features', 'product_type_id', id, newProductType.id)
    ]);
    
    // For feature images, we need a two-step process
    // First, get all the feature IDs
    const { data: features } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', newProductType.id);
      
    if (features && features.length > 0) {
      // For each new feature, check if there were images in the original
      const { data: originalFeatures } = await supabase
        .from('product_type_features')
        .select('id')
        .eq('product_type_id', id);
        
      if (originalFeatures) {
        // Clone feature images for each feature
        for (let i = 0; i < Math.min(features.length, originalFeatures.length); i++) {
          await cloneRelatedItems(
            'product_type_feature_images',
            'feature_id',
            originalFeatures[i].id,
            features[i].id
          );
        }
      }
    }
    
    // Clone the main product image if available
    await cloneRelatedItems('product_type_images', 'product_type_id', id, newProductType.id);
    
    return newProductType;
  } catch (error) {
    handleCMSError('cloneProductType', 'Product Type', error);
    return null;
  }
}
