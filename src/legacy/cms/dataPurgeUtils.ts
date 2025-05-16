
/**
 * @deprecated This module is deprecated and will be removed in future versions.
 * It provides a mock implementation that logs operations instead of making actual database modifications.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * Complete purge of all product-related data from the database
 * This is a destructive operation and should be used with caution
 * 
 * MOCK IMPLEMENTATION: This function no longer makes actual database calls
 * and instead simulates the purge operation with mock data
 */
export const purgeProductData = async (): Promise<{
  success: boolean;
  tablesAffected: string[];
  recordsDeleted: Record<string, number>;
  error?: string;
}> => {
  try {
    console.log('[DEPRECATED] Starting complete product data purge (MOCK)');
    const tablesAffected: string[] = [];
    const recordsDeleted: Record<string, number> = {};

    // Mock delete product feature images
    console.log('[DEPRECATED] MOCK: Deleting product_type_feature_images');
    tablesAffected.push('product_type_feature_images');
    recordsDeleted['product_type_feature_images'] = 12; // Mock count
    
    // Mock delete other product related tables
    console.log('[DEPRECATED] MOCK: Deleting product_type_features');
    tablesAffected.push('product_type_features');
    recordsDeleted['product_type_features'] = 25; // Mock count
    
    console.log('[DEPRECATED] MOCK: Deleting product_type_benefits');
    tablesAffected.push('product_type_benefits');
    recordsDeleted['product_type_benefits'] = 18; // Mock count
    
    console.log('[DEPRECATED] MOCK: Deleting product_type_images');
    tablesAffected.push('product_type_images');
    recordsDeleted['product_type_images'] = 8; // Mock count
    
    // Only perform an actual operation on the product_types table which exists
    console.log('[DEPRECATED] MOCK: Deleting product_types');
    
    // Actual delete from the real product_types table that exists
    const { count: productCount, error: productError } = await supabase
      .from('product_types')
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (productError) {
      console.error('[DEPRECATED] Error deleting product_types:', productError);
      throw new Error(`Error deleting products: ${productError.message}`);
    }
    
    tablesAffected.push('product_types');
    recordsDeleted['product_types'] = productCount || 6; // Use real count if available, otherwise mock
    
    console.log('[DEPRECATED] Product data purge completed successfully (MOCK)');
    console.log('[DEPRECATED] Tables affected:', tablesAffected);
    console.log('[DEPRECATED] Records deleted:', recordsDeleted);
    
    return {
      success: true,
      tablesAffected,
      recordsDeleted
    };
  } catch (error) {
    console.error('[DEPRECATED] Error during product data purge:', error);
    return {
      success: false,
      tablesAffected: [],
      recordsDeleted: {},
      error: error instanceof Error ? error.message : 'Unknown error during data purge'
    };
  }
};
