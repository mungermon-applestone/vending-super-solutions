
import { useContentful } from './useContentful';
import { HomePageContent } from '@/types/homePageContent';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { useQuery } from '@tanstack/react-query';
import { CONTENTFUL_CONFIG } from '@/config/cms';

export function useHomePageContent() {
  console.log('[useHomePageContent] Initializing hook');
  
  return useQuery({
    queryKey: ['homePageContent'],
    queryFn: async () => {
      console.log('[useHomePageContent] Fetching data from Contentful');
      try {
        // Ensure we're using the correct content type ID as defined in the template
        const entries = await fetchContentfulEntries<any>('homePageContent', {
          limit: 1,
          include: 2 // Include linked entries up to 2 levels deep
        });
        
        console.log('[useHomePageContent] Raw Contentful response:', entries);
        
        if (entries && entries.length > 0) {
          const content = entries[0].fields;
          console.log('[useHomePageContent] Content from Contentful:', content);
          
          return {
            productCategoriesTitle: content.productCategoriesTitle || "Featured Product Categories",
            productCategoriesDescription: content.productCategoriesDescription || "Find the perfect vending solution for your product type.",
            businessGoalsTitle: content.businessGoalsTitle || "Business Goals We Help You Achieve",
            businessGoalsDescription: content.businessGoalsDescription || "Tailored solutions to meet your specific business objectives.",
            ctaSectionTitle: content.ctaSectionTitle || "Ready to Transform Your Vending Operations?",
            ctaSectionDescription: content.ctaSectionDescription || "Get started with our platform today and see the difference in your operations.",
            ctaPrimaryButtonText: content.ctaPrimaryButtonText || "Request a Demo",
            ctaPrimaryButtonUrl: content.ctaPrimaryButtonUrl || "/contact",
            ctaSecondaryButtonText: content.ctaSecondaryButtonText || "Learn More",
            ctaSecondaryButtonUrl: content.ctaSecondaryButtonUrl || "/products"
          };
        }
        
        console.log('[useHomePageContent] No entries found, using fallbacks');
        // Return fallback data if no entries found
        return {
          productCategoriesTitle: "Featured Product Categories",
          productCategoriesDescription: "Find the perfect vending solution for your product type.",
          businessGoalsTitle: "Business Goals We Help You Achieve",
          businessGoalsDescription: "Tailored solutions to meet your specific business objectives.",
          ctaSectionTitle: "Ready to Transform Your Vending Operations?",
          ctaSectionDescription: "Get started with our platform today and see the difference in your operations.",
          ctaPrimaryButtonText: "Request a Demo",
          ctaPrimaryButtonUrl: "/contact",
          ctaSecondaryButtonText: "Learn More",
          ctaSecondaryButtonUrl: "/products"
        };
      } catch (error) {
        console.error('[useHomePageContent] Error fetching data:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });
}
