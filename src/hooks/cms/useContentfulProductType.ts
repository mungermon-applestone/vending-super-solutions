
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

export function useContentfulProductType(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'productType', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('[useContentfulProductType] No slug provided');
        throw new Error('Product type slug is required');
      }
      
      console.log(`[useContentfulProductType] Fetching product type with slug: "${slug}"`);
      
      let client;
      try {
        client = await getContentfulClient();
      } catch (clientError) {
        console.error('[useContentfulProductType] Failed to initialize Contentful client, trying refresh', clientError);
        try {
          client = await refreshContentfulClient();
        } catch (refreshError) {
          console.error('[useContentfulProductType] Failed to refresh Contentful client', refreshError);
          throw new Error(`Failed to initialize Contentful client: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`);
        }
      }

      const entries = await client.getEntries({
        content_type: 'productType',
        'fields.slug': slug,
        include: 2
      });

      if (!entries.items.length) {
        console.error(`[useContentfulProductType] No product type found with slug: ${slug}`);
        throw new Error(`Product type not found: ${slug}`);
      }

      const entry = entries.items[0];
      
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
        })) : []
      };
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading product type: ${error.message}`);
        console.error('[useContentfulProductType] Error:', error);
      }
    }
  });
}
