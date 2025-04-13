
import { CMSProductType } from '@/types/cms';
import { ProductFormData } from '@/types/forms';
import { getCMSProviderConfig } from './providerConfig';
import { getProductAdapter } from './adapters/products/productAdapterFactory';
import { UseToastReturn } from '@/hooks/use-toast';

/**
 * Get all product types
 */
export async function getProductTypes(): Promise<CMSProductType[]> {
  console.log("[products.ts] Fetching all product types");
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    return await adapter.getAll();
  } catch (error) {
    console.error("[products.ts] Error fetching product types:", error);
    throw error;
  }
}

/**
 * Get a product type by slug
 */
export async function getProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  console.log(`[products.ts] Fetching product type with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[products.ts] Empty slug passed to getProductTypeBySlug");
    return null;
  }
  
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    return await adapter.getBySlug(slug);
  } catch (error) {
    console.error(`[products.ts] Error fetching product type by slug "${slug}":`, error);
    throw error;
  }
}

/**
 * Get a product type by UUID
 */
export async function getProductTypeByUUID(uuid: string): Promise<CMSProductType | null> {
  console.log(`[products.ts] Fetching product type with UUID: "${uuid}"`);
  
  if (!uuid || uuid.trim() === '') {
    console.warn("[products.ts] Empty UUID passed to getProductTypeByUUID");
    return null;
  }
  
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    return await adapter.getById(uuid);
  } catch (error) {
    console.error(`[products.ts] Error fetching product type by UUID "${uuid}":`, error);
    throw error;
  }
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductFormData, toast?: UseToastReturn): Promise<string> {
  console.log('[products.ts] Creating new product:', data);
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    const result = await adapter.create(data);
    
    if (toast) {
      toast.toast({
        title: "Product created",
        description: `${data.title} has been created successfully.`
      });
    }
    
    return result.id;
  } catch (error) {
    console.error('[products.ts] Error creating product:', error);
    
    if (toast) {
      toast.toast({
        title: "Error",
        description: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    throw error;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  data: ProductFormData, 
  originalSlug: string, 
  toast?: UseToastReturn
): Promise<string> {
  console.log('[products.ts] Updating product:', originalSlug, data);
  
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    
    // First get the product ID from the original slug
    const product = await adapter.getBySlug(originalSlug);
    
    if (!product) {
      throw new Error(`Product with slug "${originalSlug}" not found`);
    }
    
    const result = await adapter.update(product.id, {
      ...data,
      originalSlug
    });
    
    if (toast) {
      toast.toast({
        title: "Product updated",
        description: `${data.title} has been updated successfully.`
      });
    }
    
    return result.id;
  } catch (error) {
    console.error('[products.ts] Error updating product:', error);
    
    if (toast) {
      toast.toast({
        title: "Error",
        description: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
    
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(slug: string): Promise<boolean> {
  console.log(`[products.ts] Deleting product with slug: ${slug}`);
  
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    
    // First get the product ID from the slug
    const product = await adapter.getBySlug(slug);
    
    if (!product) {
      throw new Error(`Product with slug "${slug}" not found`);
    }
    
    return await adapter.delete(product.id);
  } catch (error) {
    console.error(`[products.ts] Error deleting product "${slug}":`, error);
    throw error;
  }
}

/**
 * Clone a product
 */
export async function cloneProduct(id: string): Promise<CMSProductType> {
  console.log(`[products.ts] Cloning product with ID: ${id}`);
  
  try {
    const adapter = getProductAdapter(getCMSProviderConfig());
    return await adapter.clone(id);
  } catch (error) {
    console.error(`[products.ts] Error cloning product "${id}":`, error);
    throw error;
  }
}
