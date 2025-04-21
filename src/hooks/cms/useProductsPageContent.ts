
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';

interface ProductsPageContent {
  purposeStatementTitle: string;
  purposeStatementDescription?: string;
  categoriesSectionTitle?: string;
  categoriesSectionDescription?: string;
  keyFeaturesTitle?: string;
  keyFeaturesDescription?: string;
  demoRequestTitle?: string;
  demoRequestDescription?: string;
  demoRequestBulletPoints?: string[];
}

export function useProductsPageContent() {
  return useQuery({
    queryKey: ['contentful', 'productsPageContent'],
    queryFn: async () => {
      console.log('[useProductsPageContent] Fetching products page content');
      const client = await getContentfulClient();
      
      const entries = await client.getEntries({
        content_type: 'productsPageContent',
        limit: 1
      });

      if (entries.items.length === 0) {
        console.warn('[useProductsPageContent] No products page content found');
        return null;
      }

      const fields = entries.items[0].fields;
      return {
        purposeStatementTitle: fields.purposeStatementTitle as string,
        purposeStatementDescription: fields.purposeStatementDescription as string,
        categoriesSectionTitle: fields.categoriesSectionTitle as string,
        categoriesSectionDescription: fields.categoriesSectionDescription as string,
        keyFeaturesTitle: fields.keyFeaturesTitle as string,
        keyFeaturesDescription: fields.keyFeaturesDescription as string,
        demoRequestTitle: fields.demoRequestTitle as string,
        demoRequestDescription: fields.demoRequestDescription as string,
        demoRequestBulletPoints: fields.demoRequestBulletPoints as string[],
      } as ProductsPageContent;
    }
  });
}
