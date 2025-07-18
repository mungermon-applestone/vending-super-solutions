
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
  navigationLinkText: string;
  // Hero-related fields
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: {
    fields: {
      file: {
        url: string;
      };
      title?: string;
      description?: string;
    };
  };
  heroPrimaryButtonText?: string;
  heroPrimaryButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonUrl?: string;
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
        console.log('[useProductsPageContent] Total items:', entries.items.length);
        console.log('[useProductsPageContent] Response structure:', JSON.stringify(entries).substring(0, 200) + "...");
        
        if (entries.items.length === 0) {
          console.warn('[useProductsPageContent] No products page content found');
          return null;
        }

        const fields = entries.items[0].fields;
        console.log('[useProductsPageContent] Content fields:', fields);
        console.log('[useProductsPageContent] Field keys:', Object.keys(fields));
        
        // Log hero-specific fields for debugging
        console.log('[useProductsPageContent] Hero fields from Contentful:', {
          heroTitle: fields.heroTitle,
          heroDescription: fields.heroDescription,
          heroImage: fields.heroImage ? 'Present' : 'Not present',
          heroPrimaryButtonText: fields.heroPrimaryButtonText,
          heroPrimaryButtonUrl: fields.heroPrimaryButtonUrl,
          heroSecondaryButtonText: fields.heroSecondaryButtonText, 
          heroSecondaryButtonUrl: fields.heroSecondaryButtonUrl
        });
        
        const transformedContent = {
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
          navigationLinkText: fields.navigationLinkText as string,
          // Extract hero-related fields
          heroTitle: fields.heroTitle as string,
          heroDescription: fields.heroDescription as string,
          heroImage: fields.heroImage,
          heroPrimaryButtonText: fields.heroPrimaryButtonText as string,
          heroPrimaryButtonUrl: fields.heroPrimaryButtonUrl as string,
          heroSecondaryButtonText: fields.heroSecondaryButtonText as string,
          heroSecondaryButtonUrl: fields.heroSecondaryButtonUrl as string,
        } as ProductsPageContent;

        // Log specific hero fields to debug
        console.log('[useProductsPageContent] Hero fields after transform:', {
          heroTitle: transformedContent.heroTitle,
          heroDescription: transformedContent.heroDescription,
          hasHeroImage: !!transformedContent.heroImage,
          heroPrimaryButtonText: transformedContent.heroPrimaryButtonText,
          heroPrimaryButtonUrl: transformedContent.heroPrimaryButtonUrl,
          heroSecondaryButtonText: transformedContent.heroSecondaryButtonText,
          heroSecondaryButtonUrl: transformedContent.heroSecondaryButtonUrl
        });
        
        return transformedContent;
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

export type { ProductsPageContent };
