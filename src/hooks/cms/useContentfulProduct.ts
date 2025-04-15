
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from '@/components/ui/use-toast';

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      try {
        const client = await getContentfulClient();
        
        if (!client) {
          console.error('[useContentfulProduct] Failed to get Contentful client - check configuration in Admin Settings');
          throw new Error('Missing Contentful configuration. Please set up your Contentful credentials in Admin Settings.');
        }
        
        // Log that we're making the query to help with debugging
        console.log(`[useContentfulProduct] Querying Contentful for product with slug: ${slug}`);
        
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
        
        console.log(`[useContentfulProduct] Successfully transformed product:`, product);
        return product;
      } catch (error) {
        console.error(`[useContentfulProduct] Error fetching product:`, error);
        
        // Provide more specific error messages for common issues
        if (error instanceof Error) {
          if (error.message.includes('401')) {
            throw new Error('Authentication failed. Please check your Contentful Delivery Token in Admin Settings.');
          } else if (error.message.includes('404')) {
            throw new Error(`Could not find product "${slug}". Please check if the product exists in Contentful.`);
          } else if (error.message.includes('Network Error')) {
            throw new Error('Network error. Please check your internet connection and try again.');
          }
        }
        
        throw error;
      }
    },
    enabled: !!slug,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error Loading Product",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });
}
