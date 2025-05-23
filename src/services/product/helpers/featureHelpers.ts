
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
 * [MOCK] Update product features for a product
 * @param data Product form data
 * @param productId Product ID
 */
export const updateProductFeatures = async (data: ProductFormData, productId: string) => {
  console.log('[MOCK productService] Updating features for product', productId);
  
  try {
    // Mock deletion of existing features
    console.log('[MOCK productService] Simulating deletion of existing features for product', productId);
    
    // If there are no features, we're done
    if (!data.features || data.features.length === 0) {
      console.log('[MOCK productService] No features to add for product', productId);
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
    
    console.log(`[MOCK productService] Would add ${features.length} features for product ${productId}:`, 
      features.map(f => ({ title: f.title, hasScreenshot: !!f.screenshot }))
    );
    
    // Mock success response
    console.log(`[MOCK productService] Successfully mocked adding ${features.length} features to product ${productId}`);
    
    return {
      success: true,
      count: features.length,
      features: features
    };
  } catch (error) {
    console.error('[MOCK productService] Error in updateProductFeatures:', error);
    throw error;
  }
};

/**
 * [MOCK] Add product features for a new product (alias to updateProductFeatures for consistency)
 * @param data Product form data
 * @param productId Product ID
 */
export const addProductFeatures = updateProductFeatures;
