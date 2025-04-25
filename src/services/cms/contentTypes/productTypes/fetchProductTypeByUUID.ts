
import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

/**
 * Fetches a product type by its UUID (Contentful entry ID)
 * @param uuid The UUID of the product type to fetch
 * @returns The product type or null if not found
 */
export async function fetchProductTypeByUUID(uuid: string): Promise<CMSProductType | null> {
  try {
    if (!uuid) {
      console.error('[fetchProductTypeByUUID] No UUID provided');
      return null;
    }
    
    console.log(`[fetchProductTypeByUUID] Fetching product type with UUID: "${uuid}"`);
    
    const client = await getContentfulClient();
    
    // Direct lookup by entry ID
    const entry = await client.getEntry(uuid, { include: 2 });
    
    if (!entry) {
      console.log(`[fetchProductTypeByUUID] No product type found with UUID "${uuid}"`);
      return null;
    }
    
    // Verify content type
    if (entry.sys.contentType.sys.id !== 'productType') {
      console.warn(`[fetchProductTypeByUUID] Entry with UUID "${uuid}" is not a product type, but a ${entry.sys.contentType.sys.id}`);
      return null;
    }
    
    console.log(`[fetchProductTypeByUUID] Found product type with UUID "${uuid}": ${entry.fields.title}`);
    
    return {
      id: entry.sys.id,
      title: entry.fields.title as string,
      slug: entry.fields.slug as string,
      description: entry.fields.description as string,
      benefits: Array.isArray(entry.fields.benefits) ? entry.fields.benefits as string[] : [],
      image: entry.fields.image ? {
        id: (entry.fields.image as any).sys.id,
        url: `https:${(entry.fields.image as any).fields.file.url}`,
        alt: (entry.fields.image as any).fields.title || entry.fields.title,
      } : undefined,
      features: entry.fields.features ? (entry.fields.features as any[]).map(feature => ({
        id: feature.sys.id,
        title: feature.fields.title,
        description: feature.fields.description,
        icon: feature.fields.icon || undefined
      })) : [],
      visible: !!entry.fields.visible,
    };
  } catch (error) {
    if ((error as any).sys?.id === 'NotFound') {
      console.log(`[fetchProductTypeByUUID] Product type with UUID "${uuid}" not found`);
      return null;
    }
    
    console.error(`[fetchProductTypeByUUID] Error fetching product type with UUID "${uuid}":`, error);
    toast.error(`Error loading product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
