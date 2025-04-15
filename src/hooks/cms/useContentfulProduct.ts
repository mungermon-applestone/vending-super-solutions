
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      try {
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'productType',
          'fields.slug': slug,
          limit: 1
        });
        
        if (!entries.items.length) {
          console.log(`[useContentfulProduct] No product found with slug: ${slug}`);
          return null;
        }
        
        const entry = entries.items[0];
        const fields = entry.fields;
        
        // Transform Contentful response to match our CMSProductType interface
        const product: CMSProductType = {
          id: entry.sys.id,
          title: fields.title as string,
          slug: fields.slug as string,
          description: fields.description as string,
          benefits: fields.benefits as string[] || [],
          image: fields.image ? {
            id: (fields.image as any).sys.id,
            url: (fields.image as any).fields.file.url,
            alt: (fields.image as any).fields.title || fields.title,
          } : undefined,
          features: fields.features ? (fields.features as any[]).map(feature => ({
            id: feature.sys.id,
            title: feature.fields.title,
            description: feature.fields.description,
            icon: feature.fields.icon || undefined
          })) : []
        };
        
        console.log(`[useContentfulProduct] Transformed product:`, product);
        return product;
      } catch (error) {
        console.error(`[useContentfulProduct] Error fetching product:`, error);
        throw error;
      }
    },
    enabled: !!slug
  });
}
