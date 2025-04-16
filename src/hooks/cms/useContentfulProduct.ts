
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from 'sonner';

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('[useContentfulProduct] No slug provided');
        throw new Error('Product slug is required');
      }
      
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      
      const client = await getContentfulClient();
      
      if (!client) {
        console.error('[useContentfulProduct] Failed to initialize Contentful client');
        throw new Error('Failed to initialize Contentful client');
      }
      
      // Log that we're making the query to help with debugging
      console.log(`[useContentfulProduct] Querying Contentful for product with slug: ${slug}`);
      
      // Query Contentful for the product
      const entries = await client.getEntries({
        content_type: 'productType',
        'fields.slug': slug,
        include: 2
      });
      
      console.log(`[useContentfulProduct] Query returned ${entries.items.length} items`);
      
      if (!entries.items.length) {
        console.error(`[useContentfulProduct] No product found with slug: ${slug}`);
        throw new Error(`Product not found in Contentful: ${slug}`);
      }
      
      const entry = entries.items[0];
      // Log the raw entry data to help with debugging
      console.log(`[useContentfulProduct] Raw entry for slug "${slug}":`, {
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
    retry: 2,
    meta: {
      onError: (error: Error) => {
        toast.error(`Error loading product from Contentful: ${error.message}`);
        console.error('[useContentfulProduct] Error:', error);
      }
    }
  });
}
