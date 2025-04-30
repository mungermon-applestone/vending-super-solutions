
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';

export function useContentfulProducts() {
  return useQuery({
    queryKey: ['contentful', 'products'],
    queryFn: async () => {
      console.log('[useContentfulProducts] Fetching all products');
      let client;

      try {
        client = await getContentfulClient();
      } catch (clientError) {
        console.error('[useContentfulProducts] Failed to initialize Contentful client, trying refresh', clientError);
        // Try refreshing the client
        try {
          client = await refreshContentfulClient();
        } catch (refreshError) {
          console.error('[useContentfulProducts] Failed to refresh Contentful client', refreshError);
          throw new Error(`Failed to initialize Contentful client: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
        }
      }
      
      if (!client) {
        console.error('[useContentfulProducts] Failed to initialize Contentful client');
        throw new Error('Failed to initialize Contentful client');
      }
      
      try {
        const entries = await client.getEntries({
          content_type: 'productType',
          include: 2
        });
        
        console.log(`[useContentfulProducts] Found ${entries.items.length} products`);
        
        if (entries.items.length === 0) {
          console.warn('[useContentfulProducts] No products found in Contentful');
        }
  
        // Log the raw data to help with debugging
        console.log('[useContentfulProducts] Raw product data:', 
          entries.items.map(item => ({
            id: item.sys.id,
            title: item.fields.title,
            slug: item.fields.slug,
            hasThumbnail: !!item.fields.thumbnail,
            contentType: item.sys.contentType?.sys?.id
          }))
        );
        
        // Transform the Contentful data into our app's format
        return entries.items.map(entry => {
          const fields = entry.fields;
          return {
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
            // Properly extract thumbnail data
            thumbnail: fields.thumbnail ? {
              id: (fields.thumbnail as any).sys.id,
              url: `https:${(fields.thumbnail as any).fields.file.url}`,
              alt: (fields.thumbnail as any).fields.title || fields.title,
            } : undefined,
            features: fields.features ? (fields.features as any[]).map(feature => ({
              id: feature.sys.id,
              title: feature.fields.title,
              description: feature.fields.description,
              icon: feature.fields.icon || undefined
            })) : []
          } as CMSProductType;
        });
      } catch (queryError) {
        console.error('[useContentfulProducts] Error fetching products from Contentful:', queryError);
        toast.error(`Error fetching products: ${queryError instanceof Error ? queryError.message : 'Unknown error'}`);
        throw queryError;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading products from Contentful: ${error.message}`);
        console.error('[useContentfulProducts] Error:', error);
      }
    }
  });
}
