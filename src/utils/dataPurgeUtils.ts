
import { supabase } from '@/integrations/supabase/client';

/**
 * Complete purge of all product-related data from the database
 * This is a destructive operation and should be used with caution
 */
export const purgeProductData = async (): Promise<{
  success: boolean;
  tablesAffected: string[];
  recordsDeleted: Record<string, number>;
  error?: string;
}> => {
  try {
    console.log('[dataPurgeUtils] Starting complete product data purge');
    const tablesAffected: string[] = [];
    const recordsDeleted: Record<string, number> = {};

    // Delete in proper order to respect foreign key constraints
    // 1. First delete product feature images
    const { count: featureImageCount, error: featureImageError } = await supabase
      .from('product_type_feature_images')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (featureImageError) {
      console.error('[dataPurgeUtils] Error deleting product_type_feature_images:', featureImageError);
      throw new Error(`Error deleting feature images: ${featureImageError.message}`);
    }
    
    tablesAffected.push('product_type_feature_images');
    recordsDeleted['product_type_feature_images'] = featureImageCount || 0;
    
    // 2. Delete product features
    const { count: featureCount, error: featureError } = await supabase
      .from('product_type_features')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (featureError) {
      console.error('[dataPurgeUtils] Error deleting product_type_features:', featureError);
      throw new Error(`Error deleting features: ${featureError.message}`);
    }
    
    tablesAffected.push('product_type_features');
    recordsDeleted['product_type_features'] = featureCount || 0;
    
    // 3. Delete product benefits
    const { count: benefitCount, error: benefitError } = await supabase
      .from('product_type_benefits')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (benefitError) {
      console.error('[dataPurgeUtils] Error deleting product_type_benefits:', benefitError);
      throw new Error(`Error deleting benefits: ${benefitError.message}`);
    }
    
    tablesAffected.push('product_type_benefits');
    recordsDeleted['product_type_benefits'] = benefitCount || 0;
    
    // 4. Delete product images
    const { count: imageCount, error: imageError } = await supabase
      .from('product_type_images')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (imageError) {
      console.error('[dataPurgeUtils] Error deleting product_type_images:', imageError);
      throw new Error(`Error deleting images: ${imageError.message}`);
    }
    
    tablesAffected.push('product_type_images');
    recordsDeleted['product_type_images'] = imageCount || 0;
    
    // 5. Finally, delete product types
    const { count: productCount, error: productError } = await supabase
      .from('product_types')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (productError) {
      console.error('[dataPurgeUtils] Error deleting product_types:', productError);
      throw new Error(`Error deleting products: ${productError.message}`);
    }
    
    tablesAffected.push('product_types');
    recordsDeleted['product_types'] = productCount || 0;
    
    console.log('[dataPurgeUtils] Product data purge completed successfully');
    console.log('[dataPurgeUtils] Tables affected:', tablesAffected);
    console.log('[dataPurgeUtils] Records deleted:', recordsDeleted);
    
    return {
      success: true,
      tablesAffected,
      recordsDeleted
    };
  } catch (error) {
    console.error('[dataPurgeUtils] Error during product data purge:', error);
    return {
      success: false,
      tablesAffected: [],
      recordsDeleted: {},
      error: error instanceof Error ? error.message : 'Unknown error during data purge'
    };
  }
};
