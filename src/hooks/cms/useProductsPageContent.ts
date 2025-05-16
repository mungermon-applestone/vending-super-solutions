
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

interface ProductsPageContent {
  purposeStatementTitle?: string;
  purposeStatementDescription?: string;
  categoriesSectionTitle?: string;
  categoriesSectionDescription?: string;
  keyFeaturesTitle?: string;
  keyFeaturesDescription?: string;
  keyFeatures?: string[];
  demoRequestTitle?: string;
  demoRequestDescription?: string;
  demoRequestBulletPoints?: string[];
}

export function useProductsPageContent() {
  return useQuery({
    queryKey: ['contentful', 'productsPageContent'],
    queryFn: async () => {
      console.log('[useProductsPageContent] Fetching products page content');
      try {
        const client = await getContentfulClient();
        
        const entries = await client.getEntries({
          content_type: 'productsPageContent',
          limit: 1
        });

        console.log('[useProductsPageContent] Raw response:', entries);

        if (entries.items.length === 0) {
          console.warn('[useProductsPageContent] No products page content found');
          return null;
        }

        const fields = entries.items[0].fields;
        console.log('[useProductsPageContent] Content fields:', fields);
        
        return {
          purposeStatementTitle: fields.purposeStatementTitle as string,
          purposeStatementDescription: fields.purposeStatementDescription as string,
          categoriesSectionTitle: fields.categoriesSectionTitle as string,
          categoriesSectionDescription: fields.categoriesSectionDescription as string,
          keyFeaturesTitle: fields.keyFeaturesTitle as string,
          keyFeaturesDescription: fields.keyFeaturesDescription as string,
          keyFeatures: fields.keyFeatures as string[],
          demoRequestTitle: fields.demoRequestTitle as string,
          demoRequestDescription: fields.demoRequestDescription as string,
          demoRequestBulletPoints: fields.demoRequestBulletPoints as string[],
        } as ProductsPageContent;
      } catch (error) {
        console.error('[useProductsPageContent] Error fetching products page content:', error);
        toast.error('Failed to load products page content');
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
}
