
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';
import { productFallbacks } from '@/data/productFallbacks';

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('[useContentfulProduct] No slug provided');
        throw new Error('Product slug is required');
      }
      
      console.log(`[useContentfulProduct] Fetching product with slug: "${slug}"`);
      
      let client;
      try {
        client = await getContentfulClient();
      } catch (clientError) {
        console.error('[useContentfulProduct] Failed to initialize Contentful client, trying refresh', clientError);
        // Try refreshing the client
        try {
          client = await refreshContentfulClient();
        } catch (refreshError) {
          console.error('[useContentfulProduct] Failed to refresh Contentful client', refreshError);
          throw new Error(`Failed to initialize Contentful client: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
        }
      }
      
      if (!client) {
        console.error('[useContentfulProduct] Failed to initialize Contentful client after retry');
        throw new Error('Failed to initialize Contentful client');
      }
      
      // Try different slug variations if needed
      const slugVariations = [slug, `${slug}-vending`, slug.replace('-vending', '')];
      let entries;
      let currentSlug = slug;
      
      console.log(`[useContentfulProduct] Will try these slug variations:`, slugVariations);
      
      for (const slugVariation of slugVariations) {
        try {
          console.log(`[useContentfulProduct] Querying Contentful for product with slug: "${slugVariation}"`);
          entries = await client.getEntries({
            content_type: 'productType',
            'fields.slug': slugVariation,
            include: 2
          });
          
          if (entries.items.length > 0) {
            console.log(`[useContentfulProduct] Found product with slug: "${slugVariation}"`);
            currentSlug = slugVariation;
            break;
          }
        } catch (error) {
          console.error(`[useContentfulProduct] Error querying for slug "${slugVariation}":`, error);
        }
      }
      
      if (!entries || !entries.items.length) {
        console.error(`[useContentfulProduct] No product found with any slug variations: ${slugVariations.join(', ')}`);
        
        // Check if we have a fallback for this product
        if (productFallbacks[slug]) {
          console.warn(`[useContentfulProduct] Using fallback data for slug: ${slug}`);
          throw new Error(`Product not found in Contentful: ${slug}`);
        }
        
        throw new Error(`Product not found in Contentful: ${slug}`);
      }
      
      console.log(`[useContentfulProduct] Query returned ${entries.items.length} items for slug "${currentSlug}"`);
      
      const entry = entries.items[0];
      // Log the raw entry data to help with debugging
      console.log(`[useContentfulProduct] Raw entry for slug "${currentSlug}":`, {
        id: entry.sys.id,
        contentType: entry.sys.contentType?.sys?.id,
        fields: Object.keys(entry.fields),
        hasTitle: !!entry.fields.title,
        hasDescription: !!entry.fields.description,
        hasImage: !!entry.fields.image,
        hasFeatures: Array.isArray(entry.fields.features) ? entry.fields.features.length : 0
      });
      
      const fields = entry.fields;
      
      // Transform the Contentful data into our app's format
      const product: CMSProductType = {
        id: entry.sys.id,
        title: fields.title as string,
        slug: fields.slug as string,
        description: fields.description as string,
        benefits: Array.isArray(fields.benefits) ? fields.benefits as string[] : [],
        image: fields.image ? {
          id: (fields.image as any).sys.id,
          url: `https:${(fields.image as any).fields.file.url}`,
          alt: (fields.image as any).fields.title || fields.title,
        } : undefined,
        features: fields.features ? (fields.features as any[]).map(feature => ({
          id: feature.sys.id,
          title: feature.fields.title,
          description: feature.fields.description,
          icon: feature.fields.icon || undefined
        })) : []
      };
      
      console.log(`[useContentfulProduct] Successfully processed product:`, {
        title: product.title,
        slug: product.slug,
        hasBenefits: product.benefits.length,
        hasFeatures: product.features.length
      });
      return product;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading product from Contentful: ${error.message}`);
        console.error('[useContentfulProduct] Error:', error);
      }
    }
  });
}
