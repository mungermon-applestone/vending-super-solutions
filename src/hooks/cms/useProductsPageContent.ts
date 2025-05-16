
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/contentful/client';

interface ProductsPageContent {
  purposeStatementTitle?: string;
  purposeStatementDescription?: string;
  categoriesSectionTitle?: string;
  categoriesSectionDescription?: string;
  keyFeaturesTitle?: string;
  keyFeaturesDescription?: string;
  keyFeatures?: string[];
}

/**
 * Hook to fetch products page content from Contentful
 */
export function useProductsPageContent() {
  return useQuery({
    queryKey: ['contentful', 'products-page-content'],
    queryFn: async (): Promise<ProductsPageContent | null> => {
      try {
        const client = await getContentfulClient();
        
        const response = await client.getEntries({
          content_type: 'productsPage',
          include: 1,
          limit: 1
        });
        
        if (!response.items || response.items.length === 0) {
          return null;
        }
        
        const entry = response.items[0];
        
        // Transform key features field if it exists
        let keyFeatures: string[] = [];
        if (entry.fields.keyFeatures) {
          if (Array.isArray(entry.fields.keyFeatures)) {
            keyFeatures = entry.fields.keyFeatures;
          } else if (typeof entry.fields.keyFeatures === 'string') {
            keyFeatures = [entry.fields.keyFeatures];
          }
        }
        
        return {
          purposeStatementTitle: entry.fields.purposeStatementTitle || 'Our Vending Solutions',
          purposeStatementDescription: entry.fields.purposeStatementDescription || '',
          categoriesSectionTitle: entry.fields.categoriesSectionTitle || '',
          categoriesSectionDescription: entry.fields.categoriesSectionDescription || '',
          keyFeaturesTitle: entry.fields.keyFeaturesTitle || '',
          keyFeaturesDescription: entry.fields.keyFeaturesDescription || '',
          keyFeatures
        };
      } catch (error) {
        console.error('Error fetching products page content:', error);
        return null;
      }
    }
  });
}
