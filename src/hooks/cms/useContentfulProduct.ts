
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      
      const client = await getContentfulClient();
      
      if (!client) {
        throw new Error('Failed to initialize Contentful client');
      }
      
      // Log that we're making the query to help with debugging
      console.log(`[useContentfulProduct] Querying Contentful for product with slug: ${slug}`);
      
      const entries = await client.getEntries({
        content_type: 'productType',
        'fields.slug': slug,
        include: 2
      });
      
      if (!entries.items.length) {
        console.log(`[useContentfulProduct] No product found with slug: ${slug}`);
        throw new Error(`Product not found: ${slug}`);
      }
      
      const entry = entries.items[0];
      const fields = entry.fields;
      
      const product: CMSProductType = {
        id: entry.sys.id,
        title: fields.title as string,
        slug: fields.slug as string,
        description: fields.description as string,
        benefits: fields.benefits as string[] || [],
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
      
      console.log(`[useContentfulProduct] Successfully retrieved product:`, product);
      return product;
    },
    enabled: !!slug,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading product: ${error.message}`);
      }
    }
  });
}
