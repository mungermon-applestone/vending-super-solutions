
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CMSProductType } from '@/types/cms';
import { handleCMSError, logCMSOperation } from '../types';

/**
 * Clone an existing product type, creating a new one with the same data but a unique slug
 * @param productId UUID of the product type to clone
 * @returns The newly created product type
 */
export async function cloneProductType(productId: string): Promise<CMSProductType | null> {
  try {
    logCMSOperation('cloneProductType', 'Product Type', `Cloning product type with ID: ${productId}`);
    
    // 1. Fetch the original product type with all its associated data
    const { data: originalProduct, error: fetchError } = await supabase
      .from('product_types')
      .select(`
        *,
        product_type_benefits (id, benefit, display_order),
        product_type_features (
          id, 
          title, 
          description, 
          icon, 
          display_order,
          product_type_feature_images (id, url, alt, width, height)
        ),
        product_type_images (id, url, alt, width, height)
      `)
      .eq('id', productId)
      .single();
      
    if (fetchError) {
      handleCMSError('cloneProductType', 'Product Type', fetchError);
      throw fetchError;
    }
    
    if (!originalProduct) {
      throw new Error(`Product type with ID ${productId} not found`);
    }

    // 2. Create a new product type with modified title and slug
    const newProductId = uuidv4();
    const newTitle = `${originalProduct.title} (Copy)`;
    const baseSameSlug = originalProduct.slug.replace(/-copy(-\d+)?$/, '');
    const newSlug = `${baseSameSlug}-copy`;
    
    const { data: newProduct, error: insertError } = await supabase
      .from('product_types')
      .insert({
        id: newProductId,
        title: newTitle,
        slug: newSlug,
        description: originalProduct.description,
        visible: originalProduct.visible
      })
      .select()
      .single();
      
    if (insertError) {
      handleCMSError('cloneProductType', 'Product Type', insertError);
      throw insertError;
    }
    
    // 3. Clone benefits
    if (originalProduct.product_type_benefits && originalProduct.product_type_benefits.length > 0) {
      const newBenefits = originalProduct.product_type_benefits.map(benefit => ({
        id: uuidv4(),
        product_type_id: newProductId,
        benefit: benefit.benefit,
        display_order: benefit.display_order
      }));
      
      const { error: benefitsError } = await supabase
        .from('product_type_benefits')
        .insert(newBenefits);
        
      if (benefitsError) {
        handleCMSError('cloneProductType', 'Product Benefits', benefitsError);
        console.error('Failed to clone benefits:', benefitsError);
        // Continue with other cloning operations
      }
    }
    
    // 4. Clone features and their images
    if (originalProduct.product_type_features && originalProduct.product_type_features.length > 0) {
      for (const feature of originalProduct.product_type_features) {
        const newFeatureId = uuidv4();
        
        // Clone feature
        const { error: featureError } = await supabase
          .from('product_type_features')
          .insert({
            id: newFeatureId,
            product_type_id: newProductId,
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            display_order: feature.display_order
          });
          
        if (featureError) {
          handleCMSError('cloneProductType', 'Product Features', featureError);
          console.error('Failed to clone feature:', featureError);
          continue;
        }
        
        // Clone feature images
        if (feature.product_type_feature_images && feature.product_type_feature_images.length > 0) {
          const newImages = feature.product_type_feature_images.map(image => ({
            id: uuidv4(),
            feature_id: newFeatureId,
            url: image.url,
            alt: image.alt,
            width: image.width,
            height: image.height
          }));
          
          const { error: imageError } = await supabase
            .from('product_type_feature_images')
            .insert(newImages);
            
          if (imageError) {
            handleCMSError('cloneProductType', 'Product Feature Images', imageError);
            console.error('Failed to clone feature images:', imageError);
          }
        }
      }
    }
    
    // 5. Clone product images
    if (originalProduct.product_type_images && originalProduct.product_type_images.length > 0) {
      const newImages = originalProduct.product_type_images.map(image => ({
        id: uuidv4(),
        product_type_id: newProductId,
        url: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height
      }));
      
      const { error: imageError } = await supabase
        .from('product_type_images')
        .insert(newImages);
        
      if (imageError) {
        handleCMSError('cloneProductType', 'Product Images', imageError);
        console.error('Failed to clone product images:', imageError);
      }
    }
    
    logCMSOperation('cloneProductType', 'Product Type', `Successfully cloned product type with ID: ${productId}`);
    
    // Return the newly created product with its ID and slug
    return {
      ...newProduct,
      id: newProductId,
      title: newTitle,
      slug: newSlug
    } as CMSProductType;
    
  } catch (error) {
    handleCMSError('cloneProductType', 'Product Type', error);
    throw error;
  }
}
