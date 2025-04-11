
import { CMSProductType } from '@/types/cms';
import { productTypeOperations } from './contentTypes/productTypes';
import { normalizeSlug, getSlugVariations, mapUrlSlugToDatabaseSlug } from './utils/slugMatching';

/**
 * Get all product types
 */
export async function getProductTypes(): Promise<CMSProductType[]> {
  console.log("[productTypes.ts] Fetching all product types");
  return await productTypeOperations.fetchAll();
}

/**
 * Delete a product type
 */
export async function deleteProductType(id: string): Promise<boolean> {
  console.log(`[productTypes.ts] Deleting product type with ID: ${id}`);
  return await productTypeOperations.delete(id);
}

/**
 * Get a product type by slug
 */
export async function getProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  console.log(`[productTypes.ts] Attempting to fetch product type with slug: "${slug}"`);
  
  if (!slug || slug.trim() === '') {
    console.warn("[productTypes.ts] Empty slug passed to getProductTypeBySlug");
    return null;
  }
  
  try {
    // Direct lookup with improved slug handling
    console.log(`[productTypes.ts] Using enhanced slug lookup for: "${slug}"`);
    const productType = await productTypeOperations.fetchBySlug(slug);
    
    if (productType) {
      console.log(`[productTypes.ts] Successfully retrieved product type: ${productType.title}`);
      return productType;
    }
    
    console.log(`[productTypes.ts] Could not find product type with slug "${slug}" after trying all variations`);
    
    // As a last resort, try a fuzzy search
    console.log(`[productTypes.ts] All direct lookups failed, trying fallback method with fuzzy search`);
    const productTypesList = await productTypeOperations.fetchAll({ 
      filters: { 
        slug: slug,
        exactMatch: false // Allow fuzzy matching as last resort
      } 
    });
    
    if (productTypesList.length > 0) {
      console.log(`[productTypes.ts] Fallback found product type via fuzzy search: ${productTypesList[0].title}`);
      return productTypesList[0];
    }
    
    // DEBUG: Let's try to get all product types to see what's available
    console.log('[productTypes.ts] DEBUG: Getting all product types to check available options');
    const allTypes = await getProductTypes();
    console.log('[productTypes.ts] DEBUG: Available product types:', 
      allTypes.map(pt => ({ title: pt.title, slug: pt.slug, id: pt.id }))
    );
    
    console.log(`[productTypes.ts] Could not find product type with any slug variation of "${slug}"`);
    return null;
  } catch (error) {
    console.error(`[productTypes.ts] Error fetching product type by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get a product type by its UUID (most reliable method)
 */
export async function getProductTypeByUUID(uuid: string): Promise<CMSProductType | null> {
  console.log(`[productTypes.ts] Attempting to fetch product type with UUID: "${uuid}"`);
  
  if (!uuid || uuid.trim() === '') {
    console.warn("[productTypes.ts] Empty UUID passed to getProductTypeByUUID");
    return null;
  }
  
  try {
    // Use our direct method specifically for UUID lookups
    const productType = await productTypeOperations.fetchById(uuid);
    
    if (productType) {
      console.log(`[productTypes.ts] Successfully retrieved product type by UUID: ${productType.title}`);
      return productType;
    }
    
    console.log(`[productTypes.ts] Could not find product type with UUID "${uuid}"`);
    return null;
  } catch (error) {
    console.error(`[productTypes.ts] Error fetching product type by UUID "${uuid}":`, error);
    return null;
  }
}
