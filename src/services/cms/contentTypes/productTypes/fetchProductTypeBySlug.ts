
import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { getSlugVariations } from '@/services/cms/utils/slug/variations';
import { toast } from 'sonner';

interface DiagnosticData {
  slugAttempted: string;
  slugVariations: string[];
  entriesFound: number;
  contentfulResponse?: any;
  error?: any;
}

/**
 * Fetches a product type by its slug from Contentful
 * @param slug The slug of the product type to fetch
 * @returns The product type or null if not found
 */
export async function fetchProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  const diagnosticData: DiagnosticData = {
    slugAttempted: slug,
    slugVariations: [],
    entriesFound: 0
  };
  
  try {
    if (!slug) {
      console.error('[fetchProductTypeBySlug] No slug provided');
      return null;
    }
    
    console.log(`[fetchProductTypeBySlug] Fetching product type with slug: "${slug}"`);
    
    const client = await getContentfulClient();
    
    // First try with exact slug match
    console.log(`[fetchProductTypeBySlug] Attempting exact match with slug: "${slug}"`);
    const exactMatchQuery = await client.getEntries({
      content_type: 'productType',
      'fields.slug': slug,
      include: 2
    });
    
    console.log(`[fetchProductTypeBySlug] Exact match query returned ${exactMatchQuery.total} entries`);
    
    if (exactMatchQuery.items.length > 0) {
      const entry = exactMatchQuery.items[0];
      console.log(`[fetchProductTypeBySlug] Found product type with exact slug "${slug}":`, entry.fields.title);
      
      diagnosticData.entriesFound = exactMatchQuery.items.length;
      
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
    
    // No exact match, try with variations
    const slugVariations = getSlugVariations(slug);
    diagnosticData.slugVariations = slugVariations;
    console.log(`[fetchProductTypeBySlug] No exact match found. Trying ${slugVariations.length} slug variations:`, slugVariations);
    
    // Try each slug variation
    for (const variation of slugVariations) {
      console.log(`[fetchProductTypeBySlug] Trying variation: "${variation}"`);
      const entries = await client.getEntries({
        content_type: 'productType',
        'fields.slug': variation,
        include: 2
      });
      
      if (entries.items.length > 0) {
        const entry = entries.items[0];
        console.log(`[fetchProductTypeBySlug] Found product type with variation "${variation}":`, entry.fields.title);
        
        diagnosticData.entriesFound = entries.items.length;
        
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
    
    // If we still haven't found anything, let's do a more generic search to see what's available
    console.log(`[fetchProductTypeBySlug] No product type found with slug "${slug}" or any of its variations. Trying a broad search to see what's available.`);
    const allProductTypes = await client.getEntries({
      content_type: 'productType',
      limit: 10
    });
    
    console.log(`[fetchProductTypeBySlug] Found ${allProductTypes.total} total product types:`, 
      allProductTypes.items.map(item => ({
        id: item.sys.id,
        slug: item.fields.slug,
        title: item.fields.title
      }))
    );
    
    diagnosticData.contentfulResponse = {
      availableProductTypes: allProductTypes.items.map(item => ({
        id: item.sys.id,
        slug: item.fields.slug,
        title: item.fields.title
      }))
    };
    
    console.log(`[fetchProductTypeBySlug] No product type found with slug "${slug}" or any of its variations`);
    return null;
  } catch (error) {
    diagnosticData.error = error instanceof Error ? error.message : String(error);
    console.error(`[fetchProductTypeBySlug] Error fetching product type with slug "${slug}":`, error);
    
    // Try to get diagnostic information about what product types are available
    try {
      const client = await getContentfulClient();
      const allProductTypes = await client.getEntries({
        content_type: 'productType',
        limit: 5
      });
      
      console.log(`[fetchProductTypeBySlug] Diagnostic - Available product types:`, 
        allProductTypes.items.map(item => ({
          id: item.sys.id,
          slug: item.fields.slug,
          title: item.fields.title
        }))
      );
      
      diagnosticData.contentfulResponse = {
        availableProductTypes: allProductTypes.items.map(item => ({
          id: item.sys.id,
          slug: item.fields.slug,
          title: item.fields.title
        }))
      };
    } catch (diagnosticError) {
      console.error('[fetchProductTypeBySlug] Error fetching diagnostic data:', diagnosticError);
    }
    
    toast.error(`Error loading product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  } finally {
    console.log('[fetchProductTypeBySlug] Diagnostic data:', diagnosticData);
  }
}
