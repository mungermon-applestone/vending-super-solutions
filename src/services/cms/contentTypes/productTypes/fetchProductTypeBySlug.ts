
import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { getSlugVariations } from '@/services/cms/utils/slug/variations';
import { toast } from 'sonner';

/**
 * Fetches a product type by its slug from Contentful
 * @param slug The slug of the product type to fetch
 * @returns The product type or null if not found
 */
export async function fetchProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  try {
    if (!slug) {
      console.error('[fetchProductTypeBySlug] No slug provided');
      return null;
    }
    
    console.log(`[fetchProductTypeBySlug] Fetching product type with slug: "${slug}"`);
    
    const client = await getContentfulClient();
    
    // Generate potential slug variations to improve matching
    const slugVariations = getSlugVariations(slug);
    console.log(`[fetchProductTypeBySlug] Trying ${slugVariations.length} slug variations:`, slugVariations);
    
    // Try each slug variation
    for (const variation of slugVariations) {
      const entries = await client.getEntries({
        content_type: 'productType',
        'fields.slug': variation,
        include: 2
      });
      
      if (entries.items.length > 0) {
        const entry = entries.items[0];
        console.log(`[fetchProductTypeBySlug] Found product type with variation "${variation}":`, entry.fields.title);
        
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
      }
    }
    
    console.log(`[fetchProductTypeBySlug] No product type found with slug "${slug}" or any of its variations`);
    return null;
  } catch (error) {
    console.error(`[fetchProductTypeBySlug] Error fetching product type with slug "${slug}":`, error);
    toast.error(`Error loading product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
