
import { useContentful } from './useContentful';
import { HomePageContent } from '@/types/homePageContent';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { useQuery } from '@tanstack/react-query';
import { CONTENTFUL_CONFIG } from '@/config/cms';

// Define fallback content to use when Contentful data is not available
const fallbackHomeContent: HomePageContent = {
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

export function useHomePageContent() {
  console.log('[useHomePageContent] Initializing hook');
  
  return useQuery({
    queryKey: ['homePageContent'],
    queryFn: async () => {
      console.log('[useHomePageContent] Fetching data from Contentful');
      try {
        // Check if Contentful is configured
        if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
          console.warn('[useHomePageContent] Contentful is not configured, using fallback content');
          return fallbackHomeContent;
        }
        
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
            productCategoriesTitle: content.productCategoriesTitle || fallbackHomeContent.productCategoriesTitle,
            productCategoriesDescription: content.productCategoriesDescription || fallbackHomeContent.productCategoriesDescription,
            businessGoalsTitle: content.businessGoalsTitle || fallbackHomeContent.businessGoalsTitle,
            businessGoalsDescription: content.businessGoalsDescription || fallbackHomeContent.businessGoalsDescription,
            ctaSectionTitle: content.ctaSectionTitle || fallbackHomeContent.ctaSectionTitle,
            ctaSectionDescription: content.ctaSectionDescription || fallbackHomeContent.ctaSectionDescription,
            ctaPrimaryButtonText: content.ctaPrimaryButtonText || fallbackHomeContent.ctaPrimaryButtonText,
            ctaPrimaryButtonUrl: content.ctaPrimaryButtonUrl || fallbackHomeContent.ctaPrimaryButtonUrl,
            ctaSecondaryButtonText: content.ctaSecondaryButtonText || fallbackHomeContent.ctaSecondaryButtonText,
            ctaSecondaryButtonUrl: content.ctaSecondaryButtonUrl || fallbackHomeContent.ctaSecondaryButtonUrl
          };
        }
        
        console.log('[useHomePageContent] No entries found, using fallbacks');
        // Return fallback data if no entries found
        return fallbackHomeContent;
      } catch (error) {
        console.error('[useHomePageContent] Error fetching data:', error);
        // Return fallback data on error
        return fallbackHomeContent;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });
}
