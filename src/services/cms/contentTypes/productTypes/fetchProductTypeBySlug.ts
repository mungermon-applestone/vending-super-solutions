
import { CMSProductType } from '@/types/cms';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { normalizeSlug, getSlugVariations, mapUrlSlugToDatabaseSlug, logSlugSearch, logSlugResult, findBestSlugMatch } from '@/services/cms/utils/slugMatching';
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
    
    // Log search parameters for debugging
    logSlugSearch('productType', slug);
    
    const client = await getContentfulClient();
    
    // Normalize the slug to handle inconsistencies
    const normalizedSlug = normalizeSlug(slug);
    
    // Generate slug variations for more robust matching
    const slugVariations = getSlugVariations(normalizedSlug);
    
    console.log(`[fetchProductTypeBySlug] Trying slug variations:`, slugVariations);
    
    let productType: CMSProductType | null = null;
    
    // First try: attempt to get all product types to have complete list for matching
    try {
      const allProductsQuery = await client.getEntries({
        content_type: 'productType',
        limit: 100
      });
      
      if (allProductsQuery.items.length > 0) {
        // Extract all available slugs
        const allSlugs = allProductsQuery.items.map(item => item.fields.slug as string);
        console.log(`[fetchProductTypeBySlug] Found ${allSlugs.length} product types for matching`);
        
        // Try to find best match using our advanced matching
        const bestMatch = findBestSlugMatch(normalizedSlug, allSlugs);
        
        if (bestMatch) {
          console.log(`[fetchProductTypeBySlug] Found best match: "${bestMatch}" for search slug: "${normalizedSlug}"`);
          
          // Get the matching product from our results
          const matchedProduct = allProductsQuery.items.find(item => 
            (item.fields.slug as string) === bestMatch
          );
          
          if (matchedProduct) {
            const entry = matchedProduct;
            
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
            
            logSlugResult('productType', normalizedSlug, bestMatch, true);
            console.log(`[fetchProductTypeBySlug] Successfully found product via best match: ${entry.fields.title}`);
            return productType;
          }
        }
      }
    } catch (error) {
      console.error('[fetchProductTypeBySlug] Error during advanced slug matching:', error);
      // Continue with traditional approach if advanced matching fails
    }
    
    // Traditional approach: Iterate through slug variations to find a match
    for (const slugVariation of slugVariations) {
      const dbSlug = mapUrlSlugToDatabaseSlug(slugVariation);
      const query: any = {
        content_type: 'productType',
        'fields.slug': dbSlug,
        include: 2,
        limit: 1
      };
      
      console.log(`[fetchProductTypeBySlug] Querying with DB slug: "${dbSlug}" (from URL slug: "${slugVariation}")`);
      
      const entries = await client.getEntries(query);
      
      if (entries.items.length > 0) {
        const entry = entries.items[0];
        
        logSlugResult('productType', slugVariation, dbSlug, true);
        console.log(`[fetchProductTypeBySlug] Found product type with slug "${dbSlug}": ${entry.fields.title}`);
        
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
        logSlugResult('productType', slugVariation, dbSlug, false);
        console.log(`[fetchProductTypeBySlug] No product type found with slug: "${dbSlug}"`);
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
