
import { CMSProductType } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../types';
import { cloneContentItem, cloneRelatedItems } from '../../utils/cloneContent';

/**
 * Clone a product type
 * @param id ID of the product type to clone
 * @returns The cloned product type or null if failed
 */
export async function cloneProductType(id: string): Promise<CMSProductType | null> {
  try {
    logCMSOperation('cloneProductType', 'Product Type', `Starting clone operation for product with ID: ${id}`);
    
    // Clone the main product type
    const newProduct = await cloneContentItem<CMSProductType>(
      'product_types',
      id,
      'Product Type'
    );
    
    if (!newProduct) {
      throw new Error('Failed to clone product type');
    }
    
    // Clone related items
    await Promise.all([
      // Clone benefits
      cloneRelatedItems('product_type_benefits', 'product_type_id', id, newProduct.id),
      
      // Clone features
      cloneRelatedItems('product_type_features', 'product_type_id', id, newProduct.id),
      
      // Clone images
      cloneRelatedItems('product_type_images', 'product_type_id', id, newProduct.id)
    ]);
    
    // For feature images, we need a two-step process
    // First, get all the feature IDs
    const { data: features } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', newProduct.id);
      
    if (features && features.length > 0) {
      // For each new feature, check if there were images in the original
      const originalFeatures = await supabase
        .from('product_type_features')
        .select('id')
        .eq('product_type_id', id);
        
      if (originalFeatures.data) {
        // Clone feature images for each feature
        for (let i = 0; i < Math.min(features.length, originalFeatures.data.length); i++) {
          await cloneRelatedItems(
            'product_type_feature_images',
            'feature_id',
            originalFeatures.data[i].id,
            features[i].id
          );
        }
      }
    }
    
    return newProduct;
  } catch (error) {
    handleCMSError('cloneProductType', 'Product Type', error);
    return null;
  }
}
