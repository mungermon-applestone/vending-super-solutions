
import { getContentfulClient } from './client';
import { CMSProductType } from '@/types/cms';

/**
 * Fetch all product types from Contentful
 */
export async function getProductTypes() {
  try {
    console.log('[contentful/products] Attempting to fetch products');
    const client = getContentfulClient();
    
    const entries = await client.getEntries({
      content_type: 'productType',
      include: 2,
    });
    
    console.log(`[contentful/products] Found ${entries.items.length} products`);
    
    return entries.items.map((item) => {
      return {
        id: item.sys.id,
        title: item.fields.title as string,
        slug: item.fields.slug as string,
        description: item.fields.description as string,
        visible: item.fields.visible !== false, // default to true if not specified
        benefits: Array.isArray(item.fields.benefits) ? item.fields.benefits as string[] : [],
        features: Array.isArray(item.fields.features) 
          ? (item.fields.features as any[]).map(feature => ({
              id: feature.sys.id,
              title: feature.fields.title,
              description: feature.fields.description,
              icon: feature.fields.icon || undefined
            })) 
          : [],
        image: item.fields.image ? {
          url: `https:${(item.fields.image as any).fields.file.url}`,
          alt: (item.fields.image as any).fields.title || (item.fields.title as string)
        } : undefined,
        thumbnail: item.fields.thumbnail ? {
          url: `https:${(item.fields.thumbnail as any).fields.file.url}`,
          alt: (item.fields.thumbnail as any).fields.title || (item.fields.title as string)
        } : undefined,
      } as CMSProductType;
    });
  } catch (error) {
    console.error('[contentful/products] Error fetching product types:', error);
    throw error; // Rethrow to handle at a higher level
  }
}

/**
 * Fetch a single product type by slug
 */
export async function getProductTypeBySlug(slug: string) {
  try {
    if (!slug) {
      console.error('[contentful/products] No slug provided');
      return null;
    }
    
    console.log(`[contentful/products] Fetching product with slug: "${slug}"`);
    
    const client = getContentfulClient();
    
    const entries = await client.getEntries({
      content_type: 'productType',
      'fields.slug': slug,
      include: 2,
    });
    
    if (entries.items.length === 0) {
      console.log(`[contentful/products] No product found with slug "${slug}"`);
      return null;
    }
    
    const item = entries.items[0];
    
    return {
      id: item.sys.id,
      title: item.fields.title as string,
      slug: item.fields.slug as string,
      description: item.fields.description as string,
      visible: item.fields.visible !== false, // default to true if not specified
      benefits: Array.isArray(item.fields.benefits) ? item.fields.benefits as string[] : [],
      features: Array.isArray(item.fields.features) 
        ? (item.fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon || undefined
          })) 
        : [],
      image: item.fields.image ? {
        url: `https:${(item.fields.image as any).fields.file.url}`,
        alt: (item.fields.image as any).fields.title || (item.fields.title as string)
      } : undefined,
      thumbnail: item.fields.thumbnail ? {
        url: `https:${(item.fields.thumbnail as any).fields.file.url}`,
        alt: (item.fields.thumbnail as any).fields.title || (item.fields.title as string)
      } : undefined,
    } as CMSProductType;
  } catch (error) {
    console.error(`[contentful/products] Error fetching product with slug "${slug}":`, error);
    throw error; // Rethrow to handle at a higher level
  }
}
