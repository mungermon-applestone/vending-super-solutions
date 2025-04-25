
import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';
import { isContentfulConfigured } from '@/config/cms';

/**
 * Fetches all product types from Contentful
 * @param filters Optional filters
 * @returns Array of product types
 */
export async function fetchProductTypes(filters?: any): Promise<CMSProductType[]> {
  try {
    if (!isContentfulConfigured()) {
      console.error('[fetchProductTypes] Contentful is not configured properly');
      toast.error('Contentful configuration is missing or incomplete');
      throw new Error('Contentful is not properly configured');
    }
    
    console.log('[fetchProductTypes] Fetching all product types');
    
    const client = await getContentfulClient();
    
    const query: any = {
      content_type: 'productType',
      include: 2,
      limit: 100
    };
    
    // Apply filters if provided
    if (filters) {
      if (filters.slug) {
        query['fields.slug'] = filters.slug;
      }
      if (filters.visible !== undefined) {
        query['fields.visible'] = filters.visible;
      }
    }
    
    console.log('[fetchProductTypes] Query:', query);
    
    const entries = await client.getEntries(query);
    
    console.log(`[fetchProductTypes] Found ${entries.items.length} product types`);
    
    return entries.items.map(entry => ({
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
  } catch (error) {
    console.error('[fetchProductTypes] Error fetching product types:', error);
    toast.error(`Error loading products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}
