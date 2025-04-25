
import { CMSProductType, QueryOptions } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

/**
 * Fetches all product types from Contentful
 * @param filters Optional filters to apply to the query
 * @returns Array of product types
 */
export async function fetchProductTypes(filters?: Record<string, any>): Promise<CMSProductType[]> {
  try {
    console.log('[fetchProductTypes] Fetching all product types', filters ? `with filters: ${JSON.stringify(filters)}` : '');
    
    const client = await getContentfulClient();
    
    // Base query parameters
    const queryParams: any = {
      content_type: 'productType',
      include: 2,
      limit: 100,
    };
    
    // Apply filters if provided
    if (filters) {
      // Handle slug filter with exact/fuzzy matching
      if (filters.slug) {
        if (filters.exactMatch !== false) {
          queryParams['fields.slug'] = filters.slug;
        } else {
          // For fuzzy matching we'll filter results after fetching
          console.log('[fetchProductTypes] Using fuzzy slug matching for:', filters.slug);
        }
      }
      
      // Add other filters as needed
      if (filters.visible !== undefined) {
        queryParams['fields.visible'] = filters.visible;
      }
    }
    
    const entries = await client.getEntries(queryParams);
    
    if (!entries || !entries.items) {
      console.warn('[fetchProductTypes] No entries returned from Contentful');
      return [];
    }
    
    const productTypes = entries.items.map(entry => ({
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
    }));
    
    console.log(`[fetchProductTypes] Successfully fetched ${productTypes.length} product types`);
    return productTypes;
  } catch (error) {
    console.error('[fetchProductTypes] Error fetching product types:', error);
    toast.error('Failed to load product types');
    return [];
  }
}
