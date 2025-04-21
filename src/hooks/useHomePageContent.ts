
import { useQuery } from '@tanstack/react-query';
import { HomePageContent } from '@/types/homePageContent';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CONTENTFUL_CONFIG } from '@/config/cms';
import { toast } from 'sonner';

// Define fallback content with VERY obvious text to easily identify when fallbacks are being used
const fallbackHomeContent: HomePageContent = {
  productCategoriesTitle: "[FALLBACK] Featured Product Categories",
  productCategoriesDescription: "[FALLBACK] Find the perfect vending solution for your product type.",
  businessGoalsTitle: "[FALLBACK] Business Goals We Help You Achieve",
  businessGoalsDescription: "[FALLBACK] Tailored solutions to meet your specific business objectives.",
  ctaSectionTitle: "[FALLBACK] Ready to Transform Your Vending Operations?",
  ctaSectionDescription: "[FALLBACK] Get started with our platform today and see the difference in your operations.",
  ctaPrimaryButtonText: "[FALLBACK] Request a Demo",
  ctaPrimaryButtonUrl: "/contact",
  ctaSecondaryButtonText: "[FALLBACK] Learn More",
  ctaSecondaryButtonUrl: "/products"
};

export function useHomePageContent() {
  console.log('[useHomePageContent] Initializing hook');
  console.log('[useHomePageContent] Contentful config:', {
    spaceId: CONTENTFUL_CONFIG.SPACE_ID || 'NOT SET',
    hasDeliveryToken: !!CONTENTFUL_CONFIG.DELIVERY_TOKEN,
    environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID
  });
  
  return useQuery({
    queryKey: ['homePageContent'],
    queryFn: async () => {
      console.log('[useHomePageContent] Fetching data from Contentful');
      try {
        // Check if Contentful is configured
        if (!CONTENTFUL_CONFIG.SPACE_ID || !CONTENTFUL_CONFIG.DELIVERY_TOKEN) {
          console.warn('[useHomePageContent] Contentful is not configured, using fallback content');
          toast.error('Contentful is not configured properly. Check your environment variables.', {
            id: 'contentful-error',
            duration: 5000,
          });
          return fallbackHomeContent;
        }
        
        // Attempt to fetch from Contentful with more detailed logging
        console.log('[useHomePageContent] Attempting to fetch from Contentful with content type:', 'homePageContent');
        const entries = await fetchContentfulEntries<any>('homePageContent', {
          limit: 1,
          include: 2 // Include linked entries up to 2 levels deep
        });
        
        console.log('[useHomePageContent] Raw Contentful response:', entries);
        console.log('[useHomePageContent] Response length:', entries ? entries.length : 0);
        
        if (entries && entries.length > 0) {
          console.log('[useHomePageContent] First entry fields:', entries[0].fields);
          const content = entries[0].fields;
          
          const mappedContent = {
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
          
          console.log('[useHomePageContent] Mapped content from Contentful:', mappedContent);
          return mappedContent;
        }
        
        console.warn('[useHomePageContent] No entries found, using fallbacks');
        toast.warning('No content found in Contentful. Using fallback content.', {
          id: 'contentful-no-content',
          duration: 5000,
        });
        // Return fallback data if no entries found
        return fallbackHomeContent;
      } catch (error) {
        console.error('[useHomePageContent] Error fetching data:', error);
        toast.error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`, {
          id: 'contentful-fetch-error',
          duration: 5000,
        });
        // Return fallback data on error
        return fallbackHomeContent;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });
}
