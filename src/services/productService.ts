
import { supabase } from '@/integrations/supabase/client';
import { ProductFormData } from '@/types/forms';
import type { UseToastReturn } from '@/hooks/use-toast';

// Create a new product
export const createProduct = async (data: ProductFormData, toast: UseToastReturn) => {
  // Create the product type
  const { data: newProductType, error: createError } = await supabase
    .from('product_types')
    .insert({
      title: data.title,
      slug: data.slug,
      description: data.description,
      visible: true
    })
    .select('id')
    .single();

  if (createError || !newProductType) {
    throw new Error(createError?.message || 'Failed to create product type');
  }

  // Add product image
  await addProductImage(data, newProductType.id);
  
  // Add product benefits
  await addProductBenefits(data, newProductType.id);
  
  // Add product features
  await addProductFeatures(data, newProductType.id);
  
  return newProductType.id;
};

// Update an existing product
export const updateProduct = async (data: ProductFormData, originalSlug: string, toast: UseToastReturn) => {
  // Update the product type
  const { error: updateError } = await supabase
    .from('product_types')
    .update({
      title: data.title,
      slug: data.slug,
      description: data.description,
      updated_at: new Date().toISOString()
    })
    .eq('slug', originalSlug);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // Get the product ID
  const { data: productData } = await supabase
    .from('product_types')
    .select('id')
    .eq('slug', data.slug)
    .single();

  if (!productData) {
    throw new Error('Product not found');
  }

  // Update product image
  await updateProductImage(data, productData.id);
  
  // Update product benefits
  await updateProductBenefits(data, productData.id);
  
  // Update product features
  await updateProductFeatures(data, productData.id);
  
  return productData.id;
};

// Helper functions for product operations
const addProductImage = async (data: ProductFormData, productId: string) => {
  if (data.image.url) {
    await supabase
      .from('product_type_images')
      .insert({
        product_type_id: productId,
        url: data.image.url,
        alt: data.image.alt || data.title
      });
  }
};

const addProductBenefits = async (data: ProductFormData, productId: string) => {
  const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
  
  if (benefitsToInsert.length > 0) {
    await supabase
      .from('product_type_benefits')
      .insert(
        benefitsToInsert.map((benefit, index) => ({
          product_type_id: productId,
          benefit,
          display_order: index
        }))
      );
  }
};

const addProductFeatures = async (data: ProductFormData, productId: string) => {
  for (let i = 0; i < data.features.length; i++) {
    const feature = data.features[i];
    if (feature.title.trim() !== '') {
      const { data: newFeature, error: featureError } = await supabase
        .from('product_type_features')
        .insert({
          product_type_id: productId,
          title: feature.title,
          description: feature.description,
          icon: feature.icon || 'check',
          display_order: i
        })
        .select('id')
        .single();

      if (featureError || !newFeature) {
        console.error('Failed to create feature:', featureError);
        continue;
      }

      if (feature.screenshotUrl) {
        await supabase
          .from('product_type_feature_images')
          .insert({
            feature_id: newFeature.id,
            url: feature.screenshotUrl,
            alt: feature.screenshotAlt || feature.title
          });
      }
    }
  }
};

const updateProductImage = async (data: ProductFormData, productId: string) => {
  const { data: existingImages } = await supabase
    .from('product_type_images')
    .select('id')
    .eq('product_type_id', productId);

  if (existingImages && existingImages.length > 0) {
    await supabase
      .from('product_type_images')
      .update({
        url: data.image.url,
        alt: data.image.alt || data.title,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingImages[0].id);
  } else if (data.image.url) {
    await supabase
      .from('product_type_images')
      .insert({
        product_type_id: productId,
        url: data.image.url,
        alt: data.image.alt || data.title
      });
  }
};

const updateProductBenefits = async (data: ProductFormData, productId: string) => {
  await supabase
    .from('product_type_benefits')
    .delete()
    .eq('product_type_id', productId);

  const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
  if (benefitsToInsert.length > 0) {
    await supabase
      .from('product_type_benefits')
      .insert(
        benefitsToInsert.map((benefit, index) => ({
          product_type_id: productId,
          benefit,
          display_order: index
        }))
      );
  }
};

const updateProductFeatures = async (data: ProductFormData, productId: string) => {
  // Get existing features
  const { data: existingFeatures } = await supabase
    .from('product_type_features')
    .select('id')
    .eq('product_type_id', productId);

  // Delete existing features
  if (existingFeatures && existingFeatures.length > 0) {
    await supabase
      .from('product_type_features')
      .delete()
      .eq('product_type_id', productId);
  }

  // Add new features
  await addProductFeatures(data, productId);
};
