import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { normalizeSlug, getSlugVariations, mapUrlSlugToDatabaseSlug } from '@/services/cms/utils/slugMatching';
import { toast } from 'sonner';
// Import the new isContentfulConfigured function
import { isContentfulConfigured } from '@/config/cms';

/**
 * Fetches a product type by its slug
 * @param slug The slug of the product type to fetch
 * @returns The product type or null if not found
 */
export async function fetchProductTypeBySlug(slug: string): Promise<CMSProductType | null> {
  try {
    if (!slug) {
      console.error('[fetchProductTypeBySlug] No slug provided');
      return null;
    }
    
    if (!isContentfulConfigured()) {
      console.error('[fetchProductTypeBySlug] Contentful is not configured properly');
      toast.error('Contentful configuration is missing or incomplete');
      throw new Error('Contentful is not properly configured');
    }
    
    console.log(`[fetchProductTypeBySlug] Fetching product type with slug: "${slug}"`);
    
    const client = await getContentfulClient();
    
    // Normalize the slug to handle inconsistencies
    const normalizedSlug = normalizeSlug(slug);
    
    // Generate slug variations for more robust matching
    const slugVariations = getSlugVariations(normalizedSlug);
    
    console.log(`[fetchProductTypeBySlug] Trying slug variations:`, slugVariations);
    
    let productType: CMSProductType | null = null;
    
    // Iterate through slug variations to find a match
    for (const slugVariation of slugVariations) {
      const query: any = {
        content_type: 'productType',
        'fields.slug': slugVariation,
        include: 2,
        limit: 1
      };
      
      console.log(`[fetchProductTypeBySlug] Querying with slug: "${slugVariation}"`);
      
      const entries = await client.getEntries(query);
      
      if (entries.items.length > 0) {
        const entry = entries.items[0];
        
        console.log(`[fetchProductTypeBySlug] Found product type with slug "${slugVariation}": ${entry.fields.title}`);
        
        productType = {
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
        
        break; // Exit loop once a match is found
      } else {
        console.log(`[fetchProductTypeBySlug] No product type found with slug: "${slugVariation}"`);
      }
    }
    
    if (!productType) {
      console.log(`[fetchProductTypeBySlug] No product type found with any slug variation of "${slug}"`);
      return null;
    }
    
    return productType;
  } catch (error) {
    console.error(`[fetchProductTypeBySlug] Error fetching product type by slug "${slug}":`, error);
    toast.error(`Error loading product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}
