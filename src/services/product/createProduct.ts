
import { ProductFormData } from '@/types/forms';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UseToastReturn } from '@/hooks/use-toast';

/**
 * Create a new product in the database
 */
export const createProduct = async (data: ProductFormData, toastObj: UseToastReturn) => {
  try {
    console.log('[productService] Creating product with data:', data);
    
    // Check if a product with this slug already exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('product_types')
      .select('id')
      .eq('slug', data.slug)
      .maybeSingle();
    
    if (existingProduct) {
      console.error(`[productService] Product with slug "${data.slug}" already exists`);
      throw new Error(`A product with the slug "${data.slug}" already exists`);
    }
    
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
      console.error('[productService] Error creating product:', createError);
      throw new Error(createError?.message || 'Failed to create product type');
    }

    console.log('[productService] Created product type:', newProductType);

    // Add product image
    await addProductImage(data, newProductType.id);
    
    // Add product benefits
    await addProductBenefits(data, newProductType.id);
    
    // Add product features
    await addProductFeatures(data, newProductType.id);
    
    toastObj.toast({
      title: "Product created",
      description: `${data.title} has been created successfully.`
    });
    
    return newProductType.id;
  } catch (error) {
    console.error('[productService] Error in createProduct:', error);
    toastObj.toast({
      title: "Error",
      description: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    throw error;
  }
};

// Helper functions for product operations
const addProductImage = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Adding image for product:', productId);
  
  try {
    if (data.image.url) {
      await supabase
        .from('product_type_images')
        .insert({
          product_type_id: productId,
          url: data.image.url,
          alt: data.image.alt || data.title
        });
      console.log('[productService] Image added successfully');
    } else {
      console.log('[productService] No image URL provided, skipping image creation');
    }
  } catch (error) {
    console.error('[productService] Error adding product image:', error);
    throw error;
  }
};

const addProductBenefits = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Adding benefits for product:', productId);
  
  try {
    const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
    
    if (benefitsToInsert.length > 0) {
      const { data: insertedBenefits, error } = await supabase
        .from('product_type_benefits')
        .insert(
          benefitsToInsert.map((benefit, index) => ({
            product_type_id: productId,
            benefit,
            display_order: index
          }))
        );
        
      if (error) {
        console.error('[productService] Error inserting benefits:', error);
        throw error;
      }
      console.log('[productService] Benefits added successfully');
    } else {
      console.log('[productService] No benefits to insert');
    }
  } catch (error) {
    console.error('[productService] Error adding product benefits:', error);
    throw error;
  }
};

const addProductFeatures = async (data: ProductFormData, productId: string) => {
  console.log('[productService] Adding features for product:', productId);
  
  try {
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
          console.error('[productService] Failed to create feature:', featureError);
          continue;
        }

        if (feature.screenshotUrl) {
          const { error: imageError } = await supabase
            .from('product_type_feature_images')
            .insert({
              feature_id: newFeature.id,
              url: feature.screenshotUrl,
              alt: feature.screenshotAlt || feature.title
            });
            
          if (imageError) {
            console.error('[productService] Failed to add feature image:', imageError);
          }
        }
      }
    }
    console.log('[productService] Features added successfully');
  } catch (error) {
    console.error('[productService] Error adding product features:', error);
    throw error;
  }
};
