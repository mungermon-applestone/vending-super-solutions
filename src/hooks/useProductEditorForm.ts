
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UseToastReturn } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useProductType } from '@/hooks/useCMSData';
import { ProductFormData } from '@/types/forms';

export const useProductEditorForm = (
  productSlug: string | undefined,
  setIsLoading: (isLoading: boolean) => void,
  toast: UseToastReturn,
  navigate: NavigateFunction
) => {
  const [isCreating, setIsCreating] = useState(!productSlug);
  const { data: existingProduct, isLoading: isLoadingProduct } = useProductType(productSlug);

  const form = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      image: {
        url: '',
        alt: ''
      },
      benefits: [''],
      features: [
        {
          title: '',
          description: '',
          icon: 'check',
          screenshotUrl: '',
          screenshotAlt: ''
        }
      ]
    }
  });

  useEffect(() => {
    if (existingProduct && !isCreating) {
      form.reset({
        title: existingProduct.title,
        slug: existingProduct.slug,
        description: existingProduct.description,
        image: {
          url: existingProduct.image.url,
          alt: existingProduct.image.alt
        },
        benefits: existingProduct.benefits.length > 0 ? existingProduct.benefits : [''],
        features: existingProduct.features.length > 0 ? existingProduct.features.map(feature => ({
          title: feature.title,
          description: feature.description,
          icon: feature.icon as string || 'check',
          screenshotUrl: feature.screenshot?.url || '',
          screenshotAlt: feature.screenshot?.alt || ''
        })) : [
          {
            title: '',
            description: '',
            icon: 'check',
            screenshotUrl: '',
            screenshotAlt: ''
          }
        ]
      });
    }
  }, [existingProduct, isCreating, form]);

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      if (isCreating) {
        await handleCreateProduct(data);
      } else if (existingProduct) {
        await handleUpdateProduct(data, productSlug!);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.toast({
        title: "Error",
        description: `Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (data: ProductFormData) => {
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

    if (data.image.url) {
      await supabase
        .from('product_type_images')
        .insert({
          product_type_id: newProductType.id,
          url: data.image.url,
          alt: data.image.alt || data.title
        });
    }

    const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
    if (benefitsToInsert.length > 0) {
      await supabase
        .from('product_type_benefits')
        .insert(
          benefitsToInsert.map((benefit, index) => ({
            product_type_id: newProductType.id,
            benefit,
            display_order: index
          }))
        );
    }

    await insertFeatures(data.features, newProductType.id);

    toast.toast({
      title: "Product created",
      description: `${data.title} has been created successfully.`
    });

    navigate(`/products/${data.slug}`);
  };

  const handleUpdateProduct = async (data: ProductFormData, originalSlug: string) => {
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

    const { data: productData } = await supabase
      .from('product_types')
      .select('id')
      .eq('slug', data.slug)
      .single();

    if (!productData) {
      throw new Error('Product not found');
    }

    // Handle image update
    await updateProductImage(data, productData.id);

    // Handle benefits update
    await updateProductBenefits(data, productData.id);

    // Handle features update
    await updateProductFeatures(data, productData.id);

    toast.toast({
      title: "Product updated",
      description: `${data.title} has been updated successfully.`
    });

    if (data.slug !== originalSlug) {
      navigate(`/products/${data.slug}`);
    } else {
      window.location.reload();
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
    const { data: existingFeatures } = await supabase
      .from('product_type_features')
      .select('id')
      .eq('product_type_id', productId);

    if (existingFeatures && existingFeatures.length > 0) {
      await supabase
        .from('product_type_features')
        .delete()
        .eq('product_type_id', productId);
    }

    await insertFeatures(data.features, productId);
  };

  const insertFeatures = async (features: ProductFormData['features'], productId: string) => {
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
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

  return {
    isCreating,
    isLoadingProduct,
    form,
    onSubmit,
  };
};
