
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import { CMSProductType } from '@/types/cms';
import { toast } from '@/components/ui/use-toast';

// Define fallback product data for preview environment
const fallbackProductData: Record<string, CMSProductType> = {
  'cannabis-vending': {
    id: 'fallback-cannabis',
    title: 'Cannabis Vending',
    slug: 'cannabis-vending',
    description: 'Secure solutions for cannabis products with age verification and compliance features.',
    benefits: [
      'Age verification and compliance',
      'Secure product dispensing',
      'Inventory tracking',
      'Temperature control'
    ],
    image: {
      id: 'fallback-image',
      url: 'https://images.unsplash.com/photo-1560913210-91e811632701',
      alt: 'Cannabis Vending Machine',
    },
    features: [
      {
        id: 'feature-1',
        title: 'Age Verification',
        description: 'Built-in ID scanning and verification to ensure legal compliance',
        icon: 'shield'
      },
      {
        id: 'feature-2',
        title: 'Secure Storage',
        description: 'Tamper-proof design keeps products secure until authorized purchase',
        icon: 'lock'
      },
      {
        id: 'feature-3',
        title: 'Compliance Reporting',
        description: 'Automated reporting for regulatory compliance',
        icon: 'clipboard'
      }
    ]
  },
  'grocery-vending': {
    id: 'fallback-grocery',
    title: 'Grocery Vending',
    slug: 'grocery-vending',
    description: 'Temperature-controlled vending solutions for grocery items, snacks, and beverages.',
    benefits: [
      'Temperature control',
      'Fresh food dispensing',
      'Contactless shopping',
      'Inventory management'
    ],
    image: {
      id: 'fallback-image',
      url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a',
      alt: 'Grocery Vending Machine',
    },
    features: [
      {
        id: 'feature-1',
        title: 'Temperature Control',
        description: 'Maintain optimal temperature for different food products',
        icon: 'thermometer'
      },
      {
        id: 'feature-2',
        title: 'Freshness Monitoring',
        description: 'Track product expiration and ensure freshness',
        icon: 'calendar'
      },
      {
        id: 'feature-3',
        title: 'Contactless Purchasing',
        description: 'Touchless interface for hygienic shopping experience',
        icon: 'hand'
      }
    ]
  }
};

export function useContentfulProduct(slug: string) {
  return useQuery({
    queryKey: ['contentful', 'product', slug],
    queryFn: async () => {
      console.log(`[useContentfulProduct] Fetching product with slug: ${slug}`);
      try {
        const client = await getContentfulClient();
        
        // If in preview environment and client fails, use fallback data
        if (!client) {
          console.warn('[useContentfulProduct] Failed to get Contentful client - checking for fallback data');
          
          // Check if we have fallback data for this slug
          if (fallbackProductData[slug]) {
            console.log(`[useContentfulProduct] Using fallback data for: ${slug}`);
            return fallbackProductData[slug];
          }
          
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
          
          // Check fallback data before returning null
          if (fallbackProductData[slug]) {
            console.log(`[useContentfulProduct] Using fallback data for: ${slug}`);
            return fallbackProductData[slug];
          }
          
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
        
        // Check for fallback data if there's an error
        if (fallbackProductData[slug]) {
          console.log(`[useContentfulProduct] Using fallback data after error for: ${slug}`);
          return fallbackProductData[slug];
        }
        
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
