
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';

export function useContentfulProducts() {
  return useQuery({
    queryKey: ['contentful', 'products'],
    queryFn: async () => {
      console.log('[useContentfulProducts] Fetching all products');
      const client = await getContentfulClient();
      
      if (!client) {
        throw new Error('Failed to initialize Contentful client');
      }
      
      const entries = await client.getEntries({
        content_type: 'productType',
        include: 2
      });
      
      return entries.items.map(entry => {
        const fields = entry.fields;
        return {
          id: entry.sys.id,
          title: fields.title as string,
          slug: fields.slug as string,
          description: fields.description as string,
          benefits: (fields.benefits as string[]) || [],
          image: fields.image ? {
            id: (fields.image as any).sys.id,
            url: `https:${(fields.image as any).fields.file.url}`,
            alt: (fields.image as any).fields.title || fields.title,
          } : undefined,
          features: fields.features ? (fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon
          })) : []
        } as CMSProductType;
      });
    },
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });
}
