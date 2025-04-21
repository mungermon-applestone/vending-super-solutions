
import { useContentful } from './useContentful';
import { HomePageContent } from '@/types/homePageContent';

export function useHomePageContent() {
  return useContentful<HomePageContent>({
    queryKey: ['homePageContent'],
    queryFn: async () => {
      const entries = await fetchContentfulEntries<any>('homePageContent');
      if (entries && entries.length > 0) {
        const content = entries[0].fields;
        return {
          productCategoriesTitle: content.productCategoriesTitle || "Fallback content",
          productCategoriesDescription: content.productCategoriesDescription || "Fallback content",
          businessGoalsTitle: content.businessGoalsTitle || "Fallback content",
          businessGoalsDescription: content.businessGoalsDescription || "Fallback content",
          ctaSectionTitle: content.ctaSectionTitle || "Fallback content",
          ctaSectionDescription: content.ctaSectionDescription || "Fallback content",
          ctaPrimaryButtonText: content.ctaPrimaryButtonText,
          ctaPrimaryButtonUrl: content.ctaPrimaryButtonUrl,
          ctaSecondaryButtonText: content.ctaSecondaryButtonText,
          ctaSecondaryButtonUrl: content.ctaSecondaryButtonUrl
        };
      }
      return null;
    },
    fallbackData: {
      productCategoriesTitle: "Fallback content",
      productCategoriesDescription: "Fallback content",
      businessGoalsTitle: "Fallback content",
      businessGoalsDescription: "Fallback content",
      ctaSectionTitle: "Fallback content",
      ctaSectionDescription: "Fallback content"
    }
  });
}
