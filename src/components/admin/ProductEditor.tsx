import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CMSProductType, CMSFeature, CMSImage } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Plus, Save } from 'lucide-react';
import { useProductType } from '@/hooks/useCMSData';

interface ProductEditorProps {
  productSlug?: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  benefits: string[];
  features: {
    title: string;
    description: string;
    icon: string;
    screenshotUrl?: string;
    screenshotAlt?: string;
  }[];
}

const ProductEditor = ({ productSlug }: ProductEditorProps) => {
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(!productSlug);

  // Fetch existing product data if editing
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

  // Populate form with existing product data when loaded
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

  const addBenefit = () => {
    const currentBenefits = form.getValues('benefits');
    form.setValue('benefits', [...currentBenefits, '']);
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues('benefits');
    if (currentBenefits.length > 1) {
      form.setValue('benefits', currentBenefits.filter((_, i) => i !== index));
    }
  };

  const addFeature = () => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', [...currentFeatures, {
      title: '',
      description: '',
      icon: 'check',
      screenshotUrl: '',
      screenshotAlt: ''
    }]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    if (currentFeatures.length > 1) {
      form.setValue('features', currentFeatures.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      if (isCreating) {
        // Create new product type
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

        // Insert product image
        if (data.image.url) {
          await supabase
            .from('product_type_images')
            .insert({
              product_type_id: newProductType.id,
              url: data.image.url,
              alt: data.image.alt || data.title
            });
        }

        // Insert benefits
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

        // Insert features
        for (let i = 0; i < data.features.length; i++) {
          const feature = data.features[i];
          if (feature.title.trim() !== '') {
            const { data: newFeature, error: featureError } = await supabase
              .from('product_type_features')
              .insert({
                product_type_id: newProductType.id,
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

            // Insert screenshot if provided
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

        toast({
          title: "Product created",
          description: `${data.title} has been created successfully.`
        });

        navigate(`/products/${data.slug}`);

      } else if (existingProduct) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('product_types')
          .update({
            title: data.title,
            slug: data.slug,
            description: data.description,
            updated_at: new Date().toISOString()
          })
          .eq('slug', productSlug);

        if (updateError) {
          throw new Error(updateError.message);
        }

        // Get product ID
        const { data: productData } = await supabase
          .from('product_types')
          .select('id')
          .eq('slug', data.slug)
          .single();

        if (!productData) {
          throw new Error('Product not found');
        }

        // Update image
        const { data: existingImages } = await supabase
          .from('product_type_images')
          .select('id')
          .eq('product_type_id', productData.id);

        if (existingImages && existingImages.length > 0) {
          // Update existing image
          await supabase
            .from('product_type_images')
            .update({
              url: data.image.url,
              alt: data.image.alt || data.title,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingImages[0].id);
        } else if (data.image.url) {
          // Insert new image
          await supabase
            .from('product_type_images')
            .insert({
              product_type_id: productData.id,
              url: data.image.url,
              alt: data.image.alt || data.title
            });
        }

        // Update benefits
        // First delete all existing benefits
        await supabase
          .from('product_type_benefits')
          .delete()
          .eq('product_type_id', productData.id);

        // Then insert new benefits
        const benefitsToInsert = data.benefits.filter(benefit => benefit.trim() !== '');
        if (benefitsToInsert.length > 0) {
          await supabase
            .from('product_type_benefits')
            .insert(
              benefitsToInsert.map((benefit, index) => ({
                product_type_id: productData.id,
                benefit,
                display_order: index
              }))
            );
        }

        // Update features
        // First get all existing features
        const { data: existingFeatures } = await supabase
          .from('product_type_features')
          .select('id')
          .eq('product_type_id', productData.id);

        // Delete all existing features (will cascade delete screenshots)
        if (existingFeatures && existingFeatures.length > 0) {
          await supabase
            .from('product_type_features')
            .delete()
            .eq('product_type_id', productData.id);
        }

        // Insert new features
        for (let i = 0; i < data.features.length; i++) {
          const feature = data.features[i];
          if (feature.title.trim() !== '') {
            const { data: newFeature, error: featureError } = await supabase
              .from('product_type_features')
              .insert({
                product_type_id: productData.id,
                title: feature.title,
                description: feature.description,
                icon: feature.icon || 'check',
                display_order: i
              })
              .select('id')
              .single();

            if (featureError || !newFeature) {
              console.error('Failed to update feature:', featureError);
              continue;
            }

            // Insert screenshot if provided
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

        toast({
          title: "Product updated",
          description: `${data.title} has been updated successfully.`
        });

        // Navigate to new slug if it was changed
        if (data.slug !== productSlug) {
          navigate(`/products/${data.slug}`);
        } else {
          // Refresh the page to see the updated product
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct && !isCreating) {
    return <div className="py-12 text-center">Loading product data...</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isCreating ? 'Create New Product' : `Edit Product: ${existingProduct?.title}`}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL-friendly name)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="product-slug" 
                        {...field}
                        onChange={(e) => {
                          // Convert to URL-friendly format
                          const value = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-]/g, '');
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the product category..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="image.url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image.alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Description of image" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('image.url') && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Preview:</p>
                  <img 
                    src={form.watch('image.url')} 
                    alt={form.watch('image.alt')} 
                    className="max-w-[300px] border rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Benefits</span>
                <Button 
                  type="button" 
                  onClick={addBenefit} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Benefit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {form.watch('benefits').map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 mb-4">
                  <FormField
                    control={form.control}
                    name={`benefits.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder={`Benefit ${index + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button" 
                    onClick={() => removeBenefit(index)}
                    variant="ghost"
                    size="icon"
                    disabled={form.watch('benefits').length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Features</span>
                <Button 
                  type="button" 
                  onClick={addFeature} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Feature
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {form.watch('features').map((feature, index) => (
                <div key={index} className="border rounded p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Feature {index + 1}</h3>
                    <Button 
                      type="button" 
                      onClick={() => removeFeature(index)}
                      variant="ghost"
                      size="icon"
                      disabled={form.watch('features').length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`features.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feature Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Feature Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`features.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="check, shoppingbag, shieldcheck, etc." 
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            Available icons: check, shoppingbag, shieldcheck, utensils, tags, truck, clock
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`features.${index}.screenshotUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Screenshot URL (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`features.${index}.screenshotAlt`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Screenshot Alt Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Description of screenshot" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch(`features.${index}.screenshotUrl`) && (
                      <div className="mt-2">
                        <p className="text-sm mb-1">Screenshot Preview:</p>
                        <img 
                          src={form.watch(`features.${index}.screenshotUrl`)} 
                          alt={form.watch(`features.${index}.screenshotAlt`)} 
                          className="max-w-[200px] border rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Product</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductEditor;
