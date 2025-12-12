
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HomePageContent } from '@/types/homePageContent';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { CONTENTFUL_CONFIG, getEnvVariable } from '@/config/cms';
import { toast } from 'sonner';

// Define clean fallback content for production use
const fallbackHomeContent: HomePageContent = {
  productCategoriesTitle: "Featured Product Categories",
  productCategoriesDescription: "Find the perfect vending solution for your product type.",
  businessGoalsTitle: "Business Goals We Help You Achieve",
  businessGoalsDescription: "Tailored solutions to meet your specific business objectives.",
  availableMachines: "Available Machines",
  availableMachinesDescription: "Explore our range of cutting-edge vending machines compatible with our software solution.",
  
  // New features section fallbacks
  featuresSectionTitle: "Versatile, Flexible, Integration-Ready",
  featuresSectionDescription: "Our software fits right in with your current stack. If you're an OEM or retail solution provider, partner with us and instantly add self-service to your product line.",
  
  // Feature 1 fallback
  feature1Title: "Point-of-Sale",
  feature1Description: "Push and pull product data",
  feature1Icon: "ShoppingCart",
  feature1url: "",
  
  // Feature 2 fallback
  feature2Title: "Loyalty Programs",
  feature2Description: "Reward customer engagement and retention",
  feature2Icon: "Award",
  feature2url: "",
  
  // Feature 3 fallback
  feature3Title: "Existing Hardware",
  feature3Description: "Compatible with current equipment",
  feature3Icon: "Cpu",
  feature3url: "",
  
  // Feature 4 fallback
  feature4Title: "Payment Processors",
  feature4Description: "All major hardware and processing providers",
  feature4Icon: "CreditCard",
  feature4url: "",
  
  // Feature 5 fallback
  feature5Title: "IoT",
  feature5Description: "Connected device integration",
  feature5Icon: "Wifi",
  feature5url: "",
  
  // Feature 6 fallback
  feature6Title: "Identity Verification",
  feature6Description: "Hardware or software-based",
  feature6Icon: "UserCheck",
  feature6url: "",
  
  // Feature 7 fallback
  feature7Title: "Warehouse Management",
  feature7Description: "Inventory system integration",
  feature7Icon: "Package",
  feature7url: "",
  
  // Feature 8 fallback
  feature8Title: "Logistics",
  feature8Description: "Bar code tracking and last mile",
  feature8Icon: "Truck",
  feature8url: ""
};

export function useHomePageContent() {
  console.log('[useHomePageContent] Initializing hook');
  
  return useQuery({
    queryKey: ['homePageContent'],
    queryFn: async () => {
      console.log('[useHomePageContent] Fetching data from Contentful');
      
      try {
        // Get runtime config values
        const spaceId = await getEnvVariable('VITE_CONTENTFUL_SPACE_ID');
        const deliveryToken = await getEnvVariable('VITE_CONTENTFUL_DELIVERY_TOKEN');
        
        console.log('[useHomePageContent] Runtime config check:', {
          hasSpaceId: !!spaceId,
          hasDeliveryToken: !!deliveryToken,
          spaceIdPreview: spaceId ? spaceId.substring(0, 8) + '...' : 'NOT SET'
        });
        
        // Check if Contentful is configured
        if (!spaceId || !deliveryToken) {
          console.warn('[useHomePageContent] Contentful is not configured, using fallback content');
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
            // Map existing fields
            productCategoriesTitle: content.productCategoriesTitle || fallbackHomeContent.productCategoriesTitle,
            productCategoriesDescription: content.productCategoriesDescription || fallbackHomeContent.productCategoriesDescription,
            businessGoalsTitle: content.businessGoalsTitle || fallbackHomeContent.businessGoalsTitle,
            businessGoalsDescription: content.businessGoalsDescription || fallbackHomeContent.businessGoalsDescription,
            availableMachines: content.availableMachines || fallbackHomeContent.availableMachines,
            availableMachinesDescription: content.availableMachinesDescription || fallbackHomeContent.availableMachinesDescription,
            
            // Map features section fields
            featuresSectionTitle: content.featuresSectionTitle || fallbackHomeContent.featuresSectionTitle,
            featuresSectionDescription: content.featuresSectionDescription || fallbackHomeContent.featuresSectionDescription,
            
            // Map feature cards fields - matching exact field names from Contentful
            feature1Title: content.feature1Title || fallbackHomeContent.feature1Title,
            feature1Description: content.feature1Description || fallbackHomeContent.feature1Description,
            feature1Icon: content.feature1Icon || fallbackHomeContent.feature1Icon,
            feature1url: content.feature1url || fallbackHomeContent.feature1url,
            
            feature2Title: content.feature2Title || fallbackHomeContent.feature2Title,
            feature2Description: content.feature2Description || fallbackHomeContent.feature2Description,
            feature2Icon: content.feature2Icon || fallbackHomeContent.feature2Icon,
            feature2url: content.feature2url || fallbackHomeContent.feature2url,
            
            feature3Title: content.feature3Title || fallbackHomeContent.feature3Title,
            feature3Description: content.feature3Description || fallbackHomeContent.feature3Description,
            feature3Icon: content.feature3Icon || fallbackHomeContent.feature3Icon,
            feature3url: content.feature3url || fallbackHomeContent.feature3url,
            
            feature4Title: content.feature4Title || fallbackHomeContent.feature4Title,
            feature4Description: content.feature4Description || fallbackHomeContent.feature4Description,
            feature4Icon: content.feature4Icon || fallbackHomeContent.feature4Icon,
            feature4url: content.feature4url || fallbackHomeContent.feature4url,
            
            feature5Title: content.feature5Title || fallbackHomeContent.feature5Title,
            feature5Description: content.feature5Description || fallbackHomeContent.feature5Description,
            feature5Icon: content.feature5Icon || fallbackHomeContent.feature5Icon,
            feature5url: content.feature5url || fallbackHomeContent.feature5url,
            
            feature6Title: content.feature6Title || fallbackHomeContent.feature6Title,
            feature6Description: content.feature6Description || fallbackHomeContent.feature6Description,
            feature6Icon: content.feature6Icon || fallbackHomeContent.feature6Icon,
            feature6url: content.feature6url || fallbackHomeContent.feature6url,
            
            feature7Title: content.feature7Title || fallbackHomeContent.feature7Title,
            feature7Description: content.feature7Description || fallbackHomeContent.feature7Description,
            feature7Icon: content.feature7Icon || fallbackHomeContent.feature7Icon,
            feature7url: content.feature7url || fallbackHomeContent.feature7url,
            
            feature8Title: content.feature8Title || fallbackHomeContent.feature8Title,
            feature8Description: content.feature8Description || fallbackHomeContent.feature8Description,
            feature8Icon: content.feature8Icon || fallbackHomeContent.feature8Icon,
            feature8url: content.feature8url || fallbackHomeContent.feature8url
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
    initialData: fallbackHomeContent, // Provide fallback content immediately
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });
}
