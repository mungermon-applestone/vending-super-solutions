
import { supabase } from '@/integrations/supabase/client';
import { CMSProductType } from '@/types/cms';
import { ProductAdapter, ProductCreateInput, ProductUpdateInput } from './types';
import { 
  processBenefits, 
  checkProductSlugExists 
} from '@/services/product/productHelpers';
import { registerSlugChange } from '@/services/cms/utils/slugMatching';

/**
 * Supabase implementation of the Product adapter
 */
export const supabaseProductAdapter: ProductAdapter = {
  getAll: async (filters?: Record<string, any>): Promise<CMSProductType[]> => {
    console.log('[supabaseProductAdapter] Fetching all products', filters);
    
    try {
      let query = supabase
        .from('product_types')
        .select(`
          id,
          title,
          slug,
          description,
          visible,
          product_type_images (
            id,
            url,
            alt,
            width,
            height
          ),
          product_type_benefits (
            id,
            benefit,
            display_order
          ),
          product_type_features (
            id,
            title,
            description,
            icon,
            display_order,
            product_type_feature_images (
              id,
              url,
              alt,
              width,
              height
            )
          )
        `);
      
      if (filters) {
        // Apply filters if provided
        if (filters.slug) {
          query = query.eq('slug', filters.slug);
        }
        if (filters.visible !== undefined) {
          query = query.eq('visible', filters.visible);
        }
      }
      
      // Order by title
      query = query.order('title', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }
      
      // Transform the raw data to match CMSProductType
      return data.map(item => {
        // Process the data into the expected format
        const productType: CMSProductType = {
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          visible: item.visible,
          // Handle image (take the first one if exists)
          image: item.product_type_images && item.product_type_images.length > 0 
            ? {
                id: item.product_type_images[0].id,
                url: item.product_type_images[0].url,
                alt: item.product_type_images[0].alt,
                width: item.product_type_images[0].width,
                height: item.product_type_images[0].height
              }
            : undefined,
          // Process benefits
          benefits: (item.product_type_benefits || [])
            .sort((a, b) => a.display_order - b.display_order)
            .map(b => b.benefit),
          // Process features
          features: (item.product_type_features || [])
            .sort((a, b) => a.display_order - b.display_order)
            .map(f => ({
              id: f.id,
              title: f.title,
              description: f.description,
              icon: f.icon || 'check',
              // Process feature screenshot if exists
              screenshot: f.product_type_feature_images && f.product_type_feature_images.length > 0
                ? {
                    id: f.product_type_feature_images[0].id,
                    url: f.product_type_feature_images[0].url,
                    alt: f.product_type_feature_images[0].alt,
                    width: f.product_type_feature_images[0].width,
                    height: f.product_type_feature_images[0].height
                  }
                : undefined
            }))
        };
        
        return productType;
      });
    } catch (error) {
      console.error('[supabaseProductAdapter] Error in getAll:', error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<CMSProductType | null> => {
    console.log(`[supabaseProductAdapter] Fetching product by slug: ${slug}`);
    
    if (!slug) {
      return null;
    }
    
    try {
      const products = await supabaseProductAdapter.getAll({ slug });
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error(`[supabaseProductAdapter] Error getting product by slug ${slug}:`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CMSProductType | null> => {
    console.log(`[supabaseProductAdapter] Fetching product by ID: ${id}`);
    
    if (!id) {
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching product by ID: ${error.message}`);
      }
      
      if (!data) {
        return null;
      }
      
      // Get associated data
      const productWithRelations = await supabaseProductAdapter.getBySlug(data.slug);
      return productWithRelations;
    } catch (error) {
      console.error(`[supabaseProductAdapter] Error in getById for ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data: ProductCreateInput): Promise<CMSProductType> => {
    console.log('[supabaseProductAdapter] Creating product:', data);
    
    try {
      // Check if a product with this slug already exists
      const slugExists = await checkProductSlugExists(data.slug);
      
      if (slugExists) {
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
        .select('id, slug')
        .single();

      if (createError || !newProductType) {
        throw new Error(createError?.message || 'Failed to create product type');
      }

      // Add product image if provided
      if (data.image && (data.image.url || data.image.alt)) {
        await supabase
          .from('product_type_images')
          .insert({
            product_type_id: newProductType.id,
            url: data.image.url || '',
            alt: data.image.alt || ''
          });
      }
      
      // Process benefits
      const cleanBenefits = processBenefits(data.benefits);
      
      if (cleanBenefits.length > 0) {
        await supabase
          .from('product_type_benefits')
          .insert(
            cleanBenefits.map((benefit, index) => ({
              product_type_id: newProductType.id,
              benefit: benefit,
              display_order: index
            }))
          );
      }
      
      // Process features
      if (data.features && data.features.length > 0) {
        for (let i = 0; i < data.features.length; i++) {
          const feature = data.features[i];
          
          // Skip empty features
          if (!feature.title.trim() || !feature.description.trim()) {
            continue;
          }
          
          // Insert the feature
          const { data: newFeature, error: featureError } = await supabase
            .from('product_type_features')
            .insert({
              product_type_id: newProductType.id,
              title: feature.title,
              description: feature.description,
              icon: feature.icon || 'check',
              display_order: i
            })
            .select()
            .single();

          if (featureError || !newFeature) {
            console.error('[supabaseProductAdapter] Error creating feature:', featureError);
            continue;
          }

          // Add feature screenshot if provided
          if (feature.screenshotUrl || feature.screenshotAlt) {
            await supabase
              .from('product_type_feature_images')
              .insert({
                feature_id: newFeature.id,
                url: feature.screenshotUrl || '',
                alt: feature.screenshotAlt || ''
              });
          }
        }
      }
      
      // Return the newly created product
      return await supabaseProductAdapter.getBySlug(newProductType.slug) as CMSProductType;
    } catch (error) {
      console.error('[supabaseProductAdapter] Error in create:', error);
      throw error;
    }
  },
  
  update: async (id: string, data: ProductUpdateInput): Promise<CMSProductType> => {
    console.log('[supabaseProductAdapter] Updating product:', id, data);
    
    try {
      // First get the product to update
      const { data: productData, error: fetchError } = await supabase
        .from('product_types')
        .select('id, slug')
        .eq('id', id)
        .maybeSingle();

      // If the product doesn't exist, throw an error
      if (!productData) {
        throw new Error(`Product with ID "${id}" not found`);
      }

      const originalSlug = productData.slug;
      
      // If the slug is being changed, check that the new slug doesn't already exist
      if (data.slug !== originalSlug) {
        const slugExists = await checkProductSlugExists(data.slug, id);
        
        if (slugExists) {
          throw new Error(`The slug "${data.slug}" is already in use by another product`);
        }
        
        // Register the slug change for future lookups
        registerSlugChange(originalSlug, data.slug);
      }

      // Update the product type
      const { error: updateError } = await supabase
        .from('product_types')
        .update({
          title: data.title,
          slug: data.slug,
          description: data.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Process benefits - clean them and remove duplicates
      const cleanBenefits = processBenefits(data.benefits);
      
      // Delete existing benefits
      await supabase
        .from('product_type_benefits')
        .delete()
        .eq('product_type_id', id);
        
      // Insert new benefits if there are any
      if (cleanBenefits.length > 0) {
        await supabase
          .from('product_type_benefits')
          .insert(
            cleanBenefits.map((benefit, index) => ({
              product_type_id: id,
              benefit: benefit,
              display_order: index
            }))
          );
      }
      
      // Update product image
      if (data.image) {
        // First check if the product already has an image
        const { data: existingImages } = await supabase
          .from('product_type_images')
          .select('id')
          .eq('product_type_id', id);

        if (existingImages && existingImages.length > 0) {
          // Update existing image
          await supabase
            .from('product_type_images')
            .update({
              url: data.image.url || '',
              alt: data.image.alt || '',
              updated_at: new Date().toISOString()
            })
            .eq('product_type_id', id);
        } else if (data.image.url || data.image.alt) {
          // Insert new image
          await supabase
            .from('product_type_images')
            .insert({
              product_type_id: id,
              url: data.image.url || '',
              alt: data.image.alt || ''
            });
        }
      }
      
      // Handle features
      // First get existing features to manage their associated images
      const { data: existingFeatures } = await supabase
        .from('product_type_features')
        .select('id')
        .eq('product_type_id', id);

      // Delete all existing features (and cascade to their images)
      await supabase
        .from('product_type_features')
        .delete()
        .eq('product_type_id', id);

      // Insert each new feature and its screenshot
      if (data.features && data.features.length > 0) {
        for (let i = 0; i < data.features.length; i++) {
          const feature = data.features[i];
          
          // Skip empty features
          if (!feature.title.trim() || !feature.description.trim()) {
            continue;
          }
          
          // Insert the feature
          const { data: newFeature, error: featureError } = await supabase
            .from('product_type_features')
            .insert({
              product_type_id: id,
              title: feature.title,
              description: feature.description,
              icon: feature.icon || 'check',
              display_order: i
            })
            .select()
            .single();

          if (featureError || !newFeature) {
            console.error('[supabaseProductAdapter] Error creating feature:', featureError);
            continue;
          }

          // Add feature screenshot if provided
          if (feature.screenshotUrl || feature.screenshotAlt) {
            await supabase
              .from('product_type_feature_images')
              .insert({
                feature_id: newFeature.id,
                url: feature.screenshotUrl || '',
                alt: feature.screenshotAlt || ''
              });
          }
        }
      }
      
      // Return the updated product
      return await supabaseProductAdapter.getBySlug(data.slug) as CMSProductType;
    } catch (error) {
      console.error('[supabaseProductAdapter] Error in update:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    console.log(`[supabaseProductAdapter] Deleting product: ${id}`);
    
    try {
      const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting product: ${error.message}`);
      }
      
      return true;
    } catch (error) {
      console.error(`[supabaseProductAdapter] Error in delete for ID ${id}:`, error);
      throw error;
    }
  },
  
  clone: async (id: string): Promise<CMSProductType> => {
    console.log(`[supabaseProductAdapter] Cloning product: ${id}`);
    
    try {
      // Get the product to clone
      const product = await supabaseProductAdapter.getById(id);
      
      if (!product) {
        throw new Error(`Product with ID "${id}" not found`);
      }
      
      // Generate a unique slug
      let newSlug = `${product.slug}-copy`;
      let counter = 1;
      let slugExists = await checkProductSlugExists(newSlug);
      
      while (slugExists) {
        counter++;
        newSlug = `${product.slug}-copy-${counter}`;
        slugExists = await checkProductSlugExists(newSlug);
      }
      
      // Prepare clone data
      const cloneData: ProductCreateInput = {
        title: `${product.title} (Copy)`,
        slug: newSlug,
        description: product.description,
        image: product.image ? {
          url: product.image.url,
          alt: product.image.alt
        } : {
          url: '',
          alt: ''
        },
        benefits: product.benefits || [],
        features: product.features ? product.features.map(f => ({
          title: f.title,
          description: f.description,
          icon: f.icon || 'check',
          screenshotUrl: f.screenshot?.url || '',
          screenshotAlt: f.screenshot?.alt || ''
        })) : []
      };
      
      // Create the cloned product
      return await supabaseProductAdapter.create(cloneData);
    } catch (error) {
      console.error(`[supabaseProductAdapter] Error in clone for ID ${id}:`, error);
      throw error;
    }
  }
};
