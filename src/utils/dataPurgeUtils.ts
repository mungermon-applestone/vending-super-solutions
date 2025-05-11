
/**
 * @deprecated This module is deprecated and will be removed in future versions.
 * It re-exports functions from the legacy CMS module to maintain compatibility.
 */

import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Log deprecation warning when this module is imported
logDeprecationWarning(
  "utils/dataPurgeUtils.ts",
  "This module is deprecated and will be removed in a future release.",
  "Use Contentful directly for content management."
);

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * Complete purge of all product-related data - now a mock implementation
 */
export const purgeProductData = async (): Promise<{
  success: boolean;
  tablesAffected: string[];
  recordsDeleted: Record<string, number>;
  error?: string;
}> => {
  try {
    console.log('[DEPRECATED] Starting complete product data purge (MOCK)');
    
    // Mock data for the purge operation
    const tablesAffected = [
      'product_type_feature_images', 
      'product_type_features', 
      'product_type_benefits', 
      'product_type_images',
      'product_types'
    ];
    
    const recordsDeleted = {
      'product_type_feature_images': 12,
      'product_type_features': 25, 
      'product_type_benefits': 18, 
      'product_type_images': 8,
      'product_types': 6
    };
    
    console.log('[DEPRECATED] Product data purge completed successfully (MOCK)');
    
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
